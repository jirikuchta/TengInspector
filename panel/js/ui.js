// namespace pro UI funcionalitu
var UI = {};

/**
 * Trida umoznujici menit sirku sidebaru a panelu
 */
UI.SidebarResizer = function () {
	this._panelMinWidth = 300;
	this._sidebarMinWidth = 200;
	this._width = TENGINS.settings.sidebarWidth;

	this._setWidth();
	TENGINS.dom.resizer.addEventListener('mousedown', this._start.bind(this));
};

UI.SidebarResizer.prototype._start = function (e) {
	e.preventDefault();

	this._mousemoveListener = this._computeWidth.bind(this);
	this._mouseupListener = this._stop.bind(this);

	document.addEventListener('mousemove', this._mousemoveListener);
	document.addEventListener('mouseup', this._mouseupListener);
};

UI.SidebarResizer.prototype._stop = function (e) {
	e.preventDefault();
	document.removeEventListener('mousemove', this._mousemoveListener);
	document.removeEventListener('mouseup', this._mouseupListener);

	chrome.extension.sendRequest({'action': 'setSidebarWidth', 'width': this._width});
};

UI.SidebarResizer.prototype._computeWidth = function (e) {
	e.preventDefault();
	var windowWidth = document.body.offsetWidth;
	var width = document.body.clientWidth - e.x;

	if (width < this._sidebarMinWidth) { width = this._sidebarMinWidth; }
	if (windowWidth - width < this._panelMinWidth) { width = windowWidth - this._panelMinWidth; }
	this._width = width;

	this._setWidth();
};

UI.SidebarResizer.prototype._setWidth = function () {
	TENGINS.dom.panel.style.right = this._width+'px';
	TENGINS.dom.resizer.style.right = this._width+'px';
	TENGINS.dom.sidebar.style.width = this._width+'px';
};

/**
 * Zpracovava kliknuti uvnitr panelu
 */
UI.ClickHandler = function () {
	this.clickListener = this._handleClick.bind(this);
	document.addEventListener('click', this.clickListener);
};

UI.ClickHandler.prototype._handleClick = function (e) {
	var elm = e.target;

	if (Utils.hasClass(elm, 'name')) {
		this._handleParentNodeClick(elm);
	} else if (Utils.hasClass(elm, 'paneTitle')) {
		this._handlePaneTitleClick(elm);
	}
};

/**
 * Sbaluje nebo rozbaluje jednotlive uzly ve strukture dat
 */
UI.ClickHandler.prototype._handleParentNodeClick = function (elm) {
	var parent = elm.parentNode;
    var children = parent.getElementsByTagName('ol')[0];

    if (children) {
        if (Utils.hasClass(children, 'expanded')) {
            Utils.removeClass(children, 'expanded');
            Utils.removeClass(parent, 'expanded');
        } else {
            Utils.addClass(children, 'expanded');
            Utils.addClass(parent, 'expanded');
        }
    }
};

/**
 * Zobrazuje nebo schovava obsah zalozky v sidebaru
 */
UI.ClickHandler.prototype._handlePaneTitleClick = function (elm) {
	var pane = elm.parentNode;

	if (Utils.hasClass(pane, 'expanded')) {
		Utils.removeClass(pane, 'expanded');
	} else {
		Utils.addClass(pane, 'expanded');
	}

	// zjistime otevrene zalozky a posleme k ulozeni do local storage
	var panes = TENGINS.dom.sidebar.getElementsByClassName('pane');
	var openPanes = [];
	for (var i = 0; i < panes.length; i++) {
		if (Utils.hasClass(panes[i], 'expanded')) {
			openPanes.push(panes[i].getElementsByTagName('h6')[0].innerHTML);
		}
	}
	chrome.extension.sendRequest({'action': 'setOpenPanes', 'titles': openPanes.join()});
};
