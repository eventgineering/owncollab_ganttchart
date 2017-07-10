console.log("firstrunwizard loaded");

var OCGanttFRW = {};
var instanceUrl = OC.generateUrl('/apps/owncollab_ganttchart/').replace("index.php/", "");
OCGanttFRW.html = {};
OCGanttFRW.isAdmin = OC.isUserAdmin();
OCGanttFRW.pageCount;
OCGanttFRW.pages = [];
OCGanttFRW.activePage;

jQuery.fn.centerHorizontal = function (parent) {
    this.css("position","absolute");
    this.css("left", Math.max(0, (($(parent).width() - $(this).outerWidth()) / 2)) + "px");
    return this;
}

initFirstRunWizard = function () {
    var owncollab_chart = $('script[src*="owncollabgantt.js"]').length;
    var owncollab_script = $('script[src*="script.js"]').length;
    var dhtmlxgantt = $('script[src*="dhtmlxgantt.js"]').length;
    if ((dhtmlxgantt === 1) && (owncollab_script ===1) && (owncollab_chart === 1)){
        console.log("necessary scripts loaded");
        startFirstRunWizard();
        return;
    }
    setTimeout(initFirstRunWizard, 50);

};

OCGanttFRW.addPageCountDots = function(number){
    for (i = 0; i < number; i++){
        $(".counterwrapper").append('<div class="ocgantt-frw dot disabled"></div>');
        $(".counterwrapper").centerHorizontal("#lightbox");
    }
}

OCGanttFRW.addPages = function(number){
    for (i=0; i<number; i++){
        //$("#lightbox").append(OCGanttFRW.pages[i].html);
        $(".counterwrapper").first().before(OCGanttFRW.pages[i].html);
        if (OCGanttFRW.pages[i].active === true){
            OCGanttFRW.activePage = i + 1;
            $("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+")").show();
            $(".counterwrapper .dot:nth-child("+OCGanttFRW.activePage+")").addClass("enabled");
            $(".counterwrapper .dot:nth-child("+OCGanttFRW.activePage+")").removeClass("disabled");
        }
    }
    var task = {};
    var startdateField = document.querySelector("[name='projectstartdate']");
    var starttimeField = document.querySelector("[name='projectstarttime']");
    var startDate = new Date();
    var minute = startDate.getMinutes();
    var hour = startDate.getHours();
    var day = startDate.getDate();
    var month = startDate.getMonth()+1;
    var year = startDate.getFullYear();
    task.start_date = new Date(year + '-' + ('0' + month).slice(-2) + '-' + ('0' + day).slice(-2) + ' ' + ('0' + hour).slice(-2) + ':' + ('0' + minute).slice(-2));
    OCGantt.lbox.dateInit(startdateField, task);
    OCGantt.lbox.timeInit(starttimeField, task, 'start_date');

}

