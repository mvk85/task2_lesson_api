import { dataRaw } from './_lesson_data';

export default class DB {
    constructor() {
        if (typeof localStorage == 'object') {
            this.ls = localStorage;
            this.isLs = true;
        } else {
            this.isLs = false;
        }

        if (this.isLs && !this.ls.data) {
            this.dataRaw = dataRaw;
            this.data = this._compileData(this.dataRaw);
            this._writeData(this.dataRaw);
        } else if (!this.isLs) {
            this.dataRaw = dataRaw;
            this.data = this._compileData(this.dataRaw);
        } else {
            this.dataRaw = this._readData();
            this.data = this._compileData(this.dataRaw);
        }
    }

    getData() {
        return {
            data: this.data,
            dataRaw: this.dataRaw
        }
    }

    add(args) {
        let entryAdd = args.entry;
        let tableData = this.dataRaw[args.table];
        let result = { error: '', ok: false };
        let check = '';
        let idNewLesson;
        let idNewSchool;
        let idNewClassroom;

        if (args.table == 'lessons') {
            // test field new lesson
            check += this._checkNameUniq({
                entry: entryAdd,
                table: tableData
            }, true);

            // test classroom is busy
            check += this._checkLessonsClassroom({
                entryUpdate: entryAdd,
                tableData: tableData
            }, true);

            // test capacity
            check += this._checkLessonsCapacity({
                entryUpdate: entryAdd
            });

            // test busy lector
            check += this._checkLessonsLector({
                entryUpdate: entryAdd
            }, true);

            // test busy school
            check += this._checkLessonsSchool({
                entryUpdate: entryAdd
            }, true);

            // test date
            check += this._checkCorrectDate({
                entry: entryAdd
            });

            if (check) {
                result.error = check;

                return result;
            }

            // add new entry lessons:

            idNewLesson = this._getNewId('lessons');
            entryAdd.id = idNewLesson;
            tableData.push(entryAdd);

        } else if (args.table == 'school') {

            // Verification of a name:
            check += this._checkNameUniq({
                entry: entryAdd,
                table: tableData
            }, true);

            // Verification count students
            if (entryAdd.students < 1 || entryAdd.students > 300) {
                check += 'Ошибка: некорректное количество учащихся.<br>'
            }

            if (check) {
                result.error = check;

                return result;
            }

            // add new entry school
            idNewSchool = this._getNewId('school');
            entryAdd.id = idNewSchool;
            tableData.push(entryAdd);
            
        } else if (args.table == 'classroom') {
            // Verification of a name:
            check += this._checkNameUniq({
                entry: entryAdd,
                table: tableData
            }, true);

            // Verification capacity
            if (entryAdd.capacity < 1 || entryAdd.capacity > 400) {
                check += 'Ошибка: некорректное вместимость аудитории.<br>'
            }

            if (check) {
                result.error = check;

                return result;
            }

            // add entry classroom
            idNewClassroom = this._getNewId('classroom');
            entryAdd.id = idNewClassroom;
            tableData.push(entryAdd);
        }

        // update data
        this._writeData(this.dataRaw);
        this.data = this._compileData(this.dataRaw);

        result.ok = true;
        
        return result;
    }

    _getNewId(tableName) {
        let table = this.dataRaw[tableName];

        return table.length + 1;
    }
    
