import { DefaultEntity } from "src/common/default.entity";
import { EDeviceOS } from "src/user/interface/user.dto";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'log_launch', comment: '앱 실행 로그'})
export class LaunchLogEntity {
    @PrimaryColumn({comment: '앱 실행 시 생성하는 고유값'})
    sessionId: string

    @Column('datetime', {comment: '앱 실행 일시'})
    launchAt: Date;

    @Column('int', {comment: '사용자 ID (user.id). 앱 실행 당시의 사용자 ID. 비로그인 상태에서 앱 실행 시, 로그인 성공해도 값이 채워지지 않음.', nullable: true})
    initialUserId: number | null;
    @Column('int', {comment: '사용자 ID (user.id). 비로그인 상태에서 앱 실행 시, 비어있다가 로그인 성공 시 값이 채워짐.', nullable: true})
    userId: number | null;

    @Column('varchar', {comment: 'Device ID'})
    deviceId: string;
    @Column('varchar', {comment: 'Device Model'})
    deviceModel: string;
    @Column('varchar', {comment: 'Device OS Version'})
    deviceOsVersion: string;
    @Column('enum', {comment: 'Device OS', enum: EDeviceOS})
    deviceOs: EDeviceOS;
    @Column('varchar', {comment: 'App Version'})
    appVersion: string;
    @Column('varchar', {comment: 'IP'})
    ip: string;
}