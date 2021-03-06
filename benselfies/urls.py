from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin

admin.autodiscover()
from benselfies import settings

urlpatterns = patterns('',
                       url(r'^$', 'benselfies.views.home', name='home'),
                       url(r'^finish/$', 'benselfies.views.finish', name='finish'),
                       url(r'^upload/$', 'benselfies.views.upload', name='upload'),
                       url(r'^share-instagram/$', 'benselfies.views.share_instagram', name='share-instagram'),
                       url(r'^post_pic/$', 'benselfies.views.add_media_file', name='post_pic'),
                       url(r'^addimage/$', 'benselfies.views.add_image', name='add_image'),
                       url(r'^upload_custom/$', 'benselfies.views.add_custom_pic', name='custom_pic'),
                       url(r'^email/$', 'benselfies.views.email', name='email'),
                       url(r'^post_id/$', 'benselfies.views.post_id', name='post_id'),
                       url(r'^preview/$', 'benselfies.views.home', name='preview'),
                       url(r'^login/$', 'benselfies.views.login_user', name='login'),
                       url(r'^random/$', 'benselfies.views.random_page', name='random_page'),
                       url(r'^smallrandom/$', 'benselfies.views.get_small_random_winners', name='small_random'),
                       url(r'^bigrandom/$', 'benselfies.views.get_big_random_winner', name='big_random'),
                       url(r'^privacy/$', 'benselfies.views.terms', name='terms'),
                       # url(r'^benselfies/', include('benselfies.foo.urls')),

                       # Uncomment the admin/doc line below to enable admin documentation:
                       url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

                       #Uncomment the next line to enable the admin:
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'', include('social_auth.urls')),
)

urlpatterns += patterns('',
                        (r'^media/(?P<path>.*)$', 'django.views.static.serve', {
                            'document_root': settings.MEDIA_ROOT}))
