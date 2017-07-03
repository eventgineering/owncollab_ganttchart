<?php
namespace OCA\OwnCollab_GanttChart\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Controller;

use OCA\OwnCollab_GanttChart\Service\GroupUserService;

class GroupUserController extends Controller {

    private $service;
    private $userId;

    use Errors;

    /**
     * @NoAdminRequired
     * @param IGroupManager $groupManager
     * @param bool $isAdmin
    */
    public function __construct($AppName, IRequest $request, 
                                GroupUserService $service, $UserId){
        parent::__construct($AppName, $request);
        $this->service = $service;
        $this->userId = $UserId;
    }

    /**
     * @NoAdminRequired
     */
    public function json() {
        //error_log(print_r($this, true) . "\n", 3, "/var/tmp/thisgroupusercontrollerjson.log");
	return new JSONResponse($this->service->findAll());
    }

    /**
    * @NoAdminRequired
     */
    public function index() {
    //error_log(print_r($this, true) . "\n", 3, "/var/tmp/thisgroupusercontrollerindex.log");
	return new DataResponse($this->service->findAll());
    }

    /**
     * @NoAdminRequired
     *
     * @param int $gid
     */
    public function show($gid) {
        return $this->handleNotFound(function () use ($gid) {
            return $this->service->find($id);
        });
    }
}
