<?php
namespace OCA\OwnCollab_GanttChart\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\OwnCollab_GanttChart\Db\Link;
use OCA\OwnCollab_GanttChart\Db\LinkMapper;


class LinkService {

    private $mapper;

    public function __construct(LinkMapper $mapper){
        $this->mapper = $mapper;
    }

    public function findAll() {
        return $this->mapper->findAll();
    }

    private function handleException ($e) {
        if ($e instanceof DoesNotExistException ||
            $e instanceof MultipleObjectsReturnedException) {
            throw new NotFoundException($e->getMessage());
        } else {
            throw $e;
        }
    }

    public function find($id) {
        try {
            return $this->mapper->find($id);

        // in order to be able to plug in different storage backends like files
        // for instance it is a good idea to turn storage related exceptions
        // into service related exceptions so controllers and service users
        // have to deal with only one type of exception
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }

    public function create($source, $target, $type, $lag) {
        $link = new Link();
        //error_log($link . "\n", 3, "/var/tmp/meine-fehler.log");
        $link->setSource($source);
        $link->setTarget($target);
        $link->setType($type);
        $link->setLag($lag);
        return $this->mapper->insert($link);
    }

    public function update($id, $source, $target, $type, $lag) {
        try {
            $link = $this->mapper->find($id);
            $link->setSource($source);
            $link->setTarget($target);
            $link->setType($type);
            $link->setLag($lag);
            return $this->mapper->update($link);
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }

    public function delete($id) {
        try {
            $link = $this->mapper->find($id);
            $this->mapper->delete($link);
            return $task;
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }

}
