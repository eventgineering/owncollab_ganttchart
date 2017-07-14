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
OCGantt.userColors= [];
OCGantt.filterValues = function (data, query){
    return data.filter(function(el){
        return el.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
}

OCGantt.getColors = function (data){
    if (data){
        var keys = OCGantt.filterValues(data, 'color');
            if (keys.length != 0){
            keys.forEach(function(item, index){
                OC.AppConfig.getValue('owncollab_ganttchart', item, function(data){
                    if (item.match(/.*user.*/)){
                        OCGantt.userColors.push({
                            id: 'u' + item.replace('color_user', ''),
                            value: data
                        });
                    }
                    if (item.match(/.*group.*/)){
                        OCGantt.userColors.push({
                            id: 'g' + item.replace('color_group', ''),
                            value: data
                        });
                    }
                });
            });
            OCGantt.testUserColors(keys.length);
        } else {
            OCGantt.testUserColors(0);
        }
    }
}
var taskId = null;

(function (OC, window, $, undefined) {
    'use strict';

    $(document).ready(function () {
        OCGantt.dhtmlxversion = $("#app").data();
        $("#app").append(OCGantt.splashScreen);
        var $bottom = OCGantt.getBottomById("topbar") + 1;
        $("#sidebar-save").css('top', $bottom + 'px');
        $("#sidebar-settings").css('top', $bottom + 'px');
        OCGantt.setMaxHeight($("#topbar"), $("#bottombar"), 'sidebar-save');
        OCGantt.setMaxHeight($("#topbar"), $("#bottombar"), 'sidebar-settings');
        OCGantt.setMaxHeight($("#topbar"), $("#bottombar"), 'gantt_chart');
        $(".sidebar_header").hover(
            function() { $(this).addClass("Hover");},
            function() { $(this).removeClass("Hover");}
        );
        $("#zoomslider").slider({
            value: 1,
            min: 1,
            max: 80,
            step: 1,
            change: function(){
                var sliderValue = $(this).slider("value");
                var tempValue = Math.floor(sliderValue-((sliderValue-1)/5)*4);
                OCGantt.handleZoom(tempValue, sliderValue);
                },
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
        alert('test');*/


        /*OC.AppConfig.getKeys('owncollab_ganttchart', function(data){
             OCGantt.appConfig = data;
             console.log(data);
            });*/
        if (OCGantt.isAdmin === true) {
            OC.AppConfig.getKeys('owncollab_ganttchart', OCGantt.getColors);
        }
        OCGantt.config();
        gantt.init("gantt_chart");
        OCGantt.tasks = new OCGantt.Tasks(OC.generateUrl('/apps/owncollab_ganttchart/tasks'));
        OCGantt.links = new OCGantt.Links(OC.generateUrl('/apps/owncollab_ganttchart/links'));
        OCGantt.share = new OCGantt.Share(OC.generateUrl('/apps/owncollab_ganttchart'));
        OCGantt.groupusers = new OCGantt.GroupUsers(OC.generateUrl('/apps/owncollab_ganttchart/groupusers'));
        OCGantt.share.index().done(function (){
        });
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
        OCGantt.testRedo();
        OCGantt.testUndo();
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
