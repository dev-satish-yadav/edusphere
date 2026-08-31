export interface User {
  id: string;
  name: string;
  email: string;
  userType: string;
  role?: string;
  tenantId?: string;
}
