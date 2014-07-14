import os

__author__ = 'tmehta'
import facebook

graph = facebook.GraphAPI(
    'CAAD7uN1UG40BAHIuoMGFuWTCwqNAscef2ltAHQapkFAv3Rp5ZArQw75Ikqj61mEKWawshKFolCpWQaiKjNI2U4ZCNRHsVy0T0YZAHhLbhJYEWZBEl7MqZCODE68qTmMtZALKmiS0h4cQ4fiVW25EOx9R3J3ZCiZCWP6XqMa8ILCkqIDDRdrCfyhC')

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
    f = open('current_number.txt', 'w')
    current_number = str(int(current_number) + 1)
    f.write(current_number)
    f.close()

