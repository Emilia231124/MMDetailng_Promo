export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceNew: number;
  priceUsed: number;
  duration: string;
  category: ServiceCategory;
  image: string;
  features: string[];
  order: number;
  isActive: boolean;
}

export type ServiceCategory = "protection" | "polishing" | "cleaning" | "maintenance";
