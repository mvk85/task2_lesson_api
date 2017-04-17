export default class Popup {
    constructor() {
        this.initWindow();
    }

    initWindow() {
        let win = document.querySelector('.popup__cnt');

        if (!win) {
            win = document.createElement('div');
            win.classList.add('popup__cnt');
            win.innerHTML = '<div class="popup__cnt--window"></div>';
            document.body.appendChild(win);
        }

        this.win = win;
    }

    open(content) {
        this.win.classList.add('active');
        this.setContent(content);
    }

    eventClose(nodeString) {
        let node = document.querySelector(nodeString);

        node.addEventListener('click', (event) => {
            this.close();
            event.preventDefault();
        })
    }

    close() {
        this.win.classList.remove('active');
    }

    setContent(content) {
        let container = this.win.querySelector('.popup__cnt--window');

        container.innerHTML = content;
    }
} 