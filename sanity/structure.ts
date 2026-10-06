import type {StructureResolver} from 'sanity/structure'
import {SparklesIcon} from '@sanity/icons/Sparkles'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Pinned Singleton: Promo Toast Banner
      S.listItem()
        .title('Promo Toast Banner')
        .id('promoBanner')
        .icon(SparklesIcon)
        .child(
          S.document()
            .schemaType('promoBanner')
            .documentId('promoBanner')
            .title('Promo Toast Banner')
        ),

      S.divider(),

      // Regular document collections (excluding singleton banner and internal analytics)
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['promoBanner', 'promoAnalytics', 'siteAnalytics'].includes(
            listItem.getId() || ''
          )
      ),
    ])
