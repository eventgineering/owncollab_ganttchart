<?php
namespace OCA\OwnCollab_GanttChart\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

class GroupUserMapper extends Mapper {

    /** @var IDb */
	protected $db;

	/**    
	 * @param GroupUserService $groupUserService
     */


    public function __construct(IDb $db) {
        parent::__construct($db, 'group_user', '\OCA\OwnCollab_GanttChart\Db\GroupUser');
        $this->db = $db;
    }

    public function findAllUsers() {
        $sqlusers = 'SELECT uid FROM *PREFIX*users';
        return $this->db->executeQuery($sqlusers)->fetchAll();
    }

    public function findAllGroups() {
        $sqlgroups = 'SELECT gid FROM *PREFIX*groups';
        return $this->db->executeQuery($sqlgroups)->fetchAll();
    }

    public function findAll() {
        $sqlgroups = 'SELECT gid, uid FROM *PREFIX*group_user';
        $sqlusers = 'SELECT uid, displayname FROM *PREFIX*users';
        $groups = $this->db->executeQuery($sqlgroups)->fetchAll();
        $users = $this->db->executeQuery($sqlusers)->fetchAll();
        $groupusers = array();

        foreach ($users as $user){
            if (!$user['displayname']){
                $user['displayname'] = $user['uid'];
            }
            if (in_array($user['uid'], array_column($groups, 'uid'))){
                foreach ($groups as $group){
                    if (!in_array($group['gid'], array_column($groupusers, 'gid'))){
                        $groupusers[] = array('gid' => $group['gid']);
                        $index = array_search($group['gid'], array_column($groupusers, 'gid'));
                        $groupusers[$index]['users'] = array();
                    }
                    if ($user['uid'] == $group['uid']) {
                        $index = array_search($group['gid'], array_column($groupusers, 'gid'));
                        $subarray = $groupusers[$index]['users'];
                        if (!in_array($user['uid'], array_column($subarray, 'uid'))){
                            $index = array_search($group['gid'], array_column($groupusers, 'gid'));
                            $groupusers[$index]['users'][] = array(
                                'uid' => $user['uid'],
                                'displayname' => $user['displayname']);
                        }
                    }
                }
            }
            if (!in_array($user['uid'], array_column($groups, 'uid'))){
                $groupusers[] = array('gid' => '_ungrouped');
                $index = array_search('_ungrouped', array_column($groupusers, 'gid'));
                $groupusers[$index]['users'][] = array(
                    'uid' => $user['uid'],
                    'displayname' => $user['displayname']);
            }
        }

        return $groupusers;
    }
    
    public function find($gid) {
        $sql = 'SELECT * FROM *PREFIX*group_user WHERE gid = ?';
        return $this->executeQuery($sql, [$gid]);
    }

}
