export type StyleProperty = 
  | 'color'
  | 'background-color'
  | 'font-size'
  | 'padding'
  | 'opacity'
  | 'border-radius'
  | 'text-align'
  | 'margin'
  | 'width'
  | 'max-width'
  | 'height'
  | 'display'
  | 'border'
  | 'cursor';

export interface ComponentStyles {
  'color'?: string;
  'background-color'?: string;
  'font-size'?: string;
  'padding'?: number;
  'opacity'?: number;
  'border-radius'?: number;
  'text-align'?: string;
  'margin'?: number;
  'width'?: number;
  'max-width'?: number; 
  'height'?: number;
  'display'?: string;
  'border'?: string;
  'cursor'?: string;
}

export interface StyleControlConfig {
  property: StyleProperty;
  label: string;
  type: 'color' | 'number' | 'text' | 'select' | 'slider' | 'toggle';
  defaultValue?: string | number;
  min: string | number | null;
  max: string | number | null;
  step?: number;
  suffix?: string;
  options?: { value: string | number, label: string }[];
  group?: 'Text' | 'Layout' | 'Spacing' | 'Border' | 'Effects' | 'Positioning';
  hidden?: boolean;
  filter?: (styles: ComponentStyles) => boolean;
}