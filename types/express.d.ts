import { UserPayload } from './user-payload';

declare namespace Express {
  interface Request {
    user: UserPayload;
  }
}






