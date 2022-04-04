import {getCookie} from "./validation.mjs";
import {refreshAccessToken} from "./checkToken.mjs";

const refresh_token = getCookie('refresh_token')
const access_token = getCookie('access_token')

if (access_token === '' && refresh_token === ''){
    location.href = '/pharmacy/login'
} else {
    refreshAccessToken().then(function () {
        $.ajax({
            headers: {
                Authorization: 'Bearer ' + getCookie('access_token')
            },
            type: "GET",
            url: '/user'
        }).done(function (data) {
            let userParams = ['username', 'first_name', 'last_name', 'email', 'phone', 'date_of_birth']
            userParams.forEach(p => {
                document.getElementById(p + '_field').textContent = data[p]
            })
        })
    })
    $(document).ready(function () {
        $('#logout_button').on('click', function () {
            document.cookie = `access_token =`
            document.cookie = `refresh_token =`
            document.cookie = `provisor =`
            window.location = '/pharmacy/login'
        })
    })
}
