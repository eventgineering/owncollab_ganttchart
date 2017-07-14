<?php
$search = array('{link}', '{displayname}', '{expirydate}');
$replace = array($_['link'], $_['displayname'], $_['expirydate']);
$body = 'Welcome! <br>The user {displayname} invited you to ownCollab. Please click the link below to enter: <br>{link}<br><br>If the share is password protected please ask {displayname} to provide the password.'.
        'This share will expire on {expirydate}.';
echo str_replace($search, $replace, $body);