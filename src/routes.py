import datetime
import json

from  sqlalchemy.sql.expression import func
import flask
import flask_jwt_extended
import sqlalchemy.sql.expression
from flask_jwt_extended import set_access_cookies, set_refresh_cookies
import jwt
import numpy
import requests.cookies
from flask import request, render_template
from flask import Flask, jsonify, abort
from flask_restful import Resource
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
import bcrypt
import src
from src import api, db, create_access_token, create_refresh_token, jwt_required, get_jwt_identity, app
from src.models import Medicine, Order, User, Category, MedicinesInOrder, WishList, ShoppingCart
from src.schemas import MedicineSchema, OrderSchema, UserSchema, UserSchemaWithoutPassword, CategorySchema
from sqlalchemy import and_, not_, or_
from sqlalchemy.sql.expression import false
from sqlalchemy import cast, Integer


@app.route('/medicine/<id>', methods=['GET'])
def getMedicineById(id):
    medicine = Medicine.MedicineById(id).first()
    if not medicine:
        return abort(404)
    return jsonify(MedicineSchema().dumps(medicine)), 200


class MedicineInDemandListApi(Resource):
    medicine_schema = MedicineSchema()

    @jwt_required()
    def get(self):
        auth_id_user = get_jwt_identity()
        auth_user = db.session.query(User).filter_by(id_user=auth_id_user).first()
        if not auth_user.provisor:
            return "Available only for provisor", 400
        medicines = db.session.query(Medicine).filter_by(demand=True)
        return self.medicine_schema.dump(medicines, many=True), 200


class MedicineListApi(Resource):
    medicine_schema = MedicineSchema()

    @jwt_required()
    def post(self):
        auth_id_user = get_jwt_identity()
        auth_user = db.session.query(User).filter_by(id_user=auth_id_user).first()
        if not auth_user.provisor:
            return "Available only for provisor", 400
        try:
            medicine = self.medicine_schema.load(request.json, session=db.session)
        except ValidationError:
            return "Invalid input", 400
        medic1 = db.session.query(Medicine).filter_by(name_medicine=medicine.name_medicine).first()
        category = db.session.query(Category).filter_by(id_category=medicine.category_id).first()
        if not category:
            return 'Category doesn`t exist.', 500
        if medic1:
            return 'Medicine already exists.', 500
        medicine.demand = 0
        medicine.demand_number = 0
        if medicine.id_stock == 0:
            medicine.id_stock_number = 0
        db.session.add(medicine)
        db.session.commit()
        return self.medicine_schema.dump(medicine), 201

    @jwt_required()
    def put(self, id_medicine):
        auth_id_user = get_jwt_identity()
        auth_user = db.session.query(User).filter_by(id_user=auth_id_user).first()
        if not auth_user.provisor:
            return "Available only for provisor", 400
        old_medicine = db.session.query(Medicine).filter_by(id_medicine=id_medicine).first()
        if not old_medicine:
            return "Medicines not found", 404
        old_demand = old_medicine.demand
        old_demand_number = old_medicine.demand_number
        data = src.request.get_json(force=True)
        manufacturer = data.get('manufacturer')
        name_medicine = data.get('name_medicine')
        demand = data.get('demand')
        price = data.get('price')
        category_id = data.get('category_id')
        id_stock_number = data.get('id_stock_number')
        demand_number = data.get('demand_number')
        id_stock = data.get('id_stock')
        if not manufacturer or not name_medicine or not demand or not price or not category_id or not id_stock_number or \
                not demand_number or not id_stock:
            return "Invalid input", 400
        category = db.session.query(Category).filter_by(id_category=category_id).first()
        if not category:
            return 'Category doesn`t exist.', 500
        medicine = Medicine(
            manufacturer=manufacturer,
            name_medicine=name_medicine,
            demand=demand,
            price=price,
            category_id=category_id,
            id_stock_number=id_stock_number,
            demand_number=demand_number,
            id_stock=id_stock
        )
        medicine.demand = old_demand
        medicine.demand_number = old_demand_number
        if medicine.id_stock == 0 or medicine.id_stock_number == 0:
            medicine.id_stock = 0
            medicine.id_stock_number = 0
        if medicine.id_stock:
            medicine.demand = 0
            medicine.demand_number = 0
        name = db.session.query(Medicine).filter_by(name_medicine=name_medicine).first()
        if name:
            return {'message': 'Such medicine exists'}, 409
        old_medicine.manufacturer = medicine.manufacturer
        old_medicine.name_medicine = medicine.name_medicine
        old_medicine.demand = medicine.demand
        old_medicine.price = medicine.price
        old_medicine.category_id = medicine.category_id
        old_medicine.id_stock_number = medicine.id_stock_number
        old_medicine.demand_number = medicine.demand_number
        old_medicine.id_stock = medicine.id_stock
        db.session.commit()
        return self.medicine_schema.dump(old_medicine), 200

    @jwt_required()
    def delete(self, id_medicine):
        auth_id_user = get_jwt_identity()
        auth_user = db.session.query(User).filter_by(id_user=auth_id_user).first()
        if not auth_user.provisor:
            return abort(403)
        medicine = db.session.query(Medicine).filter(Medicine.id_medicine == id_medicine).first()
        orders = db.session.query(MedicinesInOrder).filter(MedicinesInOrder.id_medicine == id_medicine)
        for ord in orders:
            ord.id_medicine = 1
            db.session.commit()
        wish_list = db.session.query(WishList).filter(WishList.id_medicine == id_medicine)
        shopping_cart = db.session.query(ShoppingCart).filter(ShoppingCart.id_medicine == id_medicine)
        for w in wish_list:
            db.session.delete(w)
        for s in shopping_cart:
            db.session.delete(s)
        db.session.commit()

        db.session.delete(medicine)
        db.session.commit()
        return {'message': "Successfully deleted"}, 200


