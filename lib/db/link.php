<?php
namespace OCA\OwnCollab_GanttChart\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Link extends Entity implements JsonSerializable {

    protected $source;
    protected $target;
    protected $type;

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'source' => $this->source,
            'target' => $this->target,
            'type' => $this->type,
        ];
    }
}