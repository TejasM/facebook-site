import cookielib
from datetime import datetime
import urllib
import mechanize
import requests

__author__ = 'tmehta'

image_path = 'http://images6.alphacoders.com/316/316963.jpg'

login_url = 'https://instagram.com/accounts/login/'

upload_url = 'http://instagram.com/api/v1/media/upload/'

tom_username = 'iamtomfw'
tom_password = 'Tomfw2014'

# c = requests.Session()
# c.get('http://instagram.com/')
# print c.cookies
# csrf_token = c.cookies.get('csrftoken')
# headers = {'Origin': 'https://instagram.com', 'Accept-Encoding': 'gzip,deflate,sdch', 'Host': 'instagram.com',
# 'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6',
# 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36',
# 'Content-Type': 'application/x-www-form-urlencoded',
# 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
# 'Cache-Control': 'max-age=0', 'Referer': 'https://instagram.com/accounts/login/', 'Connection': 'keep-alive'}
#
# c.headers = headers
#
# c.cookies['csrftoken'] = csrf_token
# c.cookies['mid'] = c.cookies.get('mid')
# c.cookies['ccode'] = c.cookies.get('ccode')
#
# r = c.post(login_url, data={'csrfmiddlewaretoken': csrf_token, 'username': tom_username, 'password': tom_password})
# print r.text[0:100]
# r = c.post(upload_url, {'photo': image_path,
# 'device_timestamp': datetime.now(),
#                         'lat': 0,
#                         'lng': 0})
#
# print r.text
headers = [('Origin', 'https://instagram.com'), ('Accept-Encoding', 'gzip,deflate,sdch'), ('Host', 'instagram.com'),
           ('Accept-Language', 'en-GB,en-US;q=0.8,en;q=0.6'),
           ('User-Agent',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'),
           ('Content-Type', 'application/x-www-form-urlencoded'),
           ('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'),
           ('Cache-Control', 'max-age=0'), ('Referer', 'https://instagram.com/accounts/login/'),
           ('Connection', 'keep-alive')]

br = mechanize.Browser()
cookies = cookielib.LWPCookieJar()
br.set_cookiejar(cookies)

# browser settings (used to emulate a browser)
# br.set_handle_equiv(True)
# br.set_handle_redirect(True)
# br.set_handle_referer(True)
# br.set_handle_robots(False)
# br.set_debug_http(False)
# br.set_debug_responses(False)
# br.set_debug_redirects(False)
# br.set_handle_refresh(mechanize._http.HTTPRefreshProcessor(), max_time = 1)
# br.addheaders = headers

br.open(login_url)
#print br.response().read()
formcount = 0
for frm in br.forms():
    if str(frm.attrs["id"]) == "login-form":
        break
    formcount = formcount + 1
br.select_form(nr=formcount)

br["username"] = tom_username
br["password"] = tom_password
#print br.form
r = br.submit()
#print r.read()
t = datetime.now()
data = urllib.urlencode({'photo': image_path,
                         'device_timestamp': int((t - datetime(1970, 1, 1)).total_seconds()),
                         'lat': 0,
                         'lng': 0})

print round((t - datetime(1970, 1, 1)).total_seconds())
r = br.open(upload_url, data)
print r.read()

#print br._ua_handlers['_cookies'].cookiejar