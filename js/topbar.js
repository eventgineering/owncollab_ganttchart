	(function(){

		function shiftTask(task_id, direction) {
			var task = gantt.getTask(task_id);
			gantt.updateTask(task.id);
		};

        var btn_actions = {
            "toggle": function toggle(target, value){
                $("#" + target).toggle( "blind", {direction: "horizontal"}, value);
            },
			"hide": function hide(target, value){
                $("#" + target).hide( "blind", {direction: "horizontal"}, value);
            },
            "show": function show(target, value, timeout){
                $("#" + target).show( "blind", {direction: "horizontal"}, value);
				$("#"+ target).mouseleave(function() {
					globalTimeout = setTimeout(function() {
						$("#" + target).hide( "blind", {direction: "horizontal"}, value);
						globalTimeout = null;
					}, timeout);

					if (globalTimeout){
						$("#"+ target).mouseenter(function() {
							clearTimeout(globalTimeout);
						});
					}
				});


			},
            "undo": function undo(){
				if (OCGantt.dhtmlxversion.dhtmlxversion === "commercial"){
                	gantt.undo();
				} else if (OCGantt.dhtmlxversion.dhtmlxversion === "standard")
				{
					alert("This feature is only available with a licensed version of dhtmxGantt");
				}
            },
            "redo": function redo(){
				if (OCGantt.dhtmlxversion.dhtmlxversion === "commercial"){
                	gantt.redo();
				} else if (OCGantt.dhtmlxversion.dhtmlxversion === "standard")
				{
					alert("This feature is only available with a licensed version of dhtmxGantt");
				}
            },
			"export2excel": function export2excel(){
				gantt.exportToExcel();
			},
			"export2image": function export2image(){
				if (OCGantt.dhtmlxversion.dhtmlxversion === "commercial"){
				} else if (OCGantt.dhtmlxversion.dhtmlxversion === "standard"){
					gantt.exportToPNG();
				}
			},
			"export2PDF": function export2PDF(){
				if (OCGantt.dhtmlxversion.dhtmlxversion === "commercial"){
				} else if (OCGantt.dhtmlxversion.dhtmlxversion === "standard"){
					gantt.exportToPDF();
				}
			},
			"export2ical": function export2ical(){
				gantt.exportToICal();
			},
			"export2ms": function export2ms(){
				gantt.exportToMSProject();
			},


        };

		var actions = {
			"indent": function indent(task_id){
				var prev_id = gantt.getPrevSibling(task_id);
				while(gantt.isSelectedTask(prev_id)){
					var prev = gantt.getPrevSibling(prev_id);
					if(!prev) break;
					prev_id = prev;
				}
				if (prev_id) {
					var new_parent = gantt.getTask(prev_id);
					gantt.moveTask(task_id, gantt.getChildren(new_parent.id).length, new_parent.id);
					new_parent.type = gantt.config.types.project;
					new_parent.$open = true;
					gantt.updateTask(task_id);
					gantt.updateTask(new_parent.id);
					return task_id;
				}
				return null;
			},
			"outdent": function outdent(task_id){
				var cur_task = gantt.getTask(task_id);
				var old_parent = cur_task.parent;
				if (gantt.isTaskExists(old_parent) && old_parent != gantt.config.root_id){
					gantt.moveTask(task_id, gantt.getTaskIndex(old_parent)+1+gantt.getTaskIndex(task_id), gantt.getParent(cur_task.parent));
					if (!gantt.hasChild(old_parent))
						gantt.getTask(old_parent).type = gantt.config.types.task;
					gantt.updateTask(task_id);
					gantt.updateTask(old_parent);
					return task_id;
				}
				return null;
			},
		};
		var cascadeAction = {
			"indent":true,
			"outdent":true,
			"del":true
		};

        OCGantt.btnAction = function(actionName, target, value, timeout){
            var action = btn_actions[actionName];
            if(!action)
                return;
            else {
                action(target, value, timeout);
            }
        };

		gantt.performAction = function(actionName){
			var action = actions[actionName];
			if(!action)
				return;
			gantt.batchUpdate(function () {
				var updated = {};
				gantt.eachSelectedTask(function(task_id){
					if(cascadeAction[actionName]){
						if(!updated[gantt.getParent(task_id)]){
							var updated_id = action(task_id);
							updated[updated_id] = true;
						}else{
							updated[task_id] = true;
						}
					}else{
						action(task_id);
					}
				});
			});
		};


	})();