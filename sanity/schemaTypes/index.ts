import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import toolReviewType from './toolReviewType'
import {promoAnalyticsType} from './promoAnalyticsType'
import {promoBannerType} from './promoBannerType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, toolReviewType, promoAnalyticsType, promoBannerType],
}
