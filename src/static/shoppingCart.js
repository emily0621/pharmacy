import {refreshAccessToken} from "./checkToken.mjs";
import {displayError, getCookie} from "./validation.mjs";
import {buttonListFromShoppingCart, medicineInShoppingCartHTML} from "./baseHtml.mjs";

let medicine
refreshAccessToken().then(function () {
    $.ajax({
        headers: {Authorization: 'Bearer ' + getCookie('access_token')},
        type: 'GET',
        url: '/medicineFromShoppingCart'
    }).done(function (data) {
         medicine = JSON.parse(data)
        let shoppingCart = document.getElementById('shopping_cart')
        Array.from(medicine).forEach(medicine => {
            shoppingCart.innerHTML += medicineInShoppingCartHTML
            let medicineElement = document.getElementById('link_medicine_')
            medicineElement.innerHTML += 'Name: ' + medicine.name_medicine + '<br />' + 'Price: ' + medicine.price + '$' + '<br />'
            if (medicine.stock_number !== 0) medicineElement.innerHTML += 'In stock'
            else medicineElement.innerHTML += 'Not available'
            medicineElement.href = '/pharmacy/medicine?medicine=' + medicine.id_medicine

            document.getElementById('chosen_medicine_').id += medicine.id_medicine
            document.getElementById('num_medicine_').id += medicine.id_medicine

            let medicineImage = document.getElementById('image_medicine_')
            medicineImage.src = '/static/images/medsImg/' + medicine.image + '.png'
            medicineImage.alt = medicine.name_medicine

            medicineElement.id += medicine.id_medicine
            medicineImage.id += medicine.id_medicine
        })
        shoppingCart.innerHTML += buttonListFromShoppingCart
        $(document).ready(function (){
            let orderedMedicine = []
            let countOfOrderedMedicine = []
            $('#order').on('click', function (event){
                document.getElementById('error').style.display = 'none'
                refreshAccessToken().then(function (){
                    for (let i = 0; i < medicine.length; i++) {
                        if (document.getElementById('chosen_medicine_' + medicine[i].id_medicine).checked) {
                            let count = document.getElementById('num_medicine_' + medicine[i].id_medicine).value
                            if (medicine[i].stock_number === 0) {
                                displayError(medicine[i].name_medicine + ' is not available now')
                                break;
                            } else if (count === '') {
                                displayError('Enter count of ' + medicine[i].name_medicine.slice(0, 1).toLowerCase() +
                                    medicine[i].name_medicine.slice(1, medicine[i].name_medicine.length) + ' to order')
                                break;
                            } else if (count > medicine[i].stock_number) {
                                displayError('Max count of ' + medicine[i].name_medicine.slice(0, 1).toLowerCase() +
                                    medicine[i].name_medicine.slice(1, medicine[i].name_medicine.length) + ' can be ' + medicine[i].stock_number)
                                break;
                            } else {
                                orderedMedicine.push(medicine[i].id_medicine)
                                countOfOrderedMedicine.push(count)
                            }
                        }
                    }
                    if (document.getElementById('error').style.display !== 'block') {
                        if (orderedMedicine.length === 0) {
                            displayError('Chose at least one medicine to make order')
                        } else {
                            console.log(orderedMedicine)
                            console.log(countOfOrderedMedicine)
                            $.ajax({
                                headers: {Authorization: 'Bearer ' + getCookie('access_token')},
                                data: {
                                    medicine: JSON.stringify(orderedMedicine),
                                    count: JSON.stringify(countOfOrderedMedicine)
                                },
                                type: 'POST',
                                url: '/make_order'
                            }).done(function (){
                                console.log(document.getElementById('delete').checked)
                                if (document.getElementById('delete').checked){
                                    $.ajax({
                                        headers: {Authorization: 'Bearer ' + getCookie('access_token')},
                                        data: {
                                            medicine: JSON.stringify(orderedMedicine)
                                        },
                                        type: 'DELETE',
                                        url: '/shopping_cart'
                                    })
                                }
                                location.href = '/pharmacy/orders'
                            })
                        }
                    }
                })

            })
        })
    })
})
