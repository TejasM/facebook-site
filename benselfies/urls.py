from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()
from benselfies import settings

urlpatterns = patterns('',
                       url(r'^$', 'benselfies.views.home', name='home'),
                       url(r'^like/$', 'benselfies.views.like', name='like'),
                       url(r'^finish/$', 'benselfies.views.finish', name='finish'),
                       url(r'^upload/$', 'benselfies.views.upload', name='upload'),
                       url(r'^done/$', 'benselfies.views.done', name='done'),
                       url(r'^post_pic/$', 'benselfies.views.add_media_file', name='post_pic'),
                       url(r'^addimage/$', 'benselfies.views.add_image', name='add_image'),
                       url(r'^upload_custom/$', 'benselfies.views.add_custom_pic', name='custom_pic'),
                       url(r'^email/$', 'benselfies.views.email', name='email'),
                       url(r'^post_id/$', 'benselfies.views.post_id', name='post_id')
                       # url(r'^benselfies/', include('benselfies.foo.urls')),

                       # Uncomment the admin/doc line below to enable admin documentation:
                       # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

                       # Uncomment the next line to enable the admin:
                       # url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('',
                        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {
                            'document_root': settings.MEDIA_ROOT}))
