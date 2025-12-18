import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    if (admin.apps.length > 0) {
      return;
    }

    try {
      const credentialPath =
        process.env.FIREBASE_CREDENTIAL_PATH ||
        join(process.cwd(), 'firebase.json');
      const raw = readFileSync(credentialPath, 'utf8');
      const serviceAccount = JSON.parse(raw);

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key,
        }),
      });

      this.logger.log('Firebase Admin initialized for FCM');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin', error as Error);
      throw error;
    }
  }

  async sendToDevice(
    token: string,
    title: string,
    body?: string,
    data?: Record<string, string>,
  ): Promise<string> {
    const message: admin.messaging.Message = {
      token,
      notification: { title, body },
      data,
      android: { priority: 'high' },
      apns: { headers: { 'apns-priority': '10' } },
    };

    return await admin.messaging().send(message, false);
  }

  async sendToDevices(
    tokens: string[],
    title: string,
    body?: string,
    data?: Record<string, string>,
  ): Promise<admin.messaging.BatchResponse> {
    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: { title, body },
      data,
      android: { priority: 'high' },
      apns: { headers: { 'apns-priority': '10' } },
    };

    return await admin.messaging().sendEachForMulticast(message, false);
  }
}
