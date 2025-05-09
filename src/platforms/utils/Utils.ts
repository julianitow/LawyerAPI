import sharp from "sharp";
import NodeCache from "node-cache";

import { IFile } from "../../definitions/interfaces";
import { Application } from "../../app";

export async function saveImageToContext(image: IFile, quality: number): Promise<Buffer | Uint8Array> {
  console.debug('Compressing and saving image:', image.id, 'quality:', quality);
  const beforeTime = new Date().getSeconds();
  const cache = Application.sharedContext.cache as NodeCache;
  const cacheKey = `img-${image.id}`;
  if (cache === undefined) {
    throw new Error('Cache is undefined');
  }
  const buffer = quality !== 100 ?
    await sharp(image.content)
      .jpeg({ quality, mozjpeg: true})
      .toBuffer():
    image.content;

  cache.set(cacheKey, buffer);
  console.debug('Compression duration:', new Date().getSeconds() - beforeTime);
  return buffer;
}