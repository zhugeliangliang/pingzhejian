export interface Poetry {
  id: string;
  title: string;
  content: string;
  form: PoetryForm;
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PoetryForm =
  | '五言绝句'
  | '七言绝句'
  | '五言律诗'
  | '七言律诗'
  | '词'
  | '曲'
  | '古体诗'
  | '现代诗';

export interface Template {
  id: string;
  name: string;
  form: PoetryForm;
  pattern: string;
  description: string;
  example?: string;
}

export interface TonePattern {
  line: number;
  pattern: string;
  rhyme: boolean;
}
