import { IJwtPayload } from 'src/auth/auth.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}
