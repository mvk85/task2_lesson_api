import dbClass from './data/db';
import tableClass from './_table';
import templateClass from './template/template';
import popupClass from './_popup';
import filterClass from './_filter';
import dateClass from './assets/date';

export default class Mediator {
    constructor(options) {
        this.db = new dbClass();
        this.templates = new templateClass();
        this.popup = new popupClass();
        this.table = new tableClass({
            table: options.table,
            template: this.templates,
            popup: this.popup,
            data: this.db.getData()
        });
        this.filters = new filterClass();
        this.date = new dateClass();
        this.const = {
            TEMPLATE_LESSONS: 'lessons'
        };
    }
    
    add(data) {
        let result = this.db.add(data);

        if (!result.error) {
            this.tableRender();
        }

        return result;
    }

    update(data) {
        let result = this.db.update(data);      

        if (!result.error) {
            this.tableRender();
        }

        return result;
    }
    
    filter(filter) {
        let params = {};
        let arLessons;
        let lessons;

        params.filter = filter;
        params.data = this.db.getData().data;
        arLessons = this.filters.filter(params);
        lessons = this.templates.template(this.const.TEMPLATE_LESSONS, arLessons);

        if (typeof this.table == 'object') {
            this.table.tableRender(lessons);
        }

        return arLessons;
    }

    getEntry(params, table) {
        let entry;
        
        if (!table) {
            entry = this.filters.filter( {
                filter: params,
                data: this.db.getData().data
            });
        } else {
            entry = this.filters.filter( 
                {
                    filter: params,
                    data: this.db.getData().dataRaw
                }, 
                table
            );
        }        
        
        return entry[0];
    }

    getEntries(table) {
        if (table) {
            return this.db.dataRaw[table];
        }
        
        return this.db.data;
    }

    tableRender() {
        let data = this.db.getData().data;
        let lessons = this.templates.template(this.const.TEMPLATE_LESSONS, data);

        this.table.tableRender(lessons);
    }
}