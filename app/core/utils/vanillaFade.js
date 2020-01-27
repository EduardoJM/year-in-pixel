const fade = (type, ms, el) => {
    let element = el;
    if (typeof element === 'string') {
        element = document.querySelector(el);
    }
    const isIn = type === 'in';
    let opacity = isIn ? 0 : 1;
    const interval = 50;
    const duration = ms;
    const gap = interval / duration;
    if (isIn) {
        element.style.display = 'inline';
        element.style.opacity = opacity;
    }
    let fading = null;
    const func = () => {
        opacity = isIn ? opacity + gap : opacity - gap;
        element.style.opacity = opacity;
        if (opacity <= 0) {
            element.style.display = 'none';
        }
        if (opacity <= 0 || opacity >= 1) {
            window.clearInterval(fading);
        }
    };
    fading = window.setInterval(func, interval);
};

module.exports = fade;
