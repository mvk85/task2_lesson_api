let dataRaw = {
    lessons: [
        {
            id: 1,
            school: { id: 1 },
            name: 'Адаптивная вёрстка',
            lector: { id: 1 },
            date: { from: 1498926600000, to: 1498930200000 }, // 1.07 19:30-20:30
            classroom: { id: 1 },
            material: { id: 1 }
        },
        {
            id: 2,
            school: { id: 1 },
            name: 'Работа с сенсорным пользовательским вводом',
            lector: { id: 1 },
            date: { from: 1499013000000, to: 1499020200000 },   // 2.07 19:30-21:30
            classroom: { id: 1 },
        },
        {
            id: 3,
            school: { id: 1 },
            name: 'Мультимедиа: возможности браузера',
            lector: { id: 2 },
            date: { from: 1499099400000, to: 1499106600000 },   // 3.07 19:30-21:30
            classroom: { id: 2 },
        },
        {
            id: 4,
            school: { id: 2 },
            name: 'Java Blitz (Часть 1)',
            lector: { id: 3 },
            date: { from: 1498924860000, to: 1498932060000 },   // 1.07 19:00-21:00
            classroom: { id: 3 },
            material: { id: 2 }
        },
        {
            id: 5,
            school: { id: 2 },
            name: 'Git & Workflow',
            lector: { id: 4 },
            date: { from: 1499013000000, to: 1499016600000 },   // 2.07 19:30-20:30
            classroom: { id: 4 },
        },
        {
            id: 6,
            school: { id: 2 },
            name: 'Java Blitz (Часть 2)',
            lector: { id: 3 },
            date: { from: 1499099400000, to: 1499104860000 },   // 3.07 19:30-21:00
            classroom: { id: 3 },
        },
        {
            id: 7,
            school: { id: 3 },
            name: 'Идея, исследование, концепт (Часть 1)',
            lector: { id: 5 },
            date: { from: 1498926600000, to: 1498932060000 },   // 1.07 19:30-21:00
            classroom: { id: 4 },
            material: { id: 3 }
        },
        {
            id: 8,
            school: { id: 3 },
            name: 'Идея, исследование, концепт (Часть 2)',
            lector: { id: 5 },
            date: { from: 1499011260000, to: 1499018460000 },   // 2.07 19:00-21:00
            classroom: { id: 2 },
        },
        {
            id: 9,
            school: { id: 3 },
            name: 'Особенности проектирования мобильных интерфейсов',
            lector: { id: 6 },
            date: { from: 1499097660000, to: 1499104860000 },   // 3.07 19:00-21:00
            classroom: { id: 1 },
        },
        {
            id: 10,
            school: [{ id: 1 }, { id: 2 }, { id: 3 }],
            name: 'Идея, исследование, концепт (Часть 2)',
            lector: { id: 5 },
            date: { from: 1499184060000, to: 1499191260000 },   // 4.07 19:00-21:00
            classroom: { id: 2 },
        },
        {
            id: 11,
            school: [{ id: 1 }, { id: 2 }, { id: 3 }],
            name: 'Особенности проектирования мобильных интерфейсов',
            lector: { id: 6 },
            date: { from: 1499270460000, to: 1499277660000 },   // 5.07 19:00-21:00
            classroom: { id: 5 },
        }
    ],
    material: [
        {
            id: 1,
            name: 'Материалы',
            src: 'https://events.yandex.ru/lib/talks/4162/'
        },
        {
            id: 2,
            name: 'Материалы',
            src: 'https://events.yandex.ru/lib/talks/4162/'
        },
        {
            id: 3,
            name: 'Материалы',
            src: 'https://events.yandex.ru/lib/talks/4162/'
        }
    ],
    lector: [
        {
            id: 1,
            name: 'Дмитрий Душкин',
            src: 'https://avatars.mds.yandex.net/get-yaevents/95043/0914ac42b6dc11e687ef002590c62a5c/big',
            description: 'Кандидат технических наук, научный сотрудник ИПУ РАН с 2008 по 2013. Пришёл в Яндекс.Картинки в 2014 году, отвечал за мобильную версию и рост производительности сервиса. В 2016 перешёл в Yandex Data Factory, где разрабатывает интерфейсы и дизайн веб-приложений для B2B.'
        },
        {
            id: 2,
            name: 'Максим Васильев',
            src: 'https://avatars.mds.yandex.net/get-yaevents/194464/21e1dae2b6dc11e687ef002590c62a5c/big',
            description: 'Во фронтенд-разработке с 2007 года. До 2013-го, когда пришёл в Яндекс, работал технологом в студии Лебедева и других компаниях.'
        },
        {
            id: 3,
            name: 'Эдуард Мацуков',
            src: 'https://avatars.mds.yandex.net/get-yaevents/198307/9d9a8672b6da11e687ef002590c62a5c/big',
            description: 'Разрабатываю приложения для Android с 2010 года. В 2014 делал высоконагруженное финансовое приложение. Тогда же начал осваивать АОП, внедряя язык в продакшн. В 2015 разрабатывал инструменты для Android Studio, позволяющие использовать aspectJ в своих проектах. В Яндексе занят на проекте Авто.ру.'
        },
        {
            id: 4,
            name: 'Дмитрий Складнов',
            src: 'https://avatars.mds.yandex.net/get-yaevents/197753/08c605ecb6dc11e687ef002590c62a5c/big',
            description: 'Окончил факультет ИТ Московского Технического Университета. В Яндексе с 2015 года, разрабатывает приложение Auto.ru для Android.'
        },
        {
            id: 5,
            name: 'Антон Тен',
            src: 'https://avatars.mds.yandex.net/get-yaevents/204268/07bb5f8ab6dc11e687ef002590c62a5c/big',
            description: 'В Яндексе с 2014 года. Ведущий дизайнер продукта в сервисах Переводчик, Расписания и Видео.'
        },
        {
            id: 6,
            name: 'Васюнин Николай',
            src: 'https://avatars.mds.yandex.net/get-yaevents/194464/1c55b8d2b6dc11e687ef002590c62a5c/big',
            description: 'Пришёл в Яндекс в 2014 году. Дизайнер продукта в музыкальных сервисах компании, участник команды разработки Яндекс.Радио.'
        }
    ],
    school: [
        {
            id: 1,
            name: 'Разработка интерфейсов',
            students: 20
        },
        {
            id: 2,
            name: 'Мобильная разработка',
            students: 30
        },
        {
            id: 3,
            name: 'Мобильный дизайн',
            students: 25
        }
    ],
    classroom: [
        {
            id: 1,
            name: 'Аудитория 1',
            capacity: 60,
            location: 'корпус 1, 3 этаж'
        },
        {
            id: 2,
            name: 'Аудитория 2',
            capacity: 100,
            location: 'корпус 1, 3 этаж'
        },
        {
            id: 3,
            name: 'Аудитория 3',
            capacity: 40,
            location: 'корпус 2, 1 этаж'
        },
        {
            id: 4,
            name: 'Аудитория 4',
            capacity: 70,
            location: 'корпус 3, 4 этаж'
        },
        {
            id: 5,
            name: 'Аудитория 5',
            capacity: 80,
            location: 'корпус 3, 4 этаж'
        }
    ]
};

export {
    dataRaw
};