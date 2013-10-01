import os
from django.db import models
from django.db.models.signals import post_delete, pre_delete
from django.dispatch import receiver
from django.utils import timezone
from benselfies import settings

__author__ = 'tmehta'


class Submission(models.Model):
    user_id = models.CharField(max_length=50, default="")
    last_submitted = models.DateTimeField(default=timezone.now())
    eligible = models.BooleanField(default=True)
    email = models.CharField(max_length=200, default="")
    first_name = models.CharField(max_length=50, default="")
    last_name = models.CharField(max_length=50, default="")

    def __unicode__(self):
        return "Winner is: " + self.first_name + " " + self.last_name + "\nEmail: " + \
               self.email + "\nSubmitted: " + self.last_submitted.strftime("%c")


class UserSubmission(models.Model):
    email = models.CharField(max_length=200, default="")
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


@receiver(pre_delete, sender=UserImage)
def photo_post_delete_handler(sender, **kwargs):
    photo = kwargs['instance']
    storage, path = photo.image.storage, photo.image.path
    storage.delete(path)