export interface CreateDepartmentRequest {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface DepartmentListQueryRequest {
  page?: number;
  pageSize?: number;
}
