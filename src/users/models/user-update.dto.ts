export class UserUpdateDto {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: number;
  isActive: boolean;
}
