//Variables
var g_CurrentMonth = moment().month();

//Get the month the user is currently on, always pass g_Switch, not ideal anymore, but I don't want to fix
var g_Month = function(add) {
	return moment().add(add, "months").month();
};

//Array containing the names of each month; monthName[0] returns January
var monthName = [
"January", "February", "March", "April", "May", "June", "July", 
"August", "September", "October", "November", "December" ];

var g_Switch = 0;											//Used for changing the user month
var g_CurrentDay = moment().date();							//Current day of the month
var g_CurrentYear = moment().year();						//Current year
var weekdaysArr = [];										//Array solely for the purpose of calulating weekdaysInMonth
var weekdaysInMonth;										//Number of weekdays (M-F) in the current month
var entries = [];											//Array containing all entries in the current month
var numberOfDays;											//# of days in users's month
var socket = io();											//Socket.io, baby


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

	//Gets all weekdays in the month for weekdaysArr, and gives the number as weekDaysInMonth
	function getWeekDaysInMonth(){
		weekdaysArr = [];
		for (i = 1; i <= numberOfDays; i++){
			if (getDayOfWeek(i) !== 0 && getDayOfWeek(i) !== 6){
				weekdaysArr.push(i);
			}
		}
		weekdaysInMonth = weekdaysArr.length;
	}

	//Get all entries for the users current month
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

	//Add badges to the cards... a bit weird...
	//NEVER create a function inside a for loop
	function addEntriesToCards() {
		$(".entry-space").empty();
		for (i = 0; i < entries.length; i++){
			$(".card-content").each(function(index){		//Whoops
				if ($(this).attr("id") == entries[i].day){
					$(this).children(".entry-space").append(
						"<a><span class='new badge "+entries[i].color+ " "+"darken-1"+"' data-badge-caption=''>"+entries[i].title+"</span></a><br>"
					);
				}
			});
		}
		clickDelete();
		hoverEffect();
	}

	//Launched on modal submit; Sends data to the server
	function modalSendData(){
		var sendData = {
			month: parseInt($("#month-dropdown").val()),
			day: $("#day-dropdown").children("option").filter(":selected").text(),
			title: $("#label-textarea").val(),
			color: $("#color-radios > p :checked").attr("id")
		};
		if (sendData.title !== undefined && sendData.title !== "" && sendData.color !== undefined){
		$.post("/addentry", sendData, function(data){
			if (data.success === true){
				Materialize.toast('Success!', 2500);
				socket.emit('month', sendData.month);
			} else {
				Materialize.toast('There was an error', 3000);
			}
		});
		
		} else {
			alert("Label and color must be filled out.");
		}
	}

	//Launched on badge click, deletes whichever one was clicked
	function clickDelete(){
		$("span.new.badge").click(function () {
			sendData = {
				title : $(this).text()
			};
			$.post("/deleteentry", sendData, function(data){
				if (data.success === true){
					Materialize.toast('Deleted', 1000);
					socket.emit('month', g_Month(g_Switch));
				} else {
					Materialize.toast('There was an error', 4000);
				}
			});			
		});
	}

	//Change card height if the window is resized... wrap this in a function later
	$(window).resize(function() {
		if( (screen.availHeight || screen.height-30) <= window.innerHeight) {
    		$(".card").css("height", "235");
		} else {
			$(".card").css("height", "208");
		}
	});

	//Launches when "New Entry" is clicked, opens the modal etc.
	function newEntryClick() {
		$('#label-textarea').val("");
		$('#label-textarea').trigger('autoresize');
		$('#modal1').openModal();
		$("#label-textarea").focus();
	}

	//Show current users month as the header
	function monthAsHeader(){
		$(".brand-logo").text(function(){
			var n = monthName[g_Month(g_Switch)];
			return n;
		});
	}	

	//Populates the "Month" dropdown in the modal
	function populateModal(){
		var i;
		$("#month-dropdown").empty();
		for (i = 0; i < monthName.length; i++) {
			if (i >= g_CurrentMonth){
				$("#month-dropdown").append("<option value='" + i + "'>" + monthName[i] + "</option>");
			}
		}
		$("#month-dropdown").val(g_Month(g_Switch));
	}

	//Populates the "Day" dropdown in the modal
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

	//Changes the "Day" dropdown when a month is selected
	function updateDayDropDown() {
		$("#month-dropdown").change(function(){
			populateDayDropdown(parseInt($("#month-dropdown").val()));
			$('select').material_select();
		});
	}

	//Dynamically adds cards to the page based on a ton of variables; Animates cards
	//So portable :')
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
						$(".card-template").clone().appendTo(".new-column:eq("+count+")").removeClass("hide card-template").addClass("new-card animated");
					} else if (getDayOfWeek(1) === 0 || getDayOfWeek(1) === 6){
						$(".card-template").clone().appendTo(".new-column:eq("+count+")").removeClass("hide card-template").addClass("new-card animated");

					}
				}
				count++;
			}
		}
		$(".new-card").addClass("zoomIn");
	}

	//Refreshes entries if another user has made a 'destructive' change
	function socketLoad(){
		socket.on('month', function(msg){
			if (msg == g_Month(g_Switch)){
				getEntries();
			}
		});
	}

	//Sends the modal data on enter
	function preventEnter(){
		$('#modal1').keydown(function(e) {
			if(e.keyCode == 13) {
				e.preventDefault();
				modalSendData();
				$('#modal1').closeModal();
			}
		});
	}

	//Adds the labels to each card
	function addTextToCards() {
		$(".card-title").each(function(index){
			$(this).text(weekdaysArr[index-1]);
			$(this).parent().attr("id", weekdaysArr[index-1]);
			if ($(this).text() == g_CurrentDay && g_Month(g_Switch) == g_CurrentMonth){
				$(this).append("<span class='badge'>Today</span>");
			}
		});
	}

	//Changes card height if fullscreen
	function changeCardHeight(){
		if( (screen.availHeight || screen.height-30) <= window.innerHeight) {
    		$(".card").css("height", "235");
    	}
	}

	//Button "Previous Month" is clicked, basically reload the page but on the previous month
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

	//Button "Next Month" is clicked, basically reload the page but on the next month
	function nextClick(){
		if(g_Month(g_Switch) !== 11){
			g_Switch++;
			g_Month(g_Switch);
			$(".new-card").addClass("fadeOutLeft");
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

	//Month header is clicked, same as above except it brings you to the current month
	function goToCurrentMonth(){
		g_Switch = 0;
		g_Month(g_Switch);
		$(".new-card").addClass("fadeOutRight");
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

	//Put it all together!
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