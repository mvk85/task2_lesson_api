import dbClass from '../src/js/data/db';
import filterClass from '../src/js/_filter';

let assert = require('assert');

describe('Проверка api', () => {
    describe('test: get test data ', () => {
        it('Тестируем на 11 элементах', () => {
            let data = new dbClass();

            assert.equal(data.data.length, 11);
        });
    });

    describe('test: filter', () => {
        it('Для школы "разработка интерфейсов" должно вернуться 5 лекций', () => {
            let db = new dbClass();
            let filters = new filterClass();
            let params = {
                date: { from: 1498926600000, to: 1499277660000 }, // from 01.07 to 05.07
                school: { key: 'id', value: 1 }
            };
            let filterData = {
                filter: params,
                data: db.data
            };

            assert.equal(filters.filter(filterData).length, 5);
        });
    });

    describe('test: add lesson', () => {
        it('Добавлена одна лекция', () => {
            let db = new dbClass();
            let paramsTrue = {
                table: 'lessons',
                entry: {
                    name: 'Новая лекция',
                    school: { id: 1 },
                    lector: { id: 1 },
                    classroom: { id: 1 },
                    date: { from: 1499529600000, to: 1499536800000 }, // 8.07 19:00-21:00
                }
            };

            db.add(paramsTrue);

            assert.equal(db.data.length, 12);
        });

        it('Повторное добавление этой же лекции возвращает ошибку', () => {
            let db = new dbClass();
            let paramsTrue = {
                table: 'lessons',
                entry: {
                    name: 'Новая лекция',
                    school: { id: 1 },
                    lector: { id: 1 },
                    classroom: { id: 1 },
                    date: { from: 1499529600000, to: 1499536800000 }, // 8.07 19:00-21:00
                }
            };
            let result = db.add(paramsTrue);

            assert.equal(result.error ? true : false, true);
        });

        it('Редактирование лекции с корректными данными (изменяем имя).', () => {
            let db = new dbClass();
            let filters = new filterClass();
            let paramsTrue = {
                table: 'lessons',
                entry: {
                    id: 1,
                    name: 'Адаптивная вёрстка (html5)',
                    school: { id: 1 },
                    lector: { id: 1 },
                    classroom: { id: 1 },
                    date: { from: 1498926600000, to: 1498930200000 },  // 1.07 19:30-20:30
                }
            };
            let result = db.update(paramsTrue);
            
            let paramsFilter = { id: 1 };
            let filterData = { filter: paramsFilter, data: db.data };            
            let entry = filters.filter(filterData)[0];

            assert.equal(result.error ? true : false, false);
            assert.equal(entry.name, 'Адаптивная вёрстка (html5)');
        });

        it('Редактирование лекции с некорректной датой.', () => {
            let db = new dbClass();
            let paramsTrue = {
                table: 'lessons',
                entry: {
                    id: 1,
                    name: 'Адаптивная вёрстка (html5)',
                    school: { id: 1 },
                    lector: { id: 1 },
                    classroom: { id: 1 },
                    date: { from: 1499013000000, to: 1499020200000 },   // 2.07 19:30-21:30
                }
            };
            let result = db.update(paramsTrue);

            assert.equal(result.error ? true : false, true);
        });
    });
});
