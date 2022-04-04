import {displayError, getCookie, validate} from "./validation.mjs";

if (getCookie('refresh_token') !== ''){
    location.href = '/pharmacy/profile'
}else {
    $(document).ready(function () {
        $('.button').on('click', function () {
            document.getElementById("error").style.display = 'none'
            let validation = validate(document.getElementsByClassName('value_reg'))
            if (validation !== "") displayError(validation)
            else {
                $.ajax({
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: {
                        username: document.getElementById('username_input').value,
                        password: document.getElementById('password_input').value
                    },
                    type: 'GET',
                    url: '/user/login'
                }).done(function (data) {
                    console.log(data)
                    document.cookie = `access_token=${$.parseJSON(data)['access_token']}`
                    document.cookie = `refresh_token=${$.parseJSON(data)['refresh_token']}`
                    document.cookie = `provisor=${$.parseJSON(data)['provisor']}`
                    location.href = '/pharmacy/profile'
                }).fail(function (data) {
                    displayError(data.responseText.slice(1, data.responseText.length - 2))
                })
            }
        })
    })
}