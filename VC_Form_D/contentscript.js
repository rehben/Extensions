//PARSING

//Start Dates
function startDate(yearIncorporation) {

	incorporation = [];

	for (i = 1; i <= yearIncorporation.length; i += 2) {
		nameIncorporation = jQuery(yearIncorporation[i]).html();
		isCheckedIncorp = jQuery(yearIncorporation[i - 1]).children().length == 1;
		incorporation[nameIncorporation] = isCheckedIncorp;
	}
	return incorporation;
}

yearIncorporation = jQuery("[summary='Year of Incorporation/Organization']").find("td");
incorporation = startDate(yearIncorporation);

//directors

function directors(findMgmtNames, position) {
	mgmtPosition = [];

	for (i = 0; i <= findMgmtNames.length - 1; i++) {
		const info = {};
		firstName = jQuery(jQuery(jQuery(findMgmtNames[i]).find("tr")[1]).children()[1]).html();
		lastName = jQuery(jQuery(jQuery(findMgmtNames[i]).find("tr")[1]).children()[0]).html();

		info.name = firstName + " " + lastName;

		for (j = 1; j <= 5; j += 2) {
			positionName = jQuery(jQuery(position[i]).find("td")[j]).html();
			positionChecked = jQuery(jQuery(position[i]).find("td")[j - 1]).children().length == 1;
			info[positionName] = positionChecked;

		}
		mgmtPosition.push(info);
	}
	return mgmtPosition
}

findMgmtNames = jQuery("[summary='Related Persons']");
position = jQuery("[summary='Relationship of Person']");
mgmtPosition = directors(findMgmtNames, position)


directorsNames = mgmtPosition.filter(directorFilter).map(obj => obj.name);

function directorFilter(mgmt) {
	return mgmt["Director"] && (!mgmt["Executive Officer"] && !mgmt["Promoter"])

}


console.log(directorsNames);
//Security Types
function getSecurities(securitiesTds) {

	securities = [];

	for (i = 1; i <= securitiesTds.length - 2; i += 2) {
		name = jQuery(securitiesTds[i]).html();
		isChecked = jQuery(securitiesTds[i - 1]).children().length == 1;
		securities[name] = isChecked;
	}

	return securities;
}

securitiesTds = jQuery("[summary='Types of Securities Offered']").find("td");
securities = getSecurities(securitiesTds);
console.log(securities);
securitiesOther = jQuery(securitiesTds[17]);


notAcquisition = jQuery(jQuery("[summary='Business Combination Transaction']").find("td")[5]).children().length == 1;

function subRoundType() {
	if (securities["Equity"]) {
		return "equity round";
	} else if (!securities["Equity"] && (securities["Debt"] || securities["Option, Warrant or Other Right to Acquire Another Security"]
		|| securities["Security to be Acquired Upon Exercise of Option, Warrant or Other Right to Acquire Security"])) {
		return "debt round";
	} else {
		return "unknown";
	}
}

//Round Amounts
function salesAmounts(saleTd) {
	return jQuery(jQuery(jQuery("[summary='Offering and Sales Amounts']").find("td")[saleTd]).children()[1]).text()
}
roundAmount = salesAmounts(8);
offerAmount = salesAmounts(1);

leadMGMT = jQuery(jQuery("[summary='Signature Block']").find("td")[2]).text();
leadMGMTTitle = jQuery(jQuery("[summary='Signature Block']").find("td")[3]).text();
closeDate = jQuery(jQuery("[summary='Signature Block']").find("td")[4]).text();


function findTd(sectionSummary, tdNumber) {
	jQuery(sectionSummary).find("td")[tdNumber]
}

notAcquisitionTest = jQuery(findTd([summary = 'Business Combination Transaction'], 5)).children.length == 1;


var generalInfo = { amount: "Round Amount: $" + roundAmount, date: "Close Date: " + closeDate, Signer: "Lead Management: " + leadMGMT + ", " + leadMGMTTitle }
if (securitiesOther.text()) {
	response.secOther = "Other Round Information: " + securitiesOther.text();
}

var otherInfo = { roundType: subRoundType(), sold: roundAmount, offer: offerAmount, mgmt: directorsNames };

var response = { info: generalInfo, moreInfo: otherInfo };

for (var subResponse in generalInfo) {
	console.log(subResponse);

};


chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (!notAcquisition) {
			sendResponse(null);
		}
		else
			sendResponse(response);
	});

