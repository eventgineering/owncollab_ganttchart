<?php
/**
 * @var OCP\Template $this
 * @var array $_
 */

$appName = 'owncollab_ganttchart';
?>

<div id="sidebar-left" class="sidebar-left">
    <div id="sidebar-export">
        <div class="tbl">
            <div class="tbl_cell export_gantt sidebar_header export_excel">
                <h4>Excel</h4>
                <img src="<?php p($this->image_path($appName,'ms_excel.png'))?>" onclick="OCGantt.btnAction('export2excel')" alt="Export to Excel">
            </div>
            <div class="tbl_cell export_gantt sidebar_header export_pdf">
                <h4>PDF</h4>
                <img src="<?php p($this->image_path($appName,'application-pdf.png'))?>" onclick="OCGantt.btnAction('export2PDF')" alt="Export to PDF">
            </div>
            <div class="tbl_cell export_gantt sidebar_header export_img">
                <h4>Image</h4>
                <img src="<?php p($this->image_path($appName,'image.png'))?>" onclick="OCGantt.btnAction('export2image')" alt="Export to Image">
            </div>
            <div class="tbl_cell export_gantt sidebar_header export_ical">
                <h4>iCalendar</h4>
                <img src="<?php p($this->image_path($appName,'ical.png'))?>" onclick="OCGantt.btnAction('export2ical')" alt="Export to iCal-File">
            </div>
            <div class="tbl_cell export_gantt sidebar_header export_mc">
                <h4>MS Project</h4>
                <img src="<?php p($this->image_path($appName,'ms_project.png'))?>" onclick="OCGantt.btnAction('export2ms')" alt="Export to MS Project">
            </div>
        </div>
    </div>
    
</div>