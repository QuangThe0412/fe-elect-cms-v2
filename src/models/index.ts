import { Product, Product2 } from './product';
import { Category } from './category';
import { CategoryGroup } from './categoryGroup';
import { Dashboard } from './dashboard';
import { User } from './user';
import { Customer } from './customer';
import { TypeCustomer } from './typeCustomer';
import { Discount } from './discount';
import { DiscountDetails } from './discountDetails';
import { Order } from './order';
import { OrderDetail } from './orderDetails';

interface FileUploadState {
  files: File[];
}

export type {
  FileUploadState,
  Product,
  Product2,
  Category,
  CategoryGroup,
  Dashboard,
  User,
  Customer,
  TypeCustomer,
  Discount,
  DiscountDetails,
  Order,
  OrderDetail,
};