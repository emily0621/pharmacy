import {deleteCookie, refreshAccessToken} from "./checkToken.mjs";
import {displayError, getCookie} from "./validation.mjs";
import {orderInfListClassHtml} from "./baseHtml.mjs";

// deleteCookie('access_token')

console.log(getCookie('access_token'))
let params = new URLSearchParams(location.search)

let order_id = params.get('order')

refreshAccessToken().then(function(){
    $.ajax({
        headers: {Authorization: 'Bearer ' + getCookie('access_token')},
        type: 'GET',
        url: '/order/' + order_id
    }).done(function (data) {
        let order = JSON.parse(data)
        console.log(data)
        document.getElementById('order_title').textContent = 'Order #' + order.id_order
        document.getElementById('order_list').innerHTML += orderInfListClassHtml
        document.getElementById('date').textContent = order.date_order
        document.getElementById('status').textContent = order.status
        $.ajax({
            headers: {Authorization: 'Bearer ' + getCookie('access_token')},
            type: 'GET',
            url: '/medicineFromOrderWithCount/' + order_id
        }).done(function (data){
            let medicine = data.medicine[0]
            console.log(medicine)
            let count = data.count[0]
            let medicineStr = ''
            for (let i = 0; i < medicine.length; i++){
                medicineStr += medicine[i].toLowerCase() + ' x' + count[i] +', '
            }
            document.getElementById('medicine').textContent = medicineStr.slice(0,  medicineStr.length - 2)
        })
        console.log(order.status)
        if (order.status === 'complete' || order.status === 'is being prepared') {
            document.getElementById('delete').style.display = 'flex'
        }
        else{
            document.getElementById('delete').style.display = 'none'
            document.getElementById('error').style.backgroundColor = '#5D8E03'
            displayError('Your order is delivering to you. You can`t cancel it')
        }
        $(document).ready(function() {
            $('#delete').on('click', function (){
                refreshAccessToken().then(function() {
                    $.ajax({
                        headers: {Authorization: 'Bearer ' + getCookie('access_token')},
                        type: 'DELETE',
                        url: '/deleteOrder/' + order_id
                    }).done(function (){
                        location.href = '/pharmacy/orders'
                    })
                })
            })
            $('#medicineById').on('click', function(){
                location.href = '/pharmacy/order/medicine_in_order?order=' + order_id
            })
        })
    }).fail(function() {
        location.href = '/404'
    })
})
