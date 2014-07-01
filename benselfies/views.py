from datetime import date, datetime
import json
import cStringIO
import random
import re
import urllib
from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import HttpResponse
from django.shortcuts import render_to_response, redirect, render
from django.template import RequestContext
from django.utils import timezone
from django.utils.datastructures import MultiValueDictKeyError
from django.views.decorators.csrf import csrf_exempt
import requests
from social_auth.db.django_models import UserSocialAuth
from benselfies.models import UserSubmission, UserImage, Submission, UserProfile
from twython import Twython

__author__ = 'tmehta'


def home(request):
    logout(request)
    return render_to_response('home.html')


@login_required
def upload(request):
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)
    try:
        instagram_social = UserSocialAuth.objects.get(user=request.user, provider='instagram')
        return render(request, 'upload.html',
                      {'instagram_number': instagram_social.uid,
                       'access_token': instagram_social.tokens['access_token']})
    except UserSocialAuth.DoesNotExist:
        try:
            twitter_social = UserSocialAuth.objects.get(user=request.user, provider='twitter')
            api = Twython(settings.TWITTER_CONSUMER_KEY, settings.TWITTER_CONSUMER_SECRET,
                          twitter_social.tokens['oauth_token'], twitter_social.tokens['oauth_token_secret'])
            date_now = timezone.now() - relativedelta(years=2)
            urls = []
            # if len(profile.urls) < 10:
            max_id = None
            profile.urls = ""
            for i in range(10):
                if max_id:
                    res = api.get_user_timeline(count=200, include_entities='true', max_id=max_id)
                else:
                    res = api.get_user_timeline(count=200, include_entities='true')
                # res_urls = [t for t in res if 'urls' in t['entities']]
                if res:
                    max_id = res[-1]['id']
                res_media = [t for t in res if 'media' in t['entities']]
                # for t in res_urls:
                # for l in t['entities']['urls']:
                # if 'instagram' in l['expanded_url']:
                # urls.append(l['display_url'])
                for t in res_media:
                    for m in t['entities']['media']:
                        urls.append(m['media_url'])
                        if m['media_url'] not in profile.urls:
                            profile.urls += m['media_url'] + ","
                profile.save()
            else:
                urls = profile.urls.split(',')
            return render(request, 'upload.html',
                          {'twitter': twitter_social.uid, 'urls': urls})
        except UserSocialAuth.DoesNotExist:
            try:
                facebook_social = UserSocialAuth.objects.get(user=request.user, provider='facebook')
                return render(request, 'upload.html',
                              {'facebook': facebook_social.uid, 'access_token': facebook_social.tokens['access_token']})
            except:
                pass
    return render(request, 'upload.html')


@login_required
@csrf_exempt
def add_media_file(request):
    # TODO: check and upload to server
    try:
        submission = UserSubmission.objects.get(pk=1)
    except UserSubmission.DoesNotExist:
        submission = UserSubmission.objects.create()
    name = str(len(UserImage.objects.filter(submission=submission))) + ".png"
    image = UserImage.objects.create(submission=submission)
    imag = request.POST['image']
    if "data:image/png" in imag or "data:image/jpeg" in imag:
        imag = re.search(r'base64,(.*)', imag).group(1)
        file_content = ContentFile(imag.decode('base64'))
    else:
        response = requests.get(request.POST['image'])
        file_content = ContentFile(response.content)
    image.image.save(name, file_content)
    image.save()
    return HttpResponse(json.dumps({'image': "/media/" + image.image.name}),
                        content_type="application/json")


from PIL import ImageEnhance, Image


@login_required
def sharpen(image, sharpness=1.6):
    sharpener = ImageEnhance.Sharpness(image)
    sharpened_image = sharpener.enhance(sharpness)
    return sharpened_image


@login_required
@csrf_exempt
def add_custom_pic(request):
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
    except UserSubmission.DoesNotExist:
        return redirect(email)
    name = str(len(UserImage.objects.filter(submission=submission)))
    image = UserImage.objects.create(submission=submission)
    if 'file' in request.POST:
        file_content = ContentFile(str(request.POST['file']).split(',')[1].decode('base64'))
        file_content = sharpen(Image.open(file_content))
        thumb_io = cStringIO.StringIO()
        file_content.save(thumb_io, format='JPEG')
        file_content = ContentFile(thumb_io.getvalue())
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
    submissions = Submission.objects.filter(user_id=submission.user_id)
    user = submissions.latest('last_submitted')
    user.eligible = False
    user.save()
    submission.save()
    image.save()
    # Submission.objects.create(user_id=submission.user_id, email=submission.email)
    if image.image:
        context = {'image': "/media/" + image.image.name, "tags": tags_submit}
    else:
        context = {"tags": tags_submit}
    return HttpResponse(json.dumps(context),
                        content_type="application/json")


