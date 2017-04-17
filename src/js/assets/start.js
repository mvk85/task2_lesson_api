import dateClass from './date';

export default class Start {
    constructor(mediator) {
        this.mediator = mediator;
        this.plaginContainers = document.querySelectorAll('.plagin__container');
        this.editForm = document.querySelector('form[name="form_edit_fields"]');
        this.tabContainer = document.querySelector('#plagin__scheduler--edit');
        this.date = new dateClass();
        this._init();
        this.updateSelectTab();
        this.watchSelectTab();
    }

    updateSelectTab() {
        let tabContainer = this.tabContainer;
        let selects = tabContainer.querySelectorAll('select[data-selected]');

        for (let i = 0; i < selects.length; i++) {
            let select = selects[i];
            let table = select.dataset.selected;
            let lessons = this.mediator.getEntries(table);

            this._fillSelectOptions(lessons, select);
            this._updateContentTab(table, select);
        }
    }

    watchSelectTab() {
        let tabContainer = this.tabContainer;

        tabContainer.addEventListener('change', (event) => {
            let target = event.target;

            if (target.tagName == 'SELECT' && target.dataset.selected) {                
                let table = target.dataset.selected;

                this._updateContentTab(table, target);

            }
        })
    }

    _updateContentTab(table, target) {
        let id = target.value;
        let params = { id: +id };
        let entry = this.mediator.getEntry(params, table);

        if (table == 'lessons') {
            this._updateTabLessons(target, entry);
        } else if (table == 'school') {
            this._updateTabSchool(target, entry);
        } else if (table == 'classroom') {
            this._updateTabClassroom(target, entry);
        }
    }

    _fillSelectOptions(elements, select) {
        let options = '';

        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];

            options += `<option value = "${element.id}">${element.name}</option>`;
        }

        select.innerHTML = options;
    }

    _updateTabClassroom(target, entry) {
        let container = target.closest('.plagin__body-tab-cont');
        let name = container.querySelector('input[name="classroom_name"]');
        let location = container.querySelector('input[name="location"]');
        let capacity = container.querySelector('input[name="capacity"]');

        name.value = entry.name;
        location.value = entry.location;
        capacity.value = entry.capacity;
    }

    _updateTabSchool(target, entry) {
        let container = target.closest('.plagin__body-tab-cont');
        let name = container.querySelector('input[name="school_name"]');
        let quantity = container.querySelector('input[name="student_quantity"]');

        name.value = entry.name;
        quantity.value = entry.students;
    }

    _updateTabLessons(target, entry) {
        let container = target.closest('.plagin__body-tab-cont');
        let name = container.querySelector('input[name="lesson_name"]');
        let school = container.querySelector('select[name="school"]');
        let lector = container.querySelector('select[name="lector"]');
        let classroom = container.querySelector('select[name="classroom"]');
        let date = container.querySelector('.date');
        let tableSchool = this.mediator.db.dataRaw.school;

        this._fillSelectOptions(tableSchool, school);
        name.value = entry.name;
        lector.value = entry.lector.id;
        classroom.value = entry.classroom.id;
        this._setDateField(entry.date, date);
        this._setOptions(entry.school, school);
    }

    _setDateField(date, dateContainer) {
        let dateFields = this.mediator.date.getDateDetail(date);

        this._setDateFromTo(dateContainer, dateFields);
    }

    _setDateFromTo(container, dateFields) {
        let rowContainers = container.querySelectorAll('.date__rows');
        let rows = this._getRowContainers(rowContainers);
        let linkDateField = {
            from: this._getDateField(rows.from),
            to: this._getDateField(rows.to)
        };

        let keys = Object.keys(linkDateField.from);

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];

            this._setOptionsDate(dateFields.from[key], linkDateField.from[key]);
            this._setOptionsDate(dateFields.to[key], linkDateField.to[key]);
        }
    }

    _getRowContainers(rowContainers) {
        let rows = {};

        for (let i = 0; i < rowContainers.length; i++) {
            let row = rowContainers[i];
            let data = row.dataset.date;

            rows[data] = row;
        }

        return rows;
    }

    _getDateField(row) {
        let month = row.querySelector('select[name="month"]');
        let date = row.querySelector('select[name="day"]');
        let hour = row.querySelector('select[name="hour"]');
        let min = row.querySelector('select[name="minut"]');

        return {
            month: month,
            date: date,
            hour: hour,
            min: min
        }
    }

    _setOptionsDate(valueOption, select) {
        let options = select.options;

        if (!options) {
            return '';
        }

        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let value = valueOption;

            if (option.value == value) {
                option.selected = true;
            } else {
                option.selected = false;
            }
        }
    }

    _setOptions(valueOptions, select) {
        let options = select.options;

        if (!options) {
            return '';
        }

        if (Array.isArray(valueOptions)) {
            for (let i = 0; i < options.length; i++) {
                let option = options[i];

                for (let j = 0; j < valueOptions.length; j++) {
                    let value = valueOptions[j].id;

                    if (option.value == value) {
                        option.selected = true;
                        break;
                    } else {
                        option.selected = false;
                    }
                }
            }
        } else {
            for (let i = 0; i < options.length; i++) {
                let option = options[i];

                let value = valueOptions.id;

                if (option.value == value) {
                    option.selected = true;
                } else {
                    option.selected = false;
                }
            }
        }
    }

    _init() {
        let containers = this.plaginContainers;

        for (let i = 0; i < containers.length; i++) {
            let container = containers[i];
            let title = container.querySelector('.plagin__title');
            let body = container.querySelector('.plagin__body');

            body.classList.toggle('active');
            title.addEventListener('click', () => {
                body.classList.toggle('active');
            });

            body.addEventListener('change', (event) => {
                let target = event.target;

                if (target.tagName === 'SELECT' && target.getAttribute('name') === 'month') {
                    let month = +target.value;
                    let date = this.date.getDate(month);
                    let options = this._compileDate(date);
                    let dateSelect = target.closest('.date__rows').querySelector('select[name="day"]');

                    dateSelect.innerHTML = options;
                }
            });

            body.addEventListener('click', (event) => {
                let target = event.target;

                if (target.closest('.radio') && target.tagName === 'INPUT') {
                    let value = target.value;
                    let tabContainers = body.querySelectorAll('.plagin__body-tab-cont');
                    let tabCont;

                    for (let i = 0; i < tabContainers.length; i++) {
                        let tabContainer = tabContainers[i];

                        tabContainer.classList.remove('active');

                        if (tabContainer.dataset.tab == value) {
                            tabCont = tabContainer;
                        }
                    }

                    tabCont.classList.add('active');
                }
            })
        }

        this.editForm.addEventListener('submit', (event) => {
            event.preventDefault();
        })
    }

    _compileDate(date) {
        let length = date + 1;
        let options = [];

        for (let i = 1; i < length; i++) {
            let option = `<option value = "${i}">${i}</option>`;

            options.push(option);
        }

        return options.join('');
    }
}