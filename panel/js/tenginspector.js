// objekt Teng Inspectoru
var TENGINS = {
    'dom': {},
    '_firstRun': true,

    'show': function (source, settings) {
        if (this._firstRun) {
            this._init(settings);
        } else {
            this._clear();
        }

        // rozparsujeme data
        var parser = new Parser(source.data);

        // vytvorime HTML strukturu dat a zobrazime v panelu
        var panelData = new DOMBuilder(parser.getData('Application data:'));
        TENGINS.dom.panel.appendChild(panelData.getResult());

        // vytvorime zalozky v sidebaru
        new Errors(source.errors);
        new SidebarPane('Šablony', parser.getData('Template sources:'), 'list');
        new SidebarPane('Slovníky', parser.getData('Language dictionary sources:'), 'list');
        new SidebarPane('Konfigurační soubory', parser.getData('Configuration dictionary sources:'), 'list');
        new SidebarPane('Konfigurace', parser.getData('Configuration:'), 'last');

        new Search();
    },

    '_init': function (settings) {
        // nastavime odkazy na pracovni elementy
        this._setDOM();

        this.settings = settings;

        // inicializace UI funcionality
        new UI.ClickHandler();
        new UI.SidebarResizer();

        this._firstRun = false;
    },

    '_setDOM': function () {
        this.dom.panel = document.getElementById('panel');
        this.dom.sidebar = document.getElementById('sidebar');
        this.dom.resizer = document.getElementById('resizer');
    },

    '_clear': function () {
        TENGINS.dom.panel.innerHTML = '';
        TENGINS.dom.sidebar.innerHTML = '';
    }
};
