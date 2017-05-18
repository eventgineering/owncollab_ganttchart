<?php
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
$timepickerLangUrl = "jquery-ui-timepicker/i18n/jquery.ui.timepicker-". $lang;
$ganttLangUrl = "commercial/locale/locale_". $lang;
script('owncollab_gantt', 'html2canvas');
script('owncollab_gantt', 'commercial/dhtmlxgantt');
script('owncollab_gantt', 'commercial/ext/dhtmlxgantt_multiselect');
script('owncollab_gantt', $ganttLangUrl);
script('owncollab_gantt', 'jquery-ui-timepicker/jquery.ui.timepicker');
script('owncollab_gantt', $timepickerLangUrl);
script('owncollab_gantt', 'owncollabgantt');
script('owncollab_gantt', 'script');
style('owncollab_gantt', 'font-awesome/css/font-awesome');
style('owncollab_gantt', '../js/jquery-ui-timepicker/jquery.ui.timepicker');
//style('owncollab_gantt', 'dhtmlxgantt');
style('owncollab_gantt', 'dhtmlxganttpro');
style('owncollab_gantt', 'main');
style('owncollab_gantt', 'owncollabgantt');

?>

<div id="app">
	<div id="app-content">
		<div id="app-content-wrapper">
			<?php print_unescaped($this->inc('part.content.gantt')); ?>
		</div>
	</div>
</div>
