/**
 * ownCloud - owncollab_ganttchart
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Andreas Seiler <info@eventgineering.de>
 * @copyright eventgineering UG 2017
 */

// Definition of namespace OCGantt
var OCGantt = {};
OCGantt.lbox = {};
OCGantt.lbox.HTML = {};
OCGantt.isAdmin = OC.isUserAdmin();
OCGantt.lbox.resources = {};
OCGantt.lbox.resources.HTML = {};
OCGantt.lbox.ActiveOverlay = [];
OCGantt.tempLinks = [];
OCGantt.linksToRemove = [];
OCGantt.caretPos;
OCGantt.tempDistance = 0;
var target = undefined;

OCGantt.splashScreenIcon = OC.generateUrl('/apps/owncollab_ganttchart/img/loading-dark.gif').replace("index.php/", "");
OCGantt.splashScreen = '<div id="OCGantt-cover" class="gantt_cal_cover" style="z-index: 900;"></div>' +
    '<div id="OCGantt-loader" class="icon-loading-dark" style="display: block; top: calc(50% - 8px); left: calc(50% - 8px); filter: contrast(0%) brightness(0%); margin: auto; z-index:901; position: absolute; transform: translate(-50%, -50%)">' +
    '<br><br><br>We are preparing the app for your best experience . . .</div>';


// Definition of width of the columns in the table
OCGantt.columnWidth = {
    id: 30,
    name: 150,
    start: 120,
    end: 120,
    duration: 50,
    resources: 100,
    buttons: 75
};

// Function that initializes the gantt chart
OCGantt.init = function () {
    if (OCGantt.linksLoaded && OCGantt.tasksLoaded && OCGantt.usergroupsLoaded) {
        gantt.parse(arr);
        /*html2canvas([document.getElementById('content-wrapper')], {
            onrendered: function (canvas) {
                console.log('ready');
            }
        });*/
        return;
    }
    setTimeout(OCGantt.init, 50);
};

OCGantt.testRedo = function() {
    if (gantt._undo._redoStack.length > 0){
        console.log("redo activated");
        $(".fa-repeat").removeClass('not_available');
        return;
    }
    setTimeout(OCGantt.testRedo, 50);
};

OCGantt.testUndo = function() {
    if (gantt._undo._undoStack.length > 0){
        console.log("undo activated");
        $(".fa-undo").removeClass('not_available');
        return;
    }
    setTimeout(OCGantt.testUndo, 50);
};

OCGantt.handleZoom = function (tempValue, sliderValue) {
    // var width = ((sliderValue-((tempValue - 1)*5))*5) + 20;
    //console.log(tempValue);
    //console.log(sliderValue);
    // var width = (-5*(sliderValue-(sliderValue-1)))+50;
    var width = (-5 * (sliderValue - ((tempValue - 1) * 5))) + 50;
    gantt.config.min_column_width = width;
    switch (tempValue) {
        case 1:
            gantt.config.date_scale = "%H";
            gantt.config.scale_unit = "hour";
            gantt.config.step = 1;
            gantt.config.subscales = [
                { unit: "month", step: 1, date: "%F %Y" },
                { unit: "day", step: 1, date: "%d" }
            ];
            break;
        case 2:
            gantt.config.date_scale = "%H";
            gantt.config.scale_unit = "hour";
            gantt.config.step = 2;
            gantt.config.subscales = [
                { unit: "month", step: 1, date: "%F %Y" },
                { unit: "day", step: 1, date: "%d" }
            ];
            break;
        case 3:
            gantt.config.date_scale = "%H";
            gantt.config.scale_unit = "hour";
            gantt.config.step = 3;
            gantt.config.subscales = [
                { unit: "month", step: 1, date: "%F %Y" },
                { unit: "day", step: 1, date: "%d" }
            ];
            break;
        case 4:
            gantt.config.date_scale = "%H";
            gantt.config.scale_unit = "hour";
            gantt.config.step = 4;
            gantt.config.subscales = [
                { unit: "month", step: 1, date: "%F %Y" },
                { unit: "day", step: 1, date: "%d" }
            ];
            break;
        case 5:
            gantt.config.date_scale = "%H";
            gantt.config.scale_unit = "hour";
            gantt.config.step = 6;
            gantt.config.subscales = [
                { unit: "month", step: 1, date: "%F %Y" },
                { unit: "day", step: 1, date: "%d" }
            ];
            break;
        case 6:
            gantt.config.date_scale = "%H";
            gantt.config.scale_unit = "hour";
            gantt.config.step = 12;
            gantt.config.subscales = [
                { unit: "month", step: 1, date: "%F %Y" },
                { unit: "day", step: 1, date: "%d" }
            ];
            break;
        case 7:
            gantt.config.scale_unit = "day";
            gantt.config.date_scale = "%d";
            gantt.config.step = 1;
            gantt.config.subscales = [
                { unit: "year", step: 1, date: "%Y" },
                { unit: "month", step: 1, date: "%F" }
            ];
            break;
        case 8:
            gantt.config.date_scale = "%d";
            gantt.config.scale_unit = "day";
            gantt.config.step = 2;
            gantt.config.subscales = [
                { unit: "year", step: 1, date: "%Y" },
                { unit: "month", step: 1, date: "%F" }
            ];
            break;
        case 9:
            gantt.config.date_scale = "%d   ";
            gantt.config.scale_unit = "day";
            gantt.config.step = 3;
            gantt.config.subscales = [
                { unit: "year", step: 1, date: "%Y" },
                { unit: "month", step: 1, date: "%F" }
            ];
            break;
        case 10:
            gantt.config.date_scale = "%W";
            gantt.config.scale_unit = "week";
            gantt.config.step = 1;
            gantt.config.subscales = [
                { unit: "year", step: 1, date: "%Y" },
                { unit: "month", step: 1, date: "%F" }
            ];
            break;
        case 11:
            gantt.config.scale_unit = "week";
            gantt.config.date_scale = "%W";
            gantt.config.step = 2;
            gantt.config.subscales = [
                { unit: "year", step: 1, date: "%Y" },
                { unit: "month", step: 1, date: "%F" }
            ];
            break;
        case 12:
            gantt.config.scale_unit = "year";
            gantt.config.date_scale = "%F";
            gantt.config.step = 1;
            gantt.config.subscales = [
                { unit: "year", step: 1, date: "%Y" }
            ];
            break;
        case 13:
            gantt.config.scale_unit = "year";
            gantt.config.date_scale = "%F";
            gantt.config.step = 2;
            gantt.config.subscales = [
                { unit: "year", step: 1, date: "%Y" }
            ];
            break;
        case 14:
            gantt.config.scale_unit = "year";
            gantt.config.date_scale = "%F";
            gantt.config.step = 3;
            gantt.config.subscales = [
                { unit: "year", step: 1, date: "%Y" }
            ];
            break;
        case 15:
            gantt.config.scale_unit = "year";
            gantt.config.date_scale = "%F";
            gantt.config.step = 4;
            gantt.config.subscales = [
                { unit: "year", step: 1, date: "%Y" }
            ];
            break;
        case 16:
            gantt.config.scale_unit = "year";
            gantt.config.date_scale = "%F";
            gantt.config.step = 6;
            gantt.config.subscales = [
                { unit: "year", step: 1, date: "%Y" }
            ];
            break;
    }
    gantt.render();
}

// Function that inits a datefield with datepicker and extra features
OCGantt.lbox.dateInit = function (datefield, task, datefield2) {
    var caretPos = 1;
    $(datefield).datepicker({ dateFormat: "dd.mm.yy", minDate: null });
    if (datefield.id == 'startdate') {
        $(datefield).datepicker('setDate', task.start_date);
        $(datefield).datepicker('option', {
            onClose: function(){
                $(datefield2).datepicker('setDate', new Date(task.end_date.getTime() - (task.start_date.getTime() - $(datefield).datepicker('getDate').getTime())));
            }
        });
    }
    if (datefield.id == 'projectstartdate') {
        $(datefield).datepicker('setDate', task.start_date);
    }
    if (datefield.id == 'enddate') {
        $(datefield).datepicker('setDate', task.end_date);
    }
    $(datefield).click(function () {
        this.setSelectionRange(0, 2);
    });
    $(datefield).focus(function () {
        this.setSelectionRange(0, 2);
    });
    datefield.onkeydown = function (event) {
        if ((event.which == 190) || (event.which == 39)) {
            event.preventDefault();
            switch (caretPos) {
                case 1:
                    caretPos = 2;
                    this.setSelectionRange(3, 5);
                    break;
                case 2:
                    caretPos = 3;
                    this.setSelectionRange(6, 10);
                    break;
                case 3:
                    caretPos = 1;
                    this.setSelectionRange(0, 2);
                    break;
            }
        }
        if (event.which == 37) {
            event.preventDefault();
            switch (caretPos) {
                case 1:
                    break;
                case 2:
                    caretPos = 1;
                    this.setSelectionRange(0, 2);
                    break;
                case 3:
                    caretPos = 2;
                    this.setSelectionRange(3, 5);
                    break;
            }
        }
    };
    $(datefield).blur(function () {
        caretPos = 1;
    });
}

OCGantt.lbox.timeInit = function (timefield, task, date) {
    var caretPos = 1;
    var time = ("0" + task[date].getHours()).slice(-2) + ":" + ("0" + task[date].getMinutes()).slice(-2);
    timefield.value = time;
    $(timefield).timepicker();
    $(timefield).click(function () {
        this.setSelectionRange(0, 2);
    });
    $(timefield).focus(function () {
        this.setSelectionRange(0, 2);
    });
    timefield.onkeydown = function (event) {
        if ((event.which == 190) || (event.which == 39)) {
            event.preventDefault();
            switch (caretPos) {
                case 1:
                    caretPos = 2;
                    this.setSelectionRange(3, 5);
                    break;
                case 2:
                    caretPos = 1;
                    this.setSelectionRange(0, 2);
                    break;
            }
        }
        if (event.which == 37) {
            event.preventDefault();
            switch (caretPos) {
                case 1:
                    break;
                case 2:
                    caretPos = 1;
                    this.setSelectionRange(0, 2);
                    break;
            }
        }
    };
    $(timefield).blur(function () {
        caretPos = 1;
    });
}

