import { Product, Product2 } from './product';
import { Category } from './category';
import { CategoryGroup } from './categoryGroup';
import { User } from './user';
import { Customer } from './customer';
import { TypeCustomer } from './typeCustomer';
import { Discount } from './discount';
import { DiscountDetails } from './discountDetails';
import { Order } from './order';
import { OrderDetail } from './orderDetails';
import { Debt } from './debt';
import { DebtDetail } from './debtDetails';
import { Import } from './import';
import { ImportDetails } from './importDetails';

interface FileUploadState {
  files: File[];
}

type selectedRowType = {
  index: number,
  dataSelected: any,
}

export type {
  FileUploadState,
  Product,
  Product2,
  Category,
  CategoryGroup,
  User,
  Customer,
  TypeCustomer,
  Discount,
  DiscountDetails,
  Order,
  OrderDetail,
  Debt,
  DebtDetail,
  Import,
  ImportDetails,
  selectedRowType,
};