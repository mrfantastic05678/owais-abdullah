import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource | null | undefined) => {
  if (!source || (typeof source === 'object' && 'asset' in source && !source.asset)) {
    const noopChain: any = {
      auto: () => noopChain,
      width: () => noopChain,
      height: () => noopChain,
      fit: () => noopChain,
      quality: () => noopChain,
      url: () => '',
    };
    return noopChain;
  }
  return builder.image(source).auto('format')
}
