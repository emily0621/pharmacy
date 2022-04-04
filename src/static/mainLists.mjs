import {medicineHTML, orderInfListClassHtml} from "./baseHtml.mjs";
import {getCookie} from "./validation.mjs";

function medicineList(medicine){
    Array.from(medicine).forEach(medicine => {
        document.getElementById('productsitemsList').innerHTML += medicineHTML
        let image = document.getElementById('medicine_image')
        image.src = '/static/images/medsImg/' + medicine.image + '.png'
        image.alt = medicine.name_medicine
        image.id += medicine.id_medicine
        let information = document.getElementById('medicine_link')
        information.innerHTML += 'Name: ' + medicine.name_medicine + '<br />' + 'Price: ' + medicine.price + '$' + '<br />'
        if (medicine.stock_number !== 0) information.innerHTML += 'In stock'
        else information.innerHTML += 'Not available'
        information.href = '/pharmacy/medicine' + '?medicine=' + medicine.id_medicine
        information.id = 'medicine_' + medicine.id_medicine + '_link'
    })
}
function orderList(orders){
    let orderList = document.getElementById('orders_list')
    Array.from(orders).forEach(order => {
        console.log(order)
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
            console.log(medicine)
            console.log(medicine.length)
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
        })
    })
}

export {medicineList, orderList}