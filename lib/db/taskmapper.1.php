<?php
namespace OCA\OwnCollab_GanttChart\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

class TaskMapper extends Mapper {

    public function __construct(IDb $db) {
        parent::__construct($db, 'owncollab_gantt_tasks', '\OCA\OwnCollab_GanttChart\Db\Task');
    }

    public function findAll() {
        $sql = 'SELECT * FROM *PREFIX*owncollab_gantt_tasks';
        return $this->findEntities($sql);
    }
    
    public function find($id) {
        $sql = 'SELECT * FROM *PREFIX*owncollab_gantt_tasks WHERE id = ?';
        return $this->findEntity($sql, [$id]);
    }

}
