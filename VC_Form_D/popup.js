chrome.tabs.getSelected(null, function (tab) {
	chrome.tabs.sendMessage(tab.id, { type: 'Give Me Info' }, function (response) {
		if (response) {
			typeOfRound(response);
		}
		else {
			acquisitionResponse()
		}
	});
});


function receivedResponse(response) {
	for (var property in response.info) {
		var text = document.createTextNode(response.info[property]);
		var paragraph = document.createElement("p");
		paragraph.appendChild(text);
		var element = document.getElementsByTagName("body")[0];
		element.appendChild(paragraph);
	}
}

function typeOfRound(response) {
	var roundCat = response.moreInfo.roundType;
	if (roundCat === "equity round") {
		equitySelected(response)
	} else if (roundCat === "debt round") {
		debtSelected(response)
	}
}

function acquisitionResponse() {
	var text0 = document.createTextNode("Not Applicable");
	var paragraph = document.createElement("p");
	paragraph.appendChild(text0);
	var element = document.getElementsByTagName("body")[0];
	element.appendChild(paragraph);
}


function quetionDiv(response) {
	var equityDiv = document.createElement("Div");
	equityDiv.innerHTML = roundQuestion;

	document.getElementById("main").appendChild(equityDiv);
	
	var answerDiv = document.createElement("Div");
	answerDiv.style.width = "400px";
	answerDiv.style.height = "30px";
	document.getElementById("main").appendChild(answerDiv);

	//Buttons
	
	var buttonYes = document.createElement("input");
	buttonYes.setAttribute("id", "buttonYes");
	buttonYes.setAttribute("type", "button");
	buttonYes.setAttribute("value", "Yes");
	answerDiv.appendChild(buttonYes);


	var buttonNo = document.createElement("input");
	buttonNo.setAttribute("id", "buttonNo");
	buttonNo.setAttribute("type", "button");
	buttonNo.setAttribute("value", "No");
	answerDiv.appendChild(buttonNo);

}

function roundTypeDiv(roundType) {
	var roundTypeSection = document.createElement("div")
	roundTypeSection.style.width = "400px";
	roundTypeSection.style.height = "10px";
	roundTypeSection.innerHTML = roundType;
	document.getElementById("round").appendChild(roundTypeSection);

}

function equitySelected(response) {
	roundQuestion = "Has there been prior Venture Capital Rounds? Or Are the any of the below VC investors? " + response.moreInfo.mgmt;
	quetionDiv(response)
	var roundAmount = response.moreInfo.sold.replace(/,/g, "")
	buttonYes.onclick = function () {
		var roundType = "Round Type: Venture Capital";
		roundTypeDiv(roundType);
		receivedResponse(response)
	};
	buttonNo.onclick = function (roundAmount) {
		if (roundAmount >= 10000000) {
			var roundType = "Round Type: Undetermined";
			roundTypeDiv(roundType);
			receivedResponse(response)
		} else {
			var roundType = "Round Type: Angel";
			roundTypeDiv(roundType);
			receivedResponse(response)
		}
	}

}

function debtSelected(response) {
	const closeDate = response.info.date;
	roundQuestion = "Is there an venture capital round less than one year after " + closeDate;
	quetionDiv(response)

	buttonYes.onclick = function () {
		var roundType = "Round Type: Bridge financing in following venture capital round";
		roundTypeDiv(roundType);
		receivedResponse(response)
	};
	buttonNo.onclick = function () {
		const today = Date.now();
		const close = Date.parse(closeDate);
		const yearSinceClose = ((today - close) / 31556952000);
		if (yearSinceClose >= 1) {
			var roundType = "Round Type: Convertible Debt";
			roundTypeDiv(roundType);
			receivedResponse(response)
		} else if (yearSinceClose < 1) {
			var roundType = "Round Type: Bridge financing in new venture capital round";
			roundTypeDiv(roundType);
			receivedResponse(response)
		}
	}
}
