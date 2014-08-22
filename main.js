
var URL = "http://dev.unicrm.dk/";
var content = "content.html";
var index = "index.html";

var isLoggedIn = false;

/* Logs you in to the server */
function login() {
	var e = $('#email').val().trim();
	var p = $('#password').val().trim();
	$.ajax({
		url: URL + 'index.php?option=com_webitall_crm&task=api.login&tmpl=api',
		type: 'GET',
		data: "email=" + e + "&pass=" + p,
		dataType: 'json',

	})
	.done(function(data) {
		console.log("success");
		checkLogin(data);
	})
	.fail(function() {
		console.log("error");
		$('.error').css("color", "red");
		$('.error').html("An error occurred");
	})
	.always(function() {
		console.log("done");
	});
}

function checkLogin(data) {
	console.log("checkLogin invoked");
	console.log("status" + data.status);
	$.each(data, function(index, val) {console.log(val);});
	switch(true) {
			default:
				console.log("default");
				break;
            case (data.status == 1):
        		saveToken(data);
        		if ($('#rEmail').prop('checked', true)) {
        			saveEmail();
        		}
        		console.log("case 1 success");
        		window.location.href = content;
                break;
            case (data.status == -1):
            	console.log("case -1 fail");
                $('.error').html("<p data-localize='wrongPW'>Wrong password</p>");
                break;
            case (data.status == -2):
            	console.log("case -2 fail");
                $('.error').html("<p data-localize='wrongUS'>Wrong username / User does not exist</p>");
                break;
        }
}

/* On app load, checks if you have a valid session on the server */
function checklogin () {
	//TODO make a boolean checking if you have an active session on the server.
}

/* Checks if the token is valid */
function checkToken() {
	var token = window.localStorage.getItem("token");
	$.ajax({
		url: URL + 'index.php?option=com_webitall_crm&task=api.checkToken&tmpl=api',
		type: 'GET',
		data: "token=" + token,
		dataType: 'json',

	})
	.done(function(data) {
		console.log("success");
		checkLogin(data);
	})
	.fail(function() {
		console.log("error");
		$('.error').css("color", "red");
		$('.error').html("An error occurred");
	})
	.always(function() {
		console.log("done");
	});
}

/* Saves the token to localstorage in the browser (NEEDS ENCRYPTION?!) */
function saveToken (data) {
	console.log("savetoken");
	window.localStorage.setItem("token", data.userId + ":" + data.token);
}

/* Gets the token from localstorage */
function getToken () {
	var token = window.localStorage.getItem("token");
}
/* Saves the email to localstorage */
function saveEmail() {
	var email = $('#email').val();
	window.localStorage.setItem("email", email);
	console.log("Email saved as: " + email);
}
/* Creates an activity */
function createActivity () {
	var token = window.localStorage.getItem("token");
	var type = parseInt($('#type').val(), 10);
	var cid = parseInt($('#cid').val(), 10);
	var wid = parseInt($('#wid').val(), 10);
	var date = $('#date').val();
	var time = $('#time').val();
	var estimate = parseInt($('#estimate').val(), 10);
	var name = $('#createActivityName').val();
	var pid = parseInt($('#person').val(), 10);
	var note = $('#createNote').val();
	var prob = $('#createProbability').val();
	var amount = parseInt($('#amount').val(), 10);

	var JSONdata = JSON.stringify({
		type: type,
		contact: cid,
		responsible: wid,
		date: date,
		time: time,
		estimate: estimate,
		name: name,
		person: pid,
		note: note,
		probability: prob,
		amount: amount
	});

	console.log(JSONdata);
	$.ajax({
		url: URL + 'index.php?option=com_webitall_crm&task=api.createActivity&tmpl=api',
		type: 'GET',
		data: "token=" + token + "&data=" + JSONdata,
		dataType: 'json',
		/*async: false,*/

	})
	.done(function(data) {
		console.log("Added activity with : " + JSONdata);
		window.location.href = content;
	})
	.fail(function() {
		console.log("error");
		$('.error').css("color", "red");
		$('.error').html("An error occurred");
	})
	.always(function() {
		console.log("done");
	}); 
}
/* Cancels out of the create activity page */
function cancelCreateActivity () {
	window.location.href = content;
}