    update(args) {
        let entryUpdate = args.entry;
        let id = entryUpdate.id;
        let tableData = this.dataRaw[args.table];
        let entryOrigin = this._getEntry(id, tableData);
        let result = { error: '', ok: false };
        let check = '';

        if (!entryOrigin) {
            return result.error = 'Error update, entry not found to DB';
        }

        if (args.table == 'lessons') {
            // test field new lesson
            check += this._checkNameUniq({
                entry: entryUpdate,
                table: tableData
            });

            // test classroom is busy
            check += this._checkLessonsClassroom({
                entryUpdate: entryUpdate,
                tableData: tableData
            });

            // test capacity
            check += this._checkLessonsCapacity({
                entryUpdate: entryUpdate
            });

            // test busy lector
            check += this._checkLessonsLector({
                entryUpdate: entryUpdate
            });

            // test busy school
            check += this._checkLessonsSchool({
                entryUpdate: entryUpdate
            });

            // test date
            check += this._checkCorrectDate({
                entry: entryUpdate
            });

            if (check) {
                result.error = check;

                return result;
            }

            // update entry lesson:

            if (Array.isArray(entryUpdate.school)) {
                entryOrigin.school = entryUpdate.school;
            } else if (Array.isArray(entryOrigin.school)) {
                entryOrigin.school = { id: entryUpdate.school.id };
            } else {
                if (entryOrigin.school.id != entryUpdate.school.id) {
                    entryOrigin.school.id = entryUpdate.school.id;
                }
            }

            if (entryOrigin.lector.id != entryUpdate.lector.id) {
                entryOrigin.lector.id = entryUpdate.lector.id;
            }

            if (entryOrigin.classroom.id != entryUpdate.classroom.id) {
                entryOrigin.classroom.id = entryUpdate.classroom.id;
            }

            if (entryOrigin.name != entryUpdate.name) {
                entryOrigin.name = entryUpdate.name;
            }

            if (entryOrigin.date.from != entryUpdate.date.from) {
                entryOrigin.date.from = entryUpdate.date.from;
            }

            if (entryOrigin.date.to != entryUpdate.date.to) {
                entryOrigin.date.to = entryUpdate.date.to;
            }

        } else if (args.table == 'school') {

            // Verification of employment of a name:
            check += this._checkSchoolName({
                entryUpdate: entryUpdate,
                tableData: tableData
            });

            // Verification count students
            if (entryOrigin.students < entryUpdate.students) {
                check += this._checkSchoolCountStudents({
                    entryUpdate: entryUpdate
                });
            }

            if (check) {
                result.error = check;

                return result;
            }

            // update entry school
            entryOrigin.name = entryUpdate.name;
            entryOrigin.students = entryUpdate.students;

        } else if (args.table == 'classroom') {

            // Verification capacity classroom
            if (entryOrigin.capacity > entryUpdate.capacity) {
                check += this._checkClassroomCapacity({
                    entryUpdate: entryUpdate
                });
            }

            // Verification of employment of a name:
            check += this._checkClassroomName({
                entryUpdate: entryUpdate
            });

            if (check) {
                result.error = check; // error.join('');

                return result;
            }

            // update entry classroom
            entryOrigin.name = entryUpdate.name;
            entryOrigin.capacity = entryUpdate.capacity;
            entryOrigin.location = entryUpdate.location;

        }

        // update data
        this._writeData(this.dataRaw);
        this.data = this._compileData(this.dataRaw);

        result.ok = true;

        return result;
    }

    /**
     * Проверка даты начала и окончания лекции на корректность
     * @param params
     * @returns {string}
     * @private
     */
    _checkCorrectDate(params) {
        let from = params.entry.date.from;
        let dateFrom = new Date(from);
        let dateNumberFrom = dateFrom.getDate();
        let to = params.entry.date.to;
        let dateTo = new Date(to);
        let dateNumberTo = dateTo.getDate();
        let error = '';

        if (to < from) {
            error = 'Ошибка: время окончания лекции не может быть меньше времени начала.<br>';
        }

        if (dateNumberTo - dateNumberFrom > 0) {
            error = 'Ошибка: лекция начинается и оканчивается в один и тот же день.<br>';
        }

        return error;
    }

    /**
     * Проверка на пустоту и уникальность поля "name"
     * @param params
     * @returns {string}
     * @private
     */
    _checkNameUniq(params, add) {
        let table = params.table
        let nameNew = params.entry.name;
        let entry = params.entry;
        let error = '';

        if (!nameNew || nameNew.length < 3) {
            return error = 'Ошибка: поле "Имя" не заполнено или меньше трех символов<br>';
        }

        for (let i = 0; i < table.length; i++) {
            let element = table[i];
            let nameOld = element.name;
            let testId = add ? true : element.id != entry.id;

            if ( nameNew == nameOld && testId) {
                error += 'Ошибка: имя не уникально. <br>';
                break;
            }
        }

        return error;
    }

