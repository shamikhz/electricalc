import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Simple CRC32 implementation for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

function generatePng(width, height) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const cornerR = width * 0.22;

  // Bolt geometry points normalized (0..1)
  // Based on: M288 64 L160 256 L248 256 L224 448 L352 224 L272 224 Z scaled to (512x512)
  const boltPoly = [
    [288 / 512, 64 / 512],
    [160 / 512, 256 / 512],
    [248 / 512, 256 / 512],
    [224 / 512, 448 / 512],
    [352 / 512, 224 / 512],
    [272 / 512, 224 / 512],
  ];

  // Point in polygon test
  function insidePoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0] * width, yi = poly[i][1] * height;
      const xj = poly[j][0] * width, yj = poly[j][1] * height;
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Rounded squircle distance
      const qx = Math.max(0, Math.abs(x - cx) - (cx - cornerR));
      const qy = Math.max(0, Math.abs(y - cy) - (cy - cornerR));
      const cornerDist = Math.sqrt(qx * qx + qy * qy);

      if (cornerDist > cornerR) {
        // Transparent outside rounded icon
        rawData[pxOffset] = 0;
        rawData[pxOffset + 1] = 0;
        rawData[pxOffset + 2] = 0;
        rawData[pxOffset + 3] = 0;
        continue;
      }

      // Emerald gradient: top-left (#10B981) to bottom-right (#047857)
      const gradT = (x / width + y / height) * 0.5;
      let r = Math.round(16 + (4 - 16) * gradT);
      let g = Math.round(185 + (120 - 185) * gradT);
      let b = Math.round(129 + (87 - 129) * gradT);
      let a = 255;

      // Inner border highlight
      if (cornerDist > cornerR - width * 0.02) {
        r = Math.min(255, r + 40);
        g = Math.min(255, g + 40);
        b = Math.min(255, b + 40);
      }

      // Check if inside lightning bolt
      if (insidePoly(x, y, boltPoly)) {
        r = 255;
        g = 255;
        b = 255;
      }

      // Accent energy spark circle around cx=368, cy=144 (scaled)
      const sparkX = (368 / 512) * width;
      const sparkY = (144 / 512) * height;
      const sparkR = (18 / 512) * width;
      const sparkDist = Math.hypot(x - sparkX, y - sparkY);
      if (sparkDist <= sparkR) {
        r = 253;
        g = 224;
        b = 71;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // PNG Signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Non-interlaced
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // IDAT
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), generatePng(192, 192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), generatePng(512, 512));
fs.writeFileSync(path.join(publicDir, 'icon-512-maskable.png'), generatePng(512, 512));
console.log('Successfully generated icon-192.png, icon-512.png, icon-512-maskable.png');
