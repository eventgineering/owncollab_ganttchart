/**
 * ownCloud - owncollab_gantt
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

// Definition of width of the columns in the tabe
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
    if (OCGantt.linksLoaded && OCGantt.tasksLoaded) {
        gantt.parse(arr);
        return;
    }
    setTimeout(OCGantt.init, 50);
};

// Function that inits a datefield with datepicker and extra features
OCGantt.lbox.dateInit = function (datefield, task) {
    var caretPos = 1;
    $(datefield).datepicker({ dateFormat: "dd.mm.yy", minDate: null });
    //$(datefield).datepicker({ minDate: null});
    if (datefield.id == 'startdate') {
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
}

//Functions for the lightbox
gantt.showLightbox = function (id) {
    taskId = id;
    var task = gantt.getTask(id);
    var form = OCGantt.lbox.getForm();
    var starttmp = task.start_date;
    var startdateField = form.querySelector("[name='startdate']");
    OCGantt.lbox.dateInit(startdateField, task);
    var starttimeField = form.querySelector("[name='starttime']");
    OCGantt.lbox.timeInit(starttimeField, task, 'start_date');
    var enddateField = form.querySelector("[name='enddate']");
    OCGantt.lbox.dateInit(enddateField, task, 'end_date');
    var endtimeField = form.querySelector("[name='endtime']");
    OCGantt.lbox.timeInit(endtimeField, task, 'end_date');
    gantt._center_lightbox(OCGantt.lbox.getForm());
    gantt.showCover();
    var input = form.querySelector("[name='description']");
    input.focus();
    input.value = task.text;
    form.style.display = "block";
    form.querySelector("[name='save']").onclick = OCGantt.lbox.save;
    form.querySelector("[name='close']").onclick = OCGantt.lbox.cancel;
    form.querySelector("[name='delete']").onclick = OCGantt.lbox.remove;
};
gantt.hideLightbox = function () {
    gantt.hideCover();
    OCGantt.lbox.getForm().style.display = "none";
    taskId = null;
}
OCGantt.lbox.getForm = function () {
    return document.getElementById("my-form");
};
OCGantt.lbox.save = function () {
    var task = gantt.getTask(taskId);
    task.text = OCGantt.lbox.getForm().querySelector("[name='description']").value;
    var sdate = OCGantt.lbox.getForm().querySelector("[name='startdate']").value;
    var stime = OCGantt.lbox.getForm().querySelector("[name='starttime']").value;
    var smonth = sdate.substr(3, 2) - 1;
    task.start_date = new Date(sdate.substr(6, 4), smonth, sdate.substr(0, 2), stime.substr(0, 2), stime.substr(3, 2));
    var edate = OCGantt.lbox.getForm().querySelector("[name='enddate']").value;
    var etime = OCGantt.lbox.getForm().querySelector("[name='endtime']").value;
    var emonth = edate.substr(3, 2) - 1;
    task.end_date = new Date(edate.substr(6, 4), emonth, edate.substr(0, 2), etime.substr(0, 2), etime.substr(3, 2));
    if (task.$new) {
        gantt.addTask(task, task.parent);
        delete task.$new;
    } else {
        gantt.updateTask(task.id);
    }
    gantt.hideLightbox();
};
OCGantt.lbox.cancel = function () {
    var task = gantt.getTask(taskId);
    if (task.$new)
        gantt.deleteTask(task.id);
    gantt.hideLightbox();
};
OCGantt.lbox.remove = function () {
    var tid = taskId;
    gantt.confirm({
        title: gantt.locale.labels.confirm_deleting_title,
        text: gantt.locale.labels.confirm_deleting,
        callback: function (res) {
            if (res){
                gantt.deleteTask(tid);
            }
        }
    });
    gantt.hideLightbox();
};

// Definition of how dates should be converted
OCGantt.DateToStr = gantt.date.date_to_str("%Y-%m-%d %H:%i");
OCGantt.StrToDate = gantt.date.str_to_date("%Y-%m-%d %H:%i");

// Definition of the lightbox
OCGantt.lbox.HTML.html = '<div class="gantt_cal_light" id="my-form" style="display: none">' +
    '<div class="gantt_cal_ltitle" style="cursor: pointer;"></div>' +
    '<div style="padding: 5px">' +
    '<div class="tbl_cell lbox_title"><label for="description">Task text</label></div>' +
    //'<br>' +
    '<input type="text" style="width:calc(100% - 16px);" name="description" value="" >' +
    '<br>' +
    '<div class="tbl_cell lbox_date_column">' +
    '<div class="tbl">' +
    '<div class="tbl_cell lbox_title"><label for="startdate">Start</label></div>' +
    '<div class="tbl_cell"><input class="datepicker" id="startdate" name="startdate" type="text"></div>' +
    '<div class="tbl_cell lbox_title"><label for="starttime"></label></div>' +
    '<div class="tbl_cell"><input class="timepicker" id="starttime" name="starttime" type="text"></div>' +
    '</div>' +
    '<div class="tbl">' +
    '<div class="tbl_cell lbox_title"><label for="enddate">End</label></div>' +
    '<div class="tbl_cell"><input class="datepicker" id="enddate" name="enddate" type="text"></div>' +
    '<div class="tbl_cell lbox_title"><label for="endtime"></label></div>' +
    '<div class="tbl_cell"><input class="timepicker" id="endtime" name="endtime" type="text"></div>' +
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
            self._links.push(link);
            self._activeLink = link;
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

(function (OC, window, $, undefined) {
    'use strict';
    OCGantt.test = function () {
    };


    // All configs should be assembled in the object OCGantt.config
    OCGantt.config = function () {
        gantt.config.server_utc = false;
        gantt.config.duration_unit = "hour";//an hour
        gantt.config.duration_step = 1;
        gantt.config.xml_date = "%Y-%m-%d %H:%i";
        gantt.config.api_date = "%Y-%m-%d %H:%i";
        gantt.config.grid_resize = true;
        gantt.config.scale_unit = "hour";
        gantt.config.step = 1;
        gantt.config.date_scale = "%H";
        gantt.config.date_grid = "%d.%m.%Y %H:%i";
        //gantt.config.show_task_cells = false;
        //gantt.config.static_background = true;
        gantt.config.smart_scales = true;
        gantt.attachEvent("onAfterTaskUpdate", function (id, move, e) {
            arr = gantt.serialize();
            gantt.refreshTask(id);
            var task = gantt.getTask(id);
            var index = OCGantt.getIndexOfProperty(arr.data, 'id', id);
            OCGantt.tasks._tasks[index] = arr.data[index];
            OCGantt.tasks._activeTask = OCGantt.tasks._tasks[index];
            OCGantt.tasks.updateActive();
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
            OCGantt.links.create(arr.links[index]).done(function () {
                gantt.changeLinkId(item.id, arr.links[index].id);
            });
        });
        gantt.attachEvent("onAfterLinkDelete", function (id, item) {
            arr = gantt.serialize();
            var index = OCGantt.getIndexOfProperty(OCGantt.links._links, 'id', id);
            OCGantt.links._activeLink = OCGantt.links._links[index];
            OCGantt.links.removeActive();
            OCGantt.links._links = arr.links;
        });
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
                            return item.duration;
                        }
                        //                        var days = (Math.abs((item.start_date.getTime() - item.end_date.getTime()) / (86400000))).toFixed(1);
                        //                        return ((days % 1 == 0) ? Math.round(days) : days) + ' d';
                    }
                }
            },

            {
                name: "resources", label: "Resources", align: "left", width: OCGantt.columnWidth.resources, resize: true, template: function (item) {
                    //                    var usersObj = { groups: [], users: [] };
                    //
                    //                    if (typeof item.users === 'string' && item.users.length > 5) {
                    //                        try {
                    //                            usersObj = JSON.parse(item.users);
                    //                        } catch (e) { }
                    //                    }
                    //
                    //                    var groupsString = Util.cleanArr(usersObj.groups).join(', ');
                    //                    var usersString = Util.cleanArr(usersObj.users).join(', ');
                    //
                    //                    return (!Util.isEmpty(groupsString) ? '<strong>' + groupsString + '</strong>, ' : '') + usersString;

                }
            },

            {
                name: "buttons", label: '', width: OCGantt.columnWidth.buttons, resize: false, template: function (item) {
                    return ('<i class="tooltip fa gantt_button_grid gantt_grid_edit fa-pencil" onclick="OCGantt.clickGridButton(' + item.id + ', \'edit\')"><span class="tooltiptext tooltip-left">Edit</span></i>' +
                        '<i class="fa gantt_button_grid gantt_grid_add fa-plus" onclick="OCGantt.clickGridButton(' + item.id + ', \'add\')"></i>' +
                        '<i class="fa gantt_button_grid gantt_grid_delete fa-times" onclick="OCGantt.clickGridButton(' + item.id + ', \'delete\')"></i>');
                }
            },
        ];
    }


})(OC, window, jQuery);
OCGantt.test();