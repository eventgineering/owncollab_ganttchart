<?php

$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
$timepickerLangUrl = "jquery-ui-timepicker/i18n/jquery.ui.timepicker-". $lang;
$FRW = \OC::$server->getConfig()->getAppValue('owncollab_ganttchart', 'firstrunwizard', '0');
//error_log($FRW . "\n", 3, "/var/tmp/installed_apps.log");
if ($FRW == '0'){
		//error_log("firstrunwizard to be loaded" . "\n", 3, "/var/tmp/installed_apps.log");
		script('owncollab_ganttchart', 'firstrunwizard');
}

$dirname = OC::$SERVERROOT.'/apps/owncollab_ganttchart/vendor/dhtmlxgantt/commercial';
if (is_dir($dirname)){
	$ganttLangUrl = "dhtmlxgantt/commercial/locale/locale_". $lang;
	vendor_script('owncollab_ganttchart', 'colorpicker/spectrum');
	vendor_script('owncollab_ganttchart', 'dhtmlxgantt/commercial/dhtmlxgantt');
	vendor_script('owncollab_ganttchart', 'dhtmlxgantt/commercial/ext/dhtmlxgantt_multiselect');
	vendor_script('owncollab_ganttchart', 'dhtmlxgantt/commercial/ext/dhtmlxgantt_undo');
	vendor_script('owncollab_ganttchart', 'dhtmlxgantt/commercial/ext/dhtmlxgantt_auto_scheduling');
	vendor_script('owncollab_ganttchart', 'dhtmlxgantt/commercial/api');
	vendor_script('owncollab_ganttchart', 'dhtmlxgantt/commercial/ext/dhtmlxgantt_marker');
	vendor_style('owncollab_ganttchart', 'dhtmlxgantt/commercial/dhtmlxgantt');
	vendor_style('owncollab_ganttchart', 'colorpicker/spectrum');
	$dhtmlxversion = "commercial";

} else {
	vendor_script('owncollab_ganttchart', 'dhtmlxgantt/standard/dhtmlxgantt');
	vendor_script('owncollab_ganttchart', 'dhtmlxgantt/standard/api');
	$ganttLangUrl = "dhtmlxgantt/standard/locale/locale_". $lang;
	vendor_style('owncollab_ganttchart', 'dhtmlxgantt/standard/dhtmlxgantt');
	$dhtmlxversion = "standard";
}

//vendor_script('owncollab_ganttchart', 'html2canvas/html2canvas');
vendor_script('owncollab_ganttchart', $ganttLangUrl);
vendor_script('owncollab_ganttchart', 'jquery-ui-timepicker/jquery.ui.timepicker');
vendor_script('owncollab_ganttchart', $timepickerLangUrl);
vendor_style('owncollab_ganttchart', 'jquery-ui-timepicker/jquery.ui.timepicker');
vendor_style('owncollab_ganttchart', 'font-awesome/css/font-awesome');
script('owncollab_ganttchart', 'owncollabgantt');
script('owncollab_ganttchart', 'topbar');
script('owncollab_ganttchart', 'bottombar');
script('owncollab_ganttchart', 'script');
style('owncollab_ganttchart', 'main');
style('owncollab_ganttchart', 'owncollabgantt');
style('owncollab_ganttchart', 'sharetabview');
style('owncollab_ganttchart', 'fonts');

?>

<div id="app" data-dhtmlxversion="<?php echo $dhtmlxversion; ?>">
	<div id="app-content">
		<div id="app-content-wrapper">
			<?php print_unescaped($this->inc('part.content.save')); ?>
			<?php print_unescaped($this->inc('part.content.settings')); ?>
			<?php print_unescaped($this->inc('part.content.topbar')); ?>
			<?php print_unescaped($this->inc('part.content.gantt')); ?>
			<?php print_unescaped($this->inc('part.content.bottombar')); ?>
		</div>
	</div>
</div>