    /**
     * Проверка имени аудитории на уникальность.
     * @param params
     * @returns {string} error || ''
     * @private
     */
    _checkClassroomName(params) {
        let error = '';
        let entryUpdate = params.entryUpdate;
        let tableClassroom = this.dataRaw.classroom;
        let idUpdate = entryUpdate.id;

        for (let i = 0; i < tableClassroom.length; i++) {
            let classroom = tableClassroom[i];

            if (classroom.id != idUpdate) {
                if (classroom.name === entryUpdate.name) {
                    error += 'Ошибка: школа с таким именем уже существует.'
                }
            }
        }

        return error;
    }

    /**
     * Проверка вместимости аудитории. Хватит ли вместимости аудитории для проведения лекции,
     * если ее уменьшить при редактировании аудитории.
     * @param params
     * @returns {string} error || ''
     * @private
     */
    _checkClassroomCapacity(params) {
        let error = '';
        let entryUpdate = params.entryUpdate;
        let capacityClassroomUpdate = entryUpdate.capacity;
        let tableLessons = this.dataRaw.lessons;
        let idClassroomUpdate = entryUpdate.id;
        let capacityStudentsSchools = 0;

        for (let i = 0; i < tableLessons.length; i++) {
            let lesson = tableLessons[i];
            let idClassroomOrigin = lesson.classroom.id;

            if (idClassroomOrigin == idClassroomUpdate) {
                if (Array.isArray(lesson.school)) {
                    let schools = lesson.school;

                    for (let i = 0; i < schools.length; i++) {
                        let school = schools[i];

                        capacityStudentsSchools += this._getSchool(school.id).students;
                    }

                    if (capacityClassroomUpdate < capacityStudentsSchools) {
                        error += `Ошибка: для лекции "${lesson.name}" не будет хватать
                    вместимости изменяемой аудитории<br>`;
                    }

                } else {
                    capacityStudentsSchools = this._getSchool(lesson.school.id).students;

                    if (capacityClassroomUpdate < capacityStudentsSchools) {
                        error += `Ошибка: для лекции "${lesson.name}" не будет хватать
                    вместимости изменяемой аудитории<br>`;
                    }

                }
            }

        }

        return error;
    }

    /**
     * Проверка, хватит ли вместимости в аудиториях при увеличении количества студентов на лекции
     * @param params
     * @returns {string} error || ''
     * @private
     */
    _checkSchoolCountStudents(params) {
        let error = '';
        let entryUpdate = params.entryUpdate;
        let idSchoolUpdata = entryUpdate.id;
        let tableLessons = this.dataRaw.lessons;
        let capacityClassroomVer = 0;
        let capacityStudents = entryUpdate.students;
        let capacityStudentsSchools = 0;
        let idClassroomVer;

        for (let i = 0; i < tableLessons.length; i++) {
            let lesson = tableLessons[i];

            if (Array.isArray(lesson.school)) {
                let schools = lesson.school;
                let isContain = false;

                for (let i = 0; i < schools.length; i++) {
                    let school = schools[i];

                    capacityStudentsSchools += this._getSchool(school.id).students;

                    if (school.id == idSchoolUpdata) {
                        isContain = true;
                    }
                }

                if (isContain) {
                    idClassroomVer = lesson.classroom.id;
                    capacityClassroomVer = this._getClassroom(idClassroomVer).capacity;

                    if (capacityClassroomVer < capacityStudentsSchools) {
                        error += `Ошибка: для лекции "${lesson.name}" не будет хватать
                        вместимости аудитории<br>`;
                    }
                }

            } else if (lesson.school.id == idSchoolUpdata) {
                idClassroomVer = lesson.classroom.id;

                let capacityClassroomVer = this._getClassroom(idClassroomVer).capacity;

                if (capacityClassroomVer < capacityStudents) {
                    error += `Ошибка: для лекции "${lesson.name}" не будет хватать
                        вместимости аудитории<br>`;
                }

            }
        }

        return error;
    }

