$(document).ready(function () {
    $('#settingModal').on('show.bs.modal', function (event) {
        stopautorefresh()
    })
    $('#settingModal').on('hidden.bs.modal', function (event) {
        startautorefresh()
    })
});
function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate)
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function clearCookie(name) {
    setCookie(name, "", -1);
}

function set_check() {
    setCookie('sound', document.getElementById('alertSound').checked ? 1 : 0, 365);
}

function countdown() {
    setCookie('countdown', document.getElementById('countdown').checked ? 1 : 0, 365);

    if (document.getElementById('countdown').checked == 1) {
        $("#sec").show()
    } else {
        $("#sec").hide()
    }

}

function updateInterval(e) {
    var options = e.options;
    var seconds = options[options.selectedIndex].value;
    if (seconds > 0) {
        /*stopautorefresh();*/
        setCookie('interval', seconds, 365);

        /*startautorefresh();*/
    } else {
        setCookie('interval', seconds, 365);
        /*stopautorefresh();*/
    }
}

function autorefresh() {
    interval = getCookie('interval');
    if (interval != null) {
        t2 = setTimeout(function () { location.reload() }, interval * 1000);
    }
}

function sec() {
    if (301 > timerc > 0) {
        $("#sec").html(timerc);
        --timerc;
        t1 = setTimeout("sec()", 1000);
    }
};

function stopautorefresh() {
    if (typeof t1 == "number") {
        clearTimeout(t1);
    }
    if (typeof t2 == "number") {
        clearTimeout(t2);
    }
    $("#sec").text('');
}

function startautorefresh() {
    x = getCookie('interval');
    if (x == null || x == "null" || x == "" || x == "undefined" || x == false || x == undefined) {
        setCookie('interval', '15', 365);
        $("#interval_15").prop('selected', true);
    }
    timerc = getCookie('interval');
    
    y = getCookie('countdown')
    if (y == "0") {
        $("#sec").hide()
    }

    sec();
    autorefresh();
}

startautorefresh()