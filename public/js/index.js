//Global variables
var g_Month;						//Current month
var g_DaysInMonth;					//Number of days in current month
var g_CurrentDay;					//Current day of the month
var g_CurrentYear;					//Current year
var dateObj = new Date();			//Global date object
var counter;						//Counter for dealing with months that start on a Saturday or Sunday
//On page load...
$(function(){

	//Change card height if fullscreen
	if (window.innerHeight == screen.height) {
		$(".card").css("height", "230");
	}

	//Initialize materialize dropdowns for modal
	$('select').material_select();

//Show current month as the header

	$(".brand-logo").text(function(){
		var d = new Date();
		var month = [];
		month[0] = "January";
		month[1] = "February";
		month[2] = "March";
		month[3] = "April";
		month[4] = "May";
		month[5] = "June";
		month[6] = "July";
		month[7] = "August";
		month[8] = "September";
		month[9] = "October";
		month[10] = "November";
		month[11] = "December";
		var n = month[dateObj.getMonth()];

		//Set the current month... 1 based, ex. 8 = August
		g_Month = dateObj.getMonth() + 1;

		return n;
	});

//Create cards for each day

	//Get number of days in any month... based on one, ex. (8,2016) returns 31 for August
	function daysInMonth(month,year) {
    	return new Date(year, month, 0).getDate();
	}

	//Get the day of the week for any day of the current month and year
	function getDayOfWeek(day) {
		var d = new Date(g_CurrentYear, g_Month - 1, day);
		return d.getDay();
	}

	//Set the current year
	g_CurrentYear = dateObj.getFullYear();
	//Set the current day
	g_CurrentDay = dateObj.getUTCDate();
	//Set the # of days in the current month
	g_DaysInMonth = daysInMonth(g_Month, g_CurrentYear);

	console.log(getDayOfWeek(1));
	//Removes cards for days in the previous month 
	$(".card-title").each(function(index){
		if (getDayOfWeek(1) === 6) {
			if (getDayOfWeek(1) >= index){
				$(this).parent().parent().remove();
			}
		}

		if (getDayOfWeek(1) > index+1){
			$(this).parent().parent().remove();
		}
	});

	$(".card-title").each(function(index){
		//Account for days that start on a Sunday or Saturday
		if (getDayOfWeek(1) === 6){
			counter=3;
		} else if (getDayOfWeek(1) === 0){
			counter=2;
		} else {
			counter=1;
		}
		//Add date number to every card
		$(this).text(index+counter);

		//Hides extra days
		if (index+counter > g_DaysInMonth) {
			$(this).parent().parent().addClass("hide");
		}
		//Add "Today" badge to current day
		if (index+counter == g_CurrentDay){
			$(this).append("<span class='badge'><u>Today</u>");
		}
		console.log(g_DaysInMonth);
	});
	console.log(counter);

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