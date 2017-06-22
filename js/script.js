/**
 * ownCloud - owncollab_ganttchart
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author andy <info@eventgineering.de>
 * @copyright andy 2016
 */
var instanceUrl = OC.generateUrl('/apps/owncollab_ganttchart/');
var arr = {
    data: {},
    links: {},
};
var resourcesStatus = undefined;
var globalTimeout = null;
//$("body").append(OCGantt.splashScreen.html);

OCGantt.linksLoaded = undefined;
OCGantt.tasksLoaded = undefined;
OCGantt.usergroupsLoaded = undefined;
OCGantt.appConfig = undefined;
OCGantt.dhtmlxversion = undefined;
var taskId = null;

(function (OC, window, $, undefined) {
    'use strict';

    $(document).ready(function () {
        OCGantt.dhtmlxversion = $("#app").data();
        $("#app").append(OCGantt.splashScreen);
        var $bottom = OCGantt.getBottomById("topbar") + 1;
        $("#sidebar-left").css('top', $bottom + 'px');
        OCGantt.setMaxHeight($("#topbar"), $("#bottombar"), 'sidebar-left');
        OCGantt.setMaxHeight($("#topbar"), $("#bottombar"), 'gantt_chart');
        $(".sidebar_header").hover(
            function() { $(this).addClass("Hover");},
            function() { $(this).removeClass("Hover");}
        );
        $("#zoomslider").slider({
            value: 50,
            min: 0,
            max: 100,
            step: 1,
            change: function(){
                // var width = $(".gantt_task_cell").css('width');
                //width = width.substr("px", "");
                gantt.config.min_column_width = $(this).slider("value");
                gantt.render();
                console.log($("#zoomslider").slider("value"));},
        });
        $("#zoom-minus").click(function(){
            var s = $("#zoomslider"), val = s.slider("value"), step = s.slider("option", "step");
            s.slider("value", val - step);
        });
        $("#zoom-plus").click(function(){
            var s = $("#zoomslider"), val = s.slider("value"), step = s.slider("option", "step");
            s.slider("value", val + step);
        });
        $("#zoomtofit").click(function(){
            zoomToFit();
        });
        // OCGantt.showMask();
//    document.body.innerHTML += OCGantt.splashScreen;
        var translations = {
            //    newEvent: $('#new-event-string').text()
        };
        /*    
        console.log(oc_appconfig);
        console.log(OC.getLocale());
        console.log(OC.isUserAdmin());
        console.log(OC.getCurrentUser());
        console.log(OC.AppConfig);
        alert('test');


        OC.AppConfig.getKeys('owncollab_ganttchart', function(data){
             OCGantt.appConfig = data;
            });
        */
        OCGantt.config();
        gantt.init("gantt_chart");
        OCGantt.tasks = new OCGantt.Tasks(OC.generateUrl('/apps/owncollab_ganttchart/tasks'));
        OCGantt.links = new OCGantt.Links(OC.generateUrl('/apps/owncollab_ganttchart/links'));
        OCGantt.groupusers = new OCGantt.GroupUsers(OC.generateUrl('/apps/owncollab_ganttchart/groupusers'));
        /* OCGantt.groupusers.loadAll().done(function(){
            console.log(OCGantt.groupusers._groupusers);
        }); */
        OCGantt.tasks.loadAll().done(function () {
            arr.data = OCGantt.tasks._tasks;
            OCGantt.tasksLoaded = true;
        });
        OCGantt.links.loadAll().done(function () {
            arr.links = OCGantt.links._links;
            for (i = 0; i < arr.links.length; i++) {
                if (arr.links[i].lag != "0"){
                    arr.links[i].lag = parseInt(arr.links[i].lag);
                }
            }
            OCGantt.linksLoaded = true;
        });
        OCGantt.groupusers.loadAll().done(function(){
            OCGantt.usergroupsLoaded = true;
        });
        OCGantt.init();
        $("body").append(OCGantt.lbox.HTML.html);
        if (typeof monthNames != 'undefined') {
            // min date should always be the next day
            var minDate = new Date();
            minDate.setDate(minDate.getDate() + 1);
            $.datepicker.setDefaults({
                monthNames: monthNames,
                monthNamesShort: monthNamesShort,
                dayNames: dayNames,
                dayNamesMin: dayNamesMin,
                dayNamesShort: dayNamesShort,
                firstDay: firstDay,
                minDate: minDate
            });
        }
    });

})(OC, window, jQuery);
