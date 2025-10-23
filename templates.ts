import { Template } from './types';

export const templates: Template[] = [
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'A sleek, dark theme with cool blue accents for a modern and professional look.',
    theme: {
      backgroundColor: '03045E',
      textColor: 'FFFFFF',
      accentColor: '00B4D8',
      fontFamily: 'Michroma',
    },
    availableLayouts: {
      content: ['title_and_content', 'image_left_text_right'],
      divider: ['section_header'],
      quote: ['quote'],
    },
  },
  {
    id: 'corporate-clean',
    name: 'Corporate Clean',
    description: 'A bright, clean, and professional theme with a classic blue accent.',
    theme: {
      backgroundColor: 'FFFFFF',
      textColor: '333333',
      accentColor: '005f99',
      fontFamily: 'Arial',
    },
    availableLayouts: {
      content: ['title_and_content', 'two_column_text', 'image_left_text_right'],
      divider: ['section_header'],
      quote: ['quote'],
    },
  },
  {
    id: 'minimalist-dark',
    name: 'Minimalist Dark',
    description: 'A simple, elegant, and high-contrast dark theme for focused content.',
    theme: {
      backgroundColor: '121212',
      textColor: 'FFFFFF',
      accentColor: 'BB86FC',
      fontFamily: 'Michroma',
    },
    availableLayouts: {
      content: ['title_and_content', 'quote'],
      divider: ['section_header'],
      quote: ['quote'],
    },
  },
  {
    id: 'creative-burst',
    name: 'Creative Burst',
    description: 'A vibrant and energetic theme with bold colors to make your content pop.',
    theme: {
      backgroundColor: '2D2A4A',
      textColor: 'FFFFFF',
      accentColor: 'F72585',
      fontFamily: 'Michroma',
    },
    availableLayouts: {
      content: ['image_full_bleed', 'image_left_text_right'],
      divider: ['section_header'],
      quote: ['quote'],
    },
  },
  {
    id: 'eco-friendly',
    name: 'Eco-Friendly',
    description: 'An earthy and natural theme with shades of green and brown.',
    theme: {
      backgroundColor: 'F0F4F0',
      textColor: '283618',
      accentColor: '606C38',
      fontFamily: 'Georgia',
    },
    availableLayouts: {
      content: ['title_and_content', 'two_column_text'],
      divider: ['section_header'],
      quote: ['quote'],
    },
  },
  {
    id: 'academic-journal',
    name: 'Academic Journal',
    description: 'A classic, scholarly theme with a cream background and serif fonts.',
    theme: {
      backgroundColor: 'FDFBF7',
      textColor: '222222',
      accentColor: '8B0000',
      fontFamily: 'Times New Roman',
    },
    availableLayouts: {
      content: ['two_column_text', 'title_and_content'],
      divider: ['section_header'],
      quote: ['quote'],
    },
  },
  {
    id: 'tech-noir',
    name: 'Tech Noir',
    description: 'A futuristic, cyberpunk-inspired theme with electric blue and cyan accents.',
    theme: {
      backgroundColor: '0A0A0A',
      textColor: 'E0E0E0',
      accentColor: '00FFFF',
      fontFamily: 'Michroma',
    },
    availableLayouts: {
      content: ['image_left_text_right', 'image_full_bleed'],
      divider: ['section_header'],
      quote: ['quote'],
    },
  },
  {
    id: 'simple-light',
    name: 'Simple Light',
    description: 'The quintessential classic: black text on a clean white background.',
    theme: {
      backgroundColor: 'FFFFFF',
      textColor: '000000',
      accentColor: '007BFF',
      fontFamily: 'Helvetica',
    },
    availableLayouts: {
      content: ['title_and_content', 'two_column_text'],
      divider: ['section_header'],
      quote: ['quote'],
    },
  },
  {
    id: 'sunset-hues',
    name: 'Sunset Hues',
    description: 'A warm and inviting theme inspired by the colors of a sunset.',
    theme: {
      backgroundColor: 'FFF3E0',
      textColor: '4E342E',
      accentColor: 'FF7043',
      fontFamily: 'Verdana',
    },
    availableLayouts: {
      content: ['image_left_text_right', 'title_and_content'],
      divider: ['section_header'],
      quote: ['quote'],
    },
  },
  {
    id: 'modern-slate',
    name: 'Modern Slate',
    description: 'A sophisticated and modern gray theme with a striking yellow accent.',
    theme: {
      backgroundColor: '343A40',
      textColor: 'F8F9FA',
      accentColor: 'FFC107',
      fontFamily: 'Michroma',
    },
    availableLayouts: {
      content: ['title_and_content', 'image_left_text_right'],
      divider: ['section_header'],
      quote: ['quote'],
    },
  },
];