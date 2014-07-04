<?php
// A custom function that's used to send a cURL request to a given URL
// This function gives you the option to specify the URL that you would like target,
// POST parameters that may need to be submitted via forms, a user agent, proxy credentials 
// and cookies
function InitializeCurl($url, $is_post, $post_data, $user_agent, $proxy, $proxy_auth, $cookies) {
    $c = curl_init();	
	curl_setopt($c, CURLOPT_URL, $url);
	curl_setopt($c, CURLOPT_USERAGENT, $user_agent);
	curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($c, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($c, CURLOPT_PROXY, $proxy);
		
	if($proxy_auth != '') {
		curl_setopt($c, CURLOPT_PROXYUSERPWD, $proxy_auth);
	}
    
	if($is_post  != '' && $post_data != '') {
		curl_setopt($c, CURLOPT_POST, true);
		curl_setopt($c, CURLOPT_POSTFIELDS, $post_data);
	}
    
	if($cookies != '') {
		curl_setopt($c, CURLOPT_COOKIE, $cookies);
	}
    
	return $c;
}

// A custom function used to generate a dummy Android client
// IG only allows its users to post pics via mobile device,
function GenerateUserAgent() {    
	$resolutions = array("720x1280", "320x480", "480x800", "1024x768", "1280x720", "768x1024", "480x320");
	$versions = array("GT-N7000", "SM-N9000", "GT-I9220", "GT-I9100");
	$dpis = array("120", "160", "320", "240");

	$ver = $versions[array_rand($versions)];
	$dpi = $dpis[array_rand($dpis)];
	$res = $resolutions[array_rand($resolutions)];
	
	return 'Instagram 4.'.mt_rand(1,2).'.'.mt_rand(0,2).' Android ('.mt_rand(10,11).'/'.mt_rand(1,3).'.'.mt_rand(3,5).'.'.mt_rand(0,5).'; '.$dpi.'; '.$res.'; samsung; '.$ver.'; '.$ver.'; smdkc210; en_US)';
}

// A custom function that generates a GUID value
function GenerateGuid() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
}

// Generate an SHA encreyption 
function GenerateSignature($data) {
	return hash_hmac('sha256', $data, 'b4a23f5e39b5929e0666ac5de94c89d1618a2916');
}



$guid = GenerateGuid();
$agent = GenerateUserAgent();
$proxy = "";
$auth = "";
$username = "iamtomfw";
$password = "Tomfw2014";
$cookies = "";


// Check to see if the user is logged in
$c = InitializeCurl("http://instagram.com/api/v1/feed/timeline/", true, "", $agent, $proxy, $auth, $cookies);
curl_setopt($c, CURLOPT_HEADER, true);
curl_setopt($c, CURLOPT_NOBODY, true);
		
$response = curl_exec($c);
$http_status = curl_getinfo($c, CURLINFO_HTTP_CODE);
curl_close($c);
			
// If the user isn't logged in, then log them in 
if(empty($response) 
|| $http_status != 200) {
    // Set the device ID
	$device_id = "android-".$guid;
	$data = '{"device_id":"'. $device_id.'","guid":"'.$guid.'","username":"'.$username.'","password":"'.$password.'","Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}';
    
    // Generate a signature
	$signature = GenerateSignature($data);
	$post_data = 'signed_body='.$signature.'.'.urlencode($data).'&ig_sig_key_version=4';

    // Send a cURL request to the page that is supposed to handle the login form submission
	$c = InitializeCurl("https://instagram.com/api/v2/accounts/login/", true, $post_data, $agent, $proxy, $auth, $cookies);
	curl_setopt($c, CURLOPT_HEADER, true);
	$response = curl_exec($c);
		
    // If this statement is in the response, there's a chance that you'll need another proxy
	if(strpos($response, "Sorry, an error occurred while processing this request.")) {
		echo "Request failed, there's a chance that this proxy/ip is blocked";
        die;
	}
				
	$parts = explode("\r\n\r\nHTTP/", $response);
	$parts = (count($parts) > 1 ? 'HTTP/' : '').array_pop($parts);
				
	list($header, $body) = explode("\r\n\r\n", $parts, 2);
	curl_close($c);

	if(empty($body)) {
		echo "Empty response received from the server while trying to login";
        die;
	}

	$obj = @json_decode($body, true);

	if(empty($obj)) {
		echo "Could not decode the response: ".$body;
        die;
	}
		
    // If you're logging into IG for the first time with the proxy you specified,
    // then your cookies variable should be an empty string. If not, then it's wise
    // to save the cookies in a DB as they don't change very often
	if($cookies == '') {
		preg_match_all('|Set-Cookie: (.*);|U', $header, $matches);
		$cookies = implode(';', $matches[1]);

	}
}
$file = "/home/tmehta/Downloads/tumblr_m22jqt3Xiq1qm4rc3.jpg";
// Define the caption
$caption = "Sample caption text";
// Trim the caption and replace line breaks
$caption = trim(preg_replace("/\r|\n/", "", $caption));

// Define the post data that will be sent to the upload page
if(!is_file($file)) {
    echo "The image doesn't exist ".$file;
    die;
} else {
    $post_data = array('device_timestamp' => time(), 
						'photo' => '@'.$file);
}

// Send a cURL request to the page that handles the upload request
$c = InitializeCurl("https://instagram.com/api/v1/media/upload/", true, $post_data, $agent, $proxy, $auth, $cookies);	
$response = curl_exec($c);

if(empty($response)) {
	echo "Empty response received from the server while trying to post the image";
    die;
} else {
    // Decode the response 
	$obj = @json_decode($response, true);

	if(empty($obj)) {
		echo "Could not decode the response:";
        die;
	} else {
		$status = $obj['status'];

		if($status == "ok") {
			$media_id = $obj['media_id'];
			$device_id = "android-".$guid;
			$data = '{"device_id":"'.$device_id.'","guid":"'.$guid.'","media_id":"'.$media_id.'","caption":"'.$caption.'","device_timestamp":"'.time().'","source_type":"5","filter_type":"0","extra":"{}","Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"}';	
			$sig = GenerateSignature($data);
			$new_data = 'signed_body='.$sig.'.'.urlencode($data).'&ig_sig_key_version=4';

            // Send a cURL request to the page that configues the pic and its caption
			curl_setopt($c, CURLOPT_URL, "https://instagram.com/api/v1/media/configure/");
			curl_setopt($c, CURLOPT_POSTFIELDS, $new_data);
			$response = curl_exec($c);
			curl_close($c);

			if(empty($response)) {
			    echo "Empty response received from the server while trying to configure the image";
                die;
			} else {
				if(strpos($response, "login_required")) {
					echo "You are not logged in. There's a chance that the account is banned";
                    die;
				} else {
					$obj = @json_decode($response, true);
					$status = $obj['status'];

					if($status == "fail") {
						echo "fail";
                        die;
					}
				}
			}
		}  else {
    		echo "Status isn't okay";
		echo $response;
            die;
		}
	} 
}
?>
