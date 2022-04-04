import {displayError, getCookie} from "./validation.mjs";
import {refreshAccessToken} from "./checkToken.mjs";

if(getCookie('access_cookie') !== ''){
    refreshAccessToken().then(mainPage)
} else {mainPage()}

let params = new URLSearchParams(location.search);
let medicine = params.get('medicine')

function mainPage(){
    $.ajax({
        type: 'GET',
        url: '/medicine/' + medicine
    }).done(function (data) {
        let medicine = JSON.parse(data)
        document.getElementById('titleMedicine').textContent = medicine.name_medicine
        $.ajax({
            type: 'GET',
            url: '/category/' + medicine.category_id
        }).done(function (data){
            let category = JSON.parse(data)
            console.log(category)
            let image = document.getElementsByClassName('product_image').item(0)
            image.src = '/static/images/medsImg/' + medicine.image + '.png'
            image.alt = medicine.name_medicine
            let information = document.getElementById('medInformation')
            information.innerHTML = 'Name: ' + medicine.name_medicine + '<br />' +
                'Category:  ' + category.name_category + '<br />' +
                'Manufacturer: ' + medicine.manufacturer + '<br />' +
                'Description: ' + medicine.description + '<br />' +
                'Count: ' + medicine.stock_number + '<br />' +
                'Price: ' + medicine.price + '$'
        })
    }).fail(function (){
        location.href = '/404'
    })
}
$(document).ready(function() {
    $('#delete').on('click', function (){
        refreshAccessToken().then(function (){
            $.ajax({
                headers: {Authorization: 'Bearer ' + getCookie('access_token')},
                type: 'DELETE',
                url: '/medicine/' + medicine
            }).done(
                window.history.back()
            )
        })
    })
    $('#button_small_icon').on('click', function () {
        refreshAccessToken().then(function () {
            $.ajax({
                headers: {Authorization: 'Bearer ' + getCookie('access_token')},
                type: 'POST',
                url: '/wish_list/' + medicine
            }).done(function (data){
                displayError('Successfully added to your wish list')
                document.getElementById('error').style.backgroundColor = '#5D8E03'
            }).fail(function (){
                displayError('Medicine already exists in your wish list')
                document.getElementById('error').style.backgroundColor = 'darkred'
            })
        })
    })
    $('#shopping_cart').on('click', function () {
        refreshAccessToken().then(function () {
            $.ajax({
                headers: {Authorization: 'Bearer ' + getCookie('access_token')},
                type: 'POST',
                url: '/shopping_cart/' + medicine
            }).done(function (data){
                displayError('Successfully added to your shopping cart')
                document.getElementById('error').style.backgroundColor = '#5D8E03'
            }).fail(function (){
                displayError('Medicine already exists in your shopping cart')
                document.getElementById('error').style.backgroundColor = 'darkred'
            })
        })
    })
})