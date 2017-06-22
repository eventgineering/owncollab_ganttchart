/*
@license

dhtmlxGantt v.4.0.10 Professional
This software is covered by DHTMLX Commercial License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt.config.auto_scheduling = false;
gantt.config.auto_scheduling_descendant_links = false;
gantt.config.auto_scheduling_initial = true;
gantt.config.auto_scheduling_strict = false;

(function(){
	var oldDefaultTaskDate = gantt._default_task_date;
	gantt._default_task_date = function(item, parent_id) {
		var startDate = oldDefaultTaskDate.apply(gantt,arguments);
		if(item.$target && item.$source) {
			var date = gantt._getTaskMinimalStartDate(item).date;
			if (date && gantt._firstSmaller(startDate, date)) {
				startDate = gantt.getClosestWorkTime({date: date, dir: "future"});
			}
		}

		return startDate;
	};
})();


gantt._datesNotEqual = function(dateA, dateB){
	if(dateA.valueOf() > dateB.valueOf()){
		return this._hasDuration(dateB, dateA);
	}else{
		return this._hasDuration(dateA, dateB);
	}
};

gantt._firstSmaller = function(small, big){
	if(small.valueOf() < big.valueOf() && this._hasDuration(small, big))
		return true;
	return false;
};
gantt._firstBigger = function(big, small){
	return this._firstSmaller(small, big);
};



gantt._notEqualTaskDates = function(task1, task2){
	if (this._datesNotEqual(task1.start_date, task2.start_date) ||
		((this._datesNotEqual(task1.end_date, task2.end_date) ||
			task1.duration != task2.duration) && task1.type != gantt.config.types.milestone)) {
		return true;
	}
};


gantt._autoScheduleHandler = function (taskId, mode, task) {
	if (gantt.config.auto_scheduling && !this._autoscheduling_in_progress) {
		var newTask = this.getTask(taskId);
		if (gantt._notEqualTaskDates(task, newTask)){ //task.start_date.valueOf() != newTask.start_date.valueOf() ||
			//((task.end_date.valueOf() != newTask.end_date.valueOf() ||
			//	task.duration != newTask.duration) && task.type != gantt.config.types.milestone)) {
			gantt.autoSchedule(newTask.id);
		}
	}
	return true;
};

gantt._linkChangeAutoScheduleHandler = function (linkId, link) {
	if (gantt.config.auto_scheduling && !this._autoscheduling_in_progress) {
		gantt.autoSchedule(link.source);
	}
};

gantt._autoScheduleOnLoadHandler = function () {
	if (gantt.config.auto_scheduling && gantt.config.auto_scheduling_initial) {
		gantt.autoSchedule();
	}
};

gantt._checkCircularDependency = function (element, checkLink, usedElements) {
	if (usedElements[element.id]) {
		return false;
	}
	else {
		usedElements[element.id] = true;
	}
	var currentRefEl;

	for (var i = 0; i < element.$source.length; i++) {
		if (element.$source[i] == checkLink.id) {
			continue;
		}
		var currentLink = this.getLink(element.$source[i]);
		currentRefEl = this._get_link_target(currentLink);
		if (currentRefEl && !this._checkCircularDependency(currentRefEl, checkLink, usedElements)) {
			return false;
		}
	}
	if (element.id == checkLink.source) {
		currentRefEl = this._get_link_target(checkLink);
		if (currentRefEl && !this._checkCircularDependency(currentRefEl, checkLink, usedElements)) {
			return false;
		}
	}

	if(!gantt.config.auto_scheduling_descendant_links) {
		var children = gantt.getChildren(element.id);
		for (var i = 0; i < children.length; i++) {
			var refElement = this.getTask(children[i]);
			if (!refElement.$target.length) {
				if (!this._checkCircularDependency(refElement, checkLink, usedElements)) {
					return false;
				}
			}
		}
	}
	return true;
};

gantt._checkParents = function (id, tasks) {
	if (tasks[id]) {
		return false;
	}

	if (id != gantt.config.root_id) {
		var parent = gantt.getParent(id);
		if (parent != gantt.config.root_id) {
			return gantt._checkParents(parent, tasks);
		}
	}

	return true;
};

gantt._linkValidationHandler = function (id, link) {
	var result = (gantt.config.auto_scheduling_descendant_links ||
		  !(gantt.isChildOf(link.target, link.source) || gantt.isChildOf(link.source, link.target))) &&
		gantt._checkCircularDependency(gantt.getTask(link.source), link, {});

	if (!result) {
		gantt.callEvent("onCircularLinkError", [link]);
	}

	return result;
};

gantt._lightBoxChangesHandler = function (taskId, task) {

	if (gantt.config.auto_scheduling && !this._autoscheduling_in_progress) {
		var oldTask = this.getTask(taskId);
		if (gantt._notEqualTaskDates(task, oldTask)) {
			gantt._autoschedule_lightbox_id = taskId;
		}
	}
	return true;
};

gantt._lightBoxSaveHandler = function (taskId, task) {

	if (gantt.config.auto_scheduling && !this._autoscheduling_in_progress) {
		if (gantt._autoschedule_lightbox_id && gantt._autoschedule_lightbox_id == taskId) {
			gantt._autoschedule_lightbox_id = null;
			gantt.autoSchedule(task.id);
		}
	}
	return true;
};

gantt.attachEvent("onAfterLinkUpdate", gantt._linkChangeAutoScheduleHandler);
gantt.attachEvent("onAfterLinkAdd", gantt._linkChangeAutoScheduleHandler);
gantt.attachEvent("onParse", gantt._autoScheduleOnLoadHandler);
gantt.attachEvent("onBeforeLinkAdd", gantt._linkValidationHandler);
gantt.attachEvent("onBeforeLinkUpdate", gantt._linkValidationHandler);
gantt.attachEvent("onBeforeTaskChanged", gantt._autoScheduleHandler);
gantt.attachEvent("onLightboxSave", gantt._lightBoxChangesHandler);
gantt.attachEvent("onAfterTaskUpdate", gantt._lightBoxSaveHandler);


gantt.autoSchedule = function (taskId) {
	if (gantt.callEvent("onBeforeAutoSchedule", [taskId]) !== false) {
		var upTasks = {};
		var task;
		if (taskId) {
			task = this.getTask(taskId);
			upTasks = gantt._autoScheduleByTask(task, upTasks);
		}
		else {
			var tasks = gantt.getChildren(gantt.config.root_id);
			for (var i = 0; i < tasks.length; i++) {
				task = this.getTask(tasks[i]);
				upTasks = gantt._autoScheduleByTask(task, upTasks);
			}
		}
		gantt._updateTasks(upTasks);

		var tasksList = [];
		for(var i in upTasks){
			tasksList.push(i);
		}

		gantt.callEvent("onAfterAutoSchedule", [taskId, tasksList]);
	}
};

gantt._autoScheduleByTask = function (task, updatedTasksList) {
	if (gantt.config.auto_scheduling_strict) {
		updatedTasksList = gantt._autoScheduleLinkedTasks(task, updatedTasksList, null, task.id);
	}
	else {
		updatedTasksList = gantt._autoScheduleLinkedTasks(task, updatedTasksList, null);
		if (task.parent && task.parent != gantt.config.root_id) {
			updatedTasksList = gantt._autoScheduleParents(this.getTask(task.parent), updatedTasksList);
		}
	}

	return updatedTasksList;
};

gantt._autoScheduleLinkedTasks = function (task, updatedTasks, currentParent, strictStart) {
	var i;

	if (task.auto_scheduling === undefined || task.auto_scheduling) {
		var newStart = gantt._getTaskMinimalStartDate(task);
		if (task.parent && task.parent != gantt.config.root_id) {
			var parentTask = this.getTask(task.parent);
			var parentStart = gantt._getProjectMinimalStartDate(parentTask);
			if (newStart.date && parentStart.date) {
				if (this._firstSmaller(newStart.date, parentStart.date)) {
					newStart = parentStart;
				}
			}
			else {
				if (!newStart.date) {
					newStart = parentStart;
				}
			}
		}

		var needAutoschedule = gantt._isTask(task) && newStart.date && ((gantt.config.auto_scheduling_strict && this._datesNotEqual(newStart.date, task.start_date) && strictStart != task.id) ||
			(this._firstBigger(newStart.date, task.start_date)));


		// newStart is an object which contains minimal date, link to object and source task.
		// E.g.
		// {date: Fri Apr 05 2013 00:00:00 GMT+0300, link: Object, source_task: Object}

		if(needAutoschedule){
			if (gantt.callEvent("onBeforeTaskAutoSchedule", [task, newStart.date, newStart.link, newStart.source_task]) === false) {
				return updatedTasks;
			}

			gantt._updateTaskPosition(task, newStart.date, task.duration);
			updatedTasks[task.id] = true;
		}

		if(!gantt.config.auto_scheduling_descendant_links) {
			var taskChildren = this.getChildren(task.id);
			var isStrictParent = strictStart && gantt.isChildOf(strictStart, task.id);

			if (taskChildren.length && (!gantt.config.auto_scheduling_strict ||
				((!isStrictParent) || (isStrictParent && needAutoschedule)))) {
				for (i = 0; i < taskChildren.length; i++) {
					gantt._autoScheduleLinkedTasks(this.getTask(taskChildren[i]), updatedTasks, currentParent, strictStart);
				}
			}
		}

		if(needAutoschedule)
			gantt.callEvent("onAfterTaskAutoSchedule", [task, newStart.date, newStart.link, newStart.source_task]);
	}

	for (i = 0; i < task.$source.length; i++) {
		var currentLink = this.getLink(task.$source[i]);
		var referencedTask = this._get_link_target(currentLink);
		if(!referencedTask) continue;
		gantt._autoScheduleLinkedTasks(referencedTask, updatedTasks, currentParent, strictStart);
	}

	if (task.parent && currentParent && task.parent != gantt.config.root_id) {

		var taskParent = this.getTask(task.parent);
		if (gantt.config.auto_scheduling_strict) {
			gantt._autoScheduleParents(taskParent, updatedTasks, strictStart);
		}
		else {
			gantt._autoScheduleParents(taskParent, updatedTasks);
		}
	}

	return updatedTasks;
};

gantt._updateTaskPosition = function (task, start_date, duration) {
	task.start_date = this.getClosestWorkTime({date: start_date, dir: "future"});
	task.end_date = this.calculateEndDate(start_date, duration);
};

gantt._updateTasks = function (tasks) {
	this._autoscheduling_in_progress = true;
	gantt.batchUpdate(function () {
		for (var task in tasks) {
			gantt.updateTask(task);
		}
	});
	this._autoscheduling_in_progress = false;
};

gantt._calculateMinDate = function(task, predecessor, relation){
	var new_start = task.start_date;
	var links = this.config.links;

	if(relation.type == links.finish_to_start){
		new_start = predecessor.end_date;
	}else if(relation.type == links.start_to_start){
		new_start = predecessor.start_date;
	}else if(relation.type == links.start_to_finish){
		new_start = this.calculateEndDate(predecessor.start_date, (task.duration || 1) * (-1));
	}else if(relation.type == links.finish_to_finish){
		new_start  = this.calculateEndDate(predecessor.end_date, task.duration * (-1));
	}

	if(relation.lag && relation.lag*1 == relation.lag){
		new_start = this.calculateEndDate(new_start, relation.lag*1);
	}
	return new_start;
};

gantt._getTaskMinimalStartDate = function (task) {
	var result = {};
	for (var i = 0; i < task.$target.length; i++) {
		var link = this.getLink(task.$target[i]);
		var predecessor = this._get_link_source(link);
		if(!predecessor) continue;

		var ownDates = task,
			predecessorDates = predecessor;

		if (gantt._isProject(task)) {
			ownDates = gantt.getSubtaskDates(task.id);
			ownDates.duration = gantt.calculateDuration(ownDates.start_date, ownDates.end_date);
		}

		if (gantt._isProject(predecessor)) {
			predecessorDates = gantt.getSubtaskDates(predecessor.id);
			predecessorDates.duration = gantt.calculateDuration(predecessorDates.start_date, predecessorDates.end_date);
		}

		var new_start = gantt._calculateMinDate(ownDates, predecessorDates, link);

		if((!result.date || this._firstSmaller(result.date, new_start)) && !(gantt._isProject(predecessor) && gantt.isChildOf(task.id, predecessor.id))){
			result.date = new Date(new_start);
			result.link = link;
			result.source_task = predecessor;
		}
	}
	if (result.date  && this._firstSmaller(task.start_date, result.date)) {
		result._mustMove = true;
	}
	return result;
};

gantt._getProjectMinimalStartDate = function (project) {
	if (!project) {
		return {};
	}
	var result;

	if (gantt._isProject(project)) {
		result = gantt._getTaskMinimalStartDate(project);
	}
	else {
		result = {};
	}

	var projectParent;
	if (project.parent && project.parent != gantt.config.root_id) {
		projectParent = this.getTask(project.parent);
	}

	var parentMinDate = gantt._getProjectMinimalStartDate(projectParent);
	if (!result.date || ( parentMinDate.date && this._firstSmaller(result.date, parentMinDate.date))) {
		result = parentMinDate;
	}
	return result;
};

gantt._autoScheduleParents = function (parent, updatedTasks, strictStart) {
	if (!parent || gantt.config.auto_scheduling_descendant_links) {
		return updatedTasks;
	}

	if (parent.parent && parent.parent != gantt.config.root_id) {
		var bigParent = this.getTask(parent.parent);
		gantt._autoScheduleParents(bigParent, updatedTasks, strictStart);
	}
	gantt._autoScheduleLinkedTasks(parent, updatedTasks, 0, strictStart);

	return updatedTasks;
};

gantt._isStrictParent = function (strictStart, elementId) {
	if (!strictStart) {
		return false;
	}
	var parent;

	while (this.getParent(parent || strictStart)) {
		parent = this.getParent(parent || strictStart);

		if (parent == elementId) {
			return true;
		}
	}
	return false;
};