OCGantt.lbox.updateEndDateField = function (source, target) {
    console.log("update called");
    var d = $(source).datepicker('getDate');
    /*var sdate = OCGantt.lbox.getForm("my-form").querySelector("[name='startdate']").value;
    var stime = OCGantt.lbox.getForm("my-form").querySelector("[name='starttime']").value;
    var smonth = sdate.substr(3, 2) - 1;
    var enddate = new Date(sdate.substr(6, 4), smonth, sdate.substr(0, 2), stime.substr(0, 2), stime.substr(3, 2));
    console.log(enddate);*/
    console.log(d);
    $(target).datepicker('setDate', d);

}

OCGantt.lbox.addResources = function (taskResources, resource) {
    var uid = undefined;
    var gid = undefined;
    var form = OCGantt.lbox.getForm("my-form");
    var resourcesField = form.querySelector("[name='resources']");
    if (resource.indexOf("u_") != -1) {
        uid = resource.replace("u_", "");
    } else if (resource.indexOf("g_") != -1) {
        gid = resource.replace("g_", "");
    }
    if (uid) {
        if (taskResources == '') {
            taskResources = [resource];
            var displayname = OCGantt.getDisplayname(uid);
            $(resourcesField).append(displayname);
        } else if (taskResources != '') {
            taskResources.push(resource);
            var displayname = OCGantt.getDisplayname(uid);
            $(resourcesField).append(", " + displayname);
        }
    }
    if (gid) {
        if (taskResources == '') {
            taskResources = [resource];
            $(resourcesField).append("<strong>" + gid + "</strong>");
        } else if (taskResources != '') {
            taskResources.push(resource);
            $(resourcesField).append(", <strong>" + gid + "</strong>");
        }
    }
    return taskResources;
}

OCGantt.lbox.deleteResources = function (taskResources, resource) {
    var uid = undefined;
    var gid = undefined;
    var form = OCGantt.lbox.getForm("my-form");
    var resourcesField = form.querySelector("[name='resources']");
    if (resource.indexOf("u_") != -1) {
        uid = resource.replace("u_", "");
    } else if (resource.indexOf("g_") != -1) {
        gid = resource.replace("g_", "");
    }
    if (uid) {
        if (taskResources == '') {
        } else if (taskResources != '') {
            if (taskResources.length > 1) {
                $(resourcesField).append(", ");
                $(resourcesField).html(function () {
                    return $(this).html().replace(OCGantt.getDisplayname(uid) + ", ", "");
                });
            } else if (taskResources.length == 1) {
                $(resourcesField).html(function () {
                    return $(this).html().replace(OCGantt.getDisplayname(uid), "");
                });
            }
            var i = taskResources.indexOf(resource);
            if (i != -1) {
                taskResources.splice(i, 1);
            }
        }
    }
    if (gid) {
        if (taskResources == '') {
        } else if (taskResources != '') {
            $(resourcesField).html(function () {
                return $(this).html().replace("<strong>" + gid + "</strong>", "")
            });
            var i = taskResources.indexOf(resource);
            if (i != -1) {
                taskResources.splice(i, 1);
            }
        }
    }
    if ((taskResources.length == 0) || (taskResources.length == 1)) {
        $(resourcesField).html(function () {
            return $(this).html().replace(/, /g, "");
        });
    } else if (taskResources.length >= 1) {
        $(resourcesField).html(function () {
            return $(this).html().replace(/, , /g, ", ");
        });
        if ($(resourcesField).html().charAt(0) == ',') {
            $(resourcesField).html(function () {
                return $(this).html().replace(/^, /, "");
            });
        }
        if ($(resourcesField).html().charAt($(resourcesField).html().length - 2) == ',') {
            $(resourcesField).html(function () {
                return $(this).html().replace(/, $/, "");
            });
        }
    }
    return taskResources;
}

OCGantt.lbox.getChecked = function (source) {
    var checkedId = undefined;
    var linkCropStart = source.length - 2;
    var predecessor = source.substr(0, linkCropStart - 1);
    var checkBoxes = [
        $("#" + predecessor + "_FS"),
        $("#" + predecessor + "_SS"),
        $("#" + predecessor + "_SF"),
        $("#" + predecessor + "_FF"),
    ];
    $(checkBoxes).each(function () {
        if (($(this).prop("checked") == true) && ($(this).prop("id") != source)) {
            checkedId = $(this).prop("id");
        }
    });
    return checkedId;

}

OCGantt.lbox.addLink = function (tempLinks, source, target) {
    var linkCropStart = source.length - 2;
    var linkType = source.substr(linkCropStart, 2);
    var predecessor = source.substr(0, linkCropStart - 1);
    var link = {};
    link.$new = true;
    link.source = predecessor.toString();
    link.target = target.toString();
    link.lag = 0;
    switch (linkType) {
        case "FS":
            link.type = "0";
            break;
        case "SS":
            link.type = "1";
            break;
        case "SF":
            link.type = "3";
            break;
        case "FF":
            link.type = "2";
            break;
    }
    OCGantt.tempLinks.push(link);
    return OCGantt.tempLinks;
}

OCGantt.lbox.deleteLink = function (tempLinks, source, target) {
    var linkCropStart = source.length - 2;
    var linkType = undefined;
    switch (source.substr(linkCropStart, 2)) {
        case "FS":
            linkType = "0";
            break;
        case "SS":
            linkType = "1";
            break;
        case "SF":
            linkType = "3";
            break;
        case "FF":
            linkType = "2";
            break;
    }
    var predecessor = source.substr(0, linkCropStart - 1);
    var index = tempLinks.map(function (link) { return link.source + link.target + link.type; }).indexOf(predecessor + target.toString() + linkType);
    if (!tempLinks[index].$new) {
        OCGantt.linksToRemove.push(tempLinks[index]);
    }
    tempLinks.splice(index, 1);
    return tempLinks;
}

OCGantt.lbox.precheckBoxes = function (taskResources) {
    if ((taskResources.length >= 1) && (taskResources[0] != "")) {
        for (i = 0; i < taskResources.length; i++) {
            $('input[id=' + taskResources[i] + ']').prop('checked', true);
        }
    }
}

OCGantt.lbox.precheckLinks = function (links, id) {
    console.log(links);
    $(".links :checkbox").prop('checked', false);
    for (i = 0; i < links.length; i++) {
        if (links[i].target == id) {
            console.log(links[i].source);
            if (Number.isInteger(links[i].source) == false) {
                links[i].source = links[i].source.toString();
            }
            switch (links[i].type) {
                case "0":
                    $('input[id=' + links[i].source + '_FS]').prop('checked', true);
                    document.getElementById(links[i].source + "_FS").setAttribute("data-link-id", links[i].id);
                    break;
                case "1":
                    $('input[id=' + links[i].source + '_SS]').prop('checked', true);
                    document.getElementById(links[i].source + "_SS").setAttribute("data-link-id", links[i].id);
                    break;
                case "3":
                    $('input[id=' + links[i].source + '_SF]').prop('checked', true);
                    document.getElementById(links[i].source + "_SF").setAttribute("data-link-id", links[i].id);
                    break;
                case "2":
                    $('input[id=' + links[i].source + '_FF]').prop('checked', true);
                    document.getElementById(links[i].source + "_FF").setAttribute("data-link-id", links[i].id);
                    break;
            }
        }
    }
}

OCGantt.lbox.convertLagsToDay = function (links, id) {
    var lag = "";
    console.log(links);
    console.log(id);
    for (i = 0; i < links.length; i++) {
        if ((links[i].target == id) && (links[i].lag != 0)) {
            console.log(links[i].lag);
            var absLag = Math.abs(links[i].lag);
            var days = Math.floor(absLag / 24);
            var hours = absLag - (days * 24);
            lag = days + "d " + hours + "h";
            if (links[i].lag < 0) {
                lag = "-" + lag;
            }
            document.getElementById(links[i].source + "_buffer").value = lag;
            console.log("link-id: " + links[i].id + " lag: " + lag);
        }
        if ((links[i].target == id) && (links[i].lag == 0)) {
            lag = "";
            document.getElementById(links[i].source + "_buffer").value = lag;
            console.log("link-id: " + links[i].id + " lag: " + lag);
        }
    }
}

OCGantt.lbox.handleKeyEvents = function (e) {
    if (e != undefined) {
        console.log("key pressed");
        e.stopPropagation();
        var id = $(this).prop('id');
        var sucessor = e.data.sucessor;
        if (id != undefined) {
            var value = $("#" + id).prop('value');
            var dPos = value.indexOf("d") + 1;
        }
        switch (true) {
            case (e.which == 8):
            case (e.which == 16):
            case (e.which == 17):
            case (e.which == 46):
            case (e.which > 47 && e.which < 58):
            case (e.which > 95 && e.which < 106):
            case (e.which == 109):
            case (e.which > 105 && e.which < 223):
                break;
            case (e.which == 13):
                e.preventDefault();
                //OCGantt.lbox.handleBufferValue(id, sucessor, "enter");
                //$("#" + id).blur();
                break;
            case (e.which == 27):
                e.preventDefault();
                //OCGantt.lbox.handleBufferValue(id, sucessor, "escape");
                //$("#"+id).prop('value', '');
                //$("#" + id).blur();
                break;
            case (e.which == 68):
                e.preventDefault();
                if (OCGantt.caretPos == 1) {
                    OCGantt.caretPos = 2;
                    document.getElementById(id).setSelectionRange(dPos + 1, dPos + 2);
                }
                break;
            case (e.which == 72):
                e.preventDefault();
                if (OCGantt.caretPos == 2) {
                    OCGantt.caretPos = 1;
                    document.getElementById(id).setSelectionRange(0, dPos - 1);
                }
                break;
            case (e.which == 37):
            case (e.which == 39):
                e.preventDefault();
                switch (OCGantt.caretPos) {
                    case 1:
                        OCGantt.caretPos = 2;
                        document.getElementById(id).setSelectionRange(dPos + 1, dPos + 2);
                        break;
                    case 2:
                        OCGantt.caretPos = 1;
                        document.getElementById(id).setSelectionRange(0, dPos - 1);
                        break;
                }
                break;
            default:
                //e.preventDefault();
                break;
        }
    }
}

