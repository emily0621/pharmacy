import {refreshAccessToken} from "./checkToken.mjs";
import {getCookie} from "./validation.mjs";

refreshAccessToken().then(function(){
    $.ajax({
        contentType: "application/json",
        dataType: "JSON",
        headers: {Authorization: 'Bearer ' + getCookie('access_token')},
        data: {username: (new URLSearchParams(location.search)).get('username')},
        type: 'GET',
        url: '/userByUsername'
    }).done(function (data) {
        let elementIds = ['username_value', 'first_name_value', 'last_name_value', 'email_value', 'phone_value', 'date_of_birth_value']
        elementIds.forEach(el => { document.getElementById(el).textContent = JSON.parse(data)[el.slice(0, -6)] })
    }).then(function (){
        $(document).ready(function (){
            $('.button').on('click', function (event) {
                location.href = '/pharmacy/orders?username=' + (new URLSearchParams(location.search)).get('username')
                event.preventDefault();
            })
        })
    })
})