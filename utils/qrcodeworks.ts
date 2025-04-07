// Import the necessary libraries
import crypto from 'crypto';
import QRCode from 'qrcode';

// Define types for input and output
interface JsonData {
    [key: string]: unknown;
}

export const generateQRCode = async (jsonData: JsonData): Promise<string | undefined> => {
    try {
        const secretKey = process.env.AES_SECRET;
        if (!secretKey) {
            throw new Error('AES_SECRET environment variable is not defined');
        }

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf-8'), iv);

        let encryptedData = cipher.update(JSON.stringify(jsonData), 'utf8', 'hex');
        encryptedData += cipher.final('hex');

        const encryptedPayload = iv.toString('hex') + ':' + encryptedData;
        const svg = await QRCode.toString(encryptedPayload, { type: 'svg' });

        return svg;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error generating QR code:', error.message);
        } else {
            console.error('Error generating QR code:', error);
        }
        return undefined;
    }
};

export const decryptEncryptedPayload = (encryptedPayload: string): Promise<JsonData> => {
    return new Promise((resolve, reject) => {
        try {
            const secretKey = process.env.AES_SECRET;
            if (!secretKey) {
                throw new Error('AES_SECRET environment variable is not defined');
            }

            // Split the encryptedPayload to get the IV and the encrypted data
            const [ivHex, encryptedData] = encryptedPayload.split(':');
            if (!ivHex || !encryptedData) {
                throw new Error('Invalid encrypted payload format');
            }

            // Convert IV from hex string to Buffer
            const iv = Buffer.from(ivHex, 'hex');
            const encryptedBuffer = Buffer.from(encryptedData, 'hex');

            // Create a decipher using the same algorithm, secret key, and IV
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'utf-8'), iv);

            // Decrypt the data
            let decryptedData = decipher.update(encryptedBuffer.toString('hex'), 'hex', 'utf8');
            decryptedData += decipher.final('utf8');

            // Parse the decrypted JSON string back into an object
            const jsonData: JsonData = JSON.parse(decryptedData);

            resolve(jsonData);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error decrypting payload:', error.message);
            }
            else {
                console.error('Error decrypting payload:', error);
            }
            reject(error);
        }
    });
};