class PharmacyCategoryListApi(Resource):
    medicine_schema = MedicineSchema()

    def get(self, category_id):
        category = db.session.query(Category).filter_by(id_category=category_id)
        if not category.first():
            return "Category not found", 404
        medicine = db.session.query(Medicine).filter_by(category_id=category_id)
        return self.medicine_schema.dumps(medicine, many=True), 200


class PharmacyListApi(Resource):
    medicine_schema = MedicineSchema()

    def get(self, id_medicine=None):
        if not id_medicine:
            medicines = db.session.query(Medicine).all()
            return self.medicine_schema.dumps(medicines, many=True), 200
        medicine = db.session.query(Medicine).filter_by(id_medicine=id_medicine).first()
        if not medicine:
            return "Medicines not found", 404
        return self.medicine_schema.dumps(medicine), 200

    @jwt_required()
    def patch(self, id_medicine):
        auth_id_user = get_jwt_identity()
        auth_user = db.session.query(User).filter_by(id_user=auth_id_user).first()
        if auth_user.provisor:
            return "Don`t use your provisor account", 400
        medicine = db.session.query(Medicine).filter_by(id_medicine=id_medicine).first()
        if not medicine:
            return "Medicines not found", 404
        if medicine.id_stock:
            return "Meds is available to buy", 500
        if not medicine.demand:
            medicine.demand = 1
        medicine.demand_number = medicine.demand_number + 1
        db.session.commit()
        return self.medicine_schema.dump(medicine), 200


class OrderByUserListApi(Resource):
    order_schema = OrderSchema()

    @jwt_required()
    def get(self):
        username = request.args.get('username')
        provisor = db.session.query(User).filter_by(id_user=get_jwt_identity()).first()
        # user = db.session.query(User).filter_by(username=username).first()
        # order = db.session.query(Order).filter_by(user_id=user.id_user)
        if not provisor.provisor:
            return abort(403)
        return self.order_schema.dump(Order.orderByUsername(username), many=True), 200


