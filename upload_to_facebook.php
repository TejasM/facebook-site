```php
use Facebook\FacebookSession;
use Facebook\FacebookRequest;
use Facebook\GraphUser;
use Facebook\FacebookRequestException;

FacebookSession::setDefaultApplication('1504603959771876','e791f0160b691bdefb6f8c947215c34b');

// Use one of the helper classes to get a FacebookSession object.
//   FacebookRedirectLoginHelper
//   FacebookCanvasLoginHelper
//   FacebookJavaScriptLoginHelper
// or create a FacebookSession with a valid access token:
$session = new FacebookSession('CAACEdEose0cBADPbZC5MZBhSJOqVhBTkJBPdJXsrYCw4uNZBp9BEcKtrlP3DyFJl2pzN9geZC9icKyZBGkmA7QhsOa0p4Ok55PxU3nH5JamcX93SLcFDorZCM1FmjRzL9C4QKZBbo4OfyLXs9YU5POYq7FIare4an9h8ic6wWCnyCk3XJgkN088WhAIRWN2XqcZD');

// Get the GraphUser object for the current user:

/* make the API call */
$request = new FacebookRequest(
  $session,
  'POST',
  '/544358639026648/photos',
  array (
    'url' => 'http:',
  )
);
$response = $request->execute();
$graphObject = $response->getGraphObject();
echo($graphObject);
```