OCGantt.lbox.handleKeyUpEvents = function (e) {
    if (e != undefined) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        var id = $(this).prop('id');
        var sucessor = e.data.sucessor;
        if (id != undefined) {
            var value = $("#" + id).prop('value');
            var dPos = value.indexOf("d") + 1;
        }
        switch (true) {
            case (e.which == 27):
                OCGantt.lbox.handleBufferValue(id, sucessor, "escape");
                //$("#"+id).prop('value', '');
                $("#" + id).blur();
                break;
            case (e.which == 13):
                OCGantt.lbox.handleBufferValue(id, sucessor, "enter");
                $("#" + id).blur();
                break;
        }
    }
}

OCGantt.lbox.handleBufferValue = function (id, sucessor, action) {
    var value = $("#" + id).prop('value');
    var temp = value.substr(0, 1);
    if (temp == "-") {
        value = value.replace("-", "");
    }
    var dPos = value.indexOf("d");
    var hPos = value.indexOf("h");
    var days = parseInt(value.substr(0, dPos));
    var hours = parseInt(value.substr(dPos + 1, hPos - dPos));
    if ((days == 0) && (hours == 0)) {
        $("#" + id).prop('value', '');
    } else {
        var predecessor = id.substr(0, id.indexOf("_"));
        switch (action) {
            case "escape":
                var linkIndex = OCGantt.lbox.findLinkId(predecessor, sucessor);
                console.log(OCGantt.tempLinks[linkIndex]);
                OCGantt.lbox.convertLagsToDay([OCGantt.tempLinks[linkIndex]], sucessor);
                break;
            case "enter":
                var linkIndex = OCGantt.lbox.findLinkId(predecessor, sucessor);
                if (temp == "-") {
                    OCGantt.tempLinks[linkIndex].lag = ((days * 24) + hours) * (-1);
                } else {
                    console.log("convert started")
                    OCGantt.tempLinks[linkIndex].lag = ((days * 24) + hours);
                }
                OCGantt.lbox.convertLagsToDay([OCGantt.tempLinks[linkIndex]], sucessor);
                OCGantt.tempLinks[linkIndex].$changed = true;
                break;
        }
    }
    //console.log(days);
    //console.log(hours);
}

OCGantt.lbox.findLinkId = function (predecessor, sucessor) {
    var index = OCGantt.tempLinks.map(function (link) { return link.source + link.target; }).indexOf(predecessor + sucessor);
    return index;
}

OCGantt.lbox.handleMilestone = function (tempTask) {
    if (tempTask.type == "milestone") {
        $("#enddateinput").hide();
        $("#milestone").prop('checked', true);
        if (tempTask.duration != 0) {
            tempTask.duration = 0;
        }
        if (tempTask.end_date != tempTask.start_date) {
            tempTask.end_date = tempTask.start_date;
        }
    } else if (tempTask.type != "milestone") {
        $("#enddateinput").show();
        if (tempTask.duration == 0) {
            tempTask.duration = 1;
        }
        if (tempTask.end_date == tempTask.start_date) {
            // Anfang bestimmen und 1h addieren
            var time = $("#starttime").val().split(/[/ :]/);
            var minutes = parseInt(time[0]) * 60 + parseInt(time[1]) + 60;
            var newTime = ("0" + ((minutes - minutes % 60) / 60)).slice(-2) + ":" + ("0" + minutes % 60).slice(-2);
            $("#endtime").timepicker('setTime', newTime);
            var edate = OCGantt.lbox.getForm("my-form").querySelector("[name='enddate']").value;
            var etime = OCGantt.lbox.getForm("my-form").querySelector("[name='endtime']").value;
            var emonth = edate.substr(3, 2) - 1;
            tempTask.end_date = new Date(edate.substr(6, 4), emonth, edate.substr(0, 2), etime.substr(0, 2), etime.substr(3, 2));
        }
    }
    return tempTask;
}

OCGantt.lbox.setProgress = function (sourceValue, target, sign) {
    var progress = 0.0
    if ((sourceValue != null) && (sourceValue != "0") && (sourceValue != 0)) {
        progress = Number((parseFloat(sourceValue) * 100).toFixed(1));
    }
    progress = progress.toString().replace(".", ",");
    $('#' + target).prop('value', progress + " " + sign);
}

OCGantt.lbox.handleMouseMover = function (e) {
    var target = e.data.source;
    var value = $('#' + target).prop('value');
    var progress = Number(value.replace(" ", "").replace("%", "").replace(",", "."));
    var distance = e.data.y - e.pageY;
    var difference = 0;
    if ((distance > 0) && (distance > OCGantt.tempDistance)) {
        difference = distance - OCGantt.tempDistance;
        progress += (difference / 2);
    } else if ((distance > 0) && (distance < OCGantt.tempDistance)) {
        difference = OCGantt.tempDistance - distance;
        progress -= (difference / 2);
    } else if ((distance < 0) && (distance < OCGantt.tempDistance)) {
        difference = distance - OCGantt.tempDistance;
        progress -= (difference / 2) * (-1);
    } else if ((distance < 0) && (distance > OCGantt.tempDistance)) {
        difference = OCGantt.tempDistance - distance;
        progress += (difference / 2) * (-1);
    }
    if (progress < 0) {
        progress = 0;
    } else if (progress > 100) {
        progress = 100;
    }
    progress = progress.toFixed(1).toString().replace(".", ",");
    $('#' + target).prop('value', progress + " " + "%");
    OCGantt.tempDistance = distance;
}

OCGantt.lbox.getProgress = function (source, sign) {
    var value = $('#' + source).prop('value');
    var progress = value.replace(" ", "").replace(sign, "").replace(",", ".");
    progress = (Number(parseFloat(progress).toFixed(6))) / 100;
    return progress;
}

OCGantt.displayResources = function (array, target) {
    var uid = undefined;
    var gid = undefined;
    for (i = 0; i < array.length; i++) {
        if (i >= 1) { $(target).append(", "); }
        if (array[i].indexOf("u_") != -1) {
            uid = array[i].replace("u_", "");
        } else if (array[i].indexOf("g_") != -1) {
            gid = array[i].replace("g_", "");
        }
        if (uid) {
            var displayname = OCGantt.getDisplayname(uid);
            $(target).append(displayname);
            uid = undefined;
        }
        if (gid) {
            $(target).append("<strong>" + gid + "</strong>");
            gid = undefined;
        }
    }
}

OCGantt.getDisplayname = function (uid) {
    var displayname = undefined;
    var groups = OCGantt.groupusers._groupusers;
    for (var groupArray in groups) {
        var users = groups[groupArray]['users'];
        for (var userArray in users) {
            if (users[userArray]['uid'] == uid) {
                if (users[userArray]['displayname'] !== '') {
                    displayname = users[userArray]['displayname'];
                } else if (users[userArray]['displayname'] === '') {
                    displayname = users[userArray]['uid'];
                }
                break;
            }
        }
        if (displayname) { break; }
    }
    return displayname;
}


OCGantt.lbox.getTaskName = function (task) {
    return task.id === target;
}

OCGantt.lbox.getMaxHeight = function (element) {
    if (element == "linklist") {
        var offset = $("#" + element).offset();
        var maxHeight = window.innerHeight - offset.top - 72;
    } else if (element == "linklist") {
        var offset = $("#" + element).offset();
        var maxHeight = window.innerHeight - offset.top - 72;
    } else {
        var offset = $("#" + element).offset();
        var maxHeight = window.innerHeight - offset.top - 16;
    }
    return maxHeight;
}

OCGantt.lbox.setWidth = function (id) {
    var widthId = $("#header_id").css("width");
    var widthText = $("#header_text").css("width");
    var widthFS = $("#header_fs").css("width");
    var widthSS = $("#header_ss").css("width");
    var widthSF = $("#header_sf").css("width");
    var widthFF = $("#header_ff").css("width");
    var widthBuffer = $("#header_buffer").css("width");
    $("#id_" + id).css("width", widthId);
    $("#text_" + id).css("width", widthText);
    $("#fs_" + id).css("width", widthFS);
    $("#ss_" + id).css("width", widthSS);
    $("#sf_" + id).css("width", widthSF);
    $("#ff_" + id).css("width", widthFF);
    $("#buffer_" + id).css("width", widthBuffer);
}

// Function to return the index of a property in a specified array
OCGantt.getIndexOfProperty = function (array, property, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][property] == value) {
            return i;
        }
    }
}

// Function to get an array of properties in a specified array; Property 2 is the values of the properties to return
OCGantt.getAllProperties = function (array, property, value, property2) {
    var values = $.grep(array, function (v) {
        return v[property] == value;
    });
    var prop2 = [];
    values.forEach(function (p) {
        prop2.push(p[property2]);
    })
    return prop2;
}

//Function for the grid buttons
OCGantt.clickGridButton = function (id, action) {
    if (OCGantt.isAdmin === true) {
        switch (action) {
            case "edit":
                gantt.showLightbox(id);
                break;
            case "add":
                gantt.createTask(null, id);
                break;
            case "delete":
                gantt.confirm({
                    title: gantt.locale.labels.confirm_deleting_title,
                    text: gantt.locale.labels.confirm_deleting,
                    callback: function (res) {
                        if (res)
                            gantt.deleteTask(id);
                    }
                });
                break;
        }
    } else if (OCGantt.isAdmin === false) {
        alert('you are not allowed to make changes in the document');
        return
    }
}

