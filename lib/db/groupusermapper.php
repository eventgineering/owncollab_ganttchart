<?php
namespace OCA\OwnCollab_GanttChart\Db;

use OCP\IDb;
use OCP\AppFramework\Db\Mapper;

class GroupUserMapper extends Mapper {

    public function __construct(IDb $db) {
        parent::__construct($db, 'group_user', '\OCA\OwnCollab_GanttChart\Db\GroupUser');
    }

    public function findAll() {
        $sqlgroups = 'SELECT * FROM *PREFIX*group_user';
        $sqlusers = 'SELECT * FROM *PREFIX*users';
        $groups = $this->db->executeQuery($sqlgroups)->fetchAll();
        $users = $this->db->executeQuery($sqlusers)->fetchAll();
        $groupusers = array();
        $testarray = array(
            array(
                'gid' => 'admin',
                'users' => array(
                    array(
                        'uid' => 'user1',
                        'displayname' => 'user 1',
                    ),
                    array(
                        'uid' => 'user2',
                        'displayname' => 'user 2',
                    ),
                ),
            ),
            array(
                'gid' => 'benutzer',
                'users' => array(
                    array(
                        'uid' => 'user3',
                        'displayname' => 'user 3',
                    ),
                    array(
                        'uid' => 'user4',
                        'displayname' => 'user 4',
                    ),
                ),
            ),
        );

        foreach ($users as $user){
            if (!$user['displayname']){
                $user['displayname'] = $user['uid'];
            }
            if (in_array($user['uid'], array_column($groups, 'uid'))){
                error_log("user " . $user['uid'] . " is in at least 1 group " . "\n", 3, "/var/tmp/meine-fehler.log");
            foreach ($groups as $group){
                if (!in_array($group['gid'], array_column($groupusers, 'gid'))){
                    $groupusers[] = array('gid' => $group['gid']);
                }
                if ($user['uid'] == $group['uid']) {
                    $index = array_search($group['gid'], array_column($groupusers, 'gid'));
                    /* $subarray = $groupusers[$index]['users']; */
                    if (!in_array($user['uid'], array_column($subarray, 'uid'))){
                        $index = array_search($group['gid'], array_column($groupusers, 'gid'));
                        $groupusers[$index]['users'][] = array(
                            'uid' => $user['uid'],
                            'displayname' => $user['displayname']);
                    }
                }
            }}
            if (!in_array($user['uid'], array_column($groups, 'uid'))){
                error_log("user " . $user['uid'] . " has no group " . "\n", 3, "/var/tmp/meine-fehler.log");
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
