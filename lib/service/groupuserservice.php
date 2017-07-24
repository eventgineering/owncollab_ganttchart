<?php
namespace OCA\OwnCollab_GanttChart\Service;

use Exception;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\MultipleObjectsReturnedException;
use OCP\IGroupManager;

use OCA\OwnCollab_GanttChart\Db\GroupUser;
use OCA\OwnCollab_GanttChart\Db\GroupUserMapper;


class GroupUserService {

    private $mapper;

    public function __construct(GroupUserMapper $mapper){
        $this->mapper = $mapper;
    }

    public function findAll() {
        return $this->mapper->findAll();
    }

    public function findAllUsers(){
        return $this->mapper->findAllUsers();
    }

    public function findAllGroups(){
        return $this->mapper->findAllGroups();
    }

    private function handleException ($e) {
        if ($e instanceof DoesNotExistException ||
            $e instanceof MultipleObjectsReturnedException) {
            throw new NotFoundException($e->getMessage());
        } else {
            throw $e;
        }
    }

    public function find($gid) {
        try {
            return $this->mapper->find($gid);

        // in order to be able to plug in different storage backends like files
        // for instance it is a good idea to turn storage related exceptions
        // into service related exceptions so controllers and service users
        // have to deal with only one type of exception
        } catch(Exception $e) {
            $this->handleException($e);
        }
    }
    
}
