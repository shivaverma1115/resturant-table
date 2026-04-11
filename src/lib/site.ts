import type { Metadata } from "next";

import { OG, PRODUCT, TWITTER, resolveAppOrigin } from "@/lib/constants";

export function getMetadataBase(): URL {
  return resolveAppOrigin();
}

export function rootMetadata(): Metadata {
  return {
    metadataBase: getMetadataBase(),
    title: {
      default: `${PRODUCT.NAME} — ${PRODUCT.TAGLINE}`,
      template: `%s | ${PRODUCT.NAME}`,
    },
    description: PRODUCT.DESCRIPTION,
    applicationName: PRODUCT.NAME,
    keywords: [...PRODUCT.KEYWORDS],
    authors: [{ name: PRODUCT.NAME }],
    openGraph: {
      type: OG.TYPE_WEBSITE,
      locale: OG.LOCALE,
      siteName: PRODUCT.NAME,
      title: `${PRODUCT.NAME} — ${PRODUCT.TAGLINE}`,
      description: PRODUCT.DESCRIPTION,
    },
    twitter: {
      card: TWITTER.CARD_SUMMARY_LARGE_IMAGE,
      title: `${PRODUCT.NAME} — ${PRODUCT.TAGLINE}`,
      description: PRODUCT.DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
    },
    formatDetection: {
      telephone: false,
    },
  };
}
