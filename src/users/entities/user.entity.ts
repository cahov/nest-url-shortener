import { User as UserModel } from '@prisma/client';

export class UserEntity implements UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
}
