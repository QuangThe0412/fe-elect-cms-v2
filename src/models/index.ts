import { Product, Product2 } from './product';
import { Category } from './category';
import { CategoryGroup } from './categoryGroup';
import { Dashboard } from './dashboard';
import { User } from './user';

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
};