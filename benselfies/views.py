import json
import cStringIO
import urllib
from django.core.files.base import ContentFile
from django.http import HttpResponse
from django.shortcuts import render_to_response, redirect
from django.utils.datastructures import MultiValueDictKeyError
from django.views.decorators.csrf import csrf_exempt
from benselfies.models import UserSubmission, UserImage

__author__ = 'tmehta'


def home(request):
    return render_to_response('home.html')


def like(request):
    try:
        request.session["user"]
    except KeyError as _:
        return redirect(email)
    return render_to_response('like_page.html')


def upload(request):
    try:
        request.session["user"]
    except KeyError as _:
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
    return HttpResponse(json.dumps({'image': "/media/" + image.image.name}), content_type="application/json")


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
    image.save()
    return HttpResponse(json.dumps({'image': "/media/" + image.image.name}), content_type="application/json")


def done(request, user_id):
    try:
        request.session["user"]
    except KeyError as _:
        return redirect(email)
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
    except UserSubmission.DoesNotExist:
        return redirect(email)
    images = UserImage.objects.filter(submission=submission)
    images = [image.image for image in images]
    images = ["/media/" + image.name for image in images if "final-" in image.name]
    return render_to_response('done.html', {'image': images[0]})


@csrf_exempt
def add_image(request):
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
    except UserSubmission.DoesNotExist:
        return redirect(email)
    image = UserImage.objects.create(submission=submission)
    image.image = request.FILES['image']
    image.save()
    return HttpResponse(json.dumps({'url': "/media/" + image.image.name}), content_type="application/json")


@csrf_exempt
def email(request):
    if request.method == "POST":
        try:
            submission = UserSubmission.objects.get(email=request.POST["email"])
            submission.delete()
        except UserSubmission.DoesNotExist:
            pass
        submission = UserSubmission.objects.create(email=request.POST["email"], user_name=request.POST["name"])
        request.session["user"] = submission.id
        return redirect(like)
    return render_to_response('email.html')


def finish(request):
    try:
        request.session["user"]
    except KeyError as _:
        return redirect(email)
    return render_to_response('finish.html')