/* Gets the activities for the person who is logged in from the server */
function getActivities () {
	console.log("getActivities");
	var token = window.localStorage.getItem("token");
	$.ajax({
		url: URL + 'index.php?option=com_webitall_crm&task=api.getActivities&tmpl=api',
		type: 'GET',
		data: "token=" + token,
		dataType: 'json',

	})
	.done(function(data) {
		$.each(data.activities, function(index, val) {
			setTimeout(function() {
            $('#result').append("<ons-row class='activity-row row ons-row-inner'>" + 
                  "<ons-col width='15%' class='col ons-col-inner type' style='-webkit-box-flex: 0; flex: 0 0 15%; max-width: 15%; padding:5px;'>" +
                    val.type +
                  "</ons-col>" + 
                  "<ons-col width='30%' class='col ons-col-inner' style='-webkit-box-flex: 0; flex: 0 0 30%; max-width: 30%; padding:5px;'>" + 
                    val.date + "</br>" + val.time + 
                  "</ons-col>" + 
                  "<ons-col width='55%' class='col ons-col-inner' style='-webkit-box-flex: 0; flex: 0 0 55%; max-width: 55%; padding:5px;'>" + 
                    val.company + "</br>" + val.text + 
                  "</ons-col>" + 
                "</ons-row>");

				$(".type:contains('1')").html("<span class='label label-today'><i class='fa fa-phone fa-fw'></i></span>");
				$(".type:contains('2')").html("<span class='label label-today'><i class='fa fa-envelope fa-fw'></i></span>");
				$(".type:contains('3')").html("<span class='label label-today'><i class='fa fa-reply fa-fw'></i></span>");
				$(".type:contains('4')").html("<span class='label label-today'><i class='fa fa-users fa-fw'></i></span>");
				$(".type:contains('5')").html("<span class='label label-today'><i class='fa fa-paperclip fa-fw'></i></span>");
				$(".type:contains('6')").html("<span class='label label-today'><i class='fa fa-pencil-square-o fa-fw'></i></span>");
			}, 0);
		});
		
		console.log(data.status + " " + data.activities);
	})
	.fail(function() {
		console.log("error");
		$('.error').css("color", "red");
		$('.error').html("An error occurred");
	})
	.always(function() {
		fadeOutOverlay();
		console.log("done");
	});
}
/* Gets the contacts from the server */
function getContacts () {
	console.log("getContacts");
	var token = window.localStorage.getItem("token");
	$.ajax({
		url: URL + 'index.php?option=com_webitall_crm&task=api.getContacts&tmpl=api',
		type: 'GET',
		data: "full=0&token=" + token,
		dataType: 'json',
		/*async: false,*/

	})
	.done(function(data) {
		$.each(data.contacts, function(index, val) {
			setTimeout(function() {
				var cid = $('#cid');
				cid.append($("<option />").val(val.id).text(val.name));
			}, 0);
		});
		
		console.log(data.status + " " + data.contacts);
	})
	.fail(function() {
		console.log("error");
		$('.error').css("color", "red");
		$('.error').html("An error occurred");
	})
	.always(function() {
		console.log("done");
	});
}

