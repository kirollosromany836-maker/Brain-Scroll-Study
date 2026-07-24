/**
 * Small helper for encrypting sensitive fields at rest with AES-256-GCM.
 *
 * We deliberately never store names or free-text identifiers. The fields we
 * do encrypt (age, grade, social media usage) are low-sensitivity, but we
 * encrypt them anyway as defense-in-depth per the study's privacy policy.
 *
 * In a production deployment, DATA_ENCRYPTION_KEY should come from a secrets
 * manager (e.g. AWS Secrets Manager, Supabase Vault) rather than a .env file.
 */
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';

function getKey() {
  const hex = process.env.DATA_ENCRYPTION_KEY;
  if (!hex || hex.length < 64) {
    throw new Error(
      'DATA_ENCRYPTION_KEY must be set in .env as a 64-character hex string (32 bytes). See .env.example.'
    );
  }
  return Buffer.from(hex.slice(0, 64), 'hex');
}

function encryptField(plainValue) {
  if (plainValue === null || plainValue === undefined) return null;
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(String(plainValue), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Store iv + authTag + ciphertext together, base64-encoded
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

function decryptField(storedValue) {
  if (storedValue === null || storedValue === undefined) return null;
  const key = getKey();
  const raw = Buffer.from(storedValue, 'base64');
  const iv = raw.subarray(0, 12);
  const authTag = raw.subarray(12, 28);
  const ciphertext = raw.subarray(28);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encryptField, decryptField };
