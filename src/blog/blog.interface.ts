import { IPagination } from '../_common/_utils/interfaces/request.interface';

export interface ICreateBlog {
  address: string;
  title: string;
  description: string;
}

export interface IUpdateBlog {
  address?: string;
  title?: string;
  description?: string;
}

export interface IPaginationBlog extends IPagination {
  searchBy?: string;
  searchKeyword?: string;
  orderBy: string;
  sortOrder: string;
}
