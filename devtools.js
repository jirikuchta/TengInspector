TengDevtools = function () {
	// window objekt vytvoreneho panelu
	this._panelWindow = null;

	// tlacitko na prepinani zobrazeni teng debugu ve strance
	this._button = null;

	// vychozi nastaveni
	if (!localStorage.length) {
		localStorage['showDebug'] = 0; // zobrazeni tengu ve strance
		localStorage['openPanes'] = ''; // otevrene zalozky v sidebaru
		localStorage['sidebarWidth'] = 600; // sirka sidebaru
	};

	// stavy tlacitka
	this._buttonStates = {
		'1': {'tooltipText': 'Schovat teng debug ve strance', 'icon': '/img/tenginpage_on.png'},
		'0': {'tooltipText': 'Zobrazit teng debug ve strance', 'icon': '/img/tenginpage_off.png'},
	};

	// vytvoreni panelu
	this._createPanel();
};

/**
 * Vytvori novy panel v Chrome debuggeru
 */
TengDevtools.prototype._createPanel = function () {
	var that = this;

	chrome.devtools.panels.create(
		"Teng",
		"/img/panel_icon.png",
		"/panel/index.html",
		function(panel) {
			var firstRun = true; // uz mame nactena data?

			// prepnuti na zalozku Teng Inspectoru
			panel.onShown.addListener(function (panelWindow) {
				// data nacteme pouze pri prvnim prepnuti na panel Teng Inspectoru
				if (!firstRun) { return; }
				firstRun = false;

				that._panelWindow = panelWindow;

				// schovat debug ve strance
				that._handleDebugVisibility();

				// ziskani dat ze zdrojove stranky
				that._createContent();
			});

			// vyhledavani v panelu
			/******************************************************** 
			 * v stable (chrome 21) je to nejaky rozbity (https://bugs.webkit.org/show_bug.cgi?id=89517) 
			 * v bete by to melo byt opraveny, ale neni
			 * prozatim se vyhledava pres specialni input vytvoreny primo v panelu
			 *********************************************************/
			panel.onSearch.addListener(function (action) {
				alert('search');
			});

			// pri reloadu nebo prechodu na jinou stranku updatnout panel s novymi daty
			chrome.devtools.network.onRequestFinished.addListener(function (request) {
				if (request.response.content.mimeType == 'text/html') {
					// upravime viditelnosti debugu podle nastaveni
					that._handleDebugVisibility();
					that._createContent();
				}
			});

			// tlacitko na pro prepinani viditelnosti debugu ve strance
			that._button = panel.createStatusBarButton(that._buttonStates[1].icon, that._buttonStates[1].tooltipText, false);
			that._button.onClicked.addListener(function () { that._changeDebugVisibility(); });
		}
	);
};

/**
 * Prepina viditelnost tengu ve strance
 */
TengDevtools.prototype._changeDebugVisibility = function () {
	var state = localStorage.showDebug;
	if (state == 1) { state = 0; } else { state = 1; }

	this._changeSettings({'showDebug': state});
	this._handleDebugVisibility();
};

/**
 * Podle nastaveni schova nebo zobrazi teng strance
 * @param {bool} state
 */
TengDevtools.prototype._handleDebugVisibility = function () {
	var that = this;

	// zjistime readyState nactene stranky
	chrome.devtools.inspectedWindow.eval(
		"document.readyState", function (readystate, isException) {
			if (/loaded|complete/.test(readystate)) {
				state = localStorage.showDebug;
				var str = "document.getElementById('teng-debug').style.display='";
				if (state == 1) { str = str + "block'"; } else { str = str + "none'"; }

				chrome.devtools.inspectedWindow.eval(
					str, function (sourceData, isException) {
						that._button.update(that._buttonStates[state].icon, that._buttonStates[state].tooltipText);
					}
				);
			} else {
				// DOM jeste neni ready, zkusime to znovu
				that._handleDebugVisibility();
			}
		}
	);
};

/**
 * Zkopiruje teng vypis
 */
TengDevtools.prototype._createContent = function () {
	var that = this;

	// zjistime readyState nactene stranky
	chrome.devtools.inspectedWindow.eval(
		"document.readyState", function (readystate, isException) {
			if (/loaded|complete/.test(readystate)) {
				// DOM je ready, muzeme vysosat teng data
				chrome.devtools.inspectedWindow.eval(
					"document.getElementById('teng-debug').innerHTML", function (sourceData, isException) {
						if (isException) { return; } // zadna data nejsou nebo jina chyba
						document.body.innerHTML = sourceData;
						that._showInPanel();
					}
				);
			} else {
				// DOM jeste neni ready, zkusime to znovu
				that._createContent();
			}
		}
	);
};

/**
 * Rozdeli zdrojova data a preda je do panelu
 */
TengDevtools.prototype._showInPanel = function () {
	var data = {};

	// rozdeleni na samotna data a teng chyby
	data.errors = document.getElementById('teng-debug-errors') ? document.getElementById('teng-debug-errors').innerHTML : '';
	data.data = document.getElementById('teng-debug-content') ? document.getElementById('teng-debug-content').innerHTML : '';

	// zobrazeni dat v panelu
	this._panelWindow.TENGINS.show(data, localStorage);
};

/**
 * Uklada nastaveni do local storage
 * @param {object} data Objekt obsahujici polozky k ulozeni
 */
TengDevtools.prototype._changeSettings = function (data) {
	for (var key in data) {	localStorage[key] = data[key]; }
};

new TengDevtools();
