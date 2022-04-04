import {medicineHTML} from "./baseHtml.mjs";
import {medicineList} from "./mainLists.mjs";
import {displayError} from "./validation.mjs";

let params = new URLSearchParams(location.search);
const medicine_param = params.get('name_medicine')
const category_param = params.getAll('category')
const manufacturer_param = params.getAll('manufacturer')
const sort_param = params.get('sort')
const available_param = params.get('available')
let page = params.get('page')

if (page === null) {
    window.location.href += '?page=1'
    page = 1
}

if (parseInt(page) === 1){ document.getElementById('prev_page').style.display = 'none'}

$('#search_text').val(medicine_param)

if (available_param === 'true') { document.getElementById('available_products').checked = true }
else document.getElementById('available_products').checked = false

if (sort_param !== null) { $('#sortSelect').val(sort_param) }

$.ajax({
    contentType: 'application/json',
    dataType: "json",
    data: {
        name_medicine: medicine_param,
        categories: JSON.stringify(category_param),
        manufacturers: JSON.stringify(manufacturer_param),
        available: available_param,
        sort: sort_param,
        page: page
    },
    type: 'GET',
    url: '/search/medicine'
}).done(function (data) {
    let medicines = JSON.parse(data.medicines)
    console.log(medicines)
    if ((parseInt(page) - 1) * 9 + medicines.length === data.count){
        document.getElementById('next_page').style.display = 'none'
    }
    if (medicines.length === 0) displayError('Medicine not found')
    medicineList(medicines)
    document.getElementById('search_text').value = medicine_param
})
$.ajax({
    type: 'GET',
    url: '/categories'
}).done(function (data) {
    const categories = JSON.parse(data)
    Array.from(categories).forEach(category => {
        document.getElementById('categorySelect').innerHTML += '<option>' + category.name_category + '</option>'
    })
    document.getElementById('categorySelect').value = category_param
    Array.from(category_param).forEach(category => {
        console.log(category)
        console.log('lllll')
        $('#categorySelect').val(category_param)
    })
})
$.ajax({
    type: 'GET',
    url: '/manufacturers'
}).done(function (data) {
    const manufacturers = JSON.parse(data)
    Array.from(manufacturers).forEach(manufacturer => {
        document.getElementById('manufacturerSelect').innerHTML += '<option>' + manufacturer + '</option>'
    })
    $('#manufacturerSelect').val(manufacturer_param)
})

$(document).ready(function () {
    $('#search').on('click', function (event){
        const medicine = document.getElementById('search_text').value
        const categories = Array.from(document.getElementById('categorySelect').selectedOptions).map(({ value }) => value);
        const manufacturers = Array.from(document.getElementById('manufacturerSelect').selectedOptions).map(({ value }) => value);
        const sortMethod = document.getElementById('sortSelect').value
        const available = document.getElementById('available_products').checked
        console.log(medicine, categories, manufacturers, sortMethod, available)
        let newLocation = '/pharmacy/products' + '?' + 'name_medicine=' + medicine + '&sort=' + sortMethod + '&available=' + available
        categories.forEach(category => {
            console.log(category)
            newLocation += '&category=' + category
        })
        manufacturers.forEach(manufacturer => {
            newLocation += '&manufacturer=' + manufacturer
        })
        newLocation += '&page=1'
        location.href = newLocation
        event.preventDefault()
    })
    $('.link_block').on('click', function (){
        location.href = '/pharmacy/medicine' + '?' + 'medicine=' + this.id.slice(0, -5)
    })
    $('#prev_page').on('click', function (){
        params.set('page', (parseInt(page) - 1))
        location.href = window.location.pathname + '?' + params
    })
    $('#next_page').on('click', function (event){
        params.set('page', (parseInt(page) + 1))
        location.href = window.location.pathname + '?' + params
    })
})