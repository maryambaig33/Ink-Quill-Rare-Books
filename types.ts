export interface Book {
  id: string;
  title: string;
  author: string;
  year: string;
  price: string;
  image: string;
  description: string;
  condition: 'Fine' | 'Very Good' | 'Good' | 'Fair';
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface AppraisalResult {
  title?: string;
  estimatedEra?: string;
  conditionAssessment?: string;
  historicalSignificance?: string;
  rawAnalysis: string;
}

export enum AppView {
  HOME = 'HOME',
  COLLECTION = 'COLLECTION',
  CURATOR = 'CURATOR', // Chat
  APPRAISER = 'APPRAISER', // Vision
}
