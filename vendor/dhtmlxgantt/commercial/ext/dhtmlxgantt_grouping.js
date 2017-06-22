/*
@license

dhtmlxGantt v.4.0.10 Professional
This software is covered by DHTMLX Commercial License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt._groups={relation_property:null,relation_id_property:"$group_id",group_id:null,group_text:null,loading:!1,loaded:0,init:function(t){var e=this;t.attachEvent("onClear",function(){e.clear()}),e.clear();var n=t._get_parent_id;t._get_parent_id=function(a){return e.is_active()?e.get_parent(t,a):n.apply(this,arguments)};var a=t.setParent;t.setParent=function(n,r){if(!e.is_active())return a.apply(this,arguments);if(t.isTaskExists(r)){var i=t.getTask(r);n[e.relation_property]=i[e.relation_id_property];
}},t.attachEvent("onBeforeTaskDisplay",function(n,a){return e.is_active()&&a.type==t.config.types.project&&!a.$virtual?!1:!0}),t.attachEvent("onBeforeParse",function(){e.loading=!0}),t.attachEvent("onTaskLoading",function(){return e.is_active()&&(e.loaded--,e.loaded<=0&&(e.loading=!1,t.eachTask(t.bind(function(e){this.get_parent(t,e)},e)),t._sync_order())),!0}),t.attachEvent("onParse",function(){e.loading=!1,e.loaded=0})},get_parent:function(t,e,n){var a=e[this.relation_property];if(void 0!==this._groups_pull[a])return this._groups_pull[a];
var r=t.config.root_id;return this.loading||(r=this.find_parent(n||t.getTaskByTime(),a,this.relation_id_property,t.config.root_id),this._groups_pull[a]=r),r},find_parent:function(t,e,n,a){for(var r=0;r<t.length;r++){var i=t[r];if(void 0!==i[n]&&i[n]==e)return i.id}return a},clear:function(){this._groups_pull={},this.relation_property=null,this.group_id=null,this.group_text=null},is_active:function(){return!!this.relation_property},generate_sections:function(t,e){for(var n=[],a=0;a<t.length;a++){var r=gantt.copy(t[a]);
r.type=e,r.open=!0,r.$virtual=!0,r.readonly=!0,r[this.relation_id_property]=r[this.group_id],r.text=r[this.group_text],n.push(r)}return n},clear_temp_tasks:function(t){for(var e=0;e<t.length;e++)t[e].$virtual&&(t.splice(e,1),e--)},generate_data:function(t,e){var n=t.getLinks(),a=t.getTaskByTime();this.clear_temp_tasks(a);var r=[];this.is_active()&&e&&e.length&&(r=this.generate_sections(e,t.config.types.project));var i={links:n};return i.data=r.concat(a),i},update_settings:function(t,e,n){this.clear(),
this.relation_property=t,this.group_id=e,this.group_text=n},group_tasks:function(t,e,n,a,r){this.update_settings(n,a,r);var i=this.generate_data(t,e);this.loaded=i.data.length,t._clear_data(),t.parse(i)}},gantt._groups.init(gantt),gantt.groupBy=function(t){t=t||{};var e=t.groups||null,n=t.relation_property||null,a=t.group_id||"key",r=t.group_text||"label";this._groups.group_tasks(this,e,n,a,r)};
//# sourceMappingURL=../sources/ext/dhtmlxgantt_grouping.js.map