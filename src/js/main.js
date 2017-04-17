import startClass from './assets/start';
import mediatorClass from './_mediator';

export default class Main {
    constructor(table) {
        this.table = table;
        this.mediator = new mediatorClass( { table: table } );
        this.mediator.tableRender();
        new startClass(this.mediator);
    }

    filter(node, param) {
        let container = document.querySelector(node);
        let btn = container.querySelector('button[type="submit"]');
        let btnCancel = container.querySelector('button[type="reset"]');

        btn.addEventListener('click', (event) => {
            let filter = this._getDataFilter(container, param);

            event.preventDefault();

            this.mediator.filter(filter);
            window.scrollTo(0, 0);
        });

        btnCancel.addEventListener('click', () => {
            this.mediator.tableRender();
        })
    }

    add(node) {
        let container = document.querySelector(node);

        container.addEventListener('click', (event) => {
            let target = event.target;

            if (target.tagName == 'BUTTON' && target.getAttribute('type') == 'submit') {
                event.preventDefault();

                let data;
                let result;
                let tab = target.closest('.plagin__body-tab-cont');
                let dataTab = tab.dataset.tab;
                let error = tab.querySelector('.plagin_result .plagin_result-error');
                let success = tab.querySelector('.plagin_result .plagin_result-success');

                if (dataTab == 'lessons') {
                    
                    data = this._getDataLesson(tab, true);
                    result = this.mediator.add(data);

                } else if (dataTab == 'school') {
                    
                    data = this._getDataSchool(tab, true);
                    result = this.mediator.add(data);

                } else if (dataTab == 'classroom') {

                    data = this._getDataClassroom(tab, true);
                    result = this.mediator.add(data);

                }

                this._viewResultEditEntry({
                    result: result,
                    errorContainer: error,
                    successContainer: success
                });
            }

        });
    }

    editClassroom(node) {
        let container = document.querySelector(node);
        let btn = container.querySelector('button[type="submit"]');

        btn.addEventListener('click', (event) => {
            let data;
            let result;
            let error = container.querySelector('.plagin_result .plagin_result-error');
            let success = container.querySelector('.plagin_result .plagin_result-success');

            event.preventDefault();

            data = this._getDataClassroom(container);
            result = this.mediator.update(data);

            this._viewResultEditEntry({
                result: result,
                errorContainer: error,
                successContainer: success
            });
        })
    }

    editLessons(node) {
        let container = document.querySelector(node);
        let btn = container.querySelector('button[type="submit"]');

        btn.addEventListener('click', (event) => {
            let data;
            let result;
            let error = container.querySelector('.plagin_result .plagin_result-error');
            let success = container.querySelector('.plagin_result .plagin_result-success');

            event.preventDefault();

            data = this._getDataLesson(container);
            result = this.mediator.update(data);

            this._viewResultEditEntry({
                result: result,
                errorContainer: error,
                successContainer: success
            });
        })
    }

    editSchool(node) {
        let container = document.querySelector(node);
        let btn = container.querySelector('button[type="submit"]');

        btn.addEventListener('click', (event) => {
            let data;
            let result;
            let error = container.querySelector('.plagin_result .plagin_result-error');
            let success = container.querySelector('.plagin_result .plagin_result-success');

            event.preventDefault();

            data = this._getDataSchool(container);
            result = this.mediator.update(data);

            this._viewResultEditEntry({
                result: result,
                errorContainer: error,
                successContainer: success
            });

        })
    }

    _getDataClassroom(container, add) {
        let name = container.querySelector('input[name="classroom_name"]').value;
        let location = container.querySelector('input[name="location"]').value;
        let capacity = +container.querySelector('input[name="capacity"]').value;
        let result;
        let id;

        result = {
            table: 'classroom',
            entry: {
                name: name.trim(),
                capacity: capacity,
                location: location
            }
        };

        if (!add) {
            id = +container.querySelector('select[name="classroom"]').value;
            result.entry.id = id;
        }

        return result;
    }

    _getDataSchool(container, add) {
        let name = container.querySelector('input[name="school_name"]').value;
        let students = +container.querySelector('input[name="student_quantity"]').value;
        let result;
        let id;

        result = {
            table: 'school',
            entry: {
                name: name.trim(),
                students: students
            }
        };

        if (!add) {
            id = +container.querySelector('select[name="school"]').value;
            result.entry.id = id;
        }

        return result;
    }

    _viewResultEditEntry(params) {
        let node;

        params.errorContainer.innerHTML = '';
        params.errorContainer.classList.remove('active');

        if (params.result.error) {
            node = params.errorContainer;
            node.innerHTML = params.result.error;
            node.classList.add('active');
        } else if (params.result.ok) {
            node = params.successContainer;
            node.innerHTML = 'Сохранено';
            node.classList.add('active');
            setTimeout(() => {
                node.classList.remove('active');
                node.innerHTML = '';
            }, 2500);
        }
    }

    _getDataLesson(container, add) {
        let date = this._getDateFromTo(container);
        let nameLesson = container.querySelector('input[name="lesson_name"]').value;
        let school = container.querySelector('select[name="school"]');
        let lector = +container.querySelector('select[name="lector"]').value;
        let classroom = +container.querySelector('select[name="classroom"]').value;
        let schoolSelected = this._getOptionsSelected(school);
        let idLesson;
        let result;

        result = {
            table: 'lessons',
            entry: {
                // id: idLesson,
                name: nameLesson,
                school: schoolSelected,
                lector: { id: lector },
                classroom: { id: classroom },
                date: date
            }
        };

        if (!add) {
            idLesson = +container.querySelector('select[name="lessons"]').value;
            result.entry.id = idLesson;
        }

        return result;
    }

    _getOptionsSelected(select) {
        let options = select.options;
        let result = [];

        if (!options) {
            return '';
        }

        for (let i = 0; i < options.length; i++) {
            let option = options[i];

            if (option.selected) {
                result.push({ id: +option.value });
            }
        }

        return result.length == 1 ? result[0] : result; // single value = {}, multiply = [{},[{}]]
    }

    _getDataFilter(container, param) {
        let result = {};

        result.date = this._getDateFromTo(container);
        result[param] = {
            key: 'id',
            value: +container.querySelector(`select[name="${param}"]`).value
        };

        return result;
    }

    _getDateFromTo(container) {
        let rowContainers = container.querySelectorAll('.date__rows');
        let rows = this._getRowContainers(rowContainers);

        return {
            from: +this._getDateRow(rows.from), // нужны числовые значения для filter
            to: +this._getDateRow(rows.to)
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
    
    _getDateRow(row) {
        let year = 2017;
        let month = row.querySelector('select[name="month"]').value;
        let date = row.querySelector('select[name="day"]').value;
        let hour = row.querySelector('select[name="hour"]').value;
        let minut = row.querySelector('select[name="minut"]').value;

        return new Date(year, month, date, hour, minut);
    }
}