OCGantt.getBottomById = function (element) {
    var $el = $("#" + element);
    var bottom = $el.position().top + $el.offset().top + $el.outerHeight();
    return bottom;
}

OCGantt.setMaxHeight = function (topElement, bottomElement, target) {
    var $topElement = topElement;
    var $bottomElement = bottomElement;
    var top = $topElement.position().top + $topElement.offset().top + $topElement.outerHeight();
    var bottom = $bottomElement.position().top;
    var height = bottom - top;
    $("#" + target).css('height', height + 'px');
}


//Functions for the lightbox
gantt.showLightbox = function (id) {
    if (OCGantt.isAdmin === true) {
        OCGantt.lbox.ActiveOverlay = [];
        OCGantt.lbox.setActiveOverlay("my-form");
        taskId = id;
        var task
        task = gantt.getTask(id);
        var resources = [];
        OCGantt.tempLinks = [];
        OCGantt.linksToRemove = [];
        $("#content-wrapper").addClass("blur");
        var form = OCGantt.lbox.getForm("my-form");
        var starttmp = task.start_date;
        var startdateField = form.querySelector("[name='startdate']");
        var enddateField = form.querySelector("[name='enddate']");
        OCGantt.lbox.dateInit(startdateField, task, enddateField);
        var starttimeField = form.querySelector("[name='starttime']");
        OCGantt.lbox.timeInit(starttimeField, task, 'start_date');
        OCGantt.lbox.dateInit(enddateField, task, 'end_date');
        var endtimeField = form.querySelector("[name='endtime']");
        OCGantt.lbox.timeInit(endtimeField, task, 'end_date');
        var resourcesField = form.querySelector("[name='resources']");
        var linksField = form.querySelector("[name='links']");
        OCGantt.tempLinks = JSON.parse(JSON.stringify(arr.links));
        OCGantt.tempTask = JSON.parse(JSON.stringify(task));
        $("#links-form").append('<div id="linklist" class="links" style="padding: 5px; overflow-y: scroll;">');
        var fragmentLinks = document.createDocumentFragment();
        var _lineHeader = document.createElement('div'),
            _lineHeaderId = document.createElement('div'),
            _lineHeaderText = document.createElement('div'),
            _lineHeaderInputFS = document.createElement('div'),
            _lineHeaderInputSS = document.createElement('div'),
            _lineHeaderInputSF = document.createElement('div'),
            _lineHeaderInputFF = document.createElement('div'),
            _lineHeaderBuffer = document.createElement('div');
        _lineHeader.className = 'tbl predecessor_line';
        _lineHeaderId.className = 'tbl_cell header id';
        _lineHeaderText.className = 'tbl_cell header text';
        _lineHeaderInputFS.className = 'tbl_cell header type';
        _lineHeaderInputSS.className = 'tbl_cell header type';
        _lineHeaderInputSF.className = 'tbl_cell header type';
        _lineHeaderInputFF.className = 'tbl_cell header type';
        _lineHeaderBuffer.className = 'tbl_cell header buffer';
        _lineHeaderId.id = 'header_id';
        _lineHeaderText.id = 'header_text';
        _lineHeaderInputFS.id = 'header_fs';
        _lineHeaderInputSS.id = 'header_ss';
        _lineHeaderInputSF.if = 'header_sf';
        _lineHeaderInputFF.if = 'header_ff';
        _lineHeaderBuffer.id = 'header_buffer';
        _lineHeaderId.innerHTML = '<b>ID</b>';
        _lineHeaderText.innerHTML = '<b>Name</b>';
        _lineHeaderInputFS.innerHTML = '<b>FS</b>';
        _lineHeaderInputSS.innerHTML = '<b>SS</b>';
        _lineHeaderInputSF.innerHTML = '<b>SF</b>';
        _lineHeaderInputFF.innerHTML = '<b>FF</b>';
        _lineHeaderBuffer.innerHTML = '<b>Buffer</b>';
        _lineHeader.appendChild(_lineHeaderId);
        _lineHeader.appendChild(_lineHeaderText);
        _lineHeader.appendChild(_lineHeaderInputFS);
        _lineHeader.appendChild(_lineHeaderInputSS);
        _lineHeader.appendChild(_lineHeaderInputSF);
        _lineHeader.appendChild(_lineHeaderInputFF);
        _lineHeader.appendChild(_lineHeaderBuffer);
        fragmentLinks.appendChild(_lineHeader);
        for (var taskArray in arr.data) {
            if ((arr.data[taskArray]['id'] != 1) && (arr.data[taskArray]['id'] != task.id)) {
                var _lineTask = document.createElement('div'),
                    _lineTaskId = document.createElement('div'),
                    _lineTaskText = document.createElement('div'),
                    _lineTaskInputFS = document.createElement('div'),
                    _lineTaskInputSS = document.createElement('div'),
                    _lineTaskInputSF = document.createElement('div'),
                    _lineTaskInputFF = document.createElement('div'),
                    _lineTaskBuffer = document.createElement('div');
                _lineTask.className = 'tbl predecessor_line';
                _lineTaskId.className = 'tbl_cell content id';
                _lineTaskText.className = 'tbl_cell content text';
                _lineTaskInputFS.className = 'tbl_cell content type';
                _lineTaskInputSS.className = 'tbl_cell content type';
                _lineTaskInputSF.className = 'tbl_cell content type';
                _lineTaskInputFF.className = 'tbl_cell content type';
                _lineTaskBuffer.className = 'tbl_cell content buffer';
                _lineTaskId.id = 'id_' + arr.data[taskArray]['id'];
                _lineTaskText.id = 'text_' + arr.data[taskArray]['id'];
                _lineTaskInputFS.id = 'fs_' + arr.data[taskArray]['id'];
                _lineTaskInputSS.id = 'ss_' + arr.data[taskArray]['id'];
                _lineTaskInputSF.id = 'sf_' + arr.data[taskArray]['id'];
                _lineTaskInputFF.id = 'ff_' + arr.data[taskArray]['id'];
                _lineTaskBuffer.id = 'buffer_' + arr.data[taskArray]['id'];
                _lineTaskId.innerHTML = '<span class="predecessor_item_id">' + arr.data[taskArray]['id'] + '</span>';
                if (arr.data[taskArray]['type'] == "project") {
                    _lineTaskText.innerHTML = '<span><strong>' + arr.data[taskArray]['text'] + '</strong></span>';
                } else if (arr.data[taskArray]['type'] == "milestone") {
                    _lineTaskText.innerHTML = '<span><strong><i>' + arr.data[taskArray]['text'] + '<i></strong></span>';
                } else {
                    _lineTaskText.innerHTML = '<span>' + arr.data[taskArray]['text'] + '</span>';
                }
                _lineTaskInputFS.innerHTML = '<input type="checkbox" id="' + arr.data[taskArray]['id'] + '_FS" />';
                _lineTaskInputSS.innerHTML = '<input type="checkbox" id="' + arr.data[taskArray]['id'] + '_SS" />';
                _lineTaskInputSF.innerHTML = '<input type="checkbox" id="' + arr.data[taskArray]['id'] + '_SF" />';
                _lineTaskInputFF.innerHTML = '<input type="checkbox" id="' + arr.data[taskArray]['id'] + '_FF" />';
                _lineTaskBuffer.innerHTML = '<input type="text" id="' +
                    arr.data[taskArray]['id'] +
                    '_buffer" placeholder="0d 0h" />';
                _lineTask.appendChild(_lineTaskId);
                _lineTask.appendChild(_lineTaskText);
                _lineTask.appendChild(_lineTaskInputFS);
                _lineTask.appendChild(_lineTaskInputSS);
                _lineTask.appendChild(_lineTaskInputSF);
                _lineTask.appendChild(_lineTaskInputFF);
                _lineTask.appendChild(_lineTaskBuffer);
                fragmentLinks.appendChild(_lineTask);
            }
        }
        var groupUserArray = task.resources.split(",");
        if (groupUserArray.length >= 1) { resources = groupUserArray; }
        OCGantt.displayResources(groupUserArray, resourcesField);
        var fragment = document.createDocumentFragment();
        $("#resources-form").append('<div id="resourceslist" style="padding: 5px; overflow-y: scroll;">');
        var groupusers = OCGantt.groupusers._groupusers;
        for (var groupArray in groupusers) {
            group = groupusers[groupArray]['gid'];
            var _lineGroup = document.createElement('div'),
                _lineUsers = document.createElement('div'),
                _inputGroup = document.createElement('input'),
                _inputLabel = document.createElement('label');
            _inputGroup.name = groupusers[groupArray]['gid'];
            _inputGroup.type = 'checkbox';
            _inputGroup.className = 'group';
            _inputGroup.setAttribute('data-type', 'group');
            _lineGroup.appendChild(_inputGroup);
            _inputLabel.appendChild(_inputGroup);
            _lineGroup.appendChild(_inputLabel);
            _inputGroup.id = 'g_' + groupusers[groupArray]['gid'];
            _inputLabel.setAttribute('for', 'g_' + groupusers[groupArray]['gid']);
            _inputLabel.innerHTML += ' <strong>' + groupusers[groupArray]['gid'] + '</strong>';
            fragment.appendChild(_lineGroup);
            users = groupusers[groupArray]['users'];
            for (var userArray in users) {
                var _inlineUser = document.createElement('span'),
                    _inputUser = document.createElement('input'),
                    _inputUserLabel = document.createElement('label');
                _inputUser.name = users[userArray]['uid'];
                _inputUser.type = 'checkbox';
                _inputUser.className = 'user';
                _inputUser.setAttribute('data-type', 'user');
                _inputUser.setAttribute('data-gid', groupusers[groupArray]['gid']);
                _inputUser.id = 'u_' + users[userArray]['uid'];
                _inputUserLabel.setAttribute('for', 'u_' + users[userArray]['uid']);
                _inputUserLabel.innerHTML += users[userArray]['displayname'];
                _inlineUser.appendChild(_inputUser);
                _inlineUser.appendChild(_inputUserLabel);
                _lineUsers.appendChild(_inlineUser);
            }
            fragment.appendChild(_lineUsers);
        };
        $("#resources-form div:first-child").append(fragment);
        $("#resources-form").append('<div id="resourcesbuttons" style="padding: 5px; position: absolute;"><div class="tbl">' +
            '<div class="tbl_cell"><input type="button" id="save-resources" name="save-resources" value="Done"></div>' +
            '<div class="tbl_cell" align="right" ><input type="button" id="close-resources" name="close-resources" value="Cancel"></div>' +
            '</div>');
        $(".resources :checkbox").change(function () {
            $('input[id=' + $(this).attr('id') + ']').prop('checked', $(this).is(':checked'));
            if ($(this).is(':checked') === true) {
                resources = OCGantt.lbox.addResources(resources, $(this).attr('id'));
            } else if ($(this).is(':checked') === false) {
                resources = OCGantt.lbox.deleteResources(resources, $(this).attr('id'));
            }
        });
        $("#links-form div:first-child").append(fragmentLinks);
        $("#links-form").append('<div id="linkbuttons" style="padding: 5px; position: absolute;"><div class="tbl">' +
            '<div class="tbl_cell"><input type="button" id="save-links" name="save-links" value="Done"></div>' +
            '<div class="tbl_cell" align="right" ><input type="button" id="close-links" name="close-links" value="Cancel"></div>' +
            '</div>');
        OCGantt.lbox.keyUpFunction = function (e) {
            if (e.which == 27) {
                var index = OCGantt.lbox.getActiveOverlay();
                if (index != undefined) {
                    var overlay = OCGantt.lbox.ActiveOverlay[index].name;
                    switch (overlay) {
                        case "links-form":
                            OCGantt.lbox.cancel.links();
                            break;
                        case "resources-form":
                            OCGantt.lbox.cancel.resources(task.resources);
                            break;
                        case "my-form":
                            OCGantt.lbox.cancel();
                            break;
                    }
                }
            }
            if (e.which == 13) {
                var index = OCGantt.lbox.getActiveOverlay();
                if (index != undefined) {
                    var overlay = OCGantt.lbox.ActiveOverlay[index].name;
                    switch (overlay) {
                        case "links-form":
                            OCGantt.lbox.save.links();
                            break;
                        case "resources-form":
                            OCGantt.lbox.save.resources(resources);
                            break;
                        case "my-form":
                            OCGantt.lbox.save();
                            gantt.hideLightbox();
                            break;
                    }
                }
            }
        }
        $(document).keyup(OCGantt.lbox.keyUpFunction);
        OCGantt.lbox.precheckBoxes(groupUserArray);
        $(resourcesField).focus(function () {
            var tempTask;
            tempTask = task;
            $("#resources-form").show();
            OCGantt.lbox.setActiveOverlay("resources-form");
            $("#resources").css('max-height', OCGantt.lbox.getMaxHeight('resourceslist'));
            $("#resources-form").css('max-height', OCGantt.lbox.getMaxHeight('resources-form'));
            var height = $("#resourceslist").height() + 72;
            $("#resources-form").css('height', height);
            var top = $("#resources-form").height() - 46;
            $("#resourcesbuttons").css('top', top);
            resourcesStatus = 1;
        });
        $(linksField).focus(function () {
            var tempTask;
            tempTask = task;
            $("#links-form").show();
            OCGantt.lbox.setActiveOverlay("links-form");
            $("#linklist").css('max-height', OCGantt.lbox.getMaxHeight('linklist'));
            $("#links-form").css('max-height', OCGantt.lbox.getMaxHeight('links-form'));
            var height = $("#linklist").height() + 72;
            $("#links-form").css('height', height);
            var top = $("#links-form").height() - 46;
            $("#linkbuttons").css('top', top);
            for (var taskArray in arr.data) {
                if (arr.data[taskArray]['id'] != 1) {
                    OCGantt.lbox.setWidth(arr.data[taskArray]['id']);
                }
            }
            OCGantt.lbox.precheckLinks(OCGantt.tempLinks, tempTask.id);
            console.log(arr.links);
            console.log(OCGantt.tempLinks);
            OCGantt.lbox.convertLagsToDay(OCGantt.tempLinks, tempTask.id, "init");
            linksStatus = 1;
        });
        (function () {
            var tempTask;
            tempTask = task;
            var previuosValue;
            var status = 0;
            $(".links input:text").on('focus', function () {
                var id = $(this).prop('id');
                var predecessor = id.substr(0, id.indexOf("_"));
                if (($('input[id=' + predecessor + '_FS]').prop('checked') == true) ||
                    ($('input[id=' + predecessor + '_SS]').prop('checked') == true) ||
                    ($('input[id=' + predecessor + '_SF]').prop('checked') == true) ||
                    ($('input[id=' + predecessor + '_FF]').prop('checked') == true)
                ) {
                    status = 1;
                    $(document).unbind("keyup", OCGantt.lbox.keyUpfunction);
                    OCGantt.caretPos = 1;
                    var value = $("#" + id).prop('value');
                    if (value === "") {
                        value = "0d 0h";
                        $("#" + id).prop('value', value);
                    }
                    var dPos = value.indexOf("d") + 1;
                    this.setSelectionRange(0, dPos - 1);
                    $("#" + id).keydown({ sucessor: tempTask.id }, OCGantt.lbox.handleKeyEvents);
                    $("#" + id).keyup({ sucessor: tempTask.id }, OCGantt.lbox.handleKeyUpEvents);
                } else {
                    $("#" + id).blur();
                    alert("set Linktype first!");
                }
            });
            $(".links input:text").on('blur', function () {
                var id = $(this).prop('id');
                if (status == 1) {
                    $("#" + id).unbind("keydown", OCGantt.lbox.handleKeyEvents);
                    $("#" + id).unbind("keyup", OCGantt.lbox.handleKeyUpEvents);
                    console.log(id);
                    console.log(tempTask.id);
                    OCGantt.lbox.handleBufferValue(id, tempTask.id, "enter");
                    console.log(OCGantt.tempLinks);
                    console.log("blurred");
                    $(document).keyup(OCGantt.lbox.keyUpFunction);
                }
            })
            $(".links :checkbox").on('focus', function () {
                previousValue = this.checked;
            }).change(function () {
                if (previousValue) {
                    OCGantt.tempLinks = OCGantt.lbox.deleteLink(OCGantt.tempLinks, $(this).prop("id"), tempTask.id);
                }
                if (!previousValue) {
                    var checkedId = OCGantt.lbox.getChecked($(this).prop("id"));
                    if (checkedId) {
                        $("#" + checkedId).prop("checked", false);
                        OCGantt.tempLinks = OCGantt.lbox.deleteLink(OCGantt.tempLinks, checkedId, tempTask.id);
                    }
                    OCGantt.tempLinks = OCGantt.lbox.addLink(OCGantt.tempLinks, $(this).attr('id'), tempTask.id);
                }
            });
        })();
        gantt._center_lightbox(OCGantt.lbox.getForm("my-form"));
        gantt.showCover();
        OCGantt.lbox.handleMilestone(OCGantt.tempTask);
        $("#milestone").change(function () {
            if ($(this).prop('checked')) {
                OCGantt.tempTask.type = "milestone";
                OCGantt.tempTask = OCGantt.lbox.handleMilestone(OCGantt.tempTask);
            }
            if (!$(this).prop('checked')) {
                OCGantt.tempTask.type = "task";
                OCGantt.tempTask = OCGantt.lbox.handleMilestone(OCGantt.tempTask);
            }
        });
        var input = form.querySelector("[name='description']");
        form.querySelector("[name='title']").innerHTML = task.id + ": " + task.text;
        input.focus();
        input.value = task.text;
        OCGantt.lbox.setProgress(OCGantt.tempTask.progress, "progress", "%");
        $("#changeprogress").mousedown(function (event) {
            console.log("y: " + event.pageY);
            $(document).disableSelection();
            $(document).mousemove({ y: event.pageY, source: "progress" }, OCGantt.lbox.handleMouseMover);
            $(document).mouseup(function () {
                OCGantt.tempDistance = 0;
                $(document).unbind("mousemove");
                $(document).unbind("mouseup");
                $(document).enableSelection();
            })
        });
        $("#changeprogress").blur(function () {
            $(this).unbind("mousedown");
            $(this).unbind("mouseup");
        });
        if (task.id == "1") {
            $("#add1").hide();
            $("label[for='description']").text("Project name");
        }
        if ((task.id != "1") && (task.type == "project")) {
            $("#dateinput").hide();
            $("label[for='description']").text("Sub Project name");
        }
        form.querySelector("[name='resources_hidden']").value = task.resources;
        form.style.display = "block";
        form.querySelector("[name='save']").onclick = OCGantt.lbox.save;
        form.querySelector("[name='close']").onclick = OCGantt.lbox.cancel;
        form.querySelector("[name='delete']").onclick = OCGantt.lbox.remove;
        $("#save-resources").click(function () { OCGantt.lbox.save.resources(resources); });
        $("#close-resources").click(function () { OCGantt.lbox.cancel.resources(task.resources); });
        $("#save-links").click(function () { OCGantt.lbox.save.links(); });
        $("#close-links").click(function () { OCGantt.lbox.cancel.links(); });
    } else if (OCGantt.isAdmin === false) {
        alert('you are not allowed to make changes in the document');
        return
    }
};
gantt.hideLightbox = function () {
    $("#content-wrapper").removeClass("blur");
    gantt.hideCover();
    OCGantt.lbox.getForm("my-form").style.display = "none";
    $("#add1").show();
    $("#dateinput").show();
    $("#resources-form").empty();
    $("#links-form").empty();
    taskId = null;
    $(document).unbind("keyup", OCGantt.lbox.keyUpfunction);
}
OCGantt.lbox.getForm = function (form) {
    return document.getElementById(form);
};
OCGantt.lbox.save = function () {
    var task = gantt.getTask(taskId);
    var tempTask = JSON.parse(JSON.stringify(task));
    tempTask.start_date = new Date(tempTask.start_date);
    tempTask.end_date = new Date(tempTask.end_date);
    task.text = OCGantt.lbox.getForm("my-form").querySelector("[name='description']").value;
    task.progress = OCGantt.lbox.getProgress("progress", "%");
    if (task.id == "1") {
        gantt.updateTask(task.id);
    }
    if ((task.id != "1") && (task.type == "project")) {
        task.resources = OCGantt.lbox.getForm("my-form").querySelector("[name='resources_hidden']").value;
        var lengthLinksToRemove = OCGantt.linksToRemove.length;
        if (lengthLinksToRemove != -1) {
            OCGantt.linksToRemove.forEach(function (item, index) {
                OCGantt.links._activeLink = OCGantt.linksToRemove[index];
                gantt.deleteLink(item.id);
            });
        }
        if (OCGantt.tempLinks) {
            OCGantt.tempLinks.forEach(function (link) {
                if (link.$new) {
                    var linkId = gantt.addLink({
                        source: link.source,
                        target: link.target,
                        type: link.type,
                        lag: link.lag
                    });
                    link.active = false;
                    delete link.$new;
                } else {

                }
            });
        }
        if (task.$new) {
            gantt.addTask(task, task.parent);
            delete task.$new;
        } else {
            gantt.updateTask(task.id);
        }
    } else if ((task.id != "1") && (task.type != "project")) {
        var sdate = OCGantt.lbox.getForm("my-form").querySelector("[name='startdate']").value;
        var edate = OCGantt.lbox.getForm("my-form").querySelector("[name='enddate']").value;
        var stime = OCGantt.lbox.getForm("my-form").querySelector("[name='starttime']").value;
        var etime = OCGantt.lbox.getForm("my-form").querySelector("[name='endtime']").value;
        var smonth = sdate.substr(3, 2) - 1;
        task.start_date = new Date(sdate.substr(6, 4), smonth, sdate.substr(0, 2), stime.substr(0, 2), stime.substr(3, 2));
        task.end_date = new Date(edate.substr(6, 4), smonth, edate.substr(0, 2), etime.substr(0, 2), etime.substr(3, 2));
        task.resources = OCGantt.lbox.getForm("my-form").querySelector("[name='resources_hidden']").value;
        var lengthLinksToRemove = OCGantt.linksToRemove.length;
        if (lengthLinksToRemove != -1) {
            OCGantt.linksToRemove.forEach(function (item, index) {
                OCGantt.links._activeLink = OCGantt.linksToRemove[index];
                gantt.deleteLink(item.id);
            });
        }
        if (OCGantt.tempLinks) {
            OCGantt.tempLinks.forEach(function (link) {
                if (link.$new) {
                    var linkId = gantt.addLink({
                        source: link.source,
                        target: link.target,
                        type: link.type,
                        lag: link.lag
                    });
                    link.active = false;
                    delete link.$new;
                } else {
                    if (link.$changed) {
                        console.log("update");
                        console.log(link);
                        console.log(arr.links);
                        gantt.getLink(link.id).lag = link.lag;
                        gantt.updateLink(link.id);
                        console.log(arr.links);
                    }
                }
            });
        }
        if (OCGantt.tempTask.type != task.type) {
            if (OCGantt.tempTask.type == "milestone") {
                task.type = OCGantt.tempTask.type;
                task.end_date = task.start_date;
            } else {
                task.type = OCGantt.tempTask.type;
                var edate = OCGantt.lbox.getForm("my-form").querySelector("[name='enddate']").value;
                var etime = OCGantt.lbox.getForm("my-form").querySelector("[name='endtime']").value;
                var emonth = edate.substr(3, 2) - 1;
                task.end_date = new Date(edate.substr(6, 4), emonth, edate.substr(0, 2), etime.substr(0, 2), etime.substr(3, 2));
            }
        }
        if (task.$new) {
            gantt.addTask(task, task.parent);
            delete task.$new;
        } else {
            gantt.updateTask(task.id);
            var index = gantt._undo._undoStack.length - 1;
            gantt._undo._undoStack[index].commands[0].oldValue = tempTask;

        }
    }
    OCGantt.lbox.getForm("my-form").querySelector("[name='resources']").innerHTML = "";
    gantt.hideLightbox();
    gantt.render();
};