/* Get full contact info */
function getContactsFull () {
	console.log("getContactsFull");
	var token = window.localStorage.getItem("token");
	$.ajax({
		url: URL + 'index.php?option=com_webitall_crm&task=api.getContacts&tmpl=api',
		type: 'GET',
		data: "full=1&token=" + token,
		dataType: 'json',
		/*async: false,*/

	})
	.done(function(data) {
		$(".error").html("");
		$.each(data.contacts, function(index, val) {
			switch(true) {
            case (!val.phone):
            console.log("Phone does not exist");
			$("#result").append("<ons-row class='activity-row row ons-row-inner'>" +
                "<ons-row class='row ons-row-inner'><ons-col width='55%' class='col ons-col-inner' style='-webkit-box-flex: 0; flex: 0 0 55%; max-width: 55%; align-self: flex-end; font-weight:bold; padding-right: 10px;'>" + val.name + "</ons-col>" +
              	"<ons-col width='45%' style='margin-bottom: 15px; -webkit-box-flex: 0; flex: 0 0 45%; max-width: 45%; align-self: flex-end;' class='col ons-col-inner'></ons-col></ons-row>" +
                "<ons-col width='55%' class='col ons-col-inner' style='-webkit-box-flex: 0; flex: 0 0 55%; max-width: 55%; align-self: flex-end;'></ons-col>" +
              	"<ons-col width='45%' class='col ons-col-inner' style='-webkit-box-flex: 0; flex: 0 0 45%; max-width: 45%; align-self: flex-end;'><a href='mailto:" + val.email + "' style='text-decoration: blink;'><span class='label label-blue label-contact'><icon class='fa fa-envelope-square fa-lg fa-fw'></icon>Send email</span></a></ons-col></ons-row>");
                break;
            case (!val.email):
            console.log("Email does not exist");
			$("#result").append("<ons-row class='activity-row row ons-row-inner'>" +
                "<ons-row class='row ons-row-inner'><ons-col width='55%' class='col ons-col-inner' style='-webkit-box-flex: 0; flex: 0 0 55%; max-width: 55%; align-self: flex-end; font-weight:bold; padding-right: 10px;'>" + val.name + "</ons-col>" +
              	"<ons-col width='45%' style='margin-bottom: 15px; -webkit-box-flex: 0; flex: 0 0 45%; max-width: 45%; align-self: flex-start;' class='col ons-col-inner'><a href='tel:" + val.phone + "' style='text-decoration: blink;'><span class='label label-success label-contact'><icon class='fa fa-phone fa-lg fa-fw'></icon>Call contact</span></a></ons-col></ons-row>" +
                "<ons-col width='55%' class='col ons-col-inner' style='-webkit-box-flex: 0; flex: 0 0 55%; max-width: 55%; align-self: flex-end;'></ons-col>" +
              	"<ons-col width='45%' class='col ons-col-inner' style='-webkit-box-flex: 0; flex: 0 0 45%; max-width: 45%; align-self: flex-end;'></ons-col></ons-row>");
                break;
            default:
            console.log("Both exist");
			$("#result").append("<ons-row class='activity-row row ons-row-inner'>" +
                "<ons-row class='row ons-row-inner'><ons-col width='55%' class='col ons-col-inner' style='-webkit-box-flex: 0; flex: 0 0 55%; max-width: 55%; align-self: flex-end; font-weight:bold; padding-right: 10px;'>" + val.name + "</ons-col>" +
              	"<ons-col width='45%' style='margin-bottom: 15px; -webkit-box-flex: 0; flex: 0 0 45%; max-width: 45%; align-self: flex-end;' class='col ons-col-inner'><a href='tel:31951115' style='text-decoration: blink;'><span class='label label-success label-contact'><icon class='fa fa-phone fa-lg fa-fw'></icon>Call contact</span></a></ons-col></ons-row>" +
                "<ons-col width='55%' class='col ons-col-inner' style='-webkit-box-flex: 0; flex: 0 0 55%; max-width: 55%; align-self: flex-end;'></ons-col>" +
              	"<ons-col width='45%' class='col ons-col-inner' style='-webkit-box-flex: 0; flex: 0 0 45%; max-width: 45%; align-self: flex-end;'><a href='mailto:" + val.email + "' style='text-decoration: blink;'><span class='label label-blue label-contact'><icon class='fa fa-envelope-square fa-lg fa-fw'></icon>Send email</span></a></ons-col></ons-row>");
                break;
        	}
		});
	})
	.fail(function() {
		console.log("error");
		$('.error').css("color", "red");
		$('.error').html("An error occurred");
	})
	.always(function() {
		fadeOutOverlay();
		console.log("done");
	});
}

/* Gets the persons from the server */
function getPersons() {
	console.log("getPersons");
	var id = $('#cid').val();
	var token = window.localStorage.getItem("token");
	$.ajax({
		url: URL + 'index.php?option=com_webitall_crm&task=api.getPersons&tmpl=api',
		type: 'GET',
		data: "contact=" + id + "&full=0&token=" + token,
		dataType: 'json',
		/*async: false,*/

	})
	.done(function(data) {
		$('#person').empty();
		$.each(data.persons, function(index, val) {
			setTimeout(function() {
				var persons = $('#person');
				persons.append($("<option />").val(val.id).text(val.name));
			}, 0);
		});
	})
	.fail(function() {
		console.log("error");
		$('.error').css("color", "red");
		$('.error').html("An error occurred");
	})
	.always(function() {
		console.log("done");
	});
}

/* Gets the persons with their full information from the server */
function getPersonsFull() {
	//TODO
}

/* Get contacts by ID */
function getContactsById () {
	console.log("getContacts");
	var id = $('#cid').val();
	console.log("Your selected id is: " + id);
}

