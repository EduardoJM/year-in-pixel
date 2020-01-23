const year = [];
year[0] = {
    name: "J",
    days: 31
};
year[1] = {
    name: "F",
    days: 28
};
year[2] = {
    name: "M",
    days: 31
};
year[3] = {
    name: "A",
    days: 30
};
year[4] = {
    name: "M",
    days: 31
};
year[5] = {
    name: "J",
    days: 30
};
year[6] = {
    name: "J",
    days: 31
};
year[7] = {
    name: "A",
    days: 31
};
year[8] = {
    name: "S",
    days: 30
};
year[9] = {
    name: "O",
    days: 31
};
year[10] = {
    name: "N",
    days: 30
};
year[11] = {
    name: "D",
    days: 31
};

document.addEventListener('DOMContentLoaded', function(){
    const buildTable = () => {
        let html = '';
        let max = -1;
        for(let i = 0; i < year.length; i++){
            html += '<div class="column"><div class="row heading">' + year[i].name + '</div>';
            for(let j = 0; j < year[i].days; j++){
                html += '<div class="row" data-day="' + j + '" data-mouth="' + i + '"><div class="color"></div></div>';
            }
            if(year[i].days > max){
                max = year[i].days;
            }
            html += "</div>";
        }
        let leftCol = '<div class="column days-num"><div class="row"></div>';
        for(let i = 0; i < max; i++){
            leftCol += '<div class="row">' + (i + 1).toString() + '</div>';
        }
        leftCol += '</div>';
        document.getElementById('pixels-box').innerHTML = leftCol + html;
    };

    const colorButtonClick = (e) => {
        const el = e.target;
        alert("Terminar o código");
        //el.style.backgroundColor = 'red';
    };

    const bindEvents = () => {
        document.querySelectorAll(".column:not(.days-num) .row:not(.heading) .color").forEach(element => {
            element.addEventListener("click", colorButtonClick);
        });
    };

    buildTable();
    bindEvents();
});