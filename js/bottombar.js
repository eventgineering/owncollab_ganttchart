
	var cachedSettings = {};
	function applyConfig(config, dates) {
		gantt.config.scale_unit = config.scale_unit;
		if (config.date_scale) {
			gantt.config.date_scale = config.date_scale;
			gantt.templates.date_scale = null;
		}
		else {
			gantt.templates.date_scale = config.template;
		}

		gantt.config.step = config.step;
		gantt.config.subscales = config.subscales;

		if (dates) {
			gantt.config.start_date = gantt.date.add(dates.start_date, -1, config.unit);
			gantt.config.end_date = gantt.date.add(gantt.date[config.unit + "_start"](dates.end_date), 2, config.unit);
		} else {
			gantt.config.start_date = gantt.config.end_date = null;
		}
	}



	function zoomToFit() {
		var project = gantt.getSubtaskDates(),
				areaWidth = gantt.$task.offsetWidth;

		for (var i = 0; i < scaleConfigs.length; i++) {
			var columnCount = getUnitsBetween(project.start_date, project.end_date, scaleConfigs[i].unit, scaleConfigs[i].step);
			if ((columnCount + 2) * gantt.config.min_column_width <= areaWidth) {
				break;
			}
		}

		if (i == scaleConfigs.length) {
			i--;
		}
		applyConfig(scaleConfigs[i], project);
		gantt.render();
	}

	// get number of columns in timeline
	function getUnitsBetween(from, to, unit, step) {
		var start = new Date(from),
				end = new Date(to);
		var units = 0;
		while (start.valueOf() < end.valueOf()) {
			units++;
			start = gantt.date.add(start, step, unit);
		}
		return units;
	}

	//Setting available scales
	var scaleConfigs = [
		// minutes
		{ unit: "minute", step: 1, scale_unit: "hour", date_scale: "%H", subscales: [
			{unit: "minute", step: 1, date: "%H:%i"}
		]
		},
		// hours
		{ unit: "hour", step: 1, scale_unit: "day", date_scale: "%j %M",
			subscales: [
				{unit: "hour", step: 1, date: "%H:%i"}
			]
		},
		// days
		{ unit: "day", step: 1, scale_unit: "month", date_scale: "%F",
			subscales: [
				{unit: "day", step: 1, date: "%j"}
			]
		},
		// weeks
		{unit: "week", step: 1, scale_unit: "month", date_scale: "%F",
			subscales: [
				{unit: "week", step: 1, template: function (date) {
					var dateToStr = gantt.date.date_to_str("%d %M");
					var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
					return dateToStr(date) + " - " + dateToStr(endDate);
				}}
			]},
		// months
		{ unit: "month", step: 1, scale_unit: "year", date_scale: "%Y",
			subscales: [
				{unit: "month", step: 1, date: "%M"}
			]},
		// quarters
		{ unit: "month", step: 3, scale_unit: "year", date_scale: "%Y",
			subscales: [
				{unit: "month", step: 3, template: function (date) {
					var dateToStr = gantt.date.date_to_str("%M");
					var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
					return dateToStr(date) + " - " + dateToStr(endDate);
				}}
			]},
		// years
		{unit: "year", step: 1, scale_unit: "year", date_scale: "%Y",
			subscales: [
				{unit: "year", step: 5, template: function (date) {
					var dateToStr = gantt.date.date_to_str("%Y");
					var endDate = gantt.date.add(gantt.date.add(date, 5, "year"), -1, "day");
					return dateToStr(date) + " - " + dateToStr(endDate);
				}}
			]},
		// decades
		{unit: "year", step: 10, scale_unit: "year", template: function (date) {
			var dateToStr = gantt.date.date_to_str("%Y");
			var endDate = gantt.date.add(gantt.date.add(date, 10, "year"), -1, "day");
			return dateToStr(date) + " - " + dateToStr(endDate);
		},
			subscales: [
				{unit: "year", step: 100, template: function (date) {
					var dateToStr = gantt.date.date_to_str("%Y");
					var endDate = gantt.date.add(gantt.date.add(date, 100, "year"), -1, "day");
					return dateToStr(date) + " - " + dateToStr(endDate);
				}}
			]}
	];