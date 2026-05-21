
// setCookie("a",10, 1000)
function setCookie(nume, val, timpExpirare) {
    let d = new Date();
    d.setTime(d.getTime() + timpExpirare);

    document.cookie = `${nume}=${val}; expires=${d.toUTCString()}; path=/`;
}


function getCookie(nume) {
    let vectorParametri = document.cookie.split(";");

    for (let param of vectorParametri) {
        param = param.trim();

        if (param.startsWith(nume + "=")) {
            return param.split("=")[1];
        }
    }
    return null;
}

function deleteCookie(nume) {
    document.cookie = `${nume}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function deleteAllCookies() {
    let cookies = document.cookie.split(";");

    for (let c of cookies) {
        let nume = c.split("=")[0].trim();
        document.cookie = `${nume}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
}


window.addEventListener("load", function () {

    let banner = document.getElementById("banner-print");
    let btn = document.getElementById("ok_cookies");

    if (getCookie("acceptat_banner")) {
        if (banner) banner.style.display = "none";
    }

    if (btn) {
        btn.onclick = function () {
            setCookie("acceptat_banner", true, 60000); 
            if (banner) banner.style.display = "none";
        };
    }
});

window.addEventListener("load", function () {
    setCookie("ultima_pagina", window.location.pathname, 24 * 60 * 60 * 1000);

});