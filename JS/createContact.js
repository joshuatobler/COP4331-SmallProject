var urlBase = 'cop4331-15.tech';
var extension = 'php';

function createContact()
{
	var first = document.getElementById("createFirst");
	var last = document.getElementById("createLast");
	var phone = document.getElementById("createPhone");
	var address = document.getElementById("createAddress");

	document.getElementById("").innerHTML = "";

	var jsonPayload = '{"first" : "' + first + '", "last" : "' + last + '", "phone" : "' + phone + '", "address" : "' + address + '"}';

	var url = urlBase + '/Add.' + extension;

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
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
}
