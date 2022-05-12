class Lb {
    constructor(options) {
        this.lbBox = document.getElementById(options.id);
        this.lbItems = this.lbBox.querySelectorAll('.lb-item');
        this.lbSigns = this.lbBox.querySelectorAll('.lb-sign li');
        this.lbCtrlL = this.lbBox.querySelectorAll('.lb-ctrl')[0];
        this.lbCtrlR = this.lbBox.querySelectorAll('.lb-ctrl')[1];

        this.curIndex = 0;
        this.numItems = this.lbItems.length;
        this.status = true;
        this.speed = options.speed || 600;
        this.delay = options.delay || 3000;
        this.direction = options.direction || 'left';
        this.screenKeyEvent = options.screenKeyEvent || false;
        this.screenTouchEvent = options.screenTouchEvent || false;

        this.handleEvents();
        this.setTransition();
    }

    start() {
        const event = {
            srcElement: this.direction == 'left' ? this.lbCtrlR : this.lbCtrlL
        };
        const clickCtrl = this.clickCtrl.bind(this);
        this.interval = setInterval(clickCtrl, this.delay, event);
    }

    pause() {
        clearInterval(this.interval);
    }
    setTransition() {
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        const styleRule = `.
        lb - item
        {
            transition: left
            ${this.speed}
            ms
            ease -in -out
        }`
    styleElement.sheet.insertRule(styleRule, 0);
    }

    clickCtrl(event) {
        if (!this.status) return;
        this.status = false;
        if (event.srcElement == this.lbCtrlR) {
            var fromIndex = this.curIndex,
                toIndex = (this.curIndex + 1) % this.numItems,
                direction = 'left';
        } else {
            var fromIndex = this.curIndex;
            toIndex = (this.curIndex + this.numItems - 1) % this.numItems,
                direction = 'right';
        }
        this.slide(fromIndex, toIndex, direction);
        this.curIndex = toIndex;
    }

    clickSign(event) {
        if (!this.status) return;
        this.status = false;
        const fromIndex = this.curIndex;
        const toIndex = parseInt(event.srcElement.getAttribute('slide-to'));
        const direction = fromIndex < toIndex ? 'left' : 'right';
        this.slide(fromIndex, toIndex, direction);
        this.curIndex = toIndex;
    }

    touchScreen(event) {
        if (event.type == 'touchstart') {
            this.startX = event.touches[0].pageX;
            this.startY = event.touches[0].pageY;
        } else {
            this.endX = event.changedTouches[0].pageX;
            this.endY = event.changedTouches[0].pageY;

            const dx = this.endX - this.startX
            const dy = this.startY - this.endY;
            const angle = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);
            if (Math.abs(dx) < 10 || Math.abs(dy) < 10) return;
            if (angle >= 0 && angle <= 45) {
                this.lbCtrlL.click();
            } else if (angle >= 135 && angle <= 180) {
                this.lbCtrlR.click();
            }
        }
    }

    keyDown(event) {
        if (event && event.keyCode == 37) {
            this.lbCtrlL.click();
        } else if (event && event.keyCode == 39) {
            this.lbCtrlR.click();
        }
    }

    handleEvents() {

        this.lbBox.addEventListener('mouseleave', this.start.bind(this));
        this.lbBox.addEventListener('mouseover', this.pause.bind(this));
        this.lbCtrlL.addEventListener('click', this.clickCtrl.bind(this));
        this.lbCtrlR.addEventListener('click', this.clickCtrl.bind(this));

        for (let i = 0; i < this.lbSigns.length; i++) {
            this.lbSigns[i].setAttribute('slide-to', i);
            this.lbSigns[i].addEventListener('click', this.clickSign.bind(this));
        }
        if (this.screenKeyEvent) {
            document.addEventListener('keydown', this.keyDown.bind(this));
        }

        if (this.screenTouchEvent) {
            this.lbBox.addEventListener('touchstart', this.touchScreen.bind(this));
            this.lbBox.addEventListener('touchend', this.touchScreen.bind(this));
        }
    }

    slide(fromIndex, toIndex, direction) {
        if (direction == 'left') {
            this.lbItems[toIndex].className = "lb-item next";
            var fromClass = 'lb-item active left',
                toClass = 'lb-item next left';
        } else {
            this.lbItems[toIndex].className = "lb-item prev";
            var fromClass = 'lb-item active right',
                toClass = 'lb-item prev right';
        }
        this.lbSigns[fromIndex].className = "";
        this.lbSigns[toIndex].className = "active";

        setTimeout((() => {
            this.lbItems[fromIndex].className = fromClass;
        this.lbItems[toIndex].className = toClass;
    }
).
    bind(this),50);
    setTimeout((() => {
        this.lbItems[fromIndex].className = 'lb-item';
        this.lbItems[toIndex].className = 'lb-item active';
        this.status = true; 
}
).
bind(this), this.speed + 50);
}
}