<?php
namespace OCA\OwnCollab_GanttChart\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;
use OCA\OwnCollab_GanttChart\Db\GroupUserMapper;

class TaskMapper extends Mapper {

    public function __construct(IDb $db) {
        parent::__construct($db, 'owncollab_gantt_tasks', '\OCA\OwnCollab_GanttChart\Db\Task');
    }

    public function getColors() {
        $sqlcolors = "SELECT configkey, configvalue FROM *PREFIX*appconfig WHERE configkey LIKE '%color_user%' OR configkey LIKE '%color_group%'";
        return $this->db->executeQuery($sqlcolors)->fetchAll();;
    }

    public function addPrefix($array, $key, $prefix, $original){
        $result = [];
        if ($original === ''){
            foreach ($array as $entity){
                $result[]['id'] = $prefix . $entity[$key];
            }
        }
        if ($original != ''){
            foreach ($array as $entity){
                $value['id'] = $prefix . $entity[$key];
                array_push($original, $value);
                $result = $original;
            }
        }
        return $result;
    }

    public function searchIndex($id, $array) {
        foreach ($array as $key => $val) {
            $array2 = (array) $val;
            if ($array2['id'] === $id) {
                return $key;
            }
        }
        return null;
    }

    public function mapColors($colors, $users){
        $searcharray = array_column($colors, 'configkey');
        foreach ($users as $key => $user){
            $searchvalue = '';
            if (substr($user['id'], 0, 2) === 'u_'){
                $searchvalue = 'color_user_'.substr($user['id'],2);
            } elseif (substr($user['id'], 0, 2) === 'g_'){
                $searchvalue = 'color_group_'.substr($user['id'],2);
            }
            $index = array_search($searchvalue, $searcharray);
            if ($index === 0){
                $users[$key]['color'] = $colors[0]['configvalue'];
            } elseif ($index > 0){
                $users[$key]['color'] = $colors[$index]['configvalue'];
            }
        } 
    return $users;
    }


    public function findAll() {
        $newarray = [];
        $usersarray = GroupUserMapper::findAllUsers();
        $usersgroupsarray = TaskMapper::addPrefix($usersarray, 'uid', 'u_', '');
        $groupsarray = GroupUserMapper::findAllGroups();
        $usersgroupsarray = TaskMapper::addPrefix($groupsarray, 'gid', 'g_', $usersgroupsarray);
        $colors = TaskMapper::getColors();
        $usersgroupsarray = TaskMapper::mapcolors($colors, $usersgroupsarray);
        //error_log(print_r($usersgroupsarray, true) . "\n", 3, "/var/tmp/usersgroupsarray.log");
        $sql = 'SELECT * FROM *PREFIX*owncollab_gantt_tasks';
        $search = array('[', '"', ']');
        $replace = '';
        $screenorder = explode(",", str_replace($search, $replace, \OC::$server->getConfig()->getAppValue('owncollab_ganttchart', 'screenorder')));
        $tasks = $this->findEntities($sql);
        if ($tasks && count($screenorder) > 1){
            foreach ($screenorder as $key=>$value){
                $value = intval($value);
                $index = TaskMapper::searchIndex($value, $tasks);
                $newarray[$key] = $tasks[$index];
            }
            foreach ($tasks as $key => $task){
                $task = (array) json_decode(json_encode($task));
                if ($task['resources'] != ''){
                    if (preg_match('/,/', $task['resources'], $match1)){
                        preg_match('/(.*?),/', $task['resources'], $match);
                        $index = array_search($match[1], array_column($usersgroupsarray, 'id'));
                        if ($usersgroupsarray[$index]['color'] != ''){
                            $tasks[$key]->color = $usersgroupsarray[$index]['color'];
                        } else {
                            $tasks[$key]->color = 'rgb(75, 113, 164)';
                        }
                    } else {
                        $index = array_search($task['resources'], array_column($usersgroupsarray, 'id'));
                        if ($usersgroupsarray[$index]['color'] != ''){
                            $tasks[$key]->color = $usersgroupsarray[$index]['color'];
                        } else {
                            $tasks[$key]->color = 'rgb(75, 113, 164)';
                        }
                    }
                } else {
                    $tasks[$key]->color = 'rgb(75, 113, 164)';
                }
            }
        } else {
            $newarray = $tasks;
        }
        //return $this->findEntities($sql);
        //error_log(print_r($newarray, true) . "\n", 3, "/var/tmp/tasks.log");
        return $newarray;
    }
    
    public function find($id) {
        $sql = 'SELECT * FROM *PREFIX*owncollab_gantt_tasks WHERE id = ?';
        return $this->findEntity($sql, [$id]);
    }

}
