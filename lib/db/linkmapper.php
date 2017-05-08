<?php
namespace OCA\OwnCollab_GanttChart\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

class LinkMapper extends Mapper {

    public function __construct(IDb $db) {
        parent::__construct($db, 'owncollab_gantt_links', '\OCA\OwnCollab_GanttChart\Db\Link');
    }

    public function findAll() {
        $sql = 'SELECT * FROM *PREFIX*owncollab_gantt_links';
        return $this->findEntities($sql);
    }
    
    public function find($id) {
        $sql = 'SELECT * FROM *PREFIX*owncollab_gantt_links WHERE id = ?';
        return $this->findEntity($sql, [$id]);
    }

}
