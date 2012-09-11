Parser = function (sourceData) {
	// zdrojova data rozdelena po jednolivych radcich do pole
	this.source = sourceData.split('\n');

	// rozparsovana vystupni data
	this.data = {
		'Template sources:': [],
		'Language dictionary sources:': [],
		'Configuration dictionary sources:': [],
		'Configuration:': {},
		'Application data:': {}
	};

	// slouzi pro docasne ulozeni dat ze sekce "Application data"
	this.tmpAppData = [];

	// rozdeleni teng vypisu podle sekci
	this._parseIntoSections();

	// cesta ve strukture fragmentu. Co polozka, to jedna uroven zanoreni v datech
	// format: ['parentFragment[1]', 'childFragment[5]']
	this.path = [];

	// reference na fragment, kterou budeme plnit daty
	this.fragment = this.data['Application data:']; // root fragment

	// pocet whitespacu, o ktere je odsazen root fragment
	this.rootLevelIndent = this._setRootLevelIndent();

	// rozparsovani "Application data" sekce
	this._parseApplicationData();
};

/**
 * Rozparsuje zdrojova data podle sekci (sablony, slovniky, configy, data)
 */
Parser.prototype._parseIntoSections = function () {
	var actualSection = 'Application data:';

	for (var i = 0; i < this.source.length; i++) {
		var s = this.source[i];
		var ts = s.trim();

		if (ts.length) { // neni to prazdny radek

			// zmena sekce, ktera se bude parsovat
			if (this.data.hasOwnProperty(ts)) {
				actualSection = ts;
				continue;
			}

			if (actualSection == 'Application data:') {
				this.tmpAppData.push(s);
			} else if (actualSection == 'Configuration:') {
				var data = this._parseVariable(ts);
				this.data[actualSection][data.key] = data.value;
			} else {
				this.data[actualSection].push(ts);
			}
		}
	}
};

/**
 * Metoda pro rozparsovani a ulozeni fragmentu a promennych ze sekce "Application data"
 */
Parser.prototype._parseApplicationData = function () {
	for (var i = 0; i < this.tmpAppData.length; i++) {
		var s = this.tmpAppData[i];
		if(/\[\d+\]:$/.test(s.trim())) { // je to fragment
			this._setFragment(s);
		} else { // je to promenna
			var data = this._parseVariable(s);
			this.fragment[data.key] = data.value;
		}
	}
};

/**
 * Nastavi referenci na aktualni fragment, do ktereho budeme ukladat
 */
Parser.prototype._setFragment = function (s) {
	this.fragment = this.data['Application data:'];

	// zjistime nazev, index a hloubku zanoreni fragmentu
	var data = this._parseFragment(s);

	// nastaveni aktualni cesty ve strukture fragmentu
	this.path = this.path.slice(0, data.level); // z predchozi cesty zkopirujeme urovne, ktere ma soucasny fragment spolecne
	this.path.push(data.name+"["+data.index+"]");

	for (var i = 0; i < this.path.length; i++) {
		var fragmentData = this._parseFragment(this.path[i]);

		if (i + 1 == this.path.length ) {
			// pridani noveho fragmentu
			if (!this.fragment.hasOwnProperty(fragmentData.name)) {
				this.fragment[fragmentData.name] = [];
			}

			// vytvorime objekt fragmentu, ktery se bude plnit promennymi
			this.fragment[fragmentData.name][fragmentData.index] = {};
		}

		// vlastni nastaveni reference
		this.fragment = this.fragment[fragmentData.name][fragmentData.index];
	}
};

/**
 * Vraci nazev, index a level fragmentu
 */
Parser.prototype._parseFragment = function (s) {
	var arr = s.split('[');
	var name = arr[0] ? arr[0].trim() : '';
	var index = arr[1] ? arr[1].split(']')[0].trim() : '';
	var level = this._getLevel(s);

	return {'name': name, 'index': index, 'level': level};
};

/**
 * Rozparsuje string s promennou na key:value par
 */
Parser.prototype._parseVariable = function (s) {
	var arr = s.split(': ');
	var key = arr[0] ? arr[0].replace(/\"/g, '').trim() : '';
	var value = arr[1] ? arr[1].replace(/\"/g, '').trim() : '';

	return {'key': key, 'value': value};
};

/**
 * Vraci uroven, ve ktere je fragment zanoren
 */
Parser.prototype._getLevel = function (s) {
	var count = s.match(/^\s*/)[0].length - this.rootLevelIndent;
	var level = count / 4;

	return level;
};

/**
 * Spocita, o kolik mezer je odsazeny root level dat
 */
Parser.prototype._setRootLevelIndent = function () {
	var indent = null;
	for (var i = 0; i < this.tmpAppData.length; i++) {
		var x = this.tmpAppData[i].match(/^\s{0,}/)[0].length;
		if (indent == null || x < indent) { indent = x; }
	}

	return indent;
};

/**
 * Vraci rozparsovana data
 */
Parser.prototype.getData = function (key) {
	if (key && typeof this.data[key] != 'undefined') {
		return this.data[key];
	} else {
		return this.data;
	}
};
