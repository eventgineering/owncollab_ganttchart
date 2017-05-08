<?php
namespace OCA\OwnCollab_GanttChart\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;

use OCA\OwnCollab_GanttChart\Db\Task;
use OCA\OwnCollab_GanttChart\Db\TaskMapper;


class TaskService {

    private $mapper;

    public function __construct(TaskMapper $mapper){
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

    public function create($text,$start_date,$duration) {
        $task = new Task();
        $task->setText($text);
        $task->setStartDate($start_date);
        $task->setDuration($duration);
        return $this->mapper->insert($task);
    }

    public function update($id, $text) {
        try {
            $task = $this->mapper->find($id);
            $task->setText($text);
            return $this->mapper->update($task);
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }

    public function delete($id) {
        try {
            $task = $this->mapper->find($id);
            $this->mapper->delete($task);
            return $task;
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }

}