    /**
     * Проверка уникальности названия школы
     * @param params
     * @returns {string} error || ''
     * @private
     */
    _checkSchoolName(params) {
        let error = '';
        let entryUpdate = params.entryUpdate;
        let tableSchool = params.tableData;
        let idUpdate = entryUpdate.id;
        let testAdd;

        for (let i = 0; i < tableSchool.length; i++) {
            let school = tableSchool[i];

            testAdd = idUpdate ? school.id != idUpdate : true;

            if (testAdd) {
                if (school.name === entryUpdate.name) {
                    error += 'Ошибка: школа с таким именем уже существует.'
                }
            }
        }

        return error;
    }

    /**
     * Проверка. Не может быть двух лекций в одно и тоже время для одной и той же школы
     * @param params
     * @returns {string} error || ''
     * @private
     */
    _checkLessonsSchool(params, add) {
        let error = '';
        let entryUpdate = params.entryUpdate;
        let idSchoolUpdata = entryUpdate.school.id;
        let tableLessons = this.dataRaw.lessons;
        let fromUpdate = entryUpdate.date.from;
        let toUpdate = entryUpdate.date.to;
        let testUpdate;

        for (let i = 0; i < tableLessons.length; i++) {
            let lesson = tableLessons[i];

            testUpdate = add ? true : lesson.id != entryUpdate.id;

            if (lesson.school.id == idSchoolUpdata && testUpdate /* lesson.id != entryUpdate.id */ ) {
                let fromOrigin = lesson.date.from;
                let toOrigin = lesson.date.to;

                if (fromUpdate >= fromOrigin && fromUpdate < toOrigin
                    || fromUpdate < fromOrigin && toUpdate > fromOrigin) {
                    error += `Ошибка: для выбранной школы в указанное время уже запланирована
                            лекция.<br>`;
                    break;
                }
            }
        }

        return error;
    }

    /**
     * Проверка занятости лектора в указанное время
     * @param params
     * @returns {string} error || ''
     * @private
     */
    _checkLessonsLector(params, add) {
        let error = '';
        let entryUpdate = params.entryUpdate;
        let idLectorUpdata = entryUpdate.lector.id;
        let tableLessons = this.dataRaw.lessons;
        let tableCommon = this.data;
        let fromUpdate = entryUpdate.date.from;
        let toUpdate = entryUpdate.date.to;
        let testUpdate;

        for (let i = 0; i < tableLessons.length; i++) {
            let lesson = tableLessons[i];

            testUpdate = add ? true : lesson.id != entryUpdate.id;

            if (lesson.lector.id == idLectorUpdata && testUpdate /* lesson.id != entryUpdate.id */) {
                let fromOrigin = lesson.date.from;
                let toOrigin = lesson.date.to;

                if (fromUpdate >= fromOrigin && fromUpdate < toOrigin
                    || fromUpdate < fromOrigin && toUpdate > fromOrigin) {
                    error += `Ошибка: лектор занят в указанное время.
                            У него проходит занятие в "${tableCommon[lesson.id - 1].classroom.name}"
                            в указанное время<br>`;
                    break;
                }
            }
        }

        return error;
    }

    /**
     * Проверка вместимости. Поместятся ли студенты в выбранной аудитории.
     * @param params
     * @returns {string} error or ''
     * @private
     */
    _checkLessonsCapacity(params) {
        let error = '';
        let entryUpdate = params.entryUpdate;
        let capacityClassroomUpdate;
        let idClassroomUpdate = entryUpdate.classroom.id;
        let tableClassroom = this.dataRaw.classroom;
        let countPeopleUpdate = 0;
        let tableSchool = this.dataRaw.school;

        for (let i = 0; i < tableClassroom.length; i++) {
            let classroom = tableClassroom[i];

            if (classroom.id == idClassroomUpdate) {
                capacityClassroomUpdate = classroom.capacity;
                break;
            }
        }

        if (Array.isArray(entryUpdate.school)) {

            let arSchoolUpdate = entryUpdate.school;

            for (let i = 0; i < tableSchool.length; i++) {
                let school = tableSchool[i];

                for (let j = 0; j < arSchoolUpdate.length; j++) {
                    let schoolUpdate = arSchoolUpdate[j];

                    if (school.id == schoolUpdate.id) {
                        countPeopleUpdate += +school.students;
                        break;
                    }
                }
            }

        } else {
            let idSchoolUpdate = entryUpdate.school.id;

            for (let i = 0; i < tableSchool.length; i++) {
                let school = tableSchool[i];

                if (school.id == idSchoolUpdate) {
                    countPeopleUpdate += +school.students;
                    break;
                }
            }
        }

        if (countPeopleUpdate > capacityClassroomUpdate) {
            error += 'Ошибка: вместимость выбранной аудитории меньше количества студентов.<br>';
        }

        return error;
    }

