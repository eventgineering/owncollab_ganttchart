<?php
namespace OCA\OwnCollab_GanttChart\Controller;

use OCP\AppFramework\Controller;
use OCP\IRequest;

class PdfExportController extends Controller {

    private $userId;
    /**
	 * @param string $appName
     */
    
    public function __construct($appName, IRequest $request, $userId) {
        parent::__construct($appName, $request);
        $this->userId = $userId;
    }

    /*public function generateRandomString($length = 10){
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }*/


    public function export(){
        /*if (!is_dir(\OC::$SERVERROOT . '/apps/owncollab_ganttchart/tmp'))
            mkdir(\OC::$SERVERROOT . '/apps/owncollab_ganttchart/tmp');
        chmod(\OC::$SERVERROOT . '/apps/owncollab_ganttchart/tmp', 0777);
        $path = \OC::$SERVERROOT . '/apps/owncollab_ganttchart/tmp/';
        $randomValue = $this->generateRandomString();
        $dataFile = $path.'data.' . $randomValue . '.txt';*/
        $ch = curl_init();
        $fields_string = '';
        $url = "https://pdfgenerator.owncollab.com/rendergantt.php";
        //$url = "http://10.8.10.201/pdfgenerator/pdfgenerator.php";
        $fields = array(
            'html' => $_POST['html'],
            'papersize' => $_POST['papersize'],
            'orientation' => $_POST['orientation'],
            'pdf_header_left' => $_POST['pdf_header_left'],
            'pdf_header_center' => $_POST['pdf_header_center'],
            'pdf_header_right'  => $_POST['pdf_header_right'],
            'pdf_footer_left' => $_POST['pdf_footer_left'],
            'pdf_footer_center' => $_POST['pdf_footer_center'],
            'pdf_footer_right'  => $_POST['pdf_footer_right'],
            'width' => $_POST['width'],
            'height' => $_POST['height'],
         );
        foreach($fields as $key=>$value) { $fields_string .= $key.'='.urlencode($value).'&'; }
        rtrim($fields_string, '&');
        //file_put_contents($dataFile, $fields_string);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_POST, count($fields));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $output = curl_exec($ch);
        curl_close($ch);
        //$output = "https://pdfgenerator.owncollab.com/" . system('curl -k --request POST "' . $url . '" --data "@' . $dataFile . '"');
        error_log(print_r($output, true) . "\n", 3, "/var/tmp/output.log");
        //echo $output;
        return $output;
    }
}
?>