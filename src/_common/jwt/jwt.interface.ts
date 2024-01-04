import { JwtPayload } from 'jsonwebtoken';

export interface IPayload extends JwtPayload {
  id: number;
  nickname: string;
  profileImage: string;
  isAdmin: boolean;
}
