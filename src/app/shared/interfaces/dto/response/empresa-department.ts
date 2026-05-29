export interface DepartmentResponse {
  id: string;
  organizationId: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isFavorite: boolean;
  membersCount: number;
  productsCount: number;
  submissionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentListResponse {
  data: DepartmentResponse[];
  query: Record<string, unknown>;
  page: number;
  pageSize: number;
  pages: number;
  totalRecords: number;
}