class OrderListApi(Resource):
    order_schema = OrderSchema()

    @jwt_required()
    def get(self, id_order=None):
        auth_id_user = get_jwt_identity()
        auth_user = db.session.query(User).filter_by(id_user=auth_id_user).first()
        if not auth_user.provisor:
            return "Available only for provisor", 400
        if not id_order:
            orders = db.session.query(Order).all()
            return self.order_schema.dump(orders, many=True), 200
        order = db.session.query(Order).filter_by(id_order=id_order).first()
        if not order:
            return "Order not found", 404
        return self.order_schema.dump(order), 200

    @jwt_required()
    def post(self):
        auth_id_user = get_jwt_identity()
        auth_user = db.session.query(User).filter_by(id_user=auth_id_user).first()
        if auth_user.provisor:
            return "Don`t use your provisor account to order meds", 400
        try:
            order = self.order_schema.load(request.json, session=db.session)
        except ValidationError:
            return "Invalid input", 400
        medic = db.session.query(Medicine).filter_by(id_medicine=order.medicine_id).first()
        if not medic:
            return 'Medicine doesn`t exist.', 500
        if not medic.id_stock:
            return "Not available. Add to demand", 500
        db.session.add(order)
        order.complete = 0
        order.status = "to_do"
        order.user_id = auth_id_user
        db.session.commit()
        return self.order_schema.dump(order), 201

    @jwt_required()
    def delete(self, id_order):
        auth_id_user = get_jwt_identity()
        auth_user = db.session.query(User).filter_by(id_user=auth_id_user).first()
        if not auth_user.provisor:
            return "Available only for provisor", 400
        order = db.session.query(Order).filter_by(id_order=id_order).first()
        if not order:
            return "Order not found", 400
        db.session.delete(order)
        db.session.commit()
        return "Successfully deleted", 200


class ProvisorListApi(Resource):
    user_schema = UserSchema()

    @jwt_required()
    def post(self):
        id_provisor = get_jwt_identity()
        provisor = db.session.query(User).filter_by(id_user=id_provisor).first()
        if not provisor.provisor:
            return "You are not provisor", 400
        try:
            user = self.user_schema.load(request.json, session=db.session)
        except ValidationError:
            return "Invalid input", 400
        usr = db.session.query(User).filter_by(username=user.username).first()
        if usr:
            return 'User with this username already exists', 500
        db.session.add(user)
        db.session.commit()
        return self.user_schema.dump(user), 201


class UserListApi(Resource):
    user_schema = UserSchema()
    user_schema_without_password = UserSchemaWithoutPassword()

    @jwt_required()
    def get(self, username=None):
        token_id_user = get_jwt_identity()
        user = db.session.query(User).filter_by(id_user=token_id_user).first()
        # if not auth_user.provisor:
        #     username = auth_user.username
        # if not username:
        #     if auth_user.provisor:
        #         users = db.session.query(User).all()
        #         return self.user_schema_without_password.dump(users, many=True), 200
        #     else:
        #         return "Available only for provisor", 400
        # user = db.session.query(User).filter_by(username=username).first()
        if not user:
            return 'User not found', 404
        # if not auth_user.provisor and auth_user.username != username:
        #     return "You can get only information about yourself.", 400
        return self.user_schema_without_password.dump(user), 200

    def post(self):
        try:
            user = self.user_schema.load(request.form, session=db.session)
        except ValidationError:
            return "Invalid input", 400
        usr = db.session.query(User).filter_by(username=user.username).first()
        if usr:
            return 'User with this username already exists', 500
        user.provisor = False
        db.session.add(user)
        db.session.commit()
        return self.user_schema.dump(user), 201

    @jwt_required()
    def put(self):
        token_id_user = get_jwt_identity()
        user = db.session.query(User).filter_by(id_user=token_id_user).first()
        if not user:
            return 'User not found', 404
        # if token_id_user != user.id_user:
        #     return "You can change only your own information", 400
        password = user.password
        provisor = user.provisor
        try:
            user = self.user_schema.load(request.form, instance=user, session=db.session)
        except ValidationError:
            return "Invalid input", 400
        try:
            db.session.add(user)
            new_password = bcrypt.hashpw(password=user.password.encode("utf-8"), salt=bcrypt.gensalt())
            user.password = password
            user.provisor = provisor
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {'message': 'Such user exists'}, 409
        return self.user_schema.dump(user), 200

    @jwt_required()
    def delete(self, username):
        token_id_user = get_jwt_identity()
        user = db.session.query(User).filter_by(username=username).first()
        if not user:
            return "User not found", 400
        if user.id_user != token_id_user:
            return "You can delete only your own account", 500
        order = db.session.query(Order).filter_by(user_id=user.id_user)
        db.session.delete(user)
        for o in order:
            db.session.delete(o)
        db.session.commit()
        return "Successfully deleted", 200


class UserLogoutListApi(Resource):

    @jwt_required()
    def get(self):
        return "Successful logout", 200


