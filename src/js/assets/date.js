export default class ODate {
    constructor() {
        this.date = new Date();
    }

    getDate(mounth) {
        return new Date(2017, +mounth + 1, 0).getDate();
    }

    getDateDetail(date) {
        return this._formatDateField(date);
    }

    _formatDateField(date) {
        let from = new Date(date.from);
        let to = new Date(date.to);

        let yearFrom = from.getFullYear();
        let monthFrom = from.getMonth();
        let dateFrom = from.getDate();
        let hourFrom = from.getHours();
        let minFrom = from.getMinutes();
        
        let yearTo = to.getFullYear();
        let monthTo = to.getMonth();
        let dateTo = to.getDate();
        let hourTo = to.getHours();
        let minTo = to.getMinutes();

        return {
            from: {
                year: yearFrom,
                month: monthFrom,
                date: dateFrom,
                hour: hourFrom,
                min: minFrom
            },
            to: {
                year: yearTo,
                month: monthTo,
                date: dateTo,
                hour: hourTo,
                min: minTo
            }            
        };
    }

    _formatDateAddNull(number) {
        if (number < 10) {
            return '0' + number;
        }

        return number;
    }

}