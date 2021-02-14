var urlBase = 'http://cop4331-15.tech/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function login()
{
	userId = 0;
	firstName = "";
	lastName = "";

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

		userId = jsonObject.id;

		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
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
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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

	document.getElementById("contactAddResult").innerHTML = "";

	var jsonPayload = '{"first" : "' + first + '", "last" : "' + last + '", "phone" : "' + phone + '", "email" : "' + email + '"}';
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
				document.getElementById("contactAddResult").innerHTML = "Contact created successfully.";
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
	var srch = document.getElementById("searchText").value;
	document.getElementById("searchResult").innerHTML = "";

	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/Read.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("searchResult").innerHTML = "User found";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}

}

function deleteContact()
{
	var first = document.getElementById("deleteFirst");
	var last = document.getElementById("deleteLast");

	document.getElementById("contactDeleteResult").innerHTML = "";

	var jsonPayload = '{"first" : "' + first + '", "last" : "' + last + '", "id" : "' + userId + '"}';
	var url = urlBase + '/Delete.' + extension;

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
				document.getElementById("contactDeleteResult").innerHTML = "Contact deleted successfully.";
				window.location.href = "contacts.html";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}

function update()
{
	var first = document.getElementById("updateFirst").value;
	var last = document.getElementById("updateLast").value;
	var phone = document.getElementById("updatePhone").value;
	var email = document.getElementById("updateEmail").value;

	document.getElementById("contactUpdateResult").innerHTML = "";

	var jsonPayload = '{"first" : "' + first + '", "last" : "' + last + '", "phone" : "' + phone + '", "email" : "' + email + '"}';
	var url = urlBase + '/Update.' + extension;

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
				document.getElementById("contactUpdateResult").innerHTML = "Contact updated successfully.";
				window.location.href = "contacts.html";
			}
		};

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}
}
