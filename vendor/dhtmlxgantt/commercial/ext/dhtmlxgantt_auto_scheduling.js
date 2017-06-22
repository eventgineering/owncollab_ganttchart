/*
@license

dhtmlxGantt v.4.0.10 Professional
This software is covered by DHTMLX Commercial License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt.config.auto_scheduling=!1,gantt.config.auto_scheduling_descendant_links=!1,gantt.config.auto_scheduling_initial=!0,gantt.config.auto_scheduling_strict=!1,function(){var t=gantt._default_task_date;gantt._default_task_date=function(a,e){var n=t.apply(gantt,arguments);if(a.$target&&a.$source){var i=gantt._getTaskMinimalStartDate(a).date;i&&gantt._firstSmaller(n,i)&&(n=gantt.getClosestWorkTime({date:i,dir:"future"}))}return n}}(),gantt._datesNotEqual=function(t,a){return t.valueOf()>a.valueOf()?this._hasDuration(a,t):this._hasDuration(t,a);
},gantt._firstSmaller=function(t,a){return t.valueOf()<a.valueOf()&&this._hasDuration(t,a)?!0:!1},gantt._firstBigger=function(t,a){return this._firstSmaller(a,t)},gantt._notEqualTaskDates=function(t,a){return this._datesNotEqual(t.start_date,a.start_date)||(this._datesNotEqual(t.end_date,a.end_date)||t.duration!=a.duration)&&t.type!=gantt.config.types.milestone?!0:void 0},gantt._autoScheduleHandler=function(t,a,e){if(gantt.config.auto_scheduling&&!this._autoscheduling_in_progress){var n=this.getTask(t);
gantt._notEqualTaskDates(e,n)&&gantt.autoSchedule(n.id)}return!0},gantt._linkChangeAutoScheduleHandler=function(t,a){gantt.config.auto_scheduling&&!this._autoscheduling_in_progress&&gantt.autoSchedule(a.source)},gantt._autoScheduleOnLoadHandler=function(){gantt.config.auto_scheduling&&gantt.config.auto_scheduling_initial&&gantt.autoSchedule()},gantt._checkCircularDependency=function(t,a,e){if(e[t.id])return!1;e[t.id]=!0;for(var n,i=0;i<t.$source.length;i++)if(t.$source[i]!=a.id){var r=this.getLink(t.$source[i]);
if(n=this._get_link_target(r),n&&!this._checkCircularDependency(n,a,e))return!1}if(t.id==a.source&&(n=this._get_link_target(a),n&&!this._checkCircularDependency(n,a,e)))return!1;if(!gantt.config.auto_scheduling_descendant_links)for(var s=gantt.getChildren(t.id),i=0;i<s.length;i++){var o=this.getTask(s[i]);if(!o.$target.length&&!this._checkCircularDependency(o,a,e))return!1}return!0},gantt._checkParents=function(t,a){if(a[t])return!1;if(t!=gantt.config.root_id){var e=gantt.getParent(t);if(e!=gantt.config.root_id)return gantt._checkParents(e,a);
}return!0},gantt._linkValidationHandler=function(t,a){var e=(gantt.config.auto_scheduling_descendant_links||!(gantt.isChildOf(a.target,a.source)||gantt.isChildOf(a.source,a.target)))&&gantt._checkCircularDependency(gantt.getTask(a.source),a,{});return e||gantt.callEvent("onCircularLinkError",[a]),e},gantt._lightBoxChangesHandler=function(t,a){if(gantt.config.auto_scheduling&&!this._autoscheduling_in_progress){var e=this.getTask(t);gantt._notEqualTaskDates(a,e)&&(gantt._autoschedule_lightbox_id=t);
}return!0},gantt._lightBoxSaveHandler=function(t,a){return gantt.config.auto_scheduling&&!this._autoscheduling_in_progress&&gantt._autoschedule_lightbox_id&&gantt._autoschedule_lightbox_id==t&&(gantt._autoschedule_lightbox_id=null,gantt.autoSchedule(a.id)),!0},gantt.attachEvent("onAfterLinkUpdate",gantt._linkChangeAutoScheduleHandler),gantt.attachEvent("onAfterLinkAdd",gantt._linkChangeAutoScheduleHandler),gantt.attachEvent("onParse",gantt._autoScheduleOnLoadHandler),gantt.attachEvent("onBeforeLinkAdd",gantt._linkValidationHandler),
gantt.attachEvent("onBeforeLinkUpdate",gantt._linkValidationHandler),gantt.attachEvent("onBeforeTaskChanged",gantt._autoScheduleHandler),gantt.attachEvent("onLightboxSave",gantt._lightBoxChangesHandler),gantt.attachEvent("onAfterTaskUpdate",gantt._lightBoxSaveHandler),gantt.autoSchedule=function(t){if(gantt.callEvent("onBeforeAutoSchedule",[t])!==!1){var a,e={};if(t)a=this.getTask(t),e=gantt._autoScheduleByTask(a,e);else for(var n=gantt.getChildren(gantt.config.root_id),i=0;i<n.length;i++)a=this.getTask(n[i]),
e=gantt._autoScheduleByTask(a,e);gantt._updateTasks(e);var r=[];for(var i in e)r.push(i);gantt.callEvent("onAfterAutoSchedule",[t,r])}},gantt._autoScheduleByTask=function(t,a){return gantt.config.auto_scheduling_strict?a=gantt._autoScheduleLinkedTasks(t,a,null,t.id):(a=gantt._autoScheduleLinkedTasks(t,a,null),t.parent&&t.parent!=gantt.config.root_id&&(a=gantt._autoScheduleParents(this.getTask(t.parent),a))),a},gantt._autoScheduleLinkedTasks=function(t,a,e,n){var i;if(void 0===t.auto_scheduling||t.auto_scheduling){
var r=gantt._getTaskMinimalStartDate(t);if(t.parent&&t.parent!=gantt.config.root_id){var s=this.getTask(t.parent),o=gantt._getProjectMinimalStartDate(s);r.date&&o.date?this._firstSmaller(r.date,o.date)&&(r=o):r.date||(r=o)}var u=gantt._isTask(t)&&r.date&&(gantt.config.auto_scheduling_strict&&this._datesNotEqual(r.date,t.start_date)&&n!=t.id||this._firstBigger(r.date,t.start_date));if(u){if(gantt.callEvent("onBeforeTaskAutoSchedule",[t,r.date,r.link,r.source_task])===!1)return a;gantt._updateTaskPosition(t,r.date,t.duration),
a[t.id]=!0}if(!gantt.config.auto_scheduling_descendant_links){var g=this.getChildren(t.id),d=n&&gantt.isChildOf(n,t.id);if(g.length&&(!gantt.config.auto_scheduling_strict||!d||d&&u))for(i=0;i<g.length;i++)gantt._autoScheduleLinkedTasks(this.getTask(g[i]),a,e,n)}u&&gantt.callEvent("onAfterTaskAutoSchedule",[t,r.date,r.link,r.source_task])}for(i=0;i<t.$source.length;i++){var l=this.getLink(t.$source[i]),c=this._get_link_target(l);c&&gantt._autoScheduleLinkedTasks(c,a,e,n)}if(t.parent&&e&&t.parent!=gantt.config.root_id){
var _=this.getTask(t.parent);gantt.config.auto_scheduling_strict?gantt._autoScheduleParents(_,a,n):gantt._autoScheduleParents(_,a)}return a},gantt._updateTaskPosition=function(t,a,e){t.start_date=this.getClosestWorkTime({date:a,dir:"future"}),t.end_date=this.calculateEndDate(a,e)},gantt._updateTasks=function(t){this._autoscheduling_in_progress=!0,gantt.batchUpdate(function(){for(var a in t)gantt.updateTask(a)}),this._autoscheduling_in_progress=!1},gantt._calculateMinDate=function(t,a,e){var n=t.start_date,i=this.config.links;
return e.type==i.finish_to_start?n=a.end_date:e.type==i.start_to_start?n=a.start_date:e.type==i.start_to_finish?n=this.calculateEndDate(a.start_date,-1*(t.duration||1)):e.type==i.finish_to_finish&&(n=this.calculateEndDate(a.end_date,-1*t.duration)),e.lag&&1*e.lag==e.lag&&(n=this.calculateEndDate(n,1*e.lag)),n},gantt._getTaskMinimalStartDate=function(t){for(var a={},e=0;e<t.$target.length;e++){var n=this.getLink(t.$target[e]),i=this._get_link_source(n);if(i){var r=t,s=i;gantt._isProject(t)&&(r=gantt.getSubtaskDates(t.id),
r.duration=gantt.calculateDuration(r.start_date,r.end_date)),gantt._isProject(i)&&(s=gantt.getSubtaskDates(i.id),s.duration=gantt.calculateDuration(s.start_date,s.end_date));var o=gantt._calculateMinDate(r,s,n);a.date&&!this._firstSmaller(a.date,o)||gantt._isProject(i)&&gantt.isChildOf(t.id,i.id)||(a.date=new Date(o),a.link=n,a.source_task=i)}}return a.date&&this._firstSmaller(t.start_date,a.date)&&(a._mustMove=!0),a},gantt._getProjectMinimalStartDate=function(t){if(!t)return{};var a;a=gantt._isProject(t)?gantt._getTaskMinimalStartDate(t):{};
var e;t.parent&&t.parent!=gantt.config.root_id&&(e=this.getTask(t.parent));var n=gantt._getProjectMinimalStartDate(e);return(!a.date||n.date&&this._firstSmaller(a.date,n.date))&&(a=n),a},gantt._autoScheduleParents=function(t,a,e){if(!t||gantt.config.auto_scheduling_descendant_links)return a;if(t.parent&&t.parent!=gantt.config.root_id){var n=this.getTask(t.parent);gantt._autoScheduleParents(n,a,e)}return gantt._autoScheduleLinkedTasks(t,a,0,e),a},gantt._isStrictParent=function(t,a){if(!t)return!1;for(var e;this.getParent(e||t);)if(e=this.getParent(e||t),
e==a)return!0;return!1};
//# sourceMappingURL=../sources/ext/dhtmlxgantt_auto_scheduling.js.map