<?php 
$dirname = OC::$SERVERROOT.'/apps/owncollab_ganttchart/vendor/dhtmlxgantt/commercial';
if (is_dir($dirname)){
    print_unescaped($this->inc('part.content.topbar.commercial'));
} else{
    print_unescaped($this->inc('part.content.topbar.standard'));
}
?>