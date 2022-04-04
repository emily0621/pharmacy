let userInfListClassHtml = "            <div class=\"inf\">\n" +
    "                <a class=\"user_block\" id=\"user_information_block\">\n" +
    "                    <ul class=\"inf_list\">\n" +
    "                        <li class=\"property\">Username: </li>\n" +
    "                        <li class=\"property\">Fisrt name:</li>\n" +
    "                        <li class=\"property\">Lisrt name:</li>\n" +
    "                        <li class=\"property\">Email:</li>\n" +
    "                        <li class=\"property\">Phone:</li>\n" +
    "                        <li class=\"property\">Date of birth:</li>\n" +
    "                    </ul>\n" +
    "                    <ul class=\"inf_list\">\n" +
    "                        <li class=\"value\" id=\"username_value\"></li>\n" +
    "                        <li class=\"value\" id=\"first_name_value\"></li>\n" +
    "                        <li class=\"value\" id=\"last_name_value\"></li>\n" +
    "                        <li class=\"value\" id=\"email_value\"></li>\n" +
    "                        <li class=\"value\" id=\"phone_value\"></li>\n" +
    "                        <li class=\"value\" id=\"date_of_birth_value\"></li>\n" +
    "                    </ul>\n" +
    "                </a>\n" +
    "            </div>"

let orderInfListClassHtml = "            <div class=\"information\" id=\"inf_order_list\">\n" +
    "                <a href=\"orderInformation.html\" class=\"user_block\" id=\"orderInf\">\n" +
    "                <h5 class=\'order_number_class\' id=\'order_number\'></h5>\n" +
    "                <div id='orderInfdiv'>\n" +
    "                    <ul class=\"inf_list\" id=\'property\'>\n" +
    "                        <li class=\"property\">Date: </li>\n" +
    "                        <li class=\"property\">Medicines: </li>\n" +
    "                        <li class=\"property\">Status: </li>\n" +
    "                    </ul>\n" +
    "                    <ul class=\"inf_list\" id=\'value_list\'>\n" +
    "                        <li class=\"value\" id=\"date\"></li>\n" +
    "                        <li class=\"value\" id=\"medicine\"></li>\n" +
    "                        <li class=\"value\" id=\"status\"></li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                </a>\n" +
    "            </div>"

let recommendedMedicineHTML = "            <a class=\"link_block\" id=\"medicine_link\">\n" +
    "                <img class=\"product_image\" id=\'medicine\'>\n" +
    "                <br>\n" +
    "            </a>"
let medicineHTML = "            <a class=\"link_block\" id=\"medicine_link\">\n" +
    "                <img class=\"product_image\" id=\"medicine_image\"><br>\n" +
    "            </a>"
let medicineInShoppingCartHTML = "            <div class=\"order\" id=\'order_medicine_\'>\n" +
    "                <input type=\"checkbox\" class=\"checkbox\" id='chosen_medicine_'>\n" +
    "                <a href=\"\" class=\"link_block\" id=\'link_medicine_\'>\n" +
    "                    <img class=\"product_image\" id=\'image_medicine_\'><br>\n" +
    "                </a>\n" +
    "                <span class=\"s\">Count: </span>\n" +
    "                <input type=\"number\" class=\"number\" min=\"1\" required id='num_medicine_'>\n" +
    "            </div>"
let buttonListFromShoppingCart = "            <div class=\"btn_list\" id=\"order_ul\">\n" +
    "                <button class=\"button\" id=\"order\">Order</button>\n" +
    "                <input type=\"checkbox\" class=\"checkbox\" id=\"delete\">\n" +
    "                <label for=\"delete\" class=\"delete_label\">Delete from shopping cart</label>\n" +
    "            </div>"

export {userInfListClassHtml, orderInfListClassHtml, recommendedMedicineHTML, medicineHTML, medicineInShoppingCartHTML,
buttonListFromShoppingCart}