import { DefaultSeoProps } from "next-seo";

import { HeadSeoProps } from "@components/seo/head-seo";

const seoImages = {
  default: "/emails/the-skills-logo-black.png",
  // TheSkills - commented out until we deoploy our own Open Graph Image as a Service.
  // https://github.com/vercel/og-image
  // ogImage: "https://og-image-one-pi.vercel.app/",
};

export const getSeoImage = (key: keyof typeof seoImages): string => {
  return seoImages[key];
};

export const seoConfig: {
  headSeo: Required<Pick<HeadSeoProps, "siteName">>;
  defaultNextSeo: DefaultSeoProps;
} = {
  headSeo: {
    siteName: "The Skills",
  },
  defaultNextSeo: {
    twitter: {
      handle: "@theskills",
      site: "@theskills",
      cardType: "summary_large_image",
    },
  },
} as const;
