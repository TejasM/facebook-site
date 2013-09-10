import os
from django.db import models
from benselfies import settings

__author__ = 'tmehta'


class UserSubmission(models.Model):
    email = models.CharField(max_length=100, default="")
    user_id = models.CharField(max_length=50, default="")
    first_name = models.CharField(max_length=50, default="")
    last_name = models.CharField(max_length=50, default="")
    submission_link = models.CharField(max_length=1000, default="")
    time = models.DateTimeField(default=None, null=True)
    num_tags = models.IntegerField(default=0, null=True)


def get_user_id(instance, filename):
    return os.path.join(settings.MEDIA_ROOT, instance.submission.user_id, filename)


class UserImage(models.Model):
    submission = models.ForeignKey(UserSubmission)
    image = models.ImageField(upload_to=get_user_id, null=True)
    tags = models.CharField(max_length=1000, null=True)