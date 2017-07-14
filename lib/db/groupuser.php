<?php
namespace OCA\OwnCollab_GanttChart\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class GroupUser extends Entity implements JsonSerializable {

    protected $gid;
    protected $uid;

    public function jsonSerialize() {
        return [
            'gid' => $this->gid,
            'uid' => $this->uid
        ];
    }
}