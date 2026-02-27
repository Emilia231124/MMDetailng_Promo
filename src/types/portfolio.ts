export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageBefore: string;
  imageAfter: string;
  serviceId: string;
  isPublished: boolean;
  createdAt: string;
}
