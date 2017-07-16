<?php
/**
 * @var OCP\Template $this
 * @var array $_
 */

$appName = 'owncollab_ganttchart';
?>

<div id="sidebar-settings" class="sidebar-left">
    <div id="sidebar-settings-header">
        <div class="tbl">
            <div class="tbl_cell export_gantt sidebar_header colors" onclick="OCGantt.btnAction('setColors')">
                <h4>Colors</h4>
            </div>
            <div class="tbl_cell export_gantt sidebar_header" onclick="OCGantt.btnAction('setShare')">
                <h4>Share</h4>
            </div>
            <div class="tbl_cell export_gantt sidebar_header" onclick="OCGantt.btnAction('setDisplay')">
                <h4>Display</h4>
            </div>
        </div>
    </div>
    <div id="sidebar-settings-content-colors" class="sidebar-left-content"></div>
    <div id="sidebar-settings-content-share" class="sidebar-left-content">
        <div id="shareTabView" class="tab shareTabView">
            <div class="dialogContainer">
                <div class="linkShareView subView">
                    <label class="hidden-visually" for="linkText-OCGantt">Link</label>
                    <input id="linkText-OCGantt" class="linkText" readonly="readonly" value="" type="text"><i class="fa fa-copy"></i>
                    <label for="recipient-OCGantt">Recipient</label>
                    <input id="recipient-OCGantt" value="" type="text" placeholder="Enter email recipients separated by ; sign">
                    <input name="showPassword" id="showPassword-OCGantt" class="checkbox showPasswordCheckbox" value="1" type="checkbox">
                    <label for="showPassword-OCGantt">Password</label>
                    <div id="linkPass" class="linkPass hidden" style="display: hidden;">
                        <label for="linkPassText-OCGantt" class="hidden-visually">Password</label>
                        <input id="linkPassText-OCGantt" class="linkPassText" placeholder="Choose a password" type="password">
                        <span class="icon-loading-small hidden"></span>
                    </div>
                    <div class="expirationView subView">
                        <input name="expirationCheckbox" class="expirationCheckbox checkbox" id="expirationCheckbox-OCGantt" value="1" type="checkbox">
                        <label for="expirationCheckbox-OCGantt">Expiry Date</label>
                        <div class="expirationDateContainer hidden" style="display: hidden;">
                            <label for="expirationDate" class="hidden-visually" value="">Expiry Date</label>
                            <input id="expirationDate" class="datepicker" placeholder="Expiry Date" value="" type="text">
                        </div>
                    </div>
                    <input type="button" id="share-save" value="Save">
                    <i id="save-share-settings" class="fa fa-spinner fa-pulse" style="display: none;"></i>
                    <p id="nothing-to-store" style="display:none;">No changes . . . nothing to be saved</p>
                </div>
            </div>
        </div>
    </div>
    <div id="sidebar-settings-content-display" class="sidebar-left-content">
        <div id="dateinput">
            <p>Please specify the date range that should be shown</p>
            <div class="tbl_cell lbox_date_column">
                <div class="tbl">
                    <div class="tbl_cell lbox_title" style="width: 20px;"><label for="set-startdate">Start</label></div>
                    <div class="tbl_cell" style="width: 80px"><input class="datepicker" id="set-startdate" name="set-startdate" type="text" style="width: 80px"></div>
                    <div class="tbl_cell lbox_title" style="width: 20px;"><label for="set-enddate">End</label></div>
                    <div class="tbl_cell" style="width: 80px"><input class="datepicker" id="set-enddate" name="set-enddate" type="text" style="width: 80px"></div>
                    <div class="tbl_cell" style="width: 1px;"></div>
                </div>
            </div>
        </div>
        <div id="display-markers">
            <input name="display-markers-today" id="display-markers-today" class="checkbox" value="0" type="checkbox">
            <label for="display-markers-today">Show marker at the actual date</label>
        </div>
    </div>
    
</div>