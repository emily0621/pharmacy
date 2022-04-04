import {recommendedMedicineHTML} from "./baseHtml.mjs";

mainPage()

function mainPage(){
    $.ajax({
        type: 'GET',
        url: '/randomMedicine'
    }).done(function (data){
        const medicines = JSON.parse(data)
        Array.from(medicines).forEach(medicine => {
            document.getElementById('recommendedMedicine').innerHTML += recommendedMedicineHTML
            document.getElementById('medicine_link').appendChild(document.createTextNode(medicine.name_medicine))
            document.getElementById('medicine_link').id = medicine.id_medicine += '_link'
            let image = document.getElementById('medicine')
            image.src = '/static/images/medsImg/' + medicine.image + '.png'
            image.alt = medicine.name_medicine
            image.id = medicine.name_medicine
        })
    }).then(function (){
        $(document).ready(function () {
            $('.link_block').on('click', function () {
                location.href = '/pharmacy/medicine' + '?' + 'medicine=' + this.id.slice(0, -5)
            })
            $('#main_button').on('click', function () {
                let params = new URLSearchParams()
                params.set('name_medicine', document.getElementById('main_text_input').value)
                params.set('page', 1)
                location.href = '/pharmacy/products?' + params
            })
        })
    })
}