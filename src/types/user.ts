export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url: string | null;
  role: string;
  role_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  page_size: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  users: number;
}
