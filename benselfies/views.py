import json
import cStringIO
import random
import re
import urllib
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.http import HttpResponse
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.utils import timezone
from django.utils.datastructures import MultiValueDictKeyError
from django.views.decorators.csrf import csrf_exempt
import requests
from benselfies.models import UserSubmission, UserImage, Submission

__author__ = 'tmehta'


@login_required()
def home(request):
    return render_to_response('home.html')


@login_required()
def upload(request, user_id):
    try:
        user = request.session["user"]
        user = UserSubmission.objects.get(pk=user)
        try:
            submission = UserSubmission.objects.get(user_id=user_id)
            if user != submission:
                submission.delete()
        except UserSubmission.DoesNotExist as _:
            pass
        user.user_id = user_id
        user.save()
    except KeyError as _:
        return redirect(email)
    except UserSubmission.DoesNotExist as _:
        return redirect(email)
    return render_to_response('upload.html')


@login_required()
@csrf_exempt
def add_media_file(request):
    #TODO: check and upload to server
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
    except UserSubmission.DoesNotExist:
        return redirect(email)
    name = str(len(UserImage.objects.filter(submission=submission)))
    image = UserImage.objects.create(submission=submission)
    response = requests.get(request.POST['image'])
    file_content = ContentFile(response.content)
    image.image.save(name, file_content)
    image.save()
    return HttpResponse(json.dumps({'image': "/media/" + image.image.name.split('/media/')[1]}),
                        content_type="application/json")


@csrf_exempt
@login_required()
def add_custom_pic(request):
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
    except UserSubmission.DoesNotExist:
        return redirect(email)
    name = str(len(UserImage.objects.filter(submission=submission)))
    image = UserImage.objects.create(submission=submission)
    file_content = ContentFile(str(request.POST['file']).split(',')[1].decode('base64'))
    image.image.save("final-" + name + ".png", file_content)
    image.tags = request.POST.getlist('tags[]')
    tags = image.tags
    tags_submit = []
    already_tagged = []
    if isinstance(tags, list):
        for tag in tags:
            split_tag = tag.split(',')
            if split_tag[0] not in already_tagged:
                tags_submit.append({'tag_uid': split_tag[0], 'x': split_tag[1], 'y': split_tag[2]})
                already_tagged.append(split_tag[0])
    submission.num_tags = len(tags_submit)
    submission.save()
    image.save()
    try:
        submissions = Submission.objects.filter(user_id=submission.user_id)
        is_eligible = map(lambda x: x.eligible, submissions)
        is_eligible = reduce(lambda x, y: x or y, is_eligible)
        if is_eligible:
            user = submissions.order_by('last_submitted')
            if len(user) > 1:
                user = user[1]
                td = (timezone.now() - user.last_submitted)
                duration = td.seconds + (td.days * 24 * 3600)
                if duration > 24 * 60 * 60:
                    Submission.objects.create(user_id=submission.user_id, email=submission.email)
    except Submission.DoesNotExist:
        Submission.objects.create(user_id=submission.user_id, email=submission.email)
    return HttpResponse(json.dumps({'image': "/media/" + image.image.name.split('/media/')[1], "tags": tags_submit}),
                        content_type="application/json")


@csrf_exempt
@login_required()
def add_image(request):
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
    except UserSubmission.DoesNotExist:
        return redirect(email)
    image = UserImage.objects.create(submission=submission)
    image.image = request.FILES['image']
    image.save()
    return HttpResponse(json.dumps({'url': "/media/" + image.image.name.split('/media/')[1]}),
                        content_type="application/json")


@csrf_exempt
@login_required()
def email(request):
    if request.method == "POST":
        try:
            submissions = Submission.objects.filter(user_id=request.POST["user_id"])
            is_eligible = map(lambda x: x.eligible, submissions)
            is_eligible = reduce(lambda x, y: x or y, is_eligible)
            if is_eligible:
                user = submissions.latest('last_submitted')
                td = (timezone.now() - user.last_submitted)
                duration = td.seconds + (td.days * 24 * 3600)
                if duration > 24 * 60 * 60:
                    Submission.objects.create(user_id=request.POST["user_id"], email=request.POST["email"])
        except Submission.DoesNotExist:
            Submission.objects.create(user_id=request.POST["user_id"], email=request.POST["email"])
        submission = UserSubmission.objects.create(email=request.POST["email"], first_name=request.POST["first_name"],
                                                   last_name=request.POST["last_name"], num_tags=0)
        request.session["user"] = submission.id
        return redirect(upload, user_id=(request.POST["user_id"]))
    return render_to_response('email.html')


@login_required()
def finish(request):
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
        images = UserImage.objects.filter(submission=submission)
        for image in images:
            image.delete()
        submission.time = timezone.now()
        submission.save()
        context = {"link": submission.submission_link, "user_id": submission.user_id}
        Submission.objects.create(user_id=submission.user_id, email=submission.email)
    except KeyError as _:
        return redirect(email)
    return render_to_response('finish.html', context)


@csrf_exempt
@login_required()
def post_id(request):
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
        submission.submission_link = request.POST['post_id']
        submission.save()
    except KeyError as _:
        return HttpResponse({}, content_type="application/json")
    except UserSubmission.DoesNotExist as _:
        return HttpResponse({}, content_type="application/json")
    return HttpResponse({}, content_type="application/json")


def preview(request):
    return render_to_response('coming_soon.html')


@csrf_exempt
def login_user(request):
    if request.user.is_authenticated():
        return redirect(home)
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect(home)
    return render_to_response('login.html')


@login_required()
def get_small_random_winner(request):
    submissions = Submission.objects.filter()
    submission = random.choice(submissions)
    return render_to_response('random_page.html', {"submission": submission})


@login_required()
def get_big_random_winner(request):
    submissions = Submission.objects.filter(eligible=True)
    submission = random.choice(submissions)
    submissions = Submission.objects.filter(user_id=submission.user_id)
    for sub in submissions:
        sub.eligible = False
        sub.save()
    return render_to_response('random_page.html', {"submission": submission})


@login_required()
def random_page(request):
    return render_to_response('random_page.html')