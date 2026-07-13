export interface Certification {
  id?: string;
  title: string;
  issuer: string;
  logo?: string | null;
  issuerWebsite: string | null;
  issueDate: string;
  credentialID: string | null;
  credentialURL: string | null;
  certificate?: string | null;
  status: "Active" | "Inactive" | "Pending" | "Surrendered" | "Withdrawn" | "Suspended" | "Revoked" | "Expired";
  createdAt?: Date;
  updatedAt?: Date;
}