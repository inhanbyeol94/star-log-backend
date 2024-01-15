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
