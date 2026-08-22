import { PortableTextBlock } from "next-sanity";

export interface Faq {
  question: string;
  answer: string;
}

export interface Post {
  _id: string;
  title: string;
  summary: string;
  content: PortableTextBlock[];
  faqs: Faq[];
  categories: { title: string }[];
  mainImage: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
  _createdAt: string;
  author: {
    name: string;
    image?: {
      _type: string;
      asset: {
        _ref: string;
        _type: string;
      };
    };
    bio?: string;
  };
  slug: {
    current: string | null;
  };
  likes?: number;
  dislikes?: number;
  views?: number;
}
