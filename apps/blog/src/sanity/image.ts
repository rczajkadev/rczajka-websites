import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { sanityClient } from './client';

const { image } = createImageUrlBuilder(sanityClient);

export const urlForImage = (source: SanityImageSource) => image(source);