class UserLoginListApi(Resource):

    def get(self):
        data = src.request.args
        username = data.get('username')
        password = data.get('password')
        user = db.session.query(User).filter_by(username=username).first()
        if not user:
            return "User not found", 400
        if not user.check_password(password):
            return "Wrong password", 400
        access_token = create_access_token(identity=user.id_user, expires_delta=app.config['JWT_ACCESS_TOKEN_EXPIRES'])
        refresh_token = create_refresh_token(identity=user.id_user,
                                             expires_delta=app.config['JWT_REFRESH_TOKEN_EXPIRES'])
        return json.dumps(
            {"access_token": access_token, "refresh_token": refresh_token, "provisor": user.provisor}), 200


@app.route('/medicineFromOrder', methods=['GET'])
@jwt_required()
def medicineFromOrder():
    order = request.args.get('order')
    medicines = Medicine.MedicineByIdsList([id[0] for id in MedicinesInOrder.medicineInOrderByOrderIdList(order)])
    return jsonify(MedicineSchema().dumps(medicines, many=True)), 200


@app.route('/medicineFromOrderWithCount/<order>', methods=['GET'])
@jwt_required()
def medicineFromOrderWithCount(order):
    medicine, count = [], []
    rows = db.session.query(Medicine.name_medicine, MedicinesInOrder.count).filter(MedicinesInOrder.id_order == order).join(MedicinesInOrder, Medicine.id_medicine == MedicinesInOrder.id_medicine).all()
    print(rows)
    for r in rows:
        medicine.append(r[0])
        count.append(r[1])
    return jsonify({'medicine': [medicine], 'count': [count]}), 200


@app.route('/order/<id_order>', methods=['GET'])
@jwt_required()
def orderById(id_order):
    order = db.session.query(Order).filter(Order.id_order == id_order).first()
    user = db.session.query(User).filter(User.id_user == get_jwt_identity()).first()
    if (order.user_id != get_jwt_identity() and not user.provisor) or order.status == 'canceled':
        return jsonify('Not your order'), 400
    return jsonify(OrderSchema().dumps(order)), 200


@app.route('/randomMedicine', methods=['GET'])
def randomMedicine():
    return jsonify(MedicineSchema().dumps(Medicine.getRandomMedicines(3), many=True)), 200


@app.route('/userByUsername', methods=['GET'])
@jwt_required()
def userByUsername():
    provisor = db.session.query(User).filter(User.id_user == get_jwt_identity()).first()
    if not provisor.provisor:
        return abort(403)
    username = request.args.get('username')
    user = db.session.query(User).filter(User.username == username).first()
    return jsonify(UserSchemaWithoutPassword().dumps(user)), 200


@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    token = request.form.get('access_token')
    try:
        jwt.decode(token, 'secret_key', algorithms=['HS256'])
    except:
        return json.dumps({"access_token": create_access_token(identity=get_jwt_identity())}), 200
    return ''


@app.route('/changeUserPassword', methods=['POST'])
@jwt_required()
def changeUserPassword():
    user_id = get_jwt_identity()
    user = db.session.query(User).filter_by(id_user=user_id).first()
    old_password = request.form.get('old_password')
    new_password = request.form.get('new_password')
    if not user.check_password(old_password):
        return "Old password is incorrect", 500
    user.password = bcrypt.hashpw(new_password, bcrypt.gensalt())
    db.session.commit()
    return "", 200


@app.route('/medicineInOrder/<id_order>/<page>', methods=['GET'])
@jwt_required()
def findMedicineInOrder(id_order, page):
    user = User.userById(get_jwt_identity())
    order = db.session.query(Order).filter(Order.id_order == id_order).first()
    if not user.provisor and (user.id_user != order.user_id or order.status == 'canceled'):
        return jsonify('Not available'), 405
    medicine = db.session.query(Medicine).filter(MedicinesInOrder.id_order == order.id_order).filter(MedicinesInOrder.id_medicine == Medicine.id_medicine)
    return jsonify({'count': medicine.count(), 'medicine': MedicineSchema().dumps(medicine.all()[((int(page) - 1) * 9):((int(page) - 1) * 9 + 9)], many=True)}), 200



