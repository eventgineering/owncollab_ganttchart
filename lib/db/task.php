<?php
namespace OCA\OwnCollab_GanttChart\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;

class Task extends Entity implements JsonSerializable {

    protected $text;
    protected $startdate;
    protected $duration;
    protected $type;
    protected $parent;
    protected $source;
    protected $target;
    protected $level;
    protected $progress;
    protected $open;
    protected $enddate;
    protected $resources;

    public function jsonSerialize() {
        return [
            'id' => $this->id,
            'text' => $this->text,
            'start_date' => $this->startdate,
            'duration' => $this->duration,
            'type' => $this->type,
            'parent' => $this->parent,
            'source' => $this->source,
            'target' => $this->target,
            'level' => $this->level,
            'progress' => $this->progress,
            'open' => $this->open,
            'end_date' => $this->enddate,
            'resources' => $this->resources,
            'color' => $this->color,
        ];
    }
}