OCGantt.lbox.save.resources = function (resources) {
    var index = OCGantt.lbox.getActiveOverlay();
    if (index != undefined) {
        var overlay = OCGantt.lbox.ActiveOverlay[index].name;
        $("#" + overlay).hide();
        OCGantt.lbox.deleteLastActiveOverlay();
    }
    document.getElementById("my-form").querySelector("[name='resources_hidden']").value = resources;
};

OCGantt.lbox.save.links = function () {
    var index = OCGantt.lbox.getActiveOverlay();
    if (index != undefined) {
        var overlay = OCGantt.lbox.ActiveOverlay[index].name;
        $("#" + overlay).hide();
        OCGantt.lbox.deleteLastActiveOverlay();
    }
};


OCGantt.lbox.cancel = function () {
    var task = gantt.getTask(taskId);
    if (task.$new)
        gantt.deleteTask(task.id);
    arr.links.forEach(function (link, index) {
        if (link.$new) {
            arr.links.splice(index, 1);
        }
    });
    gantt.hideLightbox();
    OCGantt.lbox.deleteLastActiveOverlay();
    OCGantt.lbox.getForm("my-form").querySelector("[name='resources']").innerHTML = "";
};

OCGantt.lbox.cancel.resources = function (resources) {
    var form = OCGantt.lbox.getForm("my-form");
    var index = OCGantt.lbox.getActiveOverlay();
    if (index != undefined) {
        var overlay = OCGantt.lbox.ActiveOverlay[index].name;
        $("#" + overlay).hide();
        OCGantt.lbox.deleteLastActiveOverlay();
    }
    document.getElementById("my-form").querySelector("[name='resources']").innerHTML = "";
    OCGantt.displayResources(resources.split(","), document.getElementById("my-form").querySelector("[name='resources']"));
    $("resources :checkbox").prop('checked', false);
    OCGantt.lbox.precheckBoxes(resources.split(","));
};

