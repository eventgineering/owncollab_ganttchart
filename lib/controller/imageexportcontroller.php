<?php
namespace OCA\OwnCollab_GanttChart\Controller;

use OCP\AppFramework\Controller;
use OCP\IRequest;

class ImageExportController extends Controller {

    private $userId;
    /**
	 * @param string $appName
     */
    
    public function __construct($appName, IRequest $request, $userId) {
        parent::__construct($appName, $request);
        $this->userId = $userId;
    }

    /**
	 * @PublicPage
	 * @NoCSRFRequired
	 * @UseSession
     */
     
    public function export(){
        $ch = curl_init();
        $fields_string = '';
        $url = "https://pdfgenerator.owncollab.com/rendergantt.php";
        //$url = "http://10.8.10.201/pdfgenerator/pdfgenerator.php";
        $fields = array(
            'html' => $_POST['html'],
            'type' => 'image',
            'width' => $_POST['width'],
            'height' => $_POST['height'],
         );
        foreach($fields as $key=>$value) { $fields_string .= $key.'='.urlencode($value).'&'; }
        rtrim($fields_string, '&');
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_POST, count($fields));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }
}
?>