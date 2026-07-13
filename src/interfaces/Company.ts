export interface Company {
  id?: string;
  name: string;
  logo?: string | null;
  logoPublicId?: string | null;
  website?: string | null;
  location?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
} 