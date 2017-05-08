<?php
namespace OCA\OwnCollab_GanttChart\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Task extends Entity implements JsonSerializable {

    protected $text;

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'text' => $this->text,
        ];
    }
}