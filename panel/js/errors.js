/**
 * Trida pro zobrazeni tengovych chyb
 * @param {string} source innerHTML elementu teng-debug-errors
 */
Errors = function (source) {
	this.errors = [];

	var err = source.split('\n');

	for (var i = 0; i < err.length; i++) {
		var ts = err[i].trim();
		if (ts.length) { this.errors.push(err[i]); }
	}

	// zobrazit zalozku pouze pokud jsou nejake chyby
	if (this.errors.length) { this._build(); }
};

Errors.prototype._build = function () {
	// zobrazime jako zalozku v sidebaru
	var pane = new SidebarPane('Chyby', this.errors, 'list errors');
	pane.dom.pane.classList.add('expanded');
};
