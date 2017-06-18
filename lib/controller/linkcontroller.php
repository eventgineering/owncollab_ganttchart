<?php
namespace OCA\OwnCollab_GanttChart\Controller;

use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Controller;

use OCA\OwnCollab_GanttChart\Service\LinkService;

class LinkController extends Controller {

    private $service;
    private $userId;

    use Errors;

    public function __construct($AppName, IRequest $request,
                                LinkService $service, $UserId){
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
     * @param int $source
     * @param int $target
     * @param string $type
     * @param int $lag
     */
    public function create($source, $target, $type, $lag) {
        return $this->service->create($source, $target, $type, $lag);
    }

    /**
     *
     * @param int $id
     * @param int $source
     * @param int $target
     * @param string $type
     * @param int $lag
     */
    public function update($id, $source, $target, $type, $lag) {
        return $this->handleNotFound(function () use ($id, $source, $target, $type, $lag) {
            return $this->service->update($id, $source, $target, $type, $lag);
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
