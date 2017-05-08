<?php
namespace OCA\OwnCollab_TimeTracker\Tests\Unit\Controller;

use PHPUnit_Framework_TestCase;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\DataResponse;

use OCA\OwnCollab_TimeTracker\Service\NotFoundException;


class EventControllerTest extends PHPUnit_Framework_TestCase {

    protected $controller;
    protected $service;
    protected $userId = 'john';
    protected $request;

    public function setUp() {
        $this->request = $this->getMockBuilder('OCP\IRequest')->getMock();
        $this->service = $this->getMockBuilder('OCA\OwnCollab_TimeTracker\Service\EventService')
            ->disableOriginalConstructor()
            ->getMock();
        $this->controller = new EventController(
            'owncollab_timetracker', $this->request, $this->service, $this->userId
        );
    }

    public function testUpdate() {
        $event = 'just check if this value is returned correctly';
        $this->service->expects($this->once())
            ->method('update')
            ->with($this->equalTo(3),
                    $this->equalTo('title'),
                    $this->equalTo('content'),
                   $this->equalTo($this->userId))
            ->will($this->returnValue($event));

        $result = $this->controller->update(3, 'title', 'content');

        $this->assertEquals($event, $result->getData());
    }


    public function testUpdateNotFound() {
        // test the correct status code if no event is found
        $this->service->expects($this->once())
            ->method('update')
            ->will($this->throwException(new NotFoundException()));

        $result = $this->controller->update(3, 'title', 'content');

        $this->assertEquals(Http::STATUS_NOT_FOUND, $result->getStatus());
    }

}
