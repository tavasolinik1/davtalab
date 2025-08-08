import { Injectable } from '@nestjs/common';
import crypto from 'node:crypto';

@Injectable()
export class CryptoService {
  private readonly key: Buffer;

  constructor() {
    const keyB64 = process.env.PII_ENC_KEY_BASE64;
    if (!keyB64) throw new Error('PII_ENC_KEY_BASE64 not set');
    const key = Buffer.from(keyB64, 'base64');
    if (key.length !== 32) throw new Error('PII_ENC_KEY_BASE64 must be 32 bytes base64');
    this.key = key;
  }

  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  }

  decrypt(payloadB64: string): string {
    const payload = Buffer.from(payloadB64, 'base64');
    const iv = payload.subarray(0, 12);
    const authTag = payload.subarray(12, 28);
    const data = payload.subarray(28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
    return decrypted.toString('utf8');
  }
}