OCGanttFRW.switchPages = function(action){
    switch (action){
        case "next":
            $(".counterwrapper .dot:nth-child("+OCGanttFRW.activePage+")").removeClass("enabled");
            $(".counterwrapper .dot:nth-child("+OCGanttFRW.activePage+")").addClass("disabled");
            $("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+")").hide();
            if ($("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+") video").get(0)){
                $("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+") video").get(0).pause();
            }
            delete OCGanttFRW.pages[OCGanttFRW.activePage-1].active;
            OCGanttFRW.activePage++;
            $(".counterwrapper .dot:nth-child("+OCGanttFRW.activePage+")").addClass("enabled");
            $(".counterwrapper .dot:nth-child("+OCGanttFRW.activePage+")").removeClass("disabled");
            $("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+")").fadeIn(500);
            if ($("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+") video").get(0)){
                $("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+") video").get(0).play();
            }
            OCGanttFRW.pages[OCGanttFRW.activePage-1].active = true;
            if (OCGanttFRW.activePage === $("#lightbox .wrapper").length){
                $("#nextbutton").hide();
                $("#finishbutton").show();
            }
            if ((OCGanttFRW.activePage != 1) && ($("#lightbox .wrapper").length) != 1){
                $("#lightbox input[name = 'back']").addClass('enabled');
                $("#lightbox input[name = 'back']").removeClass('disabled');
            }
        break;
        case "back":
            $(".counterwrapper .dot:nth-child("+OCGanttFRW.activePage+")").removeClass("enabled");
            $(".counterwrapper .dot:nth-child("+OCGanttFRW.activePage+")").addClass("disabled");
            $("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+")").hide();
            if ($("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+") video").get(0)){
                $("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+") video").get(0).pause();
            }
            delete OCGanttFRW.pages[OCGanttFRW.activePage-1].active;
            OCGanttFRW.activePage --;
            $(".counterwrapper .dot:nth-child("+OCGanttFRW.activePage+")").addClass("enabled");
            $(".counterwrapper .dot:nth-child("+OCGanttFRW.activePage+")").removeClass("disabled");
            $("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+")").fadeIn(500);
            if ($("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+") video").get(0)){
                $("#lightbox .wrapper:nth-child("+OCGanttFRW.activePage+") video").get(0).play();
            }
            OCGanttFRW.pages[OCGanttFRW.activePage-1].active = true;
            if (OCGanttFRW.activePage != $("#lightbox .wrapper").length){
                $("#nextbutton").show();
                $("#finishbutton").hide();
            }
            if (OCGanttFRW.activePage === 1){
                $("#lightbox input[name = 'back']").addClass('disabled');
                $("#lightbox input[name = 'back']").removeClass('enabled');
            }
        break;
        case "finish":
            OCGanttFRW.getInitialValues();

    }
}

OCGanttFRW.getInitialValues = function(){
    var task = {};
    task.text = $("#projectname").prop('value');
    if (task.text === '') {
        task.text = 'Project name';
    }
    var sdate = document.querySelector("[name='projectstartdate']").value;
    var stime = document.querySelector("[name='projectstarttime']").value;
    var smonth = sdate.substr(3, 2) - 1;
    task.start_date = new Date(sdate.substr(6, 4), smonth, sdate.substr(0, 2), stime.substr(0, 2), stime.substr(3, 2));
    task.type = "task";
    task.open = "1";
    task.end_date = new Date(task.start_date);
    task.end_date = new Date(task.end_date.setDate((task.end_date.getDate())+1));
    gantt.addTask(task, '');
    OC.AppConfig.setValue('owncollab_ganttchart', 'firstrunwizard', '1');
    gantt._undo._pop(gantt._undo._undoStack);
    $("#ocgantt-frw-overlay").fadeOut(500);
    $("#ocgantt-frw-overlay").remove();
};

startFirstRunWizard = function () {
    $("body").append(OCGanttFRW.html);
    OCGanttFRW.addPageCountDots(OCGanttFRW.pageCount);
    OCGanttFRW.addPages(OCGanttFRW.pageCount);
    $("#media-frw-1").css('background-image', 'url(' + instanceUrl + 'img/TUT_change_project_name.png)');
    $("#media-frw-2").css('background-image', 'url(' + instanceUrl + 'img/TUT_move_beginning.png)');
    $("#lightbox input").click(function(){
        OCGanttFRW.switchPages($(this).prop('value'));
    });
}

