(function () {

	function shiftTask(task_id, direction) {
		var task = gantt.getTask(task_id);
		gantt.updateTask(task.id);
	};

	function exportToPDF() {
		var styleSheetList = [].slice.call(document.styleSheets);
		var exportHTML = '<html><head>';
		styleSheetList.forEach(function (item) {
			exportHTML += '<link rel="stylesheet" href="' + item.href + '">';
		});
		exportHTML += '</head><body>';
		var chartWidth = $('.gantt_grid').width() + $('.gantt_task_scale').width();
		var totalTaskWidth = $('.gantt_task_scale').width();
		var taskWidth = $('.gantt_task').width();
		var totalHeight = $('.gantt_grid_scale').outerHeight(true);
		$(".gantt_grid_data").children().each(function () {
			totalHeight += $(this).outerHeight(true);
		});
		var gridHeight = $('.gantt_grid').outerHeight(true);
		var gridDataHeight = $('.gantt_grid_data').outerHeight(true);
		var taskHeight = $('.gantt_task').outerHeight(true);
		var taskDataHeight = $('.gantt_data_area').outerHeight(true);
		$('.gantt_grid').outerHeight(totalHeight);
		$('.gantt_grid_data').outerHeight(totalHeight - $('.gantt_grid_scale').outerHeight(true));
		$('.gantt_task').outerHeight(totalHeight);
		$('.gantt_data_area').outerHeight(totalHeight - $('.gantt_task_scale').outerHeight(true));
		$('.gantt_task').width(totalTaskWidth);
		exportHTML += '<div id="gantt_chart" style="width:' + chartWidth + 'px; height: ' + totalHeight + 'px;">' + $('#gantt_chart').html() + '</div></body></html>';
		var newWindow = window.open('', '_blank');
		$.post("http://10.8.10.201/pdfgenerator/pdfgenerator.php", {
			html: exportHTML,
		}, function(data, status){
			$(this).target = "_blank";
			newWindow.location = data;
		});
		$('.gantt_grid').outerHeight(gridHeight);
		$('.gantt_grid_data').outerHeight(gridDataHeight)
		$('.gantt_task').outerHeight(taskHeight);
		$('.gantt_data_area').outerHeight(taskDataHeight);
		$('.gantt_task').width(taskWidth);
	};

	var btn_actions = {
		"toggle": function toggle(target, value) {
			$("#" + target).toggle("blind", { direction: "horizontal" }, value);
		},
		"hide": function hide(target, value) {
			$("#" + target).hide("blind", { direction: "horizontal" }, value);
		},
		"show": function show(target, value, timeout) {
			$("#" + target).show("blind", { direction: "horizontal" }, value);
			$("#" + target).mouseleave(function () {
				globalTimeout = setTimeout(function () {
					$("#" + target).hide("blind", { direction: "horizontal" }, value);
					$("div[id^='sidebar-export-content']").hide();
					$("div[id^='sidebar-settings-content']").hide(function(){
					});
					$('#showPassword-OCGantt').off('change', OCGantt.lookForChange);
					$('#expirationCheckbox-OCGantt').off('change', OCGantt.lookForChange);
					$('#share-save').off('click', OCGantt.saveShareChanges);
					$('.fa-copy').off('click', OCGantt.copyLinkToClipboard);
					$('#submit_export_pdf').off("click", exportToPDF);
					globalTimeout = null;
				}, timeout);

				if (globalTimeout) {
					if ($("div[class^='sp-container']").length != 0) {
						$("div[class^='sp-container']").mouseenter(function () {
							clearTimeout(globalTimeout);
						});
					}
					if ($("[class^='ui-datepicker']").length != 0) {
						$("[class^='ui-datepicker']").mouseenter(function () {
							clearTimeout(globalTimeout);
						});
					}

					$("#" + target).mouseenter(function () {
						clearTimeout(globalTimeout);
					});
				}
			});
		},
		"undo": function undo() {
			if (OCGantt.dhtmlxversion.dhtmlxversion === "commercial") {
				var stack = gantt.getUndoStack();
				gantt.undo();
			} else if (OCGantt.dhtmlxversion.dhtmlxversion === "standard") {
				gantt.alert("This feature is only available with a licensed version of dhtmlxGantt");
            	$("#content-wrapper").addClass("blur");
            	setTimeout(function(){
                	$("gantt_popup_button").click(function(){
                    	$("#content-wrapper").removeClass("blur");
                	});
                	$(".gantt_popup_button div").click(function(){
                    	$("#content-wrapper").removeClass("blur");
                	});
                }, 200);
			}
		},
		"redo": function redo() {
			if (OCGantt.dhtmlxversion.dhtmlxversion === "commercial") {
				gantt.redo();
			} else if (OCGantt.dhtmlxversion.dhtmlxversion === "standard") {
				gantt.alert("This feature is only available with a licensed version of dhtmlxGantt");
            	$("#content-wrapper").addClass("blur");
            	setTimeout(function(){
                	$("gantt_popup_button").click(function(){
                    	$("#content-wrapper").removeClass("blur");
                	});
                	$(".gantt_popup_button div").click(function(){
                    	$("#content-wrapper").removeClass("blur");
                	});
                }, 200);
			}
		},
		"export2excel": function export2excel() {
			gantt.exportToExcel();
		},
		"export2image": function export2image() {
			if (OCGantt.dhtmlxversion.dhtmlxversion === "commercial") {
			} else if (OCGantt.dhtmlxversion.dhtmlxversion === "standard") {
				gantt.exportToPNG();
			}
		},
		"export2PDF": function export2PDF() {
			if (OCGantt.dhtmlxversion.dhtmlxversion === "commercial") {
				var task = gantt.getTask(1);
				var form = OCGantt.lbox.getForm("formExportToPDF");
				var startdateField = form.querySelector("[name='pdf_start_date']");
				var enddateField = form.querySelector("[name='pdf_end_date']");
				OCGantt.lbox.dateInit(startdateField, task);
				OCGantt.lbox.dateInit(enddateField, task);
				$('#submit_export_pdf').on("click", exportToPDF);
				$('#sidebar-export-content-pdf').show();
			} else if (OCGantt.dhtmlxversion.dhtmlxversion === "standard") {
				gantt.exportToPDF();
			}
		},
		"export2ical": function export2ical() {
			gantt.exportToICal();
		},
		"export2ms": function export2ms() {
			gantt.exportToMSProject();
		},
		"setColors": function setColors(){
			$("div[id^='sidebar-settings-content']").hide();
			$("#sidebar-settings-content-colors").show();
		},
		"setShare": function setShare(){
			$("div[id^='sidebar-settings-content']").hide();
			var minDate = new Date();
			var maxDate = null;
			minDate.setDate(minDate.getDate()+1);
			$.datepicker.setDefaults({
				minDate: minDate,
				maxDate: maxDate
			});
			$('#expirationDate').datepicker({dateFormat : 'dd.mm.yy'});
			$("#sidebar-settings-content-share").show(function(){
			});
			OCGantt.initShare();
		}

	};

	var actions = {
		"indent": function indent(task_id) {
			var prev_id = gantt.getPrevSibling(task_id);
			while (gantt.isSelectedTask(prev_id)) {
				var prev = gantt.getPrevSibling(prev_id);
				if (!prev) break;
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
		"outdent": function outdent(task_id) {
			var cur_task = gantt.getTask(task_id);
			var old_parent = cur_task.parent;
			if (gantt.isTaskExists(old_parent) && old_parent != gantt.config.root_id) {
				gantt.moveTask(task_id, gantt.getTaskIndex(old_parent) + 1 + gantt.getTaskIndex(task_id), gantt.getParent(cur_task.parent));
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
		"indent": true,
		"outdent": true,
		"del": true
	};

	OCGantt.btnAction = function (actionName, target, value, timeout) {
		var action = btn_actions[actionName];
		if (!action)
			return;
		else {
			action(target, value, timeout);
		}
	};

	gantt.performAction = function (actionName) {
		var action = actions[actionName];
		if (!action)
			return;
		gantt.batchUpdate(function () {
			var updated = {};
			gantt.eachSelectedTask(function (task_id) {
				if (cascadeAction[actionName]) {
					if (!updated[gantt.getParent(task_id)]) {
						var updated_id = action(task_id);
						updated[updated_id] = true;
					} else {
						updated[task_id] = true;
					}
				} else {
					action(task_id);
				}
			});
		});
	};


})();