import { PortableTextBlock } from "next-sanity";

export interface Post {
  _id: string;
  title: string;
  summary: string;
  content: PortableTextBlock[];
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
  };
  slug: {
    current: string | null;
  };
}
