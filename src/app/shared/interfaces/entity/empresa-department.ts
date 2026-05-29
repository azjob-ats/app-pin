export interface Department {
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
  createdAt: Date;
  updatedAt: Date;
}
