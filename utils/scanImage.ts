import jsQR from 'jsqr';
import { createCanvas, loadImage } from 'canvas';

/**
 * Scans the QR code from the given Base64 image.
 * @param {string} imageData - Base64-encoded string of the image.
 * @returns {string|null} - The decoded QR code payload or null if not found.
 */
function scanQRCodeFromImage(imageData) {
    return new Promise(async (resolve, reject) => {
        try {
            const imgBuffer = Buffer.from(imageData.split(',')[1], 'base64'); // Remove 'data:image/jpeg;base64,' prefix
            const image = await loadImage(imgBuffer); // Load image asynchronously

            const canvas = createCanvas(image.width, image.height);
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);

            const imageDataObj = context.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = jsQR(imageDataObj.data, canvas.width, canvas.height);

            if (qrCode) {
                resolve(qrCode.data); // Resolve promise with QR code data
            } else {
                resolve(null); // Resolve promise with null if no QR code is found
            }
        } catch (error) {
            console.error('Error scanning QR code:', error);
            reject(error); // Reject promise with the error
        }
    });
}

export default scanQRCodeFromImage;
