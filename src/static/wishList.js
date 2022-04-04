import {refreshAccessToken} from "./checkToken.mjs";
import {getCookie} from "./validation.mjs";
import {medicineHTML} from "./baseHtml.mjs";
import {medicineList} from "./mainLists.mjs";

refreshAccessToken().then(function() {
    $.ajax({
        headers: {Authorization: 'Bearer ' + getCookie('access_token')},
        type: 'GET',
        url: '/medicineFromWishList'
    }).done(function (data){
        let medicine = JSON.parse(data)
        medicineList(medicine)
    })
})