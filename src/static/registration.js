import {displayError, validate} from './validation.mjs';

$(document).ready(function () {
    $('.button').on('click', function() {
        document.getElementById("error").style.display = 'none'
        let validation = validate(document.getElementsByClassName('value_reg'))
        console.log(validation)
        if (validation !== "") displayError(validation)
        else if (($('#password_input').val() !== $('#confirm_password_input').val())) displayError('Passwords don`t match')
        else {
            $.ajax({
                data: {
                    username: $('#username_input').val(),
                    first_name: $('#first_name_input').val(),
                    last_name: $('#last_name_input').val(),
                    email: $('#email_input').val(),
                    phone: $('#phone_input').val(),
                    password: $('#password_input').val(),
                    date_of_birth: $('#date_of_birth_input').val(),
                    provisor: false
                },
                type: 'POST',
                url: '/user'
            }).fail(function (data) {
                displayError(data.responseText.slice(1, data.responseText.length-2))
            }).done(function (){
                location.href = '/pharmacy/login'
                for(let element of Array.from(document.getElementsByClassName('value_reg'))){
                    document.getElementById(element.id).value = ''
                }
            })
        }
    })
})