if (OCGanttFRW.isAdmin === true){
    OCGanttFRW.pages[0] = {
        html: '<div class="ocgantt-frw wrapper">' +
              '<div class="ocgantt-frw header"><h1>Welcome!</h1></div>' +
              '<div class="ocgantt-frw form" style="text-align: center;"><br><p style="font-size: 1.2em;">The following steps will guide you through the initial setup of the ownCollab Gantt chart</p>' +
              '<p style="font-size: 1.2em;">You will be able to change all the settings afterwards if necessary</p>' +
              '</div>' +
              '</div>',
        active: true
    };
    OCGanttFRW.pages[1] = {
        html: '<div class="ocgantt-frw wrapper">' +
              '<div class="ocgantt-frw header"><h1>Set the project name</h1></div>' +
              '<div class="ocgantt-frw media" id="media-frw-1">' +
              '<div class="ocgantt-frw video"><video preload="preload" loop="loop"><source src="' + instanceUrl + 'vid/TUT_change_project_name.mp4"></source></video></div>' +
              '</div>' +
              '<div class="ocgantt-frw form" style="text-align: center;"><p style="font-size: 1.2em; margin-bottom: 5px; padding-bottom: 5px;">Please set the project name as first. You can change it later by editing the first task.</p>' +
              '<input type="text" style="width:20%;" id="projectname" name="projectname" value="" placeholder="Project name" />' +
              '</div>' +
              '</div>',
        active: false
    };
        OCGanttFRW.pages[2] = {
        html: '<div class="ocgantt-frw wrapper">' +
              '<div class="ocgantt-frw header"><h1>Set the start date of the project</h1></div>' +
              '<div class="ocgantt-frw media" id="media-frw-2">' +
              '<div class="ocgantt-frw video"><video preload="preload" loop="loop"><source src="' + instanceUrl + 'vid/TUT_move_beginning.mp4"></source></video></div>' +
              '</div>' +
              '<div class="ocgantt-frw form" style="text-align: center;"><p style="font-size: 1.2em; margin-bottom: 5px; padding-bottom: 5px;">Please set the start date and time of the project. These values will be adjusted automatically when editing the project.</p>' +
              '<input class="datepicker" id="projectstartdate" name="projectstartdate" type="text" style="width: 80px">' +
              '<input class="timepicker" id="projectstarttime" name="projectstarttime" type="text" style="width: 40px">' +
              '</div>' +
              '</div>',
        active: false
    };

    OCGanttFRW.pages[3] = {
        html: '<div class="ocgantt-frw wrapper">' +
              '<div class="ocgantt-frw header"><h1>Congratulations!</h1></div>' +
              '<div class="ocgantt-frw form" style="text-align: center;"><p style="font-size: 1.2em; margin-bottom: 5px; padding-bottom: 5px;">You have succesfull setup your Gantt chart. Please press <b>finish</b> to start with your Gantt chart.</p>' +
              '</div>' +
              '</div>',
        active: false
    };
    

    OCGanttFRW.pageCount = OCGanttFRW.pages.length;
    OCGanttFRW.html = '<div id="ocgantt-frw-overlay" class="ocgantt-frw overlay">' +
                      '<div class="circleparent"><div class="circle"></div></div>' +
                      '<div class="circleparent"><div class="circle"></div></div>' +
                      '<div id="lightbox" class="gantt_cal_light ocgantt-frw lightbox">'+
                      '<div class="ocgantt-frw counterwrapper" align="center"></div>' +
                      '<div id="backbutton"><input class="ocgantt-frw btn-left disabled" type="button" name="back" value="back"/></div>' +
                      '<div id="nextbutton"><input class="ocgantt-frw btn-right enabled" type="button" name="next" value="next"/></div>' +
                      '<div id="finishbutton" style="display:none"><input class="ocgantt-frw btn-right enabled" type="button" name="finish" value="finish"/></div>' +
                      '</div>' +
                      '</div>';
} else if (OCGanttFRW.isAdmin === false){
    OCGanttFRW.html = '<div id="ocgantt-frw-overlay" class="ocgantt-frw overlay">' +
                      '<div class="circleparent"><div class="circle"></div></div>' +
                      '<div class="circleparent"><div class="circle"></div></div>' +
                      '<div class="gantt_cal_light ocgantt-frw wrapper">' +
                      '<div class="ocgantt-frw header"><h1>Welcome!</h1></div>' +
                      '<div class="ocgantt-frw form" style="text-align: center;"><br><p style="font-size: 1.2em;">Unfortunately this instance of ownCollab Gantt chart has not been setup by an adminstrator yet. Please contact your administrator to perform the initial setup for you.</p>' +
                      '</div>' +
                      '</div>' +
                      '</div>';
}

initFirstRunWizard();

