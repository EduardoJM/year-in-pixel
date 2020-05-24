const toggleModal = (id, display) => {
    const dlg = document.getElementById(id);
    if (dlg.dataset.dialogOpening === true || dlg.dataset.dialogClosing === true) {
        return;
    }
    const opened = dlg.style.display === display; // 'flex'
    dlg.dataset.dialogClosing = false;
    dlg.dataset.dialogOpening = false;
    if (!opened) {
        dlg.style.display = display; // 'flex'
        dlg.dataset.dialogOpening = true;
    } else {
        dlg.dataset.dialogClosing = true;
    }
    const time = 200;
    const count = 10;
    const interval = time / count;
    let iteration = 0;
    const changeOpacity = () => {
        let opacity = (1 / count) * iteration;
        if (opened) {
            opacity = (1 - opacity);
        }
        dlg.style.opacity = opacity;
        iteration += 1;
        if (iteration < count) {
            setTimeout(changeOpacity, interval);
        } else {
            if (opened) {
                dlg.style.opacity = 0;
                dlg.style.display = 'none';
            } else {
                dlg.style.opacity = 1;
            }
            dlg.dataset.dialogClosing = false;
            dlg.dataset.dialogOpening = false;
        }
    };
    setTimeout(changeOpacity, interval);
};

const closeModalIfOpened = (id, display) => {
    const dlg = document.getElementById(id);
    if (dlg.dataset.dialogOpening === true || dlg.dataset.dialogClosing === true) {
        return;
    }
    const opened = dlg.style.display === display; // 'flex'
    if (!opened) {
        return;
    }
    dlg.dataset.dialogClosing = true;
    dlg.dataset.dialogOpening = false;
    const time = 200;
    const count = 10;
    const interval = time / count;
    let iteration = 0;
    const changeOpacity = () => {
        const opacity = 1 - ((1 / count) * iteration);
        dlg.style.opacity = opacity;
        iteration += 1;
        if (iteration < count) {
            setTimeout(changeOpacity, interval);
        } else {
            dlg.style.opacity = 0;
            dlg.style.display = 'none';
            dlg.dataset.dialogClosing = false;
        }
    };
    setTimeout(changeOpacity, interval);
};

module.exports = {
    toggleModal,
    closeModalIfOpened,
};
