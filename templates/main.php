<?php
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
$timepickerLangUrl = "jquery-ui-timepicker/i18n/jquery.ui.timepicker-". $lang;
$ganttLangUrl = "commercial/locale/locale_". $lang;
script('owncollab_ganttchart', 'html2canvas');
script('owncollab_ganttchart', 'commercial/dhtmlxgantt');
script('owncollab_ganttchart', 'commercial/ext/dhtmlxgantt_multiselect');
script('owncollab_ganttchart', $ganttLangUrl);
script('owncollab_ganttchart', 'jquery-ui-timepicker/jquery.ui.timepicker');
script('owncollab_ganttchart', $timepickerLangUrl);
script('owncollab_ganttchart', 'owncollabgantt');
script('owncollab_ganttchart', 'script');
style('owncollab_ganttchart', 'font-awesome/css/font-awesome');
style('owncollab_ganttchart', '../js/jquery-ui-timepicker/jquery.ui.timepicker');
//style('owncollab_ganttchart', 'dhtmlxgantt');
style('owncollab_ganttchart', 'dhtmlxganttpro');
style('owncollab_ganttchart', 'main');
style('owncollab_ganttchart', 'owncollabgantt');

?>

<div id="app">
	<div id="app-content">
		<div id="app-content-wrapper">
			<?php print_unescaped($this->inc('part.content.gantt')); ?>
		</div>
	</div>
</div>
