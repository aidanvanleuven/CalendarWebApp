//Global variables (ugh) -- based on current date

var g_CurrentMonth = moment().month();

//Get the month the user is currently on, always pass g_Switch
var g_Month = function(add) {
	return moment().add(add, "months").month();
};
var g_Switch = 0;											//Used for changing the user month
var g_CurrentDay = moment().date();							//Current day of the month
var g_CurrentYear = moment().year();						//Current year
var weekdaysArr = [];										//Array solely for the purpose of calulating weekdaysInMonth
var weekdaysInMonth;										//Number of weekdays (M-F) in the current month
var monthName = [
];														//Array containing the names of each month; monthName[0] returns January
var entries = [];											//Array containing all entries in the current month
var numberOfDays;

monthName[0] = "January";									//Populate
monthName[1] = "February";
monthName[2] = "March";
monthName[3] = "April";
monthName[4] = "May";
monthName[5] = "June";
monthName[6] = "July";
monthName[7] = "August";
monthName[8] = "September";
monthName[9] = "October";
monthName[10] = "November";
monthName[11] = "December";

	var socket = io();

	//Get number of days in any month; Zero based
	function getDaysInMonth(month,year){
		if (month === undefined){
			month = g_Month(g_Switch);
		}
		if (year === undefined){
			year = g_CurrentYear;
		}
		var a = month+1;
		var b = year;
		a.toString();
		b.toString();
		var parse = a+"-"+b;
		numberOfDays = moment(parse,"M-YYYY").daysInMonth();
		return moment(parse,"M-YYYY").daysInMonth();
	}

	//Get the day of the week for any day and month; day is one based, month is zero based
	function getDayOfWeek(day, month){
		if (day === undefined){
			day = g_CurrentDay;
		}
		if (month === undefined){
			month = g_Month(g_Switch);
		}

		var a = day;
		var b = month+1;
		a.toString();
		b.toString();
		var parse = a+"-"+b;
		return moment(parse, "D-M").day();
	}

	function getWeekDaysInMonth(){
		weekdaysArr = [];
		for (i = 1; i <= numberOfDays; i++){
			if (getDayOfWeek(i) !== 0 && getDayOfWeek(i) !== 6){
				weekdaysArr.push(i);
			}
		}
		weekdaysInMonth = weekdaysArr.length;
	}

	//Get all entries for the current month
	function getEntries() {
		var sendData = {
			month: g_Month(g_Switch)
		};
		$.post("/getentries", sendData, function (data){
			entries = data;
			addEntriesToCards();
		});
	}

	//Handle color change on hover for badges
	function hoverEffect(){
		$("span.new.badge").hover(
			function () {
				$(this).addClass("darken-2");
			},
			function() {
				$(this).removeClass("darken-2");
			}
		);
	}

	//NEVER create a function inside a for loop
	function addEntriesToCards() {
		$(".entry-space").empty();
		for (i = 0; i < entries.length; i++){
			$(".card-content").each(function(index){		//Whoops
				if ($(this).attr("id") == entries[i].day){
					$(this).children(".entry-space").append(
						"<a><span class='new badge "+entries[i].color+"' data-badge-caption=''>"+entries[i].title+"</span></a><br>"
					);
				}
			});
		}
		clickDelete();
		hoverEffect();
	}

	function modalSendData(){
		var sendData = {
			month: parseInt($("#month-dropdown").val()),
			day: $("#day-dropdown").children("option").filter(":selected").text(),
			title: $("#label-textarea").val(),
			color: $("#color-radios > p :checked").attr("id")
		};
		console.log(sendData);
		if (sendData.title !== undefined && sendData.title !== "" && sendData.color !== undefined){
		$.post("/addentry", sendData, function(data){
			if (data.success === true){
				Materialize.toast('Success!', 2500);
				socket.emit('month', g_Month(g_Switch));
				if (sendData.month == g_Month(g_Switch)){
					getEntries();
				}
			} else {
				Materialize.toast('There was an error', 3000);
			}
		});
		
		} else {
			alert("Label and color must be filled out.");
		}
	}

	function clickDelete(){
		$("span.new.badge").click(function () {
			sendData = {
				title : $(this).text()
			};
			$.post("/deleteentry", sendData, function(data){
				if (data.success === true){
					Materialize.toast('Deleted', 1000);
					socket.emit('month', g_Month(g_Switch));
					getEntries();
				} else {
					Materialize.toast('There was an error', 4000);
				}
			});			
		});
	}

	$(window).resize(function() {
		if( (screen.availHeight || screen.height-30) <= window.innerHeight) {
    		$(".card").css("height", "235");
		} else {
			$(".card").css("height", "208");
		}
	});

	function newEntryClick() {
		$('#label-textarea').val("");
		$('#label-textarea').trigger('autoresize');
		$('#modal1').openModal();
		$("#label-textarea").focus();
	}

	//Show current month as the header
	function monthAsHeader(){
		$(".brand-logo").text(function(){
			var n = monthName[g_Month(g_Switch)];
			return n;
		});
	}	

	function populateModal(){
		var i;
		$("#month-dropdown").empty();
		for (i = 0; i < monthName.length; i++) {
			if (i >= g_Month(g_Switch)){
				$("#month-dropdown").append("<option value='" + i + "'>" + monthName[i] + "</option>");
			}
		}
		$("#month-dropdown").val(g_Month(g_Switch));
	}

	//Populate modal day dropdown
	function populateDayDropdown(month){
		$("#day-dropdown").empty();

		if (month === undefined){
			month = g_Month(g_Switch);
		}

		var i, j;
		var numberOfDays = getDaysInMonth(month);

		for(i = 0; i < numberOfDays; i++){
			j = i+1;
			if (getDayOfWeek(j, month) !== 0 && getDayOfWeek(j, month) !== 6){
				$("#day-dropdown").append("<option value='" + i + "'>" + j + "</option>");
			}
		}
		

		$('select').material_select();
	}

	//Change days when a month is selected
	function updateDayDropDown() {
		$("#month-dropdown").change(function(){
			populateDayDropdown(parseInt($("#month-dropdown").val()));
			$('select').material_select();
		});
	}

	function createCards(){
		var j,k;
		var count = 0;

		for (i = 0; i < 5; i++){
			$(".row-template").clone().appendTo(".page-wrapper").removeClass("hide row-template").addClass("new-row");

			for (j = 0; j < 5; j++){
				if (j === 0){
					$(".column-template").clone().appendTo(".new-row:eq("+i+")").removeClass("hide column-template").addClass("new-column");
				} else {
					$(".column-template").clone().appendTo(".new-row:eq("+i+")").removeClass("hide offset-s1 column-template").addClass("new-column");
				}
			}

			for (k = 0; k < 5; k++){
				if ($(".new-card").length < weekdaysInMonth) {
					if (getDayOfWeek(1) <= count+1){
						$(".card-template").clone().appendTo(".new-column:eq("+count+")").removeClass("hide card-template").addClass("new-card");
					} else if (getDayOfWeek(1) === 0 || getDayOfWeek(1) === 6){
						$(".card-template").clone().appendTo(".new-column:eq("+count+")").removeClass("hide card-template").addClass("new-card");
					}
				}
				count++;
			}
		}
	}

	function socketLoad(){
		socket.on('month', function(msg){
			console.log("Change detected");
			if (msg == g_Month(g_Switch)){
				console.log("Change applied");
				getEntries();
			}
		});
	}

	function preventEnter(){
		$('#modal1').keydown(function(e) {
			if(e.keyCode == 13) {
				e.preventDefault();
				modalSendData();
				$('#modal1').closeModal();
			}
		});
	}

	function addTextToCards() {
		$(".card-title").each(function(index){
			$(this).text(weekdaysArr[index-1]);
			$(this).parent().attr("id", weekdaysArr[index-1]);
			if ($(this).text() == g_CurrentDay && g_Month(g_Switch) == g_CurrentMonth){
				$(this).append("<span class='badge'>Today</span>");
			}
		});
	}

	function changeCardHeight(){
		if( (screen.availHeight || screen.height-30) <= window.innerHeight) {
    		$(".card").css("height", "235");
    	}
	}

	function previousClick(){
		if(g_Month(g_Switch) !== 0){
			g_Switch--;
			g_Month(g_Switch);
			$(".new-row").remove();
			getDaysInMonth();
			getWeekDaysInMonth();
			monthAsHeader();
			populateModal();
			populateDayDropdown();
			createCards();
			addTextToCards();
			getEntries();
		}
	}

	function nextClick(){
		if(g_Month(g_Switch) !== 11){
			g_Switch++;
			g_Month(g_Switch);
			$(".new-row").remove();
			getDaysInMonth();
			getWeekDaysInMonth();
			monthAsHeader();
			populateModal();
			populateDayDropdown();
			createCards();
			addTextToCards();
			getEntries();
		}
	}

	function goToCurrentMonth(){
		g_Switch = 0;
		g_Month(g_Switch);
		$(".new-row").remove();
		getDaysInMonth();
		getWeekDaysInMonth();
		monthAsHeader();
		populateModal();
		populateDayDropdown();
		createCards();
		addTextToCards();
		getEntries();
		}

//On page load...
$(function(){

	socketLoad();

	changeCardHeight();

	preventEnter();

	getDaysInMonth();

	getWeekDaysInMonth();
	
	monthAsHeader();

	populateModal();

	populateDayDropdown();

	updateDayDropDown();

	createCards();

	addTextToCards();

	getEntries();
});