import { DefaultEntity } from 'src/common/default.entity';
import { Column, Entity } from 'typeorm';
import { EDeviceOS } from '../interface/user.dto';

@Entity({ name: 'fcm_history', comment: 'FCM 토큰 등록 내역' })
export class FcmHistoryEntity extends DefaultEntity {
  @Column('int', { comment: '사용자 ID' })
  userId: number;

  @Column('varchar', { comment: 'FCM 토큰' })
  fcm: string;

  @Column('varchar', { comment: 'Device ID' })
  deviceId: string;

  @Column('varchar', { comment: 'Device Model' })
  deviceModel: string;

  @Column('varchar', { comment: 'Device OS Version' })
  deviceOsVersion: string;

  @Column('enum', { comment: 'Device OS', enum: EDeviceOS })
  deviceOs: EDeviceOS;

  @Column('varchar', { comment: 'App Version' })
  appVersion: string;
}
