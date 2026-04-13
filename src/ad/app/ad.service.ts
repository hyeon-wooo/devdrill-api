import { Injectable } from '@nestjs/common';
import { AdLastHistoryService } from './ad-last-history.service';
import { AdHistoryService } from './ad-history.service';
import { EAdEventType } from '../domain/ad.enum';

@Injectable()
export class AdService {
  constructor(
    private readonly adHistoryService: AdHistoryService,
    private readonly adLastHistoryService: AdLastHistoryService,
  ) {}

  async needShowAd(userId: number) {
    const already = await this.adLastHistoryService.findOne({ userId });
    if (!already) return true;

    const diff = new Date().getTime() - already.lastViewedAt.getTime();
    if (diff > 1000 * 60 * 60 * 24) return true; // 마지막 paid 이후 24시간 경과 시

    return false;
  }

  async createAdHistory(userId: number, eventType: EAdEventType) {
    await this.adHistoryService.create({
      userId,
      eventType,
    });

    if (eventType === EAdEventType.PAID) {
      const already = await this.adLastHistoryService.findOne({ userId });
      if (already)
        await this.adLastHistoryService.update(
          { id: already.id },
          {
            lastViewedAt: new Date(),
          },
        );
      else
        await this.adLastHistoryService.create({
          userId,
          lastViewedAt: new Date(),
        });
    }
  }
}
