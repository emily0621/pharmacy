from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import Schema, fields
from marshmallow_sqlalchemy.fields import Nested

from src.models import Medicine, Order, User, Category


class CategorySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Category
        load_instance = True
        include_fk = True


class MedicineSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Medicine
        load_instance = True
        include_fk = True


class OrderSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Order
        load_instance = True

    # users = fields.Nested('UserSchema')


class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        exclude = ['id_user']
        load_instance = True


class UserSchemaWithoutPassword(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        exclude = ['id_user', 'password']
        load_instance = True


# categories = fields.Nested(CategorySchema, many=True, exclude=('medicines',))
# medicines = fields.Nested(MedicineSchema, many=True, exclude=('categories',))
#
# users = fields.Nested(UserSchema, many=True, exclude=('orders',))
# orders = fields.Nested(OrderSchema, many=True, exclude=('users',))
