import crypto from 'crypto';

export function encrypt(text: string) {
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(process.env.ENCRYPT_KEY!, 'hex'),
        Buffer.from(process.env.ENCRYPT_IV!, 'hex')
    );
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(encryptedText: string) {
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(process.env.ENCRYPT_KEY!, 'hex'),
        Buffer.from(process.env.ENCRYPT_IV!, 'hex')
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
