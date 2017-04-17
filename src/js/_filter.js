export default class Filter {

    filter(params, table) {
        let arElements;
        let filter = params.filter;
        let result = [];

        if (table) {
            arElements = params.data[table];
        } else {
            arElements = params.data;
        }

        for (let i = 0; i < arElements.length; i++) {
            let lesson = arElements[i];
            let isMatch = this._isMatchingEntry(filter, lesson);

            if (isMatch) {
                result.push(lesson);
            }
        }

        return result;
    }

    /**
     * @param filter
     * @param lesson
     * @returns {boolean}
     * @private
     *
     * @example filter
     * { id: 1 }
     * { name: 'Адаптивная вёрстка' }
     * { school: { key: 'id', value: 1 } }
     */

    _isMatchingEntry (filter, lesson) {
        let arFilter = Object.keys(filter);

        for (let j = 0; j < arFilter.length; j++) {
            let keyFilter = arFilter[j];
            let valueLesson = lesson[keyFilter];
            let valueFilter = filter[keyFilter];

            if (keyFilter === 'date') {
                let fromLesson = valueLesson.from;
                let toLesson = valueLesson.to;
                let fromFilter = valueFilter.from;
                let toFilter = valueFilter.to

                if (!((fromFilter <= fromLesson && toFilter > fromLesson)
                    || (fromFilter > fromLesson && fromFilter < toLesson))) {
                    return false;
                }

            } else if (Array.isArray(valueLesson)) {
                let isMatch = false;

                for (let i = 0; i < valueLesson.length; i++) {
                    let item = valueLesson[i];

                    if (typeof item === 'object') {
                        if (this.isMatching(item[valueFilter["key"]], valueFilter["value"])) {
                            isMatch = true;
                            break;
                        }
                    } else {
                        if (this.isMatching(item, valueFilter)) {
                            isMatch = true;
                            break;
                        }
                    }
                }
                
                if (!isMatch) {
                    return false;
                }
                
            } else if (typeof valueLesson === 'object' && typeof valueFilter === 'object') {

                if (!this.isMatching(valueLesson[valueFilter["key"]], valueFilter["value"])) {
                    return false;
                }

            } else {
                
                if (!this.isMatching(valueLesson, valueFilter)) {
                    return false;
                }
                
            }
        }

        return true;
    }

    isMatching (val1, val2) {
        if (typeof val1 === 'string' && typeof val2 === 'string') {
            val1 = val1.toLowerCase();
            val2 = val2.toLowerCase();

            return val1.indexOf(val2) == -1 ? false : true;

        } else if (typeof val1 === 'number' && typeof val2 === 'number') {

            return val1 === val2 ? true : false;

        }

        throw new TypeError('Type is undefined, it\'s not string or number. Function isMatching');
    }

    isEmptyInputs (arValue) {
        for (let i = 0; i < arValue.length; i++) {
            if (!this.isEmpty(arValue[i])) {
                return false;
            }
        }

        return true;
    }

    isEmpty (value) {
        return value ? false : true;
    }
}