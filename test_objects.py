import json


class TestUser:
    user1 = json.dumps({
        "username": "user1",
        "password": "password1"
    })
    user2 = json.dumps({
        "username": "user1",
        "password": "password2"
    })
    user3 = json.dumps({
        "username": "user10",
        "password": "password1"
    })
    user1_inf = json.dumps({
        "username": "new_user1",
        "phone": "11111111",
        "last_name": "lname",
        "first_name": "fname",
        "email": "email",
        "password": "new_password_1",
        "provisor": False
    })
    user2_inf = json.dumps({
        "username": "user2",
        "phone": "11111111",
        "last_name": "lname",
        "first_name": "fname",
        "email": "email",
        "password": "new_password_1",
        "provisor": False
    })
    user6_inf = json.dumps({
        "username": "user6",
        "phone": "11111111",
        "last_name": "lname",
        "first_name": "fname",
        "email": "email",
        "password": "password6",
        "provisor": False
    })
    provisor1_inf = json.dumps({
        "username": "provisor3",
        "phone": "11111111",
        "last_name": "lname",
        "first_name": "fname",
        "email": "email",
        "password": "password3",
        "provisor": True
    })


class TestMedicine:
    medicine1 = json.dumps({
        "manufacturer": "manufacturer1",
        "name_medicine": "new_name1",
        "demand": True,
        "price": 100,
        "category_id": 1,
        "id_stock_number": 1,
        "demand_number": 1,
        "id_stock": 1
    })
    medicine2 = json.dumps({
        "manufacturer": "manufacturer1",
        "name_medicine": "new_medicine2",
        "demand": 1,
        "price": 100,
        "category_id": 10,
        "id_stock_number": 1,
        "demand_number": 1,
        "id_stock": 1
    })
    medicine3 = json.dumps({
        "manufacturer": "manufacturer1",
        "name_medicine": "new_medicine1",
        "demand": 1,
        "price": 100,
        "category_id": 1,
        "id_stock_number": 1,
        "demand_number": 1,
        "id_stock": 1
    })
    medicine4 = json.dumps({
        "manufacturer": "manufacturer1",
        "name_medicine": "new_name1",
        "demand": True,
        "price": 100,
        "category_id": 1,
        "id_stock_number": 1,
        "demand_number": 1,
        "id_stock": 1
    })


class TestOrder:
    order1 = json.dumps({
       "medicine_id": 3,
       "complete": 1,
       "shipDate": "2020-11-05",
       "user_id": 2,
       "status": "to_do"
    })
    order2 = json.dumps({
       "medicine_id": 30,
       "complete": 1,
       "shipDate": "2020-11-05",
       "user_id": 2,
       "status": "to_do"
    })
    order3 = json.dumps({
       "medicine_id": 9,
       "complete": 1,
       "shipDate": "2020-11-05",
       "user_id": 2,
       "status": "to_do"
    })
