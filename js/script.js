/**
 * ownCloud - owncollab_gantt
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author andy <info@eventgineering.de>
 * @copyright andy 2016
 */
var instanceUrl = OC.generateUrl('/apps/owncollab_gantt/');
var arr = {
    data: {},
    links: {},
};
OCGantt.linksLoaded = undefined;
OCGantt.tasksLoaded = undefined;
var taskId = null;

(function (OC, window, $, undefined) {
    'use strict';

    $(document).ready(function () {

        var translations = {
            //    newEvent: $('#new-event-string').text()
        };
        OCGantt.config();
        gantt.init("gantt_chart");

        OCGantt.tasks = new OCGantt.Tasks(OC.generateUrl('/apps/owncollab_gantt/tasks'));
        OCGantt.links = new OCGantt.Links(OC.generateUrl('/apps/owncollab_gantt/links'));
        OCGantt.links.loadAll().done(function () {
            arr.links = OCGantt.links._links;
            OCGantt.linksLoaded = true;
        });
        OCGantt.tasks.loadAll().done(function () {
            arr.data = OCGantt.tasks._tasks;
            OCGantt.tasksLoaded = true;
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
