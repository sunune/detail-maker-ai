
export type SectionType = 'Hero' | 'Features' | 'Review' | 'Spec' | 'CTA' | 'Event';

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  imageUrl?: string;
  backgroundColor: string;
  textColor: string;
}

export interface ProjectInfo {
  productName: string;
  productDesc: string;
  targetAudience: string;
  tone: string;
}

export enum AppStatus {
  SETUP = 'SETUP',
  EDITING = 'EDITING',
  PREVIEW = 'PREVIEW'
}
