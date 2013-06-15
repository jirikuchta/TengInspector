/**
 * Trida pro vytvoreni zalozky v sidebaru
 * @param {string} title Nazev zalozky
 * @param {object, array} data Zdroj dat pro obsah zalozky
 * @param {string} className CSS trida zalozky
 */
SidebarPane = function (title, data, className) {
	this.paneTitle = title;
	this.className = className || '';
	this.dombuilder = new DOMBuilder(data);
	this.dom = {};

	this._build();
};

SidebarPane.prototype._build = function () {
	// wrapper
	this.dom.pane = document.createElement('div');
	this.dom.pane.classList.add('pane');
	this.dom.pane.classList.add(this.className);

	// titulek
	this.dom.title = document.createElement('h6');
	this.dom.title.classList.add('paneTitle');
	this.dom.title.innerHTML = this.paneTitle;

	// obsah
	this.dom.panebody = document.createElement('div');
	this.dom.panebody.classList.add('body');
	this.dom.panebody.appendChild(this.dombuilder.getResult());

	this.dom.pane.appendChild(this.dom.title);
	this.dom.pane.appendChild(this.dom.panebody);
	TENGINS.dom.sidebar.appendChild(this.dom.pane);

	this._setAsOpen();
};

SidebarPane.prototype._setAsOpen = function () {
	var patt = new RegExp(this.paneTitle);
	if (patt.test(TENGINS.settings.openPanes)) {
		this.dom.pane.classList.add('expanded');
	}
};
