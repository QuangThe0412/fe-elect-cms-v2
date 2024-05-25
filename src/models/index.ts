import { Product,Product2 } from './product';
import { Category } from './category';
import {CategoryGroup} from './categoryGroup';

interface FileUploadState {
    files: File[];
  }

export type {
    Product,
    Product2,
    Category,
    CategoryGroup,
    FileUploadState
};