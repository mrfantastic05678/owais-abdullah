export interface PostCard {
  _id: string;
  title: string;
  summary: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
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
  views?: number;
  likes?: number;
  dislikes?: number;
};

export interface BlogSectionProps {
  limit?: number;
  excludeLatest?: boolean;
  showViewAll?: boolean;
}

interface BlogComment {
  _id: string;
  name: string;
  email: string;
  comment: string;
  _createdAt: string;
}