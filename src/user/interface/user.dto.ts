export enum EDeviceOS {
  IOS = 'i',
  ANDROID = 'a',
}

export class SignupBodyDto {
  name: string;
  email: string;
  password: string;
}

export class LoginBodyDto {
  email: string;
  password: string;

  deviceId: string;
  deviceModel: string;
  deviceOsVersion: string;
  deviceOs: EDeviceOS;
  appVersion: string;

  isDev: boolean;
}

export class RegisterFcmBodyDto {
  fcm: string;

  deviceId: string;
  deviceModel: string;
  deviceOsVersion: string;
  deviceOs: EDeviceOS;
  appVersion: string;
}
