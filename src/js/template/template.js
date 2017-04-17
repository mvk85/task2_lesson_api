export default class Template {

    template(key, fields) {
        if (key === 'lessons') {
            return this._getLessonsTemplate (fields);
        } else if (key === 'lector') {
            return this._getLectorTemplate (fields);
        } else if (key === 'material') {
            return this._getMaterialTemplate(fields);
        }
    }

    _getLessonsTemplate(fields) {
        let cache = [];

        for (let i = 0; i < fields.length; i++) {
            cache.push(this._getLessonTemplate(fields[i]));
        }

        return cache.join('');
    }

    _getLectorTemplate(field) {
        return `<div class="lector__popup">
            <div class="lector__popup-name">${field.name}</div>
            <div class="lector__popup-img">
                <img src="${field.src}" alt="">
            </div>
            <div class="lector__popup-text">${field.description}</div>
            <a href="" class="p_close">x</a>
            </div>`;
    }

    _getMaterialTemplate(field) {
        return `<div class="lector__popup">
            <div class="lector__popup-name">${field.name}</div>
            <div class="lector__popup-img">
                <a href="${field.src}" alt="" target="_blank">
                    Перейти к просмотру материалов
                </a>
            </div>
            <a href="" class="p_close">x</a>
            </div>`;
    }

    _getLessonTemplate(field) {
        let schema = this._getSchemaFieldsLesson();

        return `
            <tr ${field.material ? 'class="lecture__ended"' : ''}>
                <td data-label = "${schema.number}"><span>${field.id}</span></td>
                <td data-label = "${schema.school}"><span>${this._formatSchoolField(field.school)}</span></td>
                <td data-label = "${schema.lecture}"><span>${field.name}</span></td>
                <td data-label = "${schema.lector}">
                    <span><a href="${field.lector.src}" target="_blank" class="lesson__lector" data-id="${field.lector.id}">${field.lector.name}</a></span>
                </td>
                <td data-label = "${schema.date}"><span>${this._formatDateField(field.date)}</span></td>
                <td data-label = "${schema.location}"><span>${field.classroom.name} (${field.classroom.location}, до ${field.classroom.capacity} чел.)</span></td>
                <td data-label = "${schema.material}">
                    <span><a href="${field.material ? field.material.src : ''}" class="lesson__material" target="_blank" data-id="${field.material ? field.material.id : ''}">${field.material ? field.material.name : ''}</a></span>
                </td>
            </tr>`
    }

    _formatSchoolField(school) {
        let result = {
            names: [],
            count: 0
        };

        if (Array.isArray(school)) {
            for (let i = 0; i < school.length; i++) {
                result.names.push(school[i].name);
                result.count += school[i].students;
            }
        } else {
            result.names.push(school.name);
            result.count += school.students;
        }

        return `${result.names.join(', ')} (${result.count} чел.)`;
    }

    _formatDateField(date) {
        let from = new Date(date.from);
        let to = new Date(date.to);

        let mm = this._formatDateAddNull(from.getMonth() + 1);
        let dd = this._formatDateAddNull(from.getDate());
        let hourFrom = this._formatDateAddNull(from.getHours());
        let hourTo = this._formatDateAddNull(to.getHours());
        let MMFrom = this._formatDateAddNull(from.getMinutes());
        let MMTo = this._formatDateAddNull(to.getMinutes());

        return `${dd}.${mm} ${hourFrom}:${MMFrom}-${hourTo}:${MMTo}`;
    }

    _formatDateAddNull(number) {
        if (number < 10) {
            return '0' + number;
        }

        return number;
    }

    _getSchemaFieldsLesson() {
        return {
            number: '№',
            school: 'Школа',
            lecture: 'Тема лекции',
            lector: 'Имя лектора',
            date: 'Дата',
            location: 'Место проведения',
            material: 'Материалы'
        }
    }
}