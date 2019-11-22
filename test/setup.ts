import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

writeFileSync(
  join(__dirname, '../certs/access-token-private-key.pem'),
  privateKey
);
writeFileSync(
  join(__dirname, '../certs/access-token-public-key.pem'),
  publicKey
);

writeFileSync(
  join(__dirname, '../certs/refresh-token-private-key.pem'),
  privateKey
);
writeFileSync(
  join(__dirname, '../certs/refresh-token-public-key.pem'),
  publicKey
);
