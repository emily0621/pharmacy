import {getCookie} from "./validation.mjs";

function deleteCookie(name) {
  document.cookie = name + '=;path=/pharmacy/order;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function refreshAccessToken() {
    return $.ajax({
        headers: {
            Authorization: 'Bearer ' + getCookie('refresh_token')
        },
        data: {
            access_token: getCookie('access_token')
        },
        type: "POST",
        url: '/refresh'
    }).done(function (data) {
        if (data !== "") {
            document.cookie = `access_token=${$.parseJSON(data)['access_token']}; path=/pharmacy`
        }
    })
}

export {refreshAccessToken, deleteCookie}