OCGantt.lbox.cancel.links = function () {
    var form = OCGantt.lbox.getForm("my-form");
    var linksField = form.querySelector("[name='links']");
    var index = OCGantt.lbox.getActiveOverlay();
    if (index != undefined) {
        var overlay = OCGantt.lbox.ActiveOverlay[index].name;
        $("#" + overlay).hide();
        OCGantt.lbox.deleteLastActiveOverlay();
    }
    OCGantt.tempLinks = JSON.parse(JSON.stringify(arr.links));
    OCGantt.linksToRemove = [];
    $(linksField).html("");
}

OCGantt.lbox.remove = function () {
    var tid = taskId;
    gantt.confirm({
        title: gantt.locale.labels.confirm_deleting_title,
        text: gantt.locale.labels.confirm_deleting,
        callback: function (res) {
            if (res) {
                gantt.deleteTask(tid);
            }
        }
    });
    gantt.hideLightbox();
    OCGantt.lbox.getForm("my-form").querySelector("[name='resources']").innerHTML = "";
};

// Function for setting the last shown overlay like links-form as active
OCGantt.lbox.setActiveOverlay = function (container) {
    OCGantt.lbox.getActiveOverlay();
    var index = OCGantt.lbox.getActiveOverlay();
    if (index != undefined) {
        if (OCGantt.lbox.ActiveOverlay[index].name != container) {
            delete OCGantt.lbox.ActiveOverlay[index].$active;
            var overlay = {
                name: container,
                $active: true
            };
            OCGantt.lbox.ActiveOverlay.push(overlay);
        }
    }
    if (index == undefined) {
        var overlay = {
            name: container,
            $active: true
        };
        OCGantt.lbox.ActiveOverlay.push(overlay);
    }
}

// Function to get the active overlay
OCGantt.lbox.getActiveOverlay = function () {
    var returnIndex = undefined;
    OCGantt.lbox.ActiveOverlay.forEach(function (overlay, index) {
        if (overlay.$active) {
            returnIndex = index;
        }
    });
    return returnIndex;
}

// Function to delete the last overlay and set the one before as active
OCGantt.lbox.deleteLastActiveOverlay = function () {
    var index = OCGantt.lbox.getActiveOverlay();
    OCGantt.lbox.ActiveOverlay.splice(index, 1);
    var length = OCGantt.lbox.ActiveOverlay.length - 1;
    if (length != undefined) {
        if (length != -1) {
            OCGantt.lbox.ActiveOverlay[length].$active = true;
        }
    }
}

// Definition of how dates should be converted
OCGantt.DateToStr = gantt.date.date_to_str("%Y-%m-%d %H:%i");
OCGantt.StrToDate = gantt.date.str_to_date("%Y-%m-%d %H:%i");