@app.route('/findUser', methods=['GET'])
@jwt_required()
def finduser():
    username = json.loads(request.args.get('username'))
    first_name = json.loads(request.args.get('first_name'))
    last_name = json.loads(request.args.get('last_name'))
    email = json.loads(request.args.get('email'))
    phone = json.loads(request.args.get('phone'))
    date_of_birth = json.loads(request.args.get('date_of_birth'))
    page = request.args.get('page')
    users = db.session.query(User)
    users = users.filter(User.provisor == False)
    if username:
        query = 'users.filter(or_('
        for u in username:
            query += 'User.username.like(\'%' + u + '%\'), '
        query = query[0:-2]
        query += '))'
        users = eval(query)
    if first_name:
        query = 'users.filter(or_('
        for f in first_name:
            query += 'User.first_name.like(\'%' + f + '%\'), '
        query = query[0:-2] + '))'
        users = eval(query)
    if last_name:
        query = 'users.filter(or_('
        for l in last_name:
            query += 'User.last_name.like(\'%' + l + '%\'), '
        query = query[0:-2] + '))'
        users = eval(query)
    if email:
        query = 'users.filter(or_('
        for e in email:
            query += 'User.email.like(\'%' + e + '%\'), '
        query = query[0:-2] + '))'
        users = eval(query)
    if phone:
        query = 'users.filter(or_('
        for p in phone:
            query += 'User.phone.like(\'%' + p + '%\'), '
        query = query[0:-2] + '))'
        users = eval(query)
    if date_of_birth:
        date1 = date_of_birth[0].split('-')
        if len(date1[0]) == 4:
            date1 = datetime.date(year=int(date1[0]), month=int(date1[1]), day=int(date1[2]))
        else:
            date1 = datetime.date(year=int(date1[2]), month=int(date1[1]), day=int(date1[0]))
        if len(date_of_birth) == 2:
            date2 = date_of_birth[1].split('-')
            if len(date2[0]) == 4:
                date2 = datetime.date(year=int(date2[0]), month=int(date2[1]), day=int(date2[2]))
            else:
                date2 = datetime.date(year=int(date2[2]), month=int(date2[1]), day=int(date2[0]))
            users = users.filter(User.date_of_birth.between(date1, date2))
        else:
            users = users.filter(User.date_of_birth == date1)
    return jsonify({'count': users.count(),
                    'users': UserSchemaWithoutPassword(many=True).dump(users.all()[((int(page) - 1) * 8):((int(page) - 1) * 8 + 8)])}), 200


@app.route('/category/<id>', methods=['GET'])
def category(id):
    return jsonify(CategorySchema().dumps(Category.categoryById(id).first())), 200


@app.route('/categories', methods=['GET'])
def categories():
    return jsonify(CategorySchema().dumps(Category.categories().all(), many=True)), 200


@app.route('/manufacturers', methods=['GET'])
def manufacturers():
    manufacturer = Medicine.manufacturers().all()
    return json.dumps([manufacturer[0] for manufacturer in Medicine.manufacturers().all()]), 200


@app.route('/medicineLike', methods=['GET'])
def medicineLike():
    name = request.args.get('name_medicine')
    return jsonify(MedicineSchema().dumps(Medicine.medicineByNameLike(name).all(), many=True)), 200


@app.route('/search/medicine', methods=['GET'])
def medicineSearch():
    medicine = request.args.get('name_medicine')
    categories = json.loads(request.args.get('categories'))
    manufacturers = json.loads(request.args.get('manufacturers'))
    available = request.args.get('available')
    sort = request.args.get('sort')
    page = request.args.get('page')

    medicine = Medicine.medicineByNameLike(medicine)
    medicine = medicine.filter(Medicine.id_medicine != 1).order_by(func.rand())
    if available == 'true':
        medicine = medicine.filter(Medicine.stock_number != 0)
    if len(categories) != 0:
        ids_categories = db.session.query(Category.id_category).filter(Category.name_category.in_(categories)).all()
        medicine = medicine.filter(Medicine.category_id.in_([category[0] for category in ids_categories]))
    if len(manufacturers) != 0:
        medicine = medicine.filter(Medicine.manufacturer.in_(manufacturers))
    if sort == 'price':
        medicine = medicine.order_by(Medicine.price)
    elif sort == 'category':
        medicine = medicine.order_by(Medicine.category)
    else:
        medicine = medicine.order_by(Medicine.manufacturer)
    return jsonify({'count': medicine.count(),
                    'medicines': MedicineSchema().dumps(medicine.all()[((int(page) - 1) * 9):((int(page) - 1) * 9 + 9)],
                                                        many=True)}), 200


