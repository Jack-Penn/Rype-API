const axios = require("axios");
const {
  MultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} = require("@zxing/library");

async function fetchImage(url) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });
  return new Uint8Array(response.data);
}

async function scanBarcode(imageData) {
  const hints = new Map();
  const formats = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.CODE_128,
    BarcodeFormat.EAN_13,
  ];
  hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);

  const reader = new MultiFormatReader();
  reader.setHints(hints);

  const { width, height } = getImageDimensions(imageData);
  const luminanceSource = reader.createLuminanceSource(
    imageData,
    width,
    height
  );
  const binaryBitmap = reader.createBinaryBitmap(luminanceSource);

  try {
    const result = reader.decode(binaryBitmap, hints);
    console.log("Barcode text:", result.getText());
  } catch (err) {
    console.error("No barcode found in the image");
  }
}

function getImageDimensions(data) {
  if (
    data[0] === 0x89 &&
    data[1] === 0x50 &&
    data[2] === 0x4e &&
    data[3] === 0x47
  ) {
    const width =
      (data[16] << 24) | (data[17] << 16) | (data[18] << 8) | data[19];
    const height =
      (data[20] << 24) | (data[21] << 16) | (data[22] << 8) | data[23];
    return { width, height };
  }
  throw new Error("Invalid PNG file");
}

exports.scanBarcode = async (image) => {
  console.log("Scanning Barcode");
  bs = new BarcodeScanner();
  const imageData = await bs.fetchImage(image);
  await scanBarcode(imageData);
};
