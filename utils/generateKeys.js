/**
 * Script sinh RSA key pair (2048 bytes) cho JWT RS256
 * Chạy: node utils/generateKeys.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function generateRSAKeyPair() {
    // Sinh RSA key pair 2048 bytes
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    // Tạo thư mục keys nếu chưa tồn tại
    const keysDir = path.join(__dirname, 'keys');
    if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir, { recursive: true });
    }

    // Lưu public key
    fs.writeFileSync(path.join(keysDir, 'publicKey.pem'), publicKey);
    console.log('✓ Public key đã được lưu: utils/keys/publicKey.pem');

    // Lưu private key
    fs.writeFileSync(path.join(keysDir, 'privateKey.pem'), privateKey);
    console.log('✓ Private key đã được lưu: utils/keys/privateKey.pem');

    // Hiển thị public key để copy vào config
    console.log('\n========== PUBLIC KEY ==========');
    console.log(publicKey);
    console.log('================================\n');

    console.log('✅ Sinh key pair RSA (2048 bytes) thành công!');
}

generateRSAKeyPair();
