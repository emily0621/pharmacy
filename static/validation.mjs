function getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function validate(el){
    for(let element of Array.from(el)){
        if (element.validity.valueMissing) {
            return `Enter ${element.name}`
        }
        if (element.validity.tooShort) {
            return `${element.name.charAt(0).toUpperCase()}${element.name.slice(1)} must be at least ${element.minLength} characters long`
        }
        if (element.validity.tooLong) {
            return `${element.name.charAt(0).toUpperCase()}${element.name.slice(1)} must be not more then ${element.maxLength} characters long`
        }
        if (element.validity.typeMismatch) {
            return `${element.name.charAt(0).toUpperCase()}${element.name.slice(1)} doesn\`t match the type`
        }
        if (element.name === 'date of birth') {
            if (getAge(element.value) <= 18) return `You must be at least 18`
            else if (new Date(element.value) < new Date(1920, 1,1)) return `Minimal date is 01-01-1920`
        }
    }
    return ""
}

function searchValidation(phone, date_of_birth){
    let phoneNumber = /^\d+$/
    for (let i = 0; i < phone.length; i++) {
        console.log(phone[i])
        if (phone[i] !== '' && phoneNumber.test(phone[i]) === false){
            return [false, 'Use only digits in phone number']
        }
    }
    for (let i = 0; i < date_of_birth.length; i++){
        console.log((new Date(date_of_birth[i])).getTime())
        if (date_of_birth[i] !== '' && (isNaN((new Date(date_of_birth[i])).getTime()) || date_of_birth[i].split('-').length !== 3)){
            console.log('nan')
            return [false, 'Use valid date:<br/>For period: yyyy-mm-dd ~ yyyy-mm-dd OR dd-mm-yyyy ~ dd-mm-yyyy<br/>For concrete date: yyyy-mm-dd OR dd-mm-yyyy']
        }
    }
    if (date_of_birth.length === 2 && new Date(date_of_birth[0]) > new Date(date_of_birth[1])){
        return [false, 'First date must be less then second']
    }
    return [true, 'Valid data']
}

function getCookie(name){
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function displayError(messsage){
    document.getElementById('error').style.display = 'block'
    document.getElementById('error').textContent = messsage
}

export {validate, getCookie, searchValidation, displayError}