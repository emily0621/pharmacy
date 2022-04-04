import datetime, random, names
from datetime import date

from dateutil.relativedelta import relativedelta

import wsgi
from src import db
from src.models import User, Category, Medicine, Order, MedicinesInOrder, ShoppingCart, WishList

from random_username.generate import generate_username


def phone(i):
    phone_number = ''
    for j in range(9):
        phone_number += str(random.randrange(0, 9))
    return phone_number


def random_date(start, end):
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(int_delta)
    return start + datetime.timedelta(seconds=random_second)


def add_users(n):
    for i in range(n):
        username = generate_username(1)[0]
        user = User(
            username=username,
            first_name=names.get_first_name(),
            last_name=names.get_last_name(),
            email=username + '@gmail.com',
            password='password' + str(i + 1),
            phone=phone(i),
            provisor=False,
            date_of_birth=random_date(date(year=1950, month=1, day=1), date.today() - relativedelta(years=18))
        )
        db.session.add(user)
    db.session.commit()


def add_provisor(n):
    for i in range(n):
        username = generate_username(1)[0]
        provisor = User(
            username=username,
            first_name=names.get_first_name(),
            last_name=names.get_last_name(),
            email=username + '@gmail.com',
            password='password' + str(i + 1),
            phone=phone(i),
            provisor=True,
            date_of_birth=random_date(date(year=1950, month=1, day=1), date.today() - relativedelta(years=18))
        )
        db.session.add(provisor)
    db.session.commit()


def add_category(n):
    deleted_category = Category(name_category='deleted_category')
    db.session.add(deleted_category)
    for i in range(n):
        category = Category(name_category='category' + str(i+1))
        db.session.add(category)
    db.session.commit()


def add_medicine(n, m, k):
    deleted_medicine = Medicine(
        name_medicine='deleted medicine',
        manufacturer='unknown manufacturer',
        price=0,
        stock_number=0,
        demand_number=0,
        category_id=1,
        description='Once-existing medicine',
        image=0
    )
    db.session.add(deleted_medicine)
    for i in range(n):
        medicine = Medicine(
            name_medicine='Medicine'+ str(i+1),
            manufacturer='manufacturer' + str(random.randint(1, n/10)),
            price=random.randint(10, 100),
            stock_number=random.randint(0, 100),
            demand_number=random.randint(0, 100),
            category_id=random.randint(2, m+1),
            description='This is medicine ' + str(i+1),
            image=random.randint(1, k)
        )
        if random.randint(1, 5) == 5:
            medicine.stock_number = 0
        if random.randint(1, 5) == 5:
            medicine.demand_number = 0
        db.session.add(medicine)
    db.session.commit()


def add_order(n, m):
    status = ['ready to ship', 'in the process of delivery', 'delivered', 'complete', 'canceled', 'is being prepared']
    for i in range(n):
        order = Order(
            date_order=random_date(date.today() - relativedelta(months=6), date.today()),
            status=status[random.randint(0, len(status) - 1)],
            user_id=random.randint(0 + 1, m)
        )
        db.session.add(order)
    db.session.commit()


def add_medicine_in_order(n, m, k, l):
    for i in range(k):
        medicine_in_order = MedicinesInOrder(
            id_medicine=random.randint(1, m),
            id_order=i+1,
            count=random.randint(1, l)
        )
    for i in range(n - k):
        medicine_in_order = MedicinesInOrder(
            id_medicine=random.randint(1, m),
            id_order=random.randint(1, k),
            count=random.randint(1, l)
        )
        db.session.add(medicine_in_order)
    db.session.commit()


def add_shopping_cart(n, m, k):
    for i in range(n):
        shopping_cart = ShoppingCart(
            id_medicine=random.randint(1, m),
            id_user=random.randint(1, k)
        )
        db.session.add(shopping_cart)
    db.session.commit()


def add_wish_list(n, m, k):
    for i in range(n):
        wish_list = WishList(
            id_medicine=random.randint(1, m),
            id_user=random.randint(1, k)
        )
        db.session.add(wish_list)
    db.session.commit()


def populate_db(user, provisor, category, medicine, images, order, medicine_in_order, count, shopping_cart, wish_list):
    add_users(user)
    add_provisor(provisor)
    add_category(category)
    add_medicine(medicine, category, images)
    add_order(order, user)
    add_medicine_in_order(medicine_in_order, medicine, order, count)
    add_shopping_cart(shopping_cart, medicine, user)
    add_wish_list(wish_list, medicine, user)


if __name__ == '__main__':
    print('Populating db...')
    populate_db(30, 5, 10, 100, 21, 50, 250, 5, 100, 100)
    print('Successfully populated!')
