//Global variables (ugh) -- based on current date
var g_Month = moment().month();								//Current month; zero based
var g_DaysInMonth = moment().daysInMonth();					//Number of days in current month
var g_CurrentDay = moment().date();							//Current day of the month
var g_CurrentYear = moment().year();						//Current year
var weekdaysArr = [];										//Array solely for the purpose of calulating weekdaysInMonth
var weekdaysInMonth;										//Number of weekdays (M-F) in the current month
var monthName = [];											//Array containing the names of each month; monthName[0] returns January
var entries = [];											//Array containing all entries in the current month

monthName[0] = "January";
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
			month = g_Month;
		}
		if (year === undefined){
			year = g_CurrentYear;
		}
		var a = month+1;
		var b = year;
		a.toString();
		b.toString();
		var parse = a+"-"+b;
		return moment(parse,"M-YYYY").daysInMonth();
	}

	var numberOfDays = getDaysInMonth();

	//Get the day of the week for any day and month; day is one based, month is zero based
	function getDayOfWeek(day, month){
		if (day === undefined){
			day = g_CurrentDay;
		}
		if (month === undefined){
			month = g_Month;
		}

		var a = day;
		var b = month+1;
		a.toString();
		b.toString();
		var parse = a+"-"+b;
		return moment(parse, "D-M").day();
	}

	function getWeekDaysInMonth(){
		for (i = 1; i <= numberOfDays; i++){
			if (getDayOfWeek(i) !== 0 && getDayOfWeek(i) !== 6){
				weekdaysArr.push(i);
			}
		}
		weekdaysInMonth = weekdaysArr.length;
	}
	getWeekDaysInMonth();

	//Get all entries for the current month
	function getEntries() {
		var sendData = {
			month: g_Month
		};
		console.log(sendData);
		$.post("/getentries", sendData, function (data){
			entries = data;
			console.log(entries);
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
		hoverEffect();
		clickDelete();
	}

	function modalSendData(){
		var sendData = {
			month: parseInt($("#month-dropdown").val()),
			day: parseInt($("#day-dropdown").val()) + 1,
			title: $("#label-textarea").val(),
			color: $("#color-radios > p :checked").attr("id")
		};
		if (sendData.title !== undefined && sendData.title !== "" && sendData.color !== undefined){
		$.post("/addentry", sendData, function(data){
			if (data.success === true){
				Materialize.toast('Success!', 2500);
				socket.emit('success', true);
				getEntries();
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
				month : g_Month.toString(),
				day : $(this).parent().parent().parent().attr("id"),
				title : $(this).text(),
			};
			console.log(sendData);
			$.post("/deleteentry", sendData, function(data){
				if (data.success === true){
					Materialize.toast('Deleted', 1000);
					socket.emit('success', true);
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
	}

//On page load...
$(function(){


	socket.on('refresh', function(){
		getEntries();
	});

	if( (screen.availHeight || screen.height-30) <= window.innerHeight) {
    		$(".card").css("height", "235");
    }


	//Prevent newline on textarea... submit form instead
	$('#modal1').keydown(function(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			modalSendData();
			$('#modal1').closeModal();
		}
	});

	if( (screen.availHeight || screen.height-30) <= window.innerHeight) {
    		$(".card").css("height", "235");
    }

	getEntries();

	//Show current month as the header
	function monthAsHeader(){
		$(".brand-logo").text(function(){
			var n = monthName[g_Month];
			return n;
		});
	}	
	monthAsHeader();

	//Populate modal month dropdown
	function populateModal(){
		var i;
		for (i = 0; i < monthName.length; i++) {
			if (i >= g_Month){
				$("#month-dropdown").append("<option value='" + i + "'>" + monthName[i] + "</option>");
			}
		}
		$("#month-dropdown").val(g_Month);
	}
	populateModal();


	//Populate modal day dropdown
	function populateDayDropdown(month){
		$("#day-dropdown").empty();

		if (month === undefined){
			month = g_Month;
		}

		var i, j;
		var numberOfDays = getDaysInMonth(month);

		for(i = 0; i < numberOfDays; i++){
			j = i+1;
			if (getDayOfWeek(j) !== 0 && getDayOfWeek(j, month) !== 6){
				$("#day-dropdown").append("<option value='" + i + "'>" + j + "</option>");
			}
		}
		if (month == g_Month){
			$("#day-dropdown").val(g_CurrentDay-1);
		} else {
			$("#day-dropdown").val(0);
		}

		$('select').material_select();
	}
	populateDayDropdown();

	//Change days when a month is selected
	function updateDayDropDown() {
		$("#month-dropdown").change(function(){
			populateDayDropdown(parseInt($("#month-dropdown").val()));
			$('select').material_select();
		});
	}
	updateDayDropDown();

	
	///Create cards for each day... a little weird but it works
	//Be wary

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
	createCards();

	//Adds text and the "Today" badge to the cards
	function addTextToCards() {
		$(".card-title").each(function(index){
			$(this).text(weekdaysArr[index-1]);
			$(this).parent().attr("id", weekdaysArr[index-1]);
			if (weekdaysArr[index-1] === g_CurrentDay){
				$(this).append("<span class='badge'>Today</span>");
			}
		});
	}
	addTextToCards();

});