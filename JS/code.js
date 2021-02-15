var urlBase = 'http://cop4331-15.tech/LAMPAPI';
var extension = 'php';

var userId = 0;
var contactid = 0;
var firstName = "";
var lastName = "";

function login()
{
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"email" : "' + login + '", "password" : "' + hash + '"}';
	var url = urlBase + '/Login.' + extension;

	console.log(jsonPayload);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

		userId = jsonObject.message.id;

		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.message.first_name;
		lastName = jsonObject.message.last_name;

		saveCookie();

		window.location.href = "contacts.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function register()
{
	{
		var login = document.getElementById("registerEmail").value;
		var password = document.getElementById("registerPassword").value;
		var first = document.getElementById("registerFirst").value;
		var last = document.getElementById("registerLast").value;
		var hash = md5( password );

		document.getElementById("registerResult").innerHTML = "";

		var jsonPayload = '{"password" : "' + hash + '", "firstname" : "' + first + '", "lastname" : "' + last + '", "email" : "' + login + '"}';
		var url = urlBase + '/Register.' + extension;

		console.log(jsonPayload);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, false);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.send(jsonPayload);

			var jsonObject = JSON.parse(xhr.responseText);

			window.location.href = "index.html";
		}
		catch(err)
		{
			document.getElementById("registerResult").innerHTML = err.message;
		}
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",contactid=" + contactid + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
		else if( tokens[0] == "contactid" )
		{
			contactid = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		// document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function Logout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function create()
{
	var first = document.getElementById("createFirst").value;
	var last = document.getElementById("createLast").value;
	var phone = document.getElementById("createPhone").value;
	var email = document.getElementById("createEmail").value;

	readCookie();

	document.getElementById("contactAddResult").innerHTML = "";

	var jsonPayload = '{"id" : "' + userId + '", "first" : "' + first + '", "last" : "' + last + '", "email" : "' + email + '", "phone" : "' + phone + '"}';
	var url = urlBase + '/Create.' + extension;

	console.log(jsonPayload);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				window.location.href = "contacts.html";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function cancel()
{
	window.location.href = "contacts.html";
}

function newContact()
{
	window.location.href = "add.html";
}

function search()
{
	delTable();
	var srch = document.getElementById("searchText").value;
	document.getElementById("searchResult").innerHTML = "";
	var contactList = [];

	readCookie();

	var jsonPayload = '{"search" : "' + srch + '","id" : ' + userId + '}';
	var url = urlBase + '/Read.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
			xhr.send(jsonPayload);
			var jsonResponse = JSON.parse(xhr.responseText);

			contactList = jsonResponse.message;
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
	if (contactList != "No Contacts Found") { 
		displaySearch(contactList);
	}
}

function insRow(row, row2, id)
{
  	var x = document.getElementById('contactTable');
 	var row1 = x.insertRow(-1);
  	var cell1 = row1.insertCell(0);
 	var cell2 = row1.insertCell(1);
  	cell1.innerHTML = row;
  	cell2.innerHTML = row2;
	cell1.addEventListener('click', function() {gotoUpdate(id)});
	cell2.addEventListener('click', function() {gotoUpdate(id)});
}

function gotoUpdate(id) {
	contactid = id;
	saveCookie();
	window.location.href = "update.html";
}

function loadUpdate() {
	readCookie();
	var result = readResult(contactid);
	document.getElementById("upFirst").value = result.first_name;
	document.getElementById("upLast").value = result.last_name;
	document.getElementById("upEmail").value = result.email;
	document.getElementById("upPhone").value = result.phone;
}

function delTable()
{
	var x = document.getElementById('contactTable');
	while (x.rows.length > 1) {
		x.deleteRow(1);
	}
}

function displaySearch(obj)
{
	for (var i=0; i<obj.length; i++)
	{
		var result = readResult(obj[i].id);
		insRow(result.first_name, result.last_name, obj[i].id);
	}
}

function readResult(id)
{
	var jsonPayload = '{"id" : "' + id + '"}';
	var url = urlBase + '/Readone.' + extension;

	console.log(jsonPayload);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(xhr.responseText);

		return jsonObject.message;
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
}

function deleteContact()
{
	readCookie();

	document.getElementById("upResult").innerHTML = "";

	var jsonPayload = '{"id" : "' + contactid + '"}';
	var url = urlBase + '/Delete.' + extension;

	console.log(jsonPayload);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(xhr.responseText);

		window.location.href = "contacts.html";
	}
	catch(err)
	{
		document.getElementById("upResult").innerHTML = err.message;
	}
}

function update()
{
	var first = document.getElementById("upFirst").value;
	var last = document.getElementById("upLast").value;
	var phone = document.getElementById("upPhone").value;
	var email = document.getElementById("upEmail").value;

	readCookie();

	document.getElementById("upResult").innerHTML = "";

	var jsonPayload = '{"id" : "' + contactid + '", "firstname" : "' + first + '", "lastname" : "' + last + '", "phone" : "' + phone + '", "email" : "' + email + '"}';
	var url = urlBase + '/Update.' + extension;

	console.log(jsonPayload);
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(xhr.responseText);

		window.location.href = "contacts.html";
	}
	catch(err)
	{
		document.getElementById("upResult").innerHTML = err.message;
	}
}
