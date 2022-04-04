import {displayError, getCookie, searchValidation, validate} from "./validation.mjs";
import {refreshAccessToken} from "./checkToken.mjs";

refreshAccessToken().then(function () {
    $(document).ready(function () {
        $('#find').on('click', function () {
            document.getElementById("error").style.display = 'none'
            let data_input = []
            Array.from(document.getElementsByClassName('value_input')).forEach(element => {
                let data
                if (element.name === 'date of birth') {
                    data = element.value.split(' ~ ')
                }
                else {
                    data = element.value.split(', ')
                }
                data_input.push(data)
            })
            let validation = searchValidation(data_input[4], data_input[5])
            if (validation[0]){
                let newLocation = '/pharmacy/users'
                let newParams = new URLSearchParams()
                let userParams = ['username', 'first_name', 'last_name', 'email', 'phone', 'date_of_birth']
                for (let i = 0; i < data_input.length; i++){
                    data_input[i].forEach(data => {
                        if (data !== "") newParams.append(userParams[i], data)
                    })
                }
                newParams.set('page', 1)
                if (newParams.toString().length !== 0) newLocation += '?' + newParams
                location.href = newLocation
            } else displayError(validation[1])
        })
    })
})