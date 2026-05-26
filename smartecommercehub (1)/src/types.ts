export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
};

export type ProductIdea = {
  platform: string;
  title: string;
  price: string;
  rating: number;
  reviews: number;
  discount: string;
  demandScore: number;
  competitionScore: number;
  worthSelling: boolean;
};
