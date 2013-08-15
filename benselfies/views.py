import json
import cStringIO
import urllib
from django.core.files.base import ContentFile
from django.http import HttpResponse
from django.shortcuts import render_to_response, redirect
from django.views.decorators.csrf import csrf_exempt
from benselfies.models import UserSubmission, UserImage

__author__ = 'tmehta'


def home(request):
    return render_to_response('home.html')


def like(request):
    return render_to_response('like_page.html')


def upload(request):
    return render_to_response('upload.html')


@csrf_exempt
def add_media_file(request):
    #TODO: check and upload to server
    try:
        submission = UserSubmission.objects.get(user_id=request.POST["user_id"])
    except UserSubmission.DoesNotExist:
        submission = UserSubmission.objects.create(user_id=request.POST["user_id"])
    name = str(len(UserImage.objects.filter(submission=submission)))
    image = UserImage.objects.create(submission=submission)
    file_image = cStringIO.StringIO(urllib.urlopen(request.POST['image']).read())
    file_content = ContentFile(file_image.read())
    image.image.save(name, file_content)
    image.save()
    return HttpResponse(json.dumps({'image': "/media/" + image.image.name}), content_type="application/json")


@csrf_exempt
def add_custom_pic(request):
    try:
        submission = UserSubmission.objects.get(user_id=request.POST["user_id"])
    except UserSubmission.DoesNotExist:
        submission = UserSubmission.objects.create(user_id=request.POST["user_id"])
    name = str(len(UserImage.objects.filter(submission=submission)))
    image = UserImage.objects.create(submission=submission)
    file_content = ContentFile(str(request.POST['file']).split(',')[1].decode('base64'))
    image.image.save("final-" + name + ".png", file_content)
    image.save()
    return HttpResponse(json.dumps({'image': "/media/" + image.image.name}), content_type="application/json")


def done(request, user_id):
    try:
        submission = UserSubmission.objects.get(user_id=user_id)
    except UserSubmission.DoesNotExist:
        return redirect(home)
    images = UserImage.objects.filter(submission=submission)
    images = [image.image for image in images]
    images = ["/media/" + image.name for image in images if "final-" in image.name]
    return render_to_response('done.html', {'images': images})


@csrf_exempt
def email(request):
    try:
        submission = UserSubmission.objects.get(user_id=request.POST["user_id"])
        submission.delete()
    except UserSubmission.DoesNotExist:
        pass
    UserSubmission.objects.create(user_id=request.POST["user_id"], email=request.POST["email"])
    return HttpResponse({}, content_type="application/json")

@csrf_exempt
def add_image(request):
    try:
        submission = UserSubmission.objects.get(user_id=request.POST["user_id"])
    except UserSubmission.DoesNotExist:
        submission = UserSubmission.objects.create(user_id=request.POST["user_id"])
    image = UserImage.objects.create(submission=submission)
    image.image = request.FILES['image']
    image.save()
    return HttpResponse(json.dumps({'url': "/media/" + image.image.name}), content_type="application/json")