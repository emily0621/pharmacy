import {refreshAccessToken} from "./checkToken.mjs";
import {getCookie} from "./validation.mjs";
import {medicineList} from "./mainLists.mjs";
import {medicineHTML} from "./baseHtml.mjs";

let params = new URLSearchParams(location.search)

const order_id = params.get('order')
let page = params.get('page')

console.log(order_id)

if (order_id === null){
    location.href = '/404'
} else if (page === null){
    page = 1
    params.set('page', 1)
    location.href = '/pharmacy/order/medicine_in_order?' + params
} else {
    document.getElementById('title_order').textContent += order_id
    refreshAccessToken().then(function () {
        $.ajax({
            headers: {Authorization: 'Bearer ' + getCookie('access_token')},
            type: 'GET',
            url: '/medicineInOrder/' + order_id + '/' + page
        }).done(function (data) {
            let medicine = JSON.parse(data.medicine)
            let count = data.count
            Array.from(medicine).forEach(medicine => {
                console.log(medicine)
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
        }).fail(function () {
            location.href = '/404'
        })
    })
}