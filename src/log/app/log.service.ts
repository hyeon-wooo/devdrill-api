import { Injectable } from '@nestjs/common';
import { LaunchLogRepository } from '../infra/launch-log/launch-log.repository';
import { ScreenLogRepository } from '../infra/screen-log/screen-log.repository';
import { EDeviceOS } from 'src/user/interface/user.dto';

@Injectable()
export class LogService {

    constructor(private readonly launchRepo: LaunchLogRepository, private readonly screenRepo: ScreenLogRepository) {}
    
    async createScreenLog(sessionId: string, screenName: string, params: string, userId: number | null) {
        await this.screenRepo.create({
            sessionId,
            screenName,
            params,
            userId,
        });
    }

    

    async createLaunchLog(payload: {userId: number | null, initialUserId: number | null, sessionId: string, launchAt: Date, deviceId: string, deviceModel: string, deviceOsVersion: string, deviceOs: EDeviceOS, appVersion: string, ip: string}) {
        await this.launchRepo.create(payload);
    }

    async saveUserIdToLaunchLog(sessionId: string, userId: number) {
        await this.launchRepo.update({ sessionId }, { userId });
    }
}
