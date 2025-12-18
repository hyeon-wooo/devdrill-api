import { ERole } from './role/role.enum';

export interface IJwtPayload {
  id: number;
  role: ERole;
  level: number;
  canSkipAd: boolean;
  canReadAll: boolean;
}
