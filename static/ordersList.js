import {displayError, getCookie} from "./validation.mjs";
import {refreshAccessToken} from "./checkToken.mjs";
import {orderInfListClassHtml} from "./baseHtml.mjs";
import {orderList} from "./mainLists.mjs";

const username = new URLSearchParams(location.search).get('username')
document.getElementById('title_order_list').textContent = 'Orders by ' + username
refreshAccessToken().then(function (){
    $.ajax({
        headers: {Authorization: 'Bearer ' + getCookie('access_token')},
        data: {
            username: username
        },
        type: 'GET',
        url: '/pharmacy/ordersByUser'
    }).done(function (data){
        console.log(data)
        if (data.length === 0) displayError(username + ' doesn`t have any order')
        else orderList(data)
    }).then(function (){
        refreshAccessToken().then(function (){
            $(document).ready(function (){
            })
        })
    })
})