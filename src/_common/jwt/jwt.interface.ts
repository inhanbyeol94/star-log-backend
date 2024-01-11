import { JwtPayload } from 'jsonwebtoken';

export interface IPayload extends JwtPayload {
  id: string;
  email: string;
  nickname: string;
  profileImage: string;
  isAdmin: boolean;
}
