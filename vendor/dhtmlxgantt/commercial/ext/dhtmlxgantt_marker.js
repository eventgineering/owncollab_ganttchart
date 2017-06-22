/*
@license

dhtmlxGantt v.4.0.10 Professional
This software is covered by DHTMLX Commercial License. Usage without proper license is prohibited.

(c) Dinamenta, UAB.
*/
gantt._markers||(gantt._markers={}),gantt.config.show_markers=!0,gantt.attachEvent("onClear",function(){gantt._markers={}}),gantt.attachEvent("onGanttReady",function(){function t(t){if(!gantt.config.show_markers)return!1;if(!t.start_date)return!1;var e=gantt.getState();if(!(+t.start_date>+e.max_date||+t.end_date&&+t.end_date<+e.min_date||+t.start_date<+e.min_date)){var a=document.createElement("div");a.setAttribute("marker_id",t.id);var n="gantt_marker";gantt.templates.marker_class&&(n+=" "+gantt.templates.marker_class(t)),
t.css&&(n+=" "+t.css),t.title&&(a.title=t.title),a.className=n;var r=gantt.posFromDate(t.start_date);if(a.style.left=r+"px",a.style.height=Math.max(gantt._y_from_ind(gantt._order.length),0)+"px",t.end_date){var i=gantt.posFromDate(t.end_date);a.style.width=Math.max(i-r,0)+"px"}return t.text&&(a.innerHTML="<div class='gantt_marker_content' >"+t.text+"</div>"),a}}var e=document.createElement("div");e.className="gantt_marker_area",gantt.$task_data.appendChild(e),gantt.$marker_area=e,gantt._markerRenderer=gantt._task_renderer("markers",t,gantt.$marker_area,null);
}),gantt.attachEvent("onDataRender",function(){gantt.renderMarkers()}),gantt.getMarker=function(t){return this._markers?this._markers[t]:null},gantt.addMarker=function(t){return t.id=t.id||gantt.uid(),this._markers[t.id]=t,t.id},gantt.deleteMarker=function(t){return this._markers&&this._markers[t]?(delete this._markers[t],!0):!1},gantt.updateMarker=function(t){this._markerRenderer&&this._markerRenderer.render_item(this.getMarker(t))},gantt._getMarkers=function(){var t=[];for(var e in this._markers)t.push(this._markers[e]);
return t},gantt.renderMarkers=function(){if(!this._markers)return!1;if(!this._markerRenderer)return!1;var t=this._getMarkers();return this._markerRenderer.render_items(t),!0};
//# sourceMappingURL=../sources/ext/dhtmlxgantt_marker.js.map