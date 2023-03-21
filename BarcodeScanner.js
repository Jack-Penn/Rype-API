const axios = require('axios');
const { MultiFormatReader, BarcodeFormat, DecodeHintType, RGBLuminanceSource, HybridBinarizer } = require('@zxing/library');
const { PNG } = require('pngjs');

async function fetchImage(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });
  return Buffer.from(response.data);
}

function parsePNGToImageData(pngBuffer) {
  return new Promise((resolve, reject) => {
    new PNG().parse(pngBuffer, (error, data) => {
      if (error) {
        reject(error);
      } else {
        const rgbaImageData = new Uint8Array(data.width * data.height * 4);
        for (let i = 0; i < data.data.length; i++) {
          rgbaImageData[i] = data.data[i];
        }
        resolve({ data: rgbaImageData, width: data.width, height: data.height });
      }
    });
  });
}

async function scanBarcode(imageData, width, height) {
  const hints = new Map();
  const formats = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.EAN_13];
  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

  const reader = new MultiFormatReader();
  reader.setHints(hints);

  const luminanceSource = new RGBLuminanceSource(imageData, width, height);
  const binaryBitmap = new HybridBinarizer(luminanceSource);

  try {
    const result = reader.decode(binaryBitmap, hints);
    console.log('Barcode text:', result.getText());
  } catch (err) {
    console.error('No barcode found in the image');
  }
}

exports.scanBarcode = async (image) => {
  console.log("Scanning Barcode");
  // bs = new BarcodeScanner();
  const pngBuffer = await fetchImage(image);
  const { data, width, height } = await parsePNGToImageData(pngBuffer);
  await scanBarcode(data, width, height);
};