@app.route('/medicineFromWishList')
@jwt_required()
def wishList():
    user = User.userById(get_jwt_identity())
    medicine_list = db.session.query(WishList.id_medicine).filter(WishList.id_user == user.id_user)
    medicine = db.session.query(Medicine).filter(Medicine.id_medicine.in_([medicineL[0] for medicineL in medicine_list]))
    return jsonify(MedicineSchema().dumps(medicine.all(), many=True)), 200


@app.route('/medicineFromShoppingCart')
@jwt_required()
def shoppingCart():
    user = User.userById(get_jwt_identity())
    medicine_list = db.session.query(ShoppingCart.id_medicine).filter(ShoppingCart.id_user == user.id_user)
    medicine = db.session.query(Medicine).filter(Medicine.id_medicine.in_([medicineL[0] for medicineL in medicine_list]))
    return jsonify(MedicineSchema().dumps(medicine.all(), many=True)), 200


@app.route('/wish_list/<id_medicine>', methods=['POST'])
@jwt_required()
def addToWishList(id_medicine):
    user = User.userById(get_jwt_identity())
    if db.session.query(WishList).filter(and_(WishList.id_user == user.id_user,
                                         WishList.id_medicine == id_medicine)).first():
        return jsonify('Already in wish list'), 500
    wishList = WishList(
        id_user=user.id_user,
        id_medicine=id_medicine
    )
    db.session.add(wishList)
    db.session.commit()
    return jsonify('Success'), 200


@app.route('/shopping_cart/<id_medicine>', methods=['POST'])
@jwt_required()
def addToShoppingCart(id_medicine):
    user = User.userById(get_jwt_identity())
    if db.session.query(ShoppingCart).filter(and_(ShoppingCart.id_user == user.id_user,
                                         ShoppingCart.id_medicine == id_medicine)).first():
        return jsonify('Already in wish list'), 500
    shoppingCart = ShoppingCart(
        id_user=user.id_user,
        id_medicine=id_medicine
    )
    db.session.add(shoppingCart)
    db.session.commit()
    return jsonify('Success'), 200


@app.route('/shopping_cart', methods=['DELETE'])
@jwt_required()
def deleteFromShoppingCart():
    user = User.userById(get_jwt_identity())
    medicine = json.loads(request.form.get('medicine'))
    medicine_in_shopping_cart = db.session.query(ShoppingCart).filter(ShoppingCart.id_medicine.in_(medicine)).all()
    for m in medicine_in_shopping_cart:
        db.session.delete(m)
    db.session.commit()
    return jsonify('Success'), 200


@app.route('/order_for_login_user', methods=['GET'])
@jwt_required()
def orderForLoginUser():
    page = request.args.get('page')
    user = User.userById(get_jwt_identity())
    orders = db.session.query(Order).filter(Order.user_id == user.id_user).order_by(cast(Order.id_order, Integer).desc())
    if not user.provisor:
        orders = orders.filter(Order.status != 'canceled')
    return jsonify({'count': orders.count(),
                    'orders': OrderSchema().dumps(orders.all()[((int(page) - 1) * 6):((int(page) - 1) * 6 + 6)], many=True)})


@app.route('/deleteOrder/<id_order>', methods=['DELETE'])
@jwt_required()
def deleteOrder(id_order):
    order = db.session.query(Order).filter(Order.id_order == id_order).first()
    if order.status == 'is being prepared':
        order.status = 'canceled'
    elif order.status == 'complete':
        medicine_in_order = db.session.query(MedicinesInOrder).filter(MedicinesInOrder.id_order == id_order)
        for m in medicine_in_order:
            db.session.delete(m)
        db.session.commit()
        db.session.delete(order)
    else:
        return jsonify('Your order is coming to you. You can`t cancel it'), 200
    db.session.commit()
    return jsonify('Success'), 200


@app.route('/make_order', methods=['POST'])
@jwt_required()
def makeOrder():
    medicine = json.loads(request.form.get('medicine'))
    count = json.loads(request.form.get('count'))
    order = Order(
        date_order=datetime.date.today(),
        status='is being prepared',
        user_id=get_jwt_identity()
    )
    db.session.add(order)
    db.session.commit()

    for i in range(len(medicine)):
        m = Medicine.MedicineById(medicine[i]).first()
        m.stock_number -= int(count[i])
        medicineInOrder = MedicinesInOrder(
            id_order=order.id_order,
            id_medicine=medicine[i],
            count=int(count[i])
        )
        db.session.add(medicineInOrder)
    db.session.commit()
    return jsonify('Success'), 200


