<?php
/**
 * ownCloud - owncollab_timetracker
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author andy <info@eventgineering.de>
 * @copyright andy 2016
 */

/**
 * Create your routes in here. The name is the lowercase name of the controller
 * without the controller part, the stuff after the hash is the method.
 * e.g. page#index -> OCA\OwnCollab_TimeTracker\Controller\PageController->index()
 *
 * The controller class has to be registered in the application.php file since
 * it's instantiated in there
 */

return [
    'resources' => [
        'task' => ['url' => '/tasks'],
        'link' => ['url' => '/links'],
        'groupuser' => ['url' => '/groupusers'],
    ],
    'routes' => [
	   ['name' => 'page#index', 'url' => '/', 'verb' => 'GET'],
	   ['name' => 'page#do_echo', 'url' => '/echo', 'verb' => 'POST'],
       ['name' => 'share#index', 'url' => '/share', 'verb' => 'GET'],
       ['name' => 'share#getAuth', 'url' => '/share/s/{token}', 'verb' => 'POST'],
       ['name' => 'share#showAuth', 'url' => '/share/s/{token}', 'verb' => 'GET'],
       ['name' => 'share#getTasks', 'url' => '/share/s/{token}/tasks', 'verb' => 'GET'],
       ['name' => 'share#getLinks', 'url' => '/share/s/{token}/links', 'verb' => 'GET'],
       ['name' => 'share#getGroupUsers', 'url' => '/share/s/{token}/groupusers', 'verb' => 'GET'],
       ['name' => 'share#setPassword', 'url' => '/share/setPassword', 'verb' => 'POST'],
       ['name' => 'share#sendEmail', 'url' => '/share/sendemail', 'verb' => 'POST'],
       ['name' => 'share#generateToken', 'url' => '/token/generate', 'verb' => 'POST'],
       ['name' => 'share#getToken', 'url' => '/token/get', 'verb' => 'GET'],
       ['name' => 'share#getExpiryDate', 'url' => '/expirydate/get', 'verb' => 'GET'],
       ['name' => 'pdfexport#export', 'url' => '/pdfgenerator', 'verb' => 'POST'],
       ['name' => 'imageexport#export', 'url' => '/imagegenerator', 'verb' => 'POST'],
    ]
];
