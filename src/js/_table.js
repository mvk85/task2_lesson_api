export default class Table {
    constructor(options) {
        this.table = document.querySelector(options.table);
        this.popup = options.popup;
        this.templates = options.template;
        this.dataRaw = options.data.dataRaw;
        this._initEvent();
    }

    tableRender(content) {
        let tbody = this.table.querySelector('tbody');

        tbody.innerHTML = content;
    }
    
    _initEvent() {
        let table = this.table;

        table.addEventListener('click', (event) => {
            let target = event.target;

            if (target.tagName !== 'A') {
                return;
            }
            
            if (target.classList.contains('lesson__lector')) {
                let id = target.dataset.id;

                this._renderPopup('lector', id);

            } else if (target.classList.contains('lesson__material')) {
                let id = target.dataset.id;

                this._renderPopup('material', id);

            }
            
        })
    }

    _renderPopup(key, id) {
        let fields = this._getFields(this.dataRaw[key]);
        let content = this.templates.template(key, fields[id]);

        event.preventDefault();
        this.popup.open(content);
        this.popup.eventClose('.p_close');
    }

    _getFields(data) {
        let result = {};

        for (let i = 0; i < data.length; i++) {
            let element = data[i];

            if (element) {
                result[`${element.id}`] = element;
            }

        }

        return result;
    }
}