// Definition of the lightbox
OCGantt.lbox.HTML.html = '<div class="gantt_cal_light" id="my-form" style="display: none">' +
    '<div class="gantt_cal_ltitle" style="cursor: pointer; font-size: 1.2em; "><b>' +
    '<p name="title"></p></b></div>' +
    '<div style="padding: 5px">' +
    '<div class="tbl_cell lbox_title"><label for="description">Task text</label></div>' +
    '<input type="text" style="width:calc(100% - 16px);" name="description" value="" />' +
    '<div id="add1">' +
    '<div class="tbl_cell lbox_title"><label for="resources">Resources</label></div>' +
    '<input type="text" style="display:none;" name="resources_hidden" />' +
    '<div contenteditable="true" style="width:calc(100% - 16px);" name="resources"></div>' +
    '<div class="gantt_cal_light resources" id="resources-form" style="display: none; width:calc(100% - 14px); border-radius: 3px; box-shadow: 0px 4px 8px -3px rgba(0, 0, 0, .8) !important;">' +
    '</div>' +
    '<div class="tbl_cell lbox_title"><label for="links">Links</label></div>' +
    '<input type="text" style="display:none;" name="links_hidden" />' +
    '<div contenteditable="true" style="width:calc(100% - 16px);" name="links"></div>' +
    '<div class="gantt_cal_light links" id="links-form" style="display: none; width:calc(100% - 14px); border-radius: 3px; box-shadow: 0px 4px 8px -3px rgba(0, 0, 0, .8) !important; ">' +
    '</div>' +
    //'<br>' +
    '<div id="dateinput">' +
    '<div class="tbl_cell lbox_date_column">' +
    '<div class="tbl">' +
    '<div class="tbl_cell lbox_title"><label for="startdate">Start</label></div>' +
    '<div class="tbl_cell" style="width: 80px"><input class="datepicker" id="startdate" name="startdate" type="text" style="width: 80px"></div>' +
    '<div class="tbl_cell lbox_title"style="width: 0px"><label for="starttime"></label></div>' +
    '<div class="tbl_cell" style="text-align: left"><input class="timepicker" id="starttime" name="starttime" type="text" style="width: 40px"></div>' +
    '<div class="tbl_cell" style="text-align: left; width: 20px"><input id="milestone" name="milestone" type="checkbox"></div>' +
    '<div class="tbl_cell lbox_title" style="text-align: left"><label for="milestone">Milestone</label></div>' +
    '</div>' +
    '<div id="enddateinput" class="tbl">' +
    '<div class="tbl_cell lbox_title"><label for="enddate">End</label></div>' +
    '<div class="tbl_cell" style="width: 80px"><input class="datepicker" id="enddate" name="enddate" type="text" style="width: 80px"></div>' +
    '<div class="tbl_cell lbox_title"style="width: 0px"><label for="endtime"></label></div>' +
    '<div class="tbl_cell" style="text-align: left"><input class="timepicker" id="endtime" name="endtime" type="text" style="width: 40px"></div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div id="progressinput" class="tbl">' +
    '<div class="tbl_cell lbox_title" style="width: 60px"><label for="progress">Progress</Label></div>' +
    '<div class="tbl_cell style="width: 80px"><input class="gantt_progress" id="progress" name="progress" type="text" style="width: 65px; text-align: right">' +
    '<i class="fa fa-crosshairs fa-align-center gantt_changeprogress" id="changeprogress" name="changeprogress"></i>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<br>' +
    '<input type="button" name="save" value="Save">' +
    '<input type="button" name="close" value="Close">' +
    '<input type="button" name="delete" value="Delete">' +
    '</div>' +
    '</div>';

// The object OCGantt.Tasks holds all Tasks
OCGantt.Tasks = function (baseUrl) {
    this._baseUrl = baseUrl;
    this._tasks = [];
    this._activeTask = undefined;
};

//The OCGantt.Tasks.prototype holds all tasks
OCGantt.Tasks.prototype = {
    load: function (id) {
        var self = this;
        this._tasks.forEach(function (task) {
            if (task.id === id) {
                task.active = true;
                self._activeTask = task;
            } else {
                task.active = false;
            }
        });
    },
    getActive: function () {
        return this._activeTask;
    },
    removeActive: function () {
        var index;
        var deferred = $.Deferred();
        var id = this._activeTask.id;
        this._tasks.forEach(function (task, counter) {
            if (task.id === id) {
                index = counter;
            }
        });
        if (index !== undefined) {
            if (this._activeTask === this._tasks[index]) {
                delete this._activeTask;
            }
            $.ajax({
                url: this._baseUrl + '/' + id,
                method: 'DELETE'
            }).done(function () {
                deferred.resolve();
            }).fail(function () {
                deferred.reject();
            });
        } else {
            deferred.reject();
        }
        return deferred.promise();
    },
    create: function (task) {
        task.startdate = task.start_date;
        task.enddate = task.end_date;
        task.open = 1;
        var deferred = $.Deferred();
        var self = this;
        $.ajax({
            url: this._baseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(task)
        }).done(function (task) {
            self._tasks.push(task);
            self._activeTask = task;
            self.load(task.id);
            arr.data[arr.data.length - 1] = task;
            deferred.resolve();
        }).fail(function () {
            deferred.reject();
        });
        return deferred.promise();
    },
    getAll: function () {
        return this._tasks;
    },
    loadAll: function () {
        var deferred = $.Deferred();
        var self = this;
        $.get(this._baseUrl).done(function (tasks) {
            self._activeTask = undefined;
            self._tasks = tasks;
            deferred.resolve();
        }).fail(function () {
            deferred.reject();
        });
        return deferred.promise();
    },
    updateActive: function () {
        var task = this.getActive();
        task.startdate = task.start_date;
        task.enddate = task.end_date;
        return $.ajax({
            url: this._baseUrl + '/' + task.id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(task)
        }).done(function () {
            OCGantt.tasks._activeTask = undefined;
        });
    }
};

// The object OCGantt.Links holds all Tasks
OCGantt.Links = function (baseUrl) {
    this._baseUrl = baseUrl;
    this._links = [];
    this._activeLink = undefined;
};

//The OCGantt.Links.prototype holds all links
OCGantt.Links.prototype = {
    load: function (id) {
        var self = this;
        this._links.forEach(function (link) {
            if (link.id === id) {
                link.active = true;
                self._activeLink = link;
            } else {
                link.active = false;
            }
        });
    },
    getActive: function () {
        return this._activeLink;
    },
    removeActive: function () {
        var index;
        var deferred = $.Deferred();
        var id = this._activeLink.id;
        this._links.forEach(function (link, counter) {
            if (link.id === id) {
                index = counter;
            }
        });
        if (index !== undefined) {
            if (this._activeLink === this._links[index]) {
                delete this._activeLink;
            }
            $.ajax({
                url: this._baseUrl + '/' + id,
                method: 'DELETE'
            }).done(function () {
                deferred.resolve();
            }).fail(function () {
                deferred.reject();
            });
        } else {
            deferred.reject();
        }
        return deferred.promise();
    },
    create: function (link) {
        var deferred = $.Deferred();
        var self = this;
        $.ajax({
            url: this._baseUrl,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(link)
        }).done(function (link) {
            link.source = link.source.toString();
            link.target = link.target.toString();
            link.lag = 0;
            self._links.push(link);
            //self._activeLink = link;
            self.load(link.id);
            arr.links[arr.links.length - 1] = link;
            deferred.resolve();
        }).fail(function () {
            deferred.reject();
        });
        return deferred.promise();
    },
    getAll: function () {
        return this._links;
    },
    loadAll: function () {
        var deferred = $.Deferred();
        var self = this;
        $.get(this._baseUrl).done(function (links) {
            self._activeLink = undefined;
            self._links = links;
            deferred.resolve();
        }).fail(function () {
            deferred.reject();
        });
        return deferred.promise();
    },
    updateActive: function () {
        var link = this.getActive();
        return $.ajax({
            url: this._baseUrl + '/' + link.id,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(link)
        }).done(function () {
            OCGantt.links._activeLink = undefined;
        });
    }
};

OCGantt.GroupUsers = function (baseUrl) {
    this._baseUrl = baseUrl;
    this._groupusers = [];
    this._activeGroupUser = undefined;
};

OCGantt.GroupUsers.prototype = {
    load: function (id) {
        var self = this;
        this._groupusers.forEach(function (groupuser) {
            if (groupuser.gid === gid) {
                groupuser.active = true;
                self._activeGroupUser = groupuser;
            } else {
                groupuser.active = false;
            }
        });
    },
    getActive: function () {
        return this._activeGroupUser;
    },
    getAll: function () {
        return this._groupusers;
    },
    loadAll: function () {
        var deferred = $.Deferred();
        var self = this;
        $.get(this._baseUrl).done(function (groupusers) {
            self._activeGroupUser = undefined;
            self._groupusers = groupusers;
            deferred.resolve();
        }).fail(function () {
            deferred.reject();
        });
        return deferred.promise();
    },
};


