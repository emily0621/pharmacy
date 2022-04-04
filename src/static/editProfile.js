import {displayError, getCookie, validate} from "./validation.mjs";
import {refreshAccessToken} from "./checkToken.mjs";

refreshAccessToken().then(function () {
    $.ajax({
        headers: {
            Authorization: 'Bearer ' + getCookie('access_token')
        },
        type: "GET",
        url: '/user'
    }).done(function (data) {
        let input = ['username', 'first_name', 'last_name', 'email', 'phone', 'date_of_birth']
        input.forEach(inp => {
            document.getElementById(`${inp}_input`).setAttribute('placeholder', data[inp])
        })
    }).then(function (){
        $(document).ready(function () {
            $('#save_button').on('click', function () {
                document.getElementById('error').style.display = 'none'
                let validation = validate(document.getElementsByClassName('value_reg'))
                console.log(validation)
                if (validation !== "") displayError(validation)
                else {
                    for(let element of Array.from(document.getElementsByClassName('value_reg'))) {
                        if (element.value === '') element.value = element.getAttribute('placeholder')
                    }
                    refreshAccessToken().then(function (){
                        $.ajax({
                            headers:{
                                Authorization: 'Bearer ' + getCookie('access_token')
                            },
                            data: {
                                username: document.getElementById('username_input').value,
                                first_name: document.getElementById('first_name_input').value,
                                last_name: document.getElementById('last_name_input').value,
                                email: document.getElementById('email_input').value,
                                phone: document.getElementById('phone_input').value,
                                date_of_birth: document.getElementById('date_of_birth_input').value,
                                password: '',
                                provisor: false
                            },
                            type: 'PUT',
                            url: '/user'
                        }).done(function () {
                            location.href = '/pharmacy/profile'
                        }).fail(function (data) {
                            displayError(data)
                        })
                    })
                }
            })
        })
    })
})