import json
from src import app, client
from alembic.command import upgrade, downgrade
from alembic.config import Config
from src.inserts import populate_db
from flask_jwt_extended import create_access_token
import pytest
from test_objects import TestOrder, TestUser, TestMedicine


@pytest.fixture
def app_context():
    with app.app_context():
        yield


@pytest.fixture(scope="module", autouse=True)
def setup():
    downgrade(Config('alembic.ini'), "-1")
    upgrade(Config('alembic.ini'), "+1")
    populate_db()
    assert True
    yield
    assert True


def test_get_all_medicine():
    response = client.get('/pharmacy')
    assert response.status_code == 200 and str(response.json).count('{') == 9


def test_get_medicine_by_id():
    response = client.get('/pharmacy/1')
    assert response.status_code == 200 and "\"name_medicine\": \"meds1\"" in str(response.json)

    response = client.get('/pharmacy/10')
    assert response.status_code == 404 and response.json == "Medicines not found"


def test_get_medicine_by_category():
    response = client.get('/pharmacy/Category/1')
    json_response = json.loads(response.get_data())
    assert response.status_code == 200 and json_response.count("{") == 1

    response = client.get('/pharmacy/Category/4')
    assert response.status_code == 404 and response.json == "Category not found"


def test_get_order_by_user(app_context):
    token = create_access_token(1)
    response = client.get('/pharmacy/ordersByUser/1',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    json_response = json.loads(response.get_data())
    assert response.status_code == 200 and len(json_response) == 2

    token = create_access_token(6)
    response = client.get('/pharmacy/ordersByUser/1',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    json_response_provisor = json.loads(response.get_data())
    assert response.status_code == 200 and json_response_provisor == json_response

    token = create_access_token(4)
    response = client.get('/pharmacy/ordersByUser/1', headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "Available only for provisor or yourself"


def test_get_inf_about_all_orders(app_context):
    token = create_access_token(6)
    response = client.get('/pharmacy/order', headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    json_response = json.loads(response.get_data())
    assert response.status_code == 200 and len(json_response) == 3

    token = create_access_token(1)
    response = client.get('/pharmacy/order', headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "Available only for provisor"


def test_get_inf_about_order(app_context):
    token = create_access_token(6)
    response = client.get('/pharmacy/order/1', headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 200 and "\'shipDate\': \'2020-11-05\'" in str(response.json)

    token = create_access_token(6)
    response = client.get('/pharmacy/order/10', headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 404 and response.json == "Order not found"

    token = create_access_token(1)
    response = client.get('/pharmacy/order/1', headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "Available only for provisor"


def test_order_medicine(app_context):
    token = create_access_token(1)
    order = TestOrder.order1
    response = client.post('/pharmacy/order',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=order, content_type='application/json')
    assert response.status_code == 201 and "\'medicine_id\': 3" in str(response.json) \
           and "\'user_id\': 1" in str(response.json)

    token = create_access_token(6)
    order = TestOrder.order1
    response = client.post('/pharmacy/order',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=order, content_type='application/json')
    assert response.status_code == 400 and response.json == "Don`t use your provisor account to order meds"

    token = create_access_token(1)
    order = TestOrder.order2
    response = client.post('/pharmacy/order',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=order, content_type='application/json')
    assert response.status_code == 500 and response.json == 'Medicine doesn`t exist.'

    token = create_access_token(1)
    order = TestOrder.order3
    response = client.post('/pharmacy/order',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=order, content_type='application/json')
    assert response.status_code == 500 and response.json == "Not available. Add to demand"

    token = create_access_token(1)
    order = TestUser.user1
    response = client.post('/pharmacy/order',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=order, content_type='application/json')
    assert response.status_code == 400 and response.json == "Invalid input"


def test_delete_order(app_context):
    token = create_access_token(6)
    response = client.delete('/pharmacy/order/1',
                             headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 200 and response.json == "Successfully deleted"

    token = create_access_token(1)
    response = client.delete('/pharmacy/order/1',
                             headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "Available only for provisor"

    token = create_access_token(6)
    response = client.delete('/pharmacy/order/1',
                             headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "Order not found"


def test_add_to_demand(app_context):
    token = create_access_token(1)
    response = client.patch('/pharmacy/2',
                            headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 200 and "\'demand\': True" in str(response.json)

    token = create_access_token(6)
    response = client.patch('/pharmacy/2',
                            headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "Don`t use your provisor account"

    token = create_access_token(1)
    response = client.patch('/pharmacy/20',
                            headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 404 and response.json == "Medicines not found"

    token = create_access_token(1)
    response = client.patch('/pharmacy/1',
                            headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 500 and "Meds is available to buy"


def test_login():
    user = TestUser.user1
    response = client.get('/user/login', data=user, content_type='application/json')
    assert response.status_code == 200

    user = TestUser.user2
    response = client.get('/user/login', data=user, content_type='application/json')
    assert response.status_code == 400 and response.json == "Wrong password"

    user = TestUser.user3
    response = client.get('/user/login', data=user, content_type='application/json')
    assert response.status_code == 400 and response.json == "User not found"


def test_logout(app_context):
    token = create_access_token(1)
    response = client.get('/user/logout',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 200 and response.json == "Successful logout"


def test_change_inf_about_user(app_context):
    token = create_access_token(1)
    user = TestUser.user1_inf
    response = client.put('/user/user1',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                          data=user, content_type='application/json')
    assert response.status_code == 200 and "\'username\': \'new_user1\'" in str(response.json)

    token = create_access_token(1)
    user = TestUser.user2_inf
    response = client.put('/user/user2',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                          data=user, content_type='application/json')
    assert response.status_code == 400 and response.json == "You can change only your own information"

    token = create_access_token(1)
    user = TestUser.user1_inf
    response = client.put('/user/user10',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                          data=user, content_type='application/json')
    assert response.status_code == 404 and response.json == {'message': 'User not found'}

    token = create_access_token(2)
    user = TestMedicine.medicine1
    response = client.put('/user/user2',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                          data=user, content_type='application/json')
    assert response.status_code == 400 and response.json == "Invalid input"

    token = create_access_token(2)
    user = TestUser.user1_inf
    response = client.put('/user/user2',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                          data=user, content_type='application/json')
    assert response.status_code == 409 and response.json == {'message': 'Such user exists'}


def test_add_new_provisor(app_context):
    token = create_access_token(6)
    user = TestUser.provisor1_inf
    response = client.post('/provisor',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=user, content_type='application/json')
    assert response.status_code == 201 and "\'username\': \'provisor3\'"

    token = create_access_token(1)
    user = TestUser.provisor1_inf
    response = client.post('/provisor',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=user, content_type='application/json')
    assert response.status_code == 400 and response.json == "You are not provisor"

    token = create_access_token(6)
    user = TestUser.user1
    response = client.post('/provisor',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=user, content_type='application/json')
    assert response.status_code == 400 and response.json == "Invalid input"

    token = create_access_token(6)
    user = TestUser.user1_inf
    response = client.post('/provisor',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=user, content_type='application/json')
    assert response.status_code == 500 and response.json == 'User with this username already exists'


def test_get_inf_about_user(app_context):
    token = create_access_token(6)
    response = client.get('/user/user2',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 200 and "\'username\': \'user2\'" in str(response.json) \
           and str(response.json).count('{') == 1

    token = create_access_token(2)
    response = client.get('/user/user2',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 200 and "\'username\': \'user2\'" in str(response.json) \
           and str(response.json).count('{') == 1

    token = create_access_token(2)
    response = client.get('/user/user3',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "You can get only information about yourself."

    token = create_access_token(2)
    response = client.get('/user/user10',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 404 and response.json == {'message': 'User not found'}


def test_add_new_user():
    user = TestUser.user6_inf
    response = client.post('/user', data=user, content_type='application/json')
    assert response.status_code == 201 and "\'username\': \'user6\'" in str(response.json)

    user = TestUser.user1
    response = client.post('/user', data=user, content_type='application/json')
    assert response.status_code == 400 and response.json == "Invalid input"

    user = TestUser.user1_inf
    response = client.post('/user', data=user, content_type='application/json')
    assert response.status_code == 500 and response.json == 'User with this username already exists'


def test_get_inf_about_all_users(app_context):
    token = create_access_token(6)
    response = client.get('/user',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 200 and len(response.json) == 9

    token = create_access_token(1)
    response = client.get('/user',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "Available only for provisor"


def test_delete_user(app_context):
    token = create_access_token(3)
    response = client.delete('/user/user3',
                             headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 200 and response.json == "Successfully deleted"

    token = create_access_token(1)
    response = client.delete('/user/user2',
                             headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 500 and response.json == "You can delete only your own account"

    token = create_access_token(2)
    response = client.delete('/user/user10',
                             headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "User not found"


def test_get_medicine_in_demand(app_context):
    token = create_access_token(6)
    response = client.get('/medicine/demand',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 200 and len(response.json) == 3

    token = create_access_token(1)
    response = client.get('/medicine/demand',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "Available only for provisor"


def test_edit_medicine(app_context):
    token = create_access_token(6)
    medicine = TestMedicine.medicine1
    response = client.put('/medicine/1',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                          data=medicine, content_type='application/json')
    assert response.status_code == 200 and "\'name_medicine\': \'new_name1\'" in str(response.json)

    token = create_access_token(1)
    medicine = TestMedicine.medicine1
    response = client.put('/medicine/1',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                          data=medicine, content_type='application/json')
    assert response.status_code == 400 and response.json == "Available only for provisor"

    token = create_access_token(6)
    medicine = TestMedicine.medicine1
    response = client.put('/medicine/10',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                          data=medicine, content_type='application/json')
    assert response.status_code == 404 and response.json == "Medicines not found"

    token = create_access_token(6)
    medicine = TestUser.user1
    response = client.put('/medicine/1',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                          data=medicine, content_type='application/json')
    assert response.status_code == 400 and response.json == "Invalid input"

    token = create_access_token(6)
    medicine = TestMedicine.medicine2
    response = client.put('/medicine/1',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                          data=medicine, content_type='application/json')
    assert response.status_code == 500 and response.json == 'Category doesn`t exist.'

    token = create_access_token(6)
    medicine = TestMedicine.medicine4
    response = client.put('/medicine/1',
                          headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                          data=medicine, content_type='application/json')
    assert response.status_code == 409 and response.json == {'message': 'Such medicine exists'}


def test_add_medicine(app_context):
    token = create_access_token(6)
    medicine = TestMedicine.medicine3
    response = client.post('/medicine',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=medicine, content_type='application/json')
    assert response.status_code == 201 and "\'name_medicine\': \'new_medicine1\'" in str(response.json)

    token = create_access_token(1)
    medicine = TestMedicine.medicine3
    response = client.post('/medicine',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=medicine, content_type='application/json')
    assert response.status_code == 400 and response.json == "Available only for provisor"

    token = create_access_token(6)
    medicine = TestUser.user1
    response = client.post('/medicine',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=medicine, content_type='application/json')
    assert response.status_code == 400 and response.json == "Invalid input"

    token = create_access_token(6)
    medicine = TestMedicine.medicine2
    response = client.post('/medicine',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=medicine, content_type='application/json')
    assert response.status_code == 500 and response.json == 'Category doesn`t exist.'

    token = create_access_token(6)
    medicine = TestMedicine.medicine3
    response = client.post('/medicine',
                           headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))},
                           data=medicine, content_type='application/json')
    assert response.status_code == 500 and response.json == 'Medicine already exists.'


def test_delete_medicine(app_context):
    token = create_access_token(6)
    response = client.delete('/medicine/1',
                             headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 200 and response.json == {'message': "Successfully deleted"}, 200

    token = create_access_token(1)
    response = client.delete('/medicine/1',
                             headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "Available only for provisor"

    token = create_access_token(6)
    response = client.delete('/medicine/11',
                             headers={'Authorization': 'Bearer {}'.format(token.decode("utf-8"))})
    assert response.status_code == 400 and response.json == "Medicines not found"
