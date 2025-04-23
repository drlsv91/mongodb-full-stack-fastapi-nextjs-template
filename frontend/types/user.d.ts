export interface User {
  id: string;
  email: string;
  full_name: string;
  is_superuser: boolan;
  is_active: boolan;
}

export interface UserData {
  data: User[];
  count: number;
}
export interface UpdateMePassword {
  current_password: string;
  new_password: string;
}
export interface CreateUserData {
  email: string;
  full_name: string;
  is_superuser: boolan;
  is_active: boolan;
  password: string;
}
