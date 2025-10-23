// FIX: Removed an incorrect import of 'Template' from './templates' which was causing a circular dependency. The Template interface is defined in this file.
export type AppState = 'topic' | 'outline' | 'template' | 'generating' | 'presentation';

export type SlideLayout = 
  | 'title_and_content' 
  | 'section_header' 
  | 'image_full_bleed'
  | 'two_column_text'
  | 'image_left_text_right'
  | 'quote';

export type SlideType = 'introduction' | 'divider' | 'main_point' | 'quote' | 'conclusion';

export interface SlidePrototype {
  title: string;
  subtitle: string;
  content: string[];
  image_prompt: string;
  slideType: SlideType;
}
export interface SlideContent extends SlidePrototype {
  imageData?: string;
  layout: SlideLayout;
}

export interface Theme {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  theme: Theme;
  availableLayouts: {
    content: SlideLayout[];
    divider: SlideLayout[];
    quote: SlideLayout[];
  };
}
