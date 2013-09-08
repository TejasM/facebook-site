import json
import cStringIO
import re
import urllib
from django.contrib import messages
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.http import HttpResponse
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.utils import timezone
from django.utils.datastructures import MultiValueDictKeyError
from django.views.decorators.csrf import csrf_exempt
from benselfies.models import UserSubmission, UserImage

__author__ = 'tmehta'


def home(request):
    return render_to_response('home.html')


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


@csrf_exempt
def add_media_file(request):
    #TODO: check and upload to server
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
    except UserSubmission.DoesNotExist:
        return redirect(email)
    name = str(len(UserImage.objects.filter(submission=submission)))
    image = UserImage.objects.create(submission=submission)
    file_content = ContentFile(urllib.urlopen(request.POST['image']).read())
    image.image.save(name, file_content)
    image.save()
    return HttpResponse(json.dumps({'image': "/media/" + image.image.name.split('/media/')[1]}), content_type="application/json")


@csrf_exempt
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
    if isinstance(tags, list):
        for tag in tags:
            split_tag = tag.split(',')
            tags_submit.append({'tag_uid': split_tag[0], 'x': split_tag[1], 'y': split_tag[2]})
    image.save()
    return HttpResponse(json.dumps({'image': "/media/" + image.image.name.split('/media/')[1], "tags": tags_submit}),
                        content_type="application/json")


@csrf_exempt
def add_image(request):
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
    except UserSubmission.DoesNotExist:
        return redirect(email)
    image = UserImage.objects.create(submission=submission)
    image.image = request.FILES['image']
    image.save()
    return HttpResponse(json.dumps({'url': "/media/" + image.image.name.split('/media/')[1]}), content_type="application/json")


@csrf_exempt
def email(request):
    if request.method == "POST":
        # try:
        #     submission = UserSubmission.objects.filter(email=request.POST["email"],
        #                                                user_id=request.POST["user_id"]).latest('time')
        #     if submission.time and (submission.time - timezone.now()).total_seconds() < 24 * 60 * 60:
        #         messages.error(request, "You have already posted less 24 hours before. Try again in " + str(
        #             submission.time - timezone.now()))
        #         return redirect(email)
        # except UserSubmission.DoesNotExist:
        #     pass
        submission = UserSubmission.objects.create(email=request.POST["email"], first_name=request.POST["first_name"],
                                                   last_name=request.POST["last_name"])
        request.session["user"] = submission.id
        return redirect(upload, user_id=(request.POST["user_id"]))
    return render_to_response('email.html')


def finish(request):
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
        images = UserImage.objects.filter(submission=submission)
        for image in images:
            default_storage.delete(image.image.path)
        submission.time = timezone.now()
        submission.save()
        context = {"link": submission.submission_link, "user_id": submission.user_id}
    except KeyError as _:
        return redirect(email)
    return render_to_response('finish.html', context)


@csrf_exempt
def post_id(request):
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
        submission.submission_link = request.POST['post_id']
        submission.save()
    except KeyError as _:
        return HttpResponse({}, content_type="application/json")
    except UserSubmission.DoesNotExist as _:
        return HttpResponse({}, content_type="application/json")