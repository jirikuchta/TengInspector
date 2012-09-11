/**
 * posluchac na pozadavky vyvolane uvnitr rozsireni
 */
chrome.extension.onRequest.addListener(function (request, sender, callback) {
	var action = request.action;

	switch (action) {
		case 'setSidebarWidth': // ulozeni sirky sidebaru do local storage
			localStorage.sidebarWidth = request.width;
			break;
		case 'setOpenPanes': // ulozeni otevrenych zalozek v sidebaru do local storage
			localStorage.openPanes = request.titles;
			break;
	};
});