(function (OC, window, $, undefined) {
    'use strict';
    OCGantt.test = function () {
    };

    // All configs should be assembled in the object OCGantt.config
    OCGantt.config = function () {
        if (OCGantt.isAdmin === true) {
            gantt.templates.task_class = gantt.templates.grid_row_class = gantt.templates.task_row_class = function (start, end, task) {
                if (gantt.isSelectedTask(task.id))
                return "gantt_selected";
            };
            gantt.attachEvent("onAfterTaskUpdate", function (id, move, e) {
                arr = gantt.serialize();
                gantt.refreshTask(id);
                var task = gantt.getTask(id);
                var index = OCGantt.getIndexOfProperty(arr.data, 'id', id);
                arr.data[index].open = 1;
                OCGantt.tasks._tasks[index] = arr.data[index];
                OCGantt.tasks._activeTask = OCGantt.tasks._tasks[index];
                OCGantt.tasks.updateActive();
                gantt.render();
            });
            gantt.attachEvent("onAfterLinkUpdate", function (id, item) {
                arr = gantt.serialize();
                gantt.refreshLink(id);
                var link = gantt.getLink(id);
                var index = OCGantt.getIndexOfProperty(arr.links, 'id', id);
                OCGantt.links._links[index] = arr.links[index];
                OCGantt.links._activeLink = OCGantt.links._links[index];
                OCGantt.links.updateActive();
                gantt.render();
            });
            gantt.attachEvent("onAfterTaskAdd", function (id, item) {
                var tmpstart = OCGantt.DateToStr(item.start_date);
                var tmpend = OCGantt.DateToStr(item.end_date);
                arr = gantt.serialize();
                var index = arr.data.length - 1;
                arr.data[index].start_date = tmpstart;
                arr.data[index].end_date = tmpend;
                arr.data[index].parent = item.parent;
                arr.data[index].text = item.text;
                arr.data[index].duration = item.duration;
                arr.data[index].open = "1";
                OCGantt.tasks.create(arr.data[index]).done(function () {
                    gantt.changeTaskId(item.id, arr.data[index].id);
                });
                // check if the added task has a parent and if this parent is a project
                if (item.parent != 0) {
                    var task = gantt.getTask(item.parent);
                    if (task.type != 'project') {
                        task.type = 'project';
                        gantt.updateTask(item.parent);
                    }
                }
                gantt.render();
            });
            gantt.attachEvent("onAfterRedo", function (){
                if (gantt._undo._redoStack.length === 0){
                    $(".fa-repeat").addClass('not_available');
                    OCGantt.testRedo();
                }
                if (gantt._undo._undoStack.length === 0){
                    $(".fa-undo").addClass('not_available');
                    OCGantt.testUndo();
                }
            });
            gantt.attachEvent("onAfterUndo", function (){
                if (gantt._undo._redoStack.length === 0){
                    $(".fa-repeat").addClass('not_available');
                    OCGantt.testRedo();
                }
                if (gantt._undo._undoStack.length === 0){
                    $(".fa-undo").addClass('not_available');
                    OCGantt.testUndo();
                }
            });
            gantt.attachEvent("onBeforeTaskDelete", function (id, item) {
                // check if the task to be deleted was the only child and change the tasktype of the parent
                if (item.parent != 0) {
                    var parent = gantt.getTask(item.parent);
                    if ((gantt.getChildren(item.parent).length == 1) && (gantt.getChildren(item.parent)[0] == item.id)) {
                        if ((parent.type != 'task') && (parent.duration !== 0)) {
                            parent.type = 'task';
                            gantt.updateTask(item.parent);
                        }
                    }
                }
                // check if the task to be deleted has children and delete them
                if (gantt.hasChild(id)) {
                    var children = gantt.getChildren(id);
                    for (var i = 0; i < children.length; i++) {
                        gantt.deleteTask(children[i]);
                    };
                }
                var sourcelinks = OCGantt.getAllProperties(arr.links, 'source', item.id, 'id');
                var targetlinks = OCGantt.getAllProperties(arr.links, 'target', item.id, 'id');
                sourcelinks.forEach(function (sl) {
                    gantt.deleteLink(sl);
                    return;
                });
                targetlinks.forEach(function (sl) {
                    gantt.deleteLink(sl);
                    return;
                });
                return true;
            });
            gantt.attachEvent("onAfterTaskDelete", function (id, item) {
                if (item.$new) {
                    arr = gantt.serialize();
                    OCGantt.tasks._tasks = arr.data;
                    return;
                } else if (!item.$new) {
                    arr = gantt.serialize();
                    var index = OCGantt.getIndexOfProperty(OCGantt.tasks._tasks, 'id', id);
                    OCGantt.tasks._activeTask = OCGantt.tasks._tasks[index];
                    OCGantt.tasks.removeActive();
                    OCGantt.tasks._tasks = arr.data;
                }
            });
            gantt.attachEvent("onAfterLinkAdd", function (id, item) {
                arr = gantt.serialize();
                var index = arr.links.length - 1;
                arr.links[index].source = item.source;
                arr.links[index].target = item.target;
                arr.links[index].type = item.type;
                if (!item.lag) {
                    arr.links[index].lag = 0;
                }
                OCGantt.links.create(arr.links[index]).done(function () {
                    gantt.changeLinkId(item.id, arr.links[index].id);
                });
                console.log(arr.links);
            });
            gantt.attachEvent("onAfterLinkDelete", function (id, item) {
                arr = gantt.serialize();
                var index = OCGantt.getIndexOfProperty(OCGantt.links._links, 'id', id);
                OCGantt.links._activeLink = OCGantt.links._links[index];
                OCGantt.links.removeActive();
                OCGantt.links._links = arr.links;
            });
            gantt.attachEvent("onParse", function () {
                $("#OCGantt-cover").fadeOut();
                $("#OCGantt-loader").fadeOut();
            });
        } else if (OCGantt.isAdmin === false) {
            gantt.config.readonly = true;
        }
        if (OCGantt.dhtmlxversion.dhtmlxversion === "commercial") {
            console.log("You are using the commercial version");
            gantt.config.auto_scheduling = true;
            gantt.config.auto_scheduling_strict = true;
            gantt.config.undo = true;
            gantt.config.redo = true;
            gantt.config.undo_actions = {
                update: "update",
                remove: "remove", // remove an item from datastore
                add: "add"
            };
            gantt.config.undo_types = {
                link: "link",
                task: "task"
            };
            gantt.config.undo_steps = 10;
            gantt.config.multiselect = true;
        } else if (OCGantt.dhtmlxversion.dhtmlxversion === "standard") {
            console.log("You are using the standard version");
        }
        gantt.config.round_dnd_dates = false;
        gantt.config.server_utc = false;
        gantt.config.xml_date = "%Y-%m-%d %H:%i";
        gantt.config.api_date = "%Y-%m-%d %H:%i";
        gantt.config.grid_resize = true;
        gantt.config.date_scale = "%H";
        gantt.config.date_grid = "%d.%m.%Y %H:%i";
        gantt.config.scale_unit = "hour";
        gantt.config.step = 1;
        gantt.config.duration_unit = "minute";
        gantt.config.duration_step = 5;
        gantt.config.time_step = 5;
        gantt.config.subscales = [
            { unit: "month", step: 1, date: "%F %Y" },
            { unit: "day", step: 1, date: "%d" }
        ];
        gantt.config.min_column_width = 50;
        //gantt.config.show_task_cells = false;
        //gantt.config.static_background = true;
        gantt.config.smart_scales = false;
        // Styling
        gantt.config.row_height = 22;
        gantt.config.columns = [
            {
                name: "id", label: "ID", width: OCGantt.columnWidth.id, template: function (item) {
                    return item.id;
                }
            },
            {
                name: "text", label: "Taskname", tree: true, width: OCGantt.columnWidth.name, resize: true, template: function (item) {
                    if (gantt.getChildren(item.id).length > 0)
                        return '<b>' + item.text + '</b>';
                    return item.text;
                }
            },

            {
                name: "start_date", label: "Start", align: "center", width: OCGantt.columnWidth.start, resize: true, template: function (item) {
                    //                    return DateTime.dateToStr(item.start_date, "%d.%m.%Y %H:%i");
                    return item.start_date;
                }
            },

            {
                name: "end_date", label: "End", align: "center", width: OCGantt.columnWidth.end, resize: true, template: function (item) {
                    if (item.type === gantt.config.types.milestone) {
                        return '';
                    }
                    //                    return DateTime.dateToStr(item.end_date, "%d.%m.%Y %H:%i");
                    return item.end_date;
                }
            },

            {
                name: "duration", label: "Duration", align: "center", width: OCGantt.columnWidth.duration, template: function (item) {
                    if (item.type === gantt.config.types.milestone) {
                        return '';
                    } else {
                        if (item.duration) {
                            var returnValue = undefined;
                            returnValue = Math.round(item.duration / 288 * 100) / 100 + " d";
                            //Number((parseFloat(sourceValue)*100).toFixed(1));
                            // return item.duration;
                            return returnValue;
                        }
                        //                        var days = (Math.abs((item.start_date.getTime() - item.end_date.getTime()) / (86400000))).toFixed(1);
                        //                        return ((days % 1 == 0) ? Math.round(days) : days) + ' d';
                    }
                }
            },

            {
                name: "resources", label: "Resources", align: "left", width: OCGantt.columnWidth.resources, resize: true, template: function (item) {

                    var returnValue = undefined;
                    var uid = undefined;
                    var gid = undefined;
                    if (item.resources) {
                        var userGroupArray = item.resources.split(",");
                        if ((userGroupArray.length >= 1) && (userGroupArray[0] != "")) {
                            for (i = 0; i < userGroupArray.length; i++) {
                                if (i > 0) {
                                    returnValue += ", ";
                                }
                                if (userGroupArray[i].indexOf("u_") != -1) {
                                    uid = userGroupArray[i].replace("u_", "");
                                } else if (userGroupArray[i].indexOf("g_") != -1) {
                                    gid = userGroupArray[i].replace("g_", "");
                                }
                                if (uid) {
                                    if (i == 0) {
                                        returnValue = OCGantt.getDisplayname(uid);
                                    } else if (i > 0) {
                                        returnValue += OCGantt.getDisplayname(uid);
                                    }
                                    uid = undefined;
                                }
                                if (gid) {
                                    if (i == 0) {
                                        returnValue = "<strong>" + gid + "</strong>";
                                    } else if (i > 0) {
                                        returnValue += "<strong>" + gid + "</strong>";
                                    }
                                    gid = undefined;
                                }
                            }
                        } else if ((userGroupArray.length == 1) && (userGroupArray[0] == "")) {
                            returnValue = "";
                        }
                    } else if (!item.resources) {
                        item.resources = "";
                        returnValue = "";
                    }
                    return returnValue;
                }
            },

            {
                name: "buttons", label: '', width: OCGantt.columnWidth.buttons, resize: false, template: function (item) {
                    return ('<i class="fa gantt_button_grid gantt_grid_edit fa-pencil" onclick="OCGantt.clickGridButton(' + item.id + ', \'edit\')"></i>' +
                        '<i class="fa gantt_button_grid gantt_grid_add fa-plus" onclick="OCGantt.clickGridButton(' + item.id + ', \'add\')"></i>' +
                        '<i class="fa gantt_button_grid gantt_grid_delete fa-times" onclick="OCGantt.clickGridButton(' + item.id + ', \'delete\')"></i>');
                }
            },
        ];
    }


})(OC, window, jQuery);
OCGantt.test();