@login_required
@csrf_exempt
def add_image(request):
    try:
        submission = UserSubmission.objects.get(pk=1)
    except UserSubmission.DoesNotExist:
        submission = UserSubmission.objects.create()
    image = UserImage.objects.create(submission=submission)
    image.image = ContentFile(request.POST['image'], name='tom')
    image.save()
    return HttpResponse(json.dumps({'url': "/media/" + image.image.name}),
                        content_type="application/json")


@csrf_exempt
def email(request):
    if request.method == "POST":
        try:
            submissions = Submission.objects.filter(user_id=request.POST["user_id"])
            user = submissions.latest('last_submitted')
            td = (timezone.now() - user.last_submitted)
            duration = td.seconds + (td.days * 24 * 3600)
            if duration > 24 * 60 * 60:
                Submission.objects.create(user_id=request.POST["user_id"], email=request.POST["email"],
                                          first_name=request.POST["first_name"],
                                          last_name=request.POST["last_name"])
            elif not request.user.is_authenticated() and not user.eligible:
                request.session["no"] = True
                return redirect(email)
        except Submission.DoesNotExist:
            Submission.objects.create(user_id=request.POST["user_id"], email=request.POST["email"],
                                      first_name=request.POST["first_name"],
                                      last_name=request.POST["last_name"])
        submission = UserSubmission.objects.create(email=request.POST["email"], first_name=request.POST["first_name"],
                                                   last_name=request.POST["last_name"], num_tags=0)
        request.session["user"] = submission.id
        return redirect(upload, user_id=(request.POST["user_id"]))
    if "no" in request.session:
        del (request.session["no"])
        return render_to_response('email.html', {"no": True})
    else:
        return render_to_response('email.html')


@login_required
def finish(request):
    try:
        submission = UserSubmission.objects.get(pk=request.session["user"])
        images = UserImage.objects.filter(submission=submission)
        for image in images:
            image.delete()
        submission.time = timezone.now()
        submission.save()
        context = {"link": submission.submission_link, "user_id": submission.user_id}
    except KeyError as _:
        return redirect(email)
    return render_to_response('finish.html', context)


@login_required
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
    return HttpResponse({}, content_type="application/json")


@login_required
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
                return redirect(random_page)
    return render_to_response('login.html')


week_starts = [
    [datetime.strptime("7/10/13 09:00", "%d/%m/%y %H:%M"), datetime.strptime("14/10/13 23:59", "%d/%m/%y %H:%M")],
    [datetime.strptime("15/10/13 09:00", "%d/%m/%y %H:%M"), datetime.strptime("20/10/13 23:59", "%d/%m/%y %H:%M")],
    [datetime.strptime("21/10/13 09:00", "%d/%m/%y %H:%M"), datetime.strptime("27/10/13 23:59", "%d/%m/%y %H:%M")]]


@login_required()
def get_small_random_winners(request):
    submissions = Submission.objects.filter(last_submitted__gte=week_starts[0][0], last_submitted__lt=week_starts[0][1])
    if submissions:
        submission1 = random.choice(submissions)
    else:
        submission1 = None
    submissions = Submission.objects.filter(last_submitted__gte=week_starts[1][0], last_submitted__lt=week_starts[1][1])
    if submissions:
        submission2 = random.choice(submissions)
    else:
        submission2 = None
    submissions = Submission.objects.filter(last_submitted__gte=week_starts[2][0], last_submitted__lt=week_starts[2][1])
    if submissions:
        submission3 = random.choice(submissions)
    else:
        submission3 = None
    return render_to_response('random_page.html', {"submissions": [submission1, submission2, submission3]})


@login_required()
def get_big_random_winner(request):
    submissions = Submission.objects.filter(last_submitted__gte=week_starts[0][0], last_submitted__lt=week_starts[2][1])
    submission = random.choice(submissions)
    return render_to_response('random_page.html', {"submission": submission})


@login_required()
def random_page(request):
    submissions = Submission.objects.filter(last_submitted__gte=week_starts[0][0], last_submitted__lt=week_starts[2][1])
    unique_subs = submissions.values_list('email', flat=True).distinct()
    return render_to_response('random_page.html', {'num': len(submissions), 'list': unique_subs})


def terms(request):
    return render_to_response('terms.html')


@csrf_exempt
@login_required()
def share_instagram(request):
    if request.method == "POST":
        instagram_social = UserSocialAuth.objects.get(user=request.user, provider='instagram')
        r = requests.post('https://instagram.com/api/v1/media/upload/', {'photo': request.POST['photo'],
                                                                         'device_timestamp': timezone.now(),
                                                                         'lat': 0,
                                                                         'lng': 0,
                                                                         'access_token': instagram_social.tokens[
                                                                             'access_token']})
        print r.text
    return HttpResponse('', content_type='application/json')