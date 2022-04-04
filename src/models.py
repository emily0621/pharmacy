import random

import bcrypt
from sqlalchemy import ForeignKey
from sqlalchemy import Column, Date, String, Integer, Text, BOOLEAN, BINARY
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql.expression import func
# from werkzeug.security import generate_password_hash, check_password_hash

Base = declarative_base()
from src import db


class User(Base):
    __tablename__ = 'user'
    id_user = Column(Integer, primary_key=True)
    username = Column(String(25), unique=True, nullable=False)
    first_name = Column(String(25), nullable=False)
    last_name = Column(String(25), nullable=False)
    email = Column(String(50), nullable=False)
    password = Column(String(200), nullable=False)
    phone = Column(String(25), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    provisor = Column(BOOLEAN, nullable=False)

    def check_password(self, password):
        return bcrypt.checkpw(password, self.password.encode('utf-8'))

    def __init__(self, username, first_name, last_name, email, password, phone, date_of_birth, provisor):
        self.username = username
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = bcrypt.hashpw(password, bcrypt.gensalt()),
        self.phone = phone
        self.date_of_birth = date_of_birth
        self.provisor = provisor

    def __repr__(self):
        return f'User( {self.id_user}, {self.username}, {self.first_name}, {self.last_name}, {self.email}, ' \
               f'{self.password}, {self.phone})'

    @classmethod
    def searchUser(cls, usernames):
        return db.session.query(cls).filter(cls.username in usernames)

    @classmethod
    def userBaseQuery(cls):
        return db.session.query(User)

    @classmethod
    def userIdByUsername(cls, username):
        return cls.userBaseQuery().filter(cls.username == username).first().id_user

    @classmethod
    def userById(cls, id):
        return cls.userBaseQuery().filter(cls.id_user == id).first()


class Category(Base):
    __tablename__ = 'category'
    id_category = Column(Integer, primary_key=True, autoincrement=True)
    name_category = Column(String(45), nullable=True)

    def __init__(self, name_category):
        self.name_category = name_category

    def __repr__(self):
        return f'Category({self.id_category}, {self.name_category})'

    @classmethod
    def categoryBaseQuery(cls):
        return db.session.query(cls)

    @classmethod
    def categoryById(cls, id):
        return cls.categoryBaseQuery().filter(cls.id_category == id)

    @classmethod
    def categories(cls):
        return cls.categoryBaseQuery().order_by(cls.name_category)


class Medicine(Base):
    __tablename__ = 'medicine'
    id_medicine = Column(Integer, primary_key=True)
    name_medicine = Column(String(45), nullable=False)
    manufacturer = Column(String(45), nullable=False)
    price = Column(Integer, nullable=False)
    stock_number = Column(Integer, nullable=False)
    demand_number = Column(Integer, nullable=False)
    category_id = Column(Integer, ForeignKey('category.id_category'), nullable=False)
    category = db.relationship('Category')
    description = Column(String(1000), nullable=True)
    image = Column(Integer, nullable=False)

    def __init__(self, name_medicine, manufacturer, price, stock_number, demand_number, category_id, description, image):
        self.name_medicine = name_medicine
        self.manufacturer = manufacturer
        self.price = price
        self.stock_number = stock_number
        self.demand_number = demand_number
        self.category_id = category_id
        self.description = description
        self.image = image

    def __repr__(self):
        return f'Medicine({self.id_medicine}, {self.name_medicine}, {self.manufacturer}, {self.price}, ' \
               f'{self.stock_number}, {self.demand_number}, {self.category_id})'

    @classmethod
    def MedicineBaseQuery(cls):
        return db.session.query(Medicine)

    @classmethod
    def MedicineByIdsList(cls, ids):
        return cls.MedicineBaseQuery().filter(cls.id_medicine.in_(ids)).all()

    @classmethod
    def getRandomMedicines(cls, num):
        return cls.MedicineBaseQuery().order_by(func.rand()).limit(num).all()

    @classmethod
    def MedicineById(cls, id):
        return cls.MedicineBaseQuery().filter(cls.id_medicine == id)

    @classmethod
    def medicineByNameLike(cls, name):
        return cls.MedicineBaseQuery().filter(cls.name_medicine.like('%'+name+'%'))

    @classmethod
    def manufacturers(cls):
        return db.session.query(Medicine.manufacturer).group_by(Medicine.manufacturer).order_by(Medicine.manufacturer)


class Order(Base):
    __tablename__ = 'order'
    id_order = Column(Integer, primary_key=True, autoincrement=True)
    date_order = Column(Date, nullable=False)
    status = Column(String(45), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id_user'), nullable=False)

    def __init__(self, date_order, status, user_id):
        self.date_order = date_order
        self.status = status
        self.user_id = user_id

    def __repr__(self):
        return f'Order({self.id_order}, {self.shipDate}, {self.status}, {self.complete}, {self.user_id}'

    @classmethod
    def orderBaseQuery(cls):
        return db.session.query(Order)

    @classmethod
    def orderByUsername(cls, username):
        return cls.orderBaseQuery().filter(cls.user_id == User.userIdByUsername(username)).all()


class MedicinesInOrder(Base):
    __tablename__ = 'medicine_in_order'
    id_medicine_in_order = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    id_order = Column(Integer, ForeignKey('order.id_order'), nullable=False)
    id_medicine = Column(Integer, ForeignKey('medicine.id_medicine'), nullable=False)
    count = Column(Integer, nullable=False)

    def __init__(self, id_order, id_medicine, count):
        self.id_order = id_order
        self.id_medicine = id_medicine
        self.count = count

    @classmethod
    def medicineInOrderBaseQuery(cls):
        return db.session.query(MedicinesInOrder.id_medicine)

    @classmethod
    def medicineInOrderByOrderIdList(cls, id):
        return cls.medicineInOrderBaseQuery().filter(MedicinesInOrder.id_order == id).all()


class ShoppingCart(Base):
    __tablename__ = 'shopping_cart'
    id_shopping_cart = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    id_user = Column(Integer, ForeignKey('user.id_user'), nullable=False)
    id_medicine = Column(Integer, ForeignKey('medicine.id_medicine'), nullable=False)

    def __init__(self, id_user, id_medicine):
        self.id_user = id_user
        self.id_medicine = id_medicine


class WishList(Base):
    __tablename__ = 'wish_list'
    id_wish_list = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    id_user = Column(Integer, ForeignKey('user.id_user'), nullable=False)
    id_medicine = Column(Integer, ForeignKey('medicine.id_medicine'), nullable=False)

    def __init__(self, id_user, id_medicine):
        self.id_user = id_user
        self.id_medicine = id_medicine