import {displayError, validate} from "./validation.mjs";
import {getCookie} from "./validation.mjs";
import {refreshAccessToken} from "./checkToken.mjs";

refreshAccessToken().then(function (){
    $(document).ready(function (){
            $('#save_button').on('click', function () {
                document.getElementById('error').style.display = 'none'
                const oldPassword = document.getElementById('old_psw_input').value
                const newPassword = document.getElementById('new_psw_input').value
                const confirmedPassword = document.getElementById('cnf_psw_input').value

                let validation = validate(document.getElementsByClassName('value_inp'))
                if (validation !== "") displayError(validation)
                else if (newPassword !== confirmedPassword) {
                    displayError('New password and confirmed password don`t match')
                } else {
                    refreshAccessToken().then(function () {
                        $.ajax({
                            headers: {
                                Authorization: 'Bearer ' + getCookie('access_token')
                            },
                            data: {
                                old_password: oldPassword,
                                new_password: newPassword
                            },
                            type: 'POST',
                            url: '/changeUserPassword'
                        }).done(function () {
                            location.href = '/pharmacy/profile'
                        }).fail(function (data) {
                            displayError(data.responseText)
                        })
                    })
                }
            })

    })
})