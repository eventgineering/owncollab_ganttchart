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
     * @NoAdminRequired
     *
     * @param string $text
     * @param string $start_date
     * @param string $duration
     */
    public function create($text, $start_date, $duration) {
        return $this->service->create($text, $start_date, $duration);
    }

    /**
     * @NoAdminRequired
     *
     * @param int $id
     * @param string $text
     */
    public function update($id, $text) {
        return $this->handleNotFound(function () use ($id, $text) {
            return $this->service->update($id, $text);
        });
    }

    /**
     * @NoAdminRequired
     *
     * @param int $id
     */
    public function destroy($id) {
        return $this->handleNotFound(function () use ($id) {
            return $this->service->delete($id);
        });
    }

}
