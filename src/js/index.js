import mainClass from './main';

let main = new mainClass('.table');

main.filter('#plagin__scheduler--school', 'school');
main.filter('#plagin__scheduler--classroom', 'classroom');
main.editLessons('.plagin__body-tab-cont[data-tab="lessons"]');
main.editSchool('.plagin__body-tab-cont[data-tab="school"]');
main.editClassroom('.plagin__body-tab-cont[data-tab="classroom"]');
main.add('#plagin__scheduler--add');