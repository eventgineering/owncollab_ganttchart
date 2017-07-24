<?php
namespace OCA\OwnCollab_GanttChart\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Http\JSONResponse;
use OCA\OwnCollab_GanttChart\Db\GroupUserMapper;

class TaskMapper extends Mapper {
    /** @var GroupUserMapper */

	private $groupUserMapper;

	/**
	 * @param GroupUserMapper $groupUserMapper
	 */


    public function __construct(IDb $db, GroupUserMapper $groupUserMapper) {
        parent::__construct($db, 'owncollab_gantt_tasks', '\OCA\OwnCollab_GanttChart\Db\Task');
        $this->groupUserMapper = $groupUserMapper;
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
        $test = $this->groupUserMapper->findAllUsers();
        //error_log(print_r($test, true) . "\n", 3, "/var/tmp/groupusers.log");
        $usersarray = $this->groupUserMapper->findAllUsers();
        //$usersarray = GroupUserMapper::findAllUsers();
        $usersgroupsarray = TaskMapper::addPrefix($usersarray, 'uid', 'u_', '');
        //$groupsarray = GroupUserMapper::findAllGroups();
        $groupsarray = $this->groupUserMapper->findAllGroups();
        $usersgroupsarray = TaskMapper::addPrefix($groupsarray, 'gid', 'g_', $usersgroupsarray);
        $colors = TaskMapper::getColors();
        $usersgroupsarray = TaskMapper::mapcolors($colors, $usersgroupsarray);
        $sql = 'SELECT * FROM *PREFIX*owncollab_gantt_tasks';
        $search = array('[', '"', ']');
        $replace = '';
        $screenorder = explode(",", str_replace($search, $replace, \OC::$server->getConfig()->getAppValue('owncollab_ganttchart', 'screenorder')));
        $tasks = $this->findEntities($sql);
        if ($tasks){
            if (count($screenorder) > 1){
                foreach ($screenorder as $key=>$value){
                    $value = intval($value);
                    $index = TaskMapper::searchIndex($value, $tasks);
                    $newarray[$key] = $tasks[$index];
                }
            } else {
                $newarray = $tasks;
            }
            foreach ($newarray as $key => $task){
                $task = (array) json_decode(json_encode($task));
                if ($task['resources'] != ''){
                    if (preg_match('/,/', $task['resources'], $match1)){
                        preg_match('/(.*?),/', $task['resources'], $match);
                        $index = array_search($match[1], array_column($usersgroupsarray, 'id'));
                        if ($usersgroupsarray[$index]['color'] != ''){
                            $newarray[$key]->color = $usersgroupsarray[$index]['color'];
                        } else {
                            $newarray[$key]->color = 'rgb(75, 113, 164)';
                        }
                    } else {
                        $index = array_search($task['resources'], array_column($usersgroupsarray, 'id'));
                        if ($usersgroupsarray[$index]['color'] != ''){
                            $newarray[$key]->color = $usersgroupsarray[$index]['color'];
                        } else {
                            $newarray[$key]->color = 'rgb(75, 113, 164)';
                        }
                    }
                } else {
                    $newarray[$key]->color = 'rgb(75, 113, 164)';
                }
            }
        } else {
            //$newarray = $tasks;
        }
        return $newarray;
    }
    
    public function find($id) {
        $sql = 'SELECT * FROM *PREFIX*owncollab_gantt_tasks WHERE id = ?';
        return $this->findEntity($sql, [$id]);
    }

}
