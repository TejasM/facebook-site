import os
from django.db import models
from benselfies import settings

__author__ = 'tmehta'


class UserSubmission(models.Model):
    email = models.CharField(max_length=100, default="")
    user_id = models.CharField(max_length=50, default="")
    user_name = models.CharField(max_length=100, default="")


def get_user_id(instance, filename):
    return os.path.join(settings.MEDIA_ROOT, instance.submission.user_id, filename)


class UserImage(models.Model):
    submission = models.ForeignKey(UserSubmission)
    image = models.ImageField(upload_to=get_user_id, null=True)