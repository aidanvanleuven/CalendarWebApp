//Global variables -- based on current date
var g_Month = moment().month();								//Current month; zero based
var g_DaysInMonth = moment().daysInMonth();					//Number of days in current month
var g_CurrentDay = moment().date();							//Current day of the month
var g_CurrentYear = moment().year();						//Current year
var weekdaysArr = [];
var weekdaysInMonth;



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

//On page load...
$(function(){
	var monthName = [];

	//Change card height if fullscreen
	if (window.innerHeight == screen.height) {
		$(".card").css("height", "235");
	}

	//Show current month as the header and set month name array
	function monthAsHeader(){
		$(".brand-logo").text(function(){
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
			var n = monthName[g_Month];

			return n;
		});
	}	
	monthAsHeader();

	//Populate modal month dropdown
	function populateModal(){
		var i;
		for (i = 0; i < monthName.length; i++) {
			$("#month-dropdown").append("<option value='" + i + "'>" + monthName[i] + "</option>");
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

		var i;
		var numberOfDays = getDaysInMonth(month);

		for(i = 0; i < numberOfDays; i++){
			var j = i+1;
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

	
	////Create cards for each day... so fucking hacky... definitely not the right way to do this
	///jQuery madness
	//Beware of dragons

	function getWeekDaysInMonth(){
		for (i = 1; i <= numberOfDays; i++){
			if (getDayOfWeek(i) !== 0 && getDayOfWeek(i) !== 6){
				console.log(getDayOfWeek(i));
				weekdaysArr.push(i);
			}
		}
		weekdaysInMonth = weekdaysArr.length;
	}
	getWeekDaysInMonth();

	console.log(weekdaysInMonth);



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

	function addTextToCards() {
		$(".card-title").each(function(index){
			$(this).text(weekdaysArr[index-1]);
			$(this).attr("id", weekdaysArr[index-1]);
			if (weekdaysArr[index-1] === g_CurrentDay){
				$(this).append("<span class='badge'>Today</span>");
			}
		});
	}
	addTextToCards();

	

});

//Handle color change on hover for badges
$("span.badge.new").hover(
	function () {
		$(this).addClass("darken-2");
	},
	function() {
		$(this).removeClass("darken-2");
	}
);