function OnSaveButtonClick() {alert("OnSaveButtonClick");
}

function OnLodeButtonClick() {alert("OnLodeButtonClick");
}

function OnRsvDelButtonClick() {alert("OnRsvDelButtonClick");
}

// var month  = new Object();
// var target = new Object();
window.onload = function () {
    let month = document.getElementById('month');
    document.createElement('option')
    for(let i = 1; i <= 12; i++){
        let option = document.createElement('option');
        option.setAttribute('value', i);
        option.innerHTML = i + '月';
        month.appendChild(option);
    };
};