import os

__author__ = 'tmehta'
import facebook

graph = facebook.GraphAPI(
    'CAACEdEose0cBADE0BSZCV4thZCUKP0JZCp4x8GfQl4gY9WIq0CyAflt6uqoAxwRYROKl0eq92vEPYgI58RKvhmoHrZBnvK2Vl1EBgcZC8LbZAqYr27J8bif2pLVSFralTtXdOYzDv0ZC8es90zxQQHxtKAXxnBMv8fikXs2HlkkfzikIWfJTKprDzvllqh1sB0ZD')

current_number = open('current_number.txt').read().replace('\n', '')

while True:
    url = 'http://iamtom.ca/media/tom_' + str(current_number) + '.jpg'
    if not os.path.isfile('/home/iamtom/facebook-site/media/tom_' + str(current_number) + '.jpg'):
        continue
    r = graph.request('/544358639026648/photos', post_args={'url': url})
    print r

    r = graph.request('/544358639026648/links',
                      post_args={'link': "https://www.facebook.com/photo.php?fbid=" + r['id']})
    print r

