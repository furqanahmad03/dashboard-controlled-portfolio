export interface Client {
  id?: string;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  sourceName?: string | null;
  sourceWebsite?: string | null;
  company?: string | null;
  industry?: string | null;
  budget?: string | null;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