    /**
     * Проверка занятости аудитории в указанный временной промежуток.
     * @param params
     * @returns {string} error or ''
     * @private
     */
    _checkLessonsClassroom(params, add) {
        let entryUpdate = params.entryUpdate;
        let tableData = params.tableData;
        let idClassroomUpdate = entryUpdate.classroom.id;
        let fromUpdate = entryUpdate.date.from;
        let toUpdate = entryUpdate.date.to;
        let error = '';
        let testUpdate;
        let lesson;

        for (let i = 0; i < tableData.length; i++) {
            lesson = tableData[i];
            testUpdate = add ? true : lesson.id != entryUpdate.id;

            if (lesson.classroom.id == idClassroomUpdate && testUpdate) {
                let fromOrigin = lesson.date.from;
                let toOrigin = lesson.date.to;

                if (fromUpdate >= fromOrigin && fromUpdate < toOrigin
                    || fromUpdate < fromOrigin && toUpdate > fromOrigin) {
                    error += 'Ошибка: конфликт в расписании выбранной аудитории.\n' +
                        'Выберете либо другую аудиторию, либо другое время проведения лекции.<br>';
                    break;
                }
            }
        }

        return error;
    }

    _getSchool(id) {
        let tableSchool = this.dataRaw.school;
        let school;
        let result;

        for (let i = 0; i < tableSchool.length; i++) {
            school = tableSchool[i];

            if (school.id == id) {
                result = school;
                break;
            }
        }

        return result;
    }

    _getClassroom(id) {
        let tableClassroom = this.dataRaw.classroom;
        let classroom;
        let result;

        for (let i = 0; i < tableClassroom.length; i++) {
            classroom = tableClassroom[i];

            if (classroom.id == id) {
                result = classroom;
                break;
            }
        }

        return result;
    }

    _getEntry(id, table) {
        for (let i = 0; i < table.length; i++) {
            let entry = table[i];

            if (entry.id == id) {
                return entry;
            }
        }

        return false;
    }

    _writeData(data) {
        if (this.isLs) {
            try {
                this.ls.data = JSON.stringify(data);
            } catch (e) {
                if (e == QUOTA_EXCEEDED_ERR) {
                    alert('Запись невозможна, localStorage не доступен. Проверьте свободное место');
                }
            }
        } 
    }

    _readData() {
        return JSON.parse(this.ls.data);
    }

    _compileData(data) {
        let result = [];
        let lessons = data.lessons;

        for (let i = 0; i < lessons.length; i++) {
            let lesson = lessons[i];
            let lessonCompile = this._compileLesson(lesson);

            result.push(lessonCompile);
        }

        return result;
    }

    _clearData() {
        // delete this.ls.data;
        this.ls.data = '';
    }

    _compileLesson(lesson) {
        let result = {};
        let keys = Object.keys(lesson);

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = lesson[key];

            if (typeof value === 'object' && value.id) {
                let valueOrigin = this._getValueOriginData(key, value.id);

                if (!valueOrigin) {
                    throw new Error(`Don't found element ${key}, id = ${value.id}`);
                }

                result[key] = valueOrigin;

            } else if (Array.isArray(value)) {
                let arr = value;
                let res = [];

                for (let i = 0; i < arr.length; i++) {
                    let id = arr[i].id;

                    if (id) {
                        res.push(this._getValueOriginData(key, id));
                    }
                }

                result[key] = res;

            } else {
                result[key] = value;
            }
        }

        return result;
    }

    _getValueOriginData(key, id) {
        let objects = this.dataRaw[key];

        for (let i = 0; i < objects.length; i++) {
            let object = objects[i];

            if (object.id == id) {
                return object;
            }
        }

        return false;
    }
}