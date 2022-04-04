import {userInfListClassHtml} from "./baseHtml.mjs";
import {refreshAccessToken} from "./checkToken.mjs";
import {displayError, getCookie} from "./validation.mjs";

let userListHtml = document.getElementById('usersList')
let params = new URLSearchParams(location.search);

let page = params.get('page')
if (page == 1) document.getElementById('prev_page').style.display = 'none'

refreshAccessToken().then(function() {
    $.ajax({
        contentType: "application/json",
        dataType: "JSON",
        headers: {Authorization: 'Bearer ' + getCookie('access_token')},
        data: {
            username: JSON.stringify(params.getAll('username')),
            first_name: JSON.stringify(params.getAll('firstname')),
            last_name: JSON.stringify(params.getAll('lastname')),
            email:  JSON.stringify(params.getAll('email')),
            phone: JSON.stringify(params.getAll('phone')),
            date_of_birth: JSON.stringify(params.getAll('date_of_birth')),
            page: page
        },
        type: 'GET',
        url: '/findUser'
    }).done(function (data){
        let users = data.users
        if ((parseInt(page) - 1) * 8 + users.length === data.count) document.getElementById('next_page').style.display = 'none'
        if (users.length !== 0) {
            Array.from(users).forEach(element => {
                userListHtml.innerHTML += userInfListClassHtml
                document.getElementById('user_information_block').href = '/pharmacy/userInformation?username=' + element.username
                document.getElementById('user_information_block').id += element.id_user
                document.getElementsByClassName('inf').item(0).id = `information_${element.username}`
                document.getElementsByClassName('inf').item(0).className = `information`
                let elsementIds = ['username_value', 'first_name_value', 'last_name_value', 'email_value', 'phone_value', 'date_of_birth_value']
                elsementIds.forEach(elId => {
                    document.getElementById(elId).textContent = element[elId.slice(0, -6)]
                    document.getElementById(elId).id = document.getElementById(elId).id + `_${element.username}`
                })
            })
            $('#prev_page').on('click', function (event){
                params.set('page', (parseInt(page) - 1))
                location.href = window.location.pathname + '?' + params
            })
            $('#next_page').on('click', function (event){
                params.set('page', (parseInt(page) + 1))
                location.href = window.location.pathname + '?' + params
            })
        } else{
            displayError('Users not found')
        }
    })
})
