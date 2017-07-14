<?php
namespace OCA\OwnCollab_GanttChart\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Controller;

use OCA\OwnCollab_GanttChart\Service\TaskService;

class TaskController extends Controller {

    private $service;
    private $userId;

    use Errors;

    public function __construct($AppName, IRequest $request,
                                TaskService $service, $UserId){
        parent::__construct($AppName, $request);
        $this->service = $service;
        $this->userId = $UserId;
    }

    /**
     * @NoAdminRequired
     */
    public function json() {
	    return new JSONResponse($this->service->findAll());
    }

    /**
     * @NoAdminRequired
     */
    public function index() {
	    return new DataResponse($this->service->findAll());
    }

    /**
     * @NoAdminRequired
     *
     * @param int $id
     */
    public function show($id) {
        return $this->handleNotFound(function () use ($id) {
            return $this->service->find($id);
        });
    }

    /**
     *
     * @param string $text
     * @param string $startdate
     * @param integer $duration
     * @param string $type
     * @param integer $parent
     * @param string $source
     * @param string $target
     * @param integer $level
     * @param float $progress
     * @param boolean $open
     * @param string $enddate
     * @param string $resources
     */
    public function create($text, $startdate, $duration, $type, $parent, $source, $target, $level, $progress, $open, $enddate, $resources) {
        return $this->service->create($text, $startdate, $duration, $type, $parent, $source, $target, $level, $progress, $open, $enddate, $resources);
    }

    /**
     *
     * @param int $id
     * @param string $text
     * @param string $startdate
     * @param integer $duration
     * @param string $type
     * @param integer $parent
     * @param string $source
     * @param string $target
     * @param integer $level
     * @param float $progress
     * @param boolean $open
     * @param string $enddate
     * @param string $resources
     */
    public function update($id, $text, $startdate, $duration, $type, $parent, $source, $target, $level, $progress, $open, $enddate, $resources) {
        return $this->handleNotFound(function () use ($id, $text, $startdate, $duration, $type, $parent, $source, $target, $level, $progress, $open, $enddate, $resources) {
            return $this->service->update($id, $text, $startdate, $duration, $type, $parent, $source, $target, $level, $progress, $open, $enddate, $resources);
        });
    }

    /**
     *
     * @param int $id
     */
    public function destroy($id) {
        return $this->handleNotFound(function () use ($id) {
            return $this->service->delete($id);
        });
    }

}
