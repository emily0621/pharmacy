import {refreshAccessToken} from "./checkToken.mjs";
import {getCookie} from "./validation.mjs";
import {orderList} from "./mainLists.mjs";
import {orderInfListClassHtml} from "./baseHtml.mjs";

let params = new URLSearchParams(location.search)
let page = params.get('page')
if (page === null){
    page = 1
    // params.set('page', 1)
    location.search += '?' + 'page=1'
}

refreshAccessToken().then(function () {
    $.ajax({
        headers: {Authorization: 'Bearer ' + getCookie('access_token')},
        data: {page: parseInt(page)},
        type: 'GET',
        url: '/order_for_login_user'
    }).done(function (data) {
        let orders = JSON.parse(data.orders)
        if (orders.length === 0) {
            document.getElementById('error_search').textContent = 'You don`t have any order'
            document.getElementById('error_search').style.display = 'block'
        } else {
            let orderList = document.getElementById('orders_list')
            Array.from(orders).forEach(order => {
                orderList.innerHTML += orderInfListClassHtml
                $.ajax({
                    headers: {Authorization: 'Bearer ' + getCookie('access_token')},
                    data: {order: order.id_order},
                    type: 'GET',
                    url: '/medicineFromOrder'
                }).done(function (data) {
                    let medicineStr = ''
                    let medicine = JSON.parse(data)
                    const len = 30
                    for (let i = 0; i < medicine.length; i++) {
                        if (medicineStr.length <= len) {
                            medicineStr += medicine[i].name_medicine + ', '
                        } else break;
                    }
                    medicineStr = medicineStr.substr(0,medicineStr.length - 2)
                    if(medicineStr.length >= len) medicineStr += '...'
                    document.getElementById('order_number').textContent = 'Order #' + order.id_order
                    document.getElementById('date').textContent = order.date_order
                    document.getElementById('status').textContent = order.status
                    document.getElementById('medicine').textContent = medicineStr
                 }).then(function (){
                    document.getElementById('order_number').id += order.id_order
                    document.getElementById('date').id = 'date_order_' + order.id_order
                    document.getElementById('status').id = 'status_order_' + order.id_order
                    document.getElementById('medicine').id = 'medicine_order_' + order.id_order
                    document.getElementById('inf_order_list').id += order.id_order
                })
            })
        }
        if (parseInt(page) === 1){
            document.getElementById('prevPage').style.display = 'none'
        }
        if ((parseInt(page) - 1) * 6 + orders.length <= data.count){
            document.getElementById('nextPage').style.display = 'none'
        }
    }).then(function() {
        refreshAccessToken().then(function () {
            $(document).ready(function () {
                $('#new_order').on('click', function (event) {
                    location.href = '/pharmacy/shopping_cart'
                    event.preventDefault()
                })
                $('#prevPage').on('click', function () {
                    let newLocation = '/pharmacy/orders'
                    params.set('page', parseInt(page) - 1)
                    location.href = newLocation + '?' + params
                })
                $('#nextPage').on('click', function () {
                    let newLocation = '/pharmacy/orders'
                    params.set('page', parseInt(page) + 1)
                    location.href = newLocation + '?' + params
                })
                $('.information').on('click', function () {
                    location.href = '/pharmacy/order?order=' + this.id.substr(14, this.id.length)
                })
            })
        })
    })
})