/* Gets the details of the activity you've clicked on */
function getActivityDetails () {
	var token = window.localStorage.getItem("token");
	$.ajax({
		url: URL + 'index.php?option=com_webitall_crm&task=api.getActivities&tmpl=api',
		type: 'GET',
		data: "token=" + token,
		dataType: 'json',

	})
	.done(function(data) {
		$.each(data.activities, function(index, val) {
			$('#result').append("<div class='col-xs-3'><b>Type:</b> </div><div class='col-xs-9'>" + val.type + "</div>");
			$('#result').append("<div class='col-xs-3'><b>Dato:</b> </div><div class='col-xs-9'>" + val.date + "</div>");
			$('#result').append("<div class='col-xs-3'><b>Tidspunkt:</b> </div><div class='col-xs-9'>" + val.time + "</div>");
			$('#result').append("<div class='col-xs-3'><b>Virksomhed:</b> </div><div class='col-xs-9'>" + val.company + "</div>");
			$('#result').append("<div class='col-xs-3'><b>Note:</b> </div><div class='col-xs-9'>" + val.text + "</div>");
		});
		
		console.log(data.status + " " + data.activities);
	})
	.fail(function() {
		console.log("error");
		$('.error').css("color", "red");
		$('.error').html("An error occurred");
	})
	.always(function() {
		console.log("done");
	});
}
/* Gets the types */
function getType () {
	console.log("getType");
	var token = window.localStorage.getItem("token");
	$.ajax({
		url: URL + 'index.php?option=com_webitall_crm&task=api.getTypes&tmpl=api',
		type: 'GET',
		data: "token=" + token,
		dataType: 'json',
		/*async: false,*/

	})
	.done(function(data) {
		$('#type').empty();
		$.each(data.types, function(index, val) {
			setTimeout(function() {
				var type = $('#type');
				type.append($("<option />").val(index).text(val));
			}, 0);
		});
	})
	.fail(function() {
		console.log("error");
		$('.error').css("color", "red");
		$('.error').html("An error occurred");
	})
	.always(function() {
		console.log("done");
	});
}

function getEmployees () {
	console.log("getEmployees");
	var token = window.localStorage.getItem("token");
	$.ajax({
		url: URL + 'index.php?option=com_webitall_crm&task=api.getEmployees&tmpl=api',
		type: 'GET',
		data: "token=" + token,
		dataType: 'json',
		/*async: false,*/

	})
	.done(function(data) {
		$('#wid').empty();
		$.each(data.employees, function(index, val) {
			setTimeout(function() {
				var employees = $('#wid');
				employees.append($("<option />").val(val.id).text(val.name));
			}, 0);
		});
	})
	.fail(function() {
		console.log("error");
		$('.error').css("color", "red");
		$('.error').html("An error occurred");
	})
	.always(function() {
		fadeOutOverlay();
		console.log("done");
	});
}

/* LANGUAGES */

function chLang () {
	// TODO Switch case
}

function chlangDK () {
	console.log("chLangDK");
	var lang = "da";
	$(function(){
        var opts = { language: lang, pathPrefix: "languages"};
		$("[data-localize]").localize("lang", opts)
	})
	saveLang(lang);
}

function chlangEN () {
	console.log("chLangEN");
	var lang = "en";
	$(function(){
        var opts = { language: lang, pathPrefix: "languages"};
		$("[data-localize]").localize("lang", opts)
	})
	saveLang(lang);
}

function saveLang (flag) {
	var lang = window.localStorage.setItem("lang" , flag);
	console.log("Language saved: " + window.localStorage.getItem("lang"));
}

function getLang () {
	var lang = window.localStorage.getItem("lang");
	$(function(){
        var opts = { language: lang, pathPrefix: "languages"};
		$("[data-localize]").localize("lang", opts)
	})
	console.log("Language is now: " + window.localStorage.getItem("lang"));
}

/* If there is an email saved in localstorage, this will place it in the field */
function setUp () {
	/*if(localStorage.getItem("token") != null){
		console.log("if");
		checkToken();
	}
	else {*/
		console.log("else");
		var email = window.localStorage.getItem("email");
		$('#email').val(email);
	/*}*/
}

/* Function for the create activity page, to get contacts, employees and type from the db, and populate the drop down lists */
function createPage () {
	getContacts();
	getType();
	getEmployees();
	changePage();
}

function contactPage () {
	getContactsFull();
	changePage();
}

/* To make translations possible, delay the getLang function */
function changePage () {
	setTimeout(function() {
		getLang();
	}, 0);
}
/* Checks the date, and outputs the right icon labels */
function checkDate () {
	//TODO check the current date, and alter the css classes on the icon labels to reflect the correct icon colors */
}


function fadeOutOverlay () {
	$('.overlay-wrapper').fadeOut(200, function() {
		$('.overlay-wrapper').remove();
	});
}