@app.route('/pharmacy/registration')
def registration():
    return render_template('html/guest/registration.html')


@app.route('/pharmacy/login')
def login():
    return render_template('html/guest/login.html')


@app.route('/pharmacy/profile')
def profile():
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/profile.html')
    else:
        return render_template('html/loginUser/userProfile.html')


@app.route('/pharmacy/changePassword')
def changePassword():
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/changePassword.html')
    else:
        return render_template('html/loginUser/changePassword.html')


@app.route('/pharmacy/editProfile')
def editProfile():
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/editProfile.html')
    else:
        return render_template('html/loginUser/editProfile.html')


@app.route('/pharmacy/products')
def products():
    if request.cookies.get('provisor') == '':
        return render_template('html/guest/products.html')
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/products.html')
    else:
        return render_template('html/loginUser/products.html')


@app.route('/pharmacy/findUser')
def findUser():
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/findUser.html')
    else:
        return abort(403)


@app.route('/pharmacy/users')
def userList():
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/userList.html')
    else:
        return abort(403)


@app.route('/pharmacy/userInformation')
def userInf():
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/userInformation.html')
    else:
        return abort(403)


@app.route('/pharmacy/orders')
def orders():
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/orderList.html')
    elif request.cookies.get('provisor') == 'false':
        return render_template('html/loginUser/orderList.html')
    else:
        return abort(403)


@app.route('/pharmacy/order')
def order():
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/orderInformation.html')
    elif request.cookies.get('provisor') == 'false':
        return render_template('html/loginUser/orderInformation.html')
    else:
        return abort(403)


@app.route('/pharmacy/findOrders')
def findOrders():
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/findOrder.html')
    else:
        return abort(403)


@app.route('/pharmacy')
def mainPage():
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/mainPage.html')
    if request.cookies.get('provisor') == 'false':
        return render_template('html/loginUser/mainPage.html')
    else:
        return render_template('index.html')


@app.route('/pharmacy/medicine')
def productPage():
    if request.cookies.get('provisor') == 'true':
        return render_template('html/admin/singleProductPade.html')
    if request.cookies.get('provisor') == 'false':
        return render_template('html/loginUser/singleProductPade.html')
    else:
        return render_template('html/guest/singleProductPade.html')


@app.route('/pharmacy/wish_list')
def wish_list():
    if request.cookies.get('provisor') == 'false':
        return render_template('html/loginUser/wishList.html')
    else:
        return abort(403)


@app.route('/pharmacy/shopping_cart')
def shoppintCart():
    if request.cookies.get('provisor') == 'false':
        return render_template('html/loginUser/shoppingCart.html')
    else:
        return abort(403)


@app.route('/pharmacy/order/medicine_in_order')
def medicineInOrder():
    if request.cookies.get('provisor') == 'false':
        return render_template('html/loginUser/medicineFromOrder.html')
    else:
        return abort(403)


@app.route('/404')
def error404():
    return render_template('html/404.html')


api.add_resource(MedicineListApi, '/medicine', '/medicine/<id_medicine>', strict_slashes=False)
api.add_resource(MedicineInDemandListApi, '/medicine/demand', strict_slashes=False)

api.add_resource(PharmacyListApi, '/pharmacy', '/pharmacy/<id_medicine>', strict_slashes=False)
api.add_resource(PharmacyCategoryListApi, '/pharmacy/Category/<category_id>', strict_slashes=False)
api.add_resource(OrderByUserListApi, '/pharmacy/ordersByUser', strict_slashes=False)
# api.add_resource(OrderListApi, '/pharmacy/order', '/pharmacy/order/<id_order>', strict_slashes=False)

api.add_resource(ProvisorListApi, '/provisor', strict_slashes=False)
api.add_resource(UserListApi, '/user', '/user/<username>', strict_slashes=False)
api.add_resource(UserLogoutListApi, '/user', '/user/logout', strict_slashes=False)
api.add_resource(UserLoginListApi, '/user/login', strict_slashes=False)
