import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StyleControlConfig, StyleProperty, ComponentStyles } from './property-types';

@Component({
  selector: 'app-properties-panel',
  standalone: false,
  templateUrl: './properties-panel.component.html',
  styleUrl: './properties-panel.component.scss',
})
export class PropertiesPanelComponent implements OnChanges, OnInit {
  @Input() component: { styles?: ComponentStyles, content?: string, id?: string } | null = null;
  @Output() styleChange = new EventEmitter<Partial<ComponentStyles>>();
  @Output() contentChange = new EventEmitter<string>();

  form: FormGroup;
  activeTab: 'content' | 'styles' = 'styles';

  styleControls: StyleControlConfig[] = [];

  constructor(private fb: FormBuilder) {
    // Initialize form with proper typing
    const formGroupConfig: Record<StyleProperty, FormControl<string | number | null>> = {
      'color': new FormControl<string>('#000000'),
      'background-color': new FormControl<string>('transparent'),
      'font-size': new FormControl<number>(16),
      'padding': new FormControl<number>(0),
      'opacity': new FormControl<number>(1),
      'border-radius': new FormControl<number>(0),
      'text-align': new FormControl<string>('left'),
      'margin': new FormControl<number>(0),
      'width': new FormControl<number>(0),
      'max-width': new FormControl<number>(0),
      'height': new FormControl<number>(0),
      'display': new FormControl<string>('block'),
      'border': new FormControl<number>(0),
      'cursor': new FormControl<string>('pointer'),
    };

    this.form = this.fb.group(formGroupConfig);

    // Handle form changes
    this.form.valueChanges.subscribe(values => {
      const styleUpdates: Partial<ComponentStyles> = {};
      
      this.styleControls.forEach(control => {
        const value = values[control.property];
        if (value !== null && value !== undefined) {
          styleUpdates[control.property] = control.suffix && typeof value === 'number' 
            ? `${value}${control.suffix}`
            : value.toString();
        }
      });

      this.styleChange.emit(styleUpdates);
    });
  }

  ngOnInit(): void {
    this.setStyleControls();
  }

  applyFilter(component: any): void {
    this.setStyleControls();

    this.styleControls = this.styleControls.filter(control => {
    if (!control.filter) return true;
    
    return control.filter(component.styles);
  });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['component']?.currentValue) {
      const component = changes['component'].currentValue;
      const patchValue: Partial<ComponentStyles> | any = {};

      this.applyFilter(component);

      this.styleControls.forEach(control => {
        const styleValue = component.styles[control.property];
        if (styleValue) {
          if (control.type === 'color' || control.type === 'select') {
            patchValue[control.property] = styleValue;
          } else {
            // Extract numeric value from strings like "16px"
            const numericValue = parseFloat(styleValue);
            patchValue[control.property] = isNaN(numericValue) 
              ? control.defaultValue 
              : numericValue;
          }
        } else {
          patchValue[control.property] = control.defaultValue;
        }
      });

      this.form.patchValue(patchValue, { emitEvent: false });
    }
  }

  setStyleControls() {
    this.styleControls = [
      {
        label: 'Text Color',
        type: 'color',
        property: 'color',
        defaultValue: '#000000',
        min: 0,
        max: 0,
        filter: (styles) => !!styles.color
      },
      {
        label: 'Background',
        type: 'color',
        property: 'background-color',
        defaultValue: 'transparent',
        min: 0,
        max: 0,
        filter: (styles) => !!styles['background-color']
      },
      {
        label: 'Font Size',
        type: 'number',
        property: 'font-size',
        min: 8,
        max: 72,
        step: 1,
        suffix: 'px',
        defaultValue: 16,
        filter: (styles) => !!styles['font-size']
      },
      {
        label: 'Padding',
        type: 'number',
        property: 'padding',
        min: 0,
        max: 50,
        step: 1,
        suffix: 'px',
        defaultValue: 0,
        filter: (styles) => !!styles.padding
      },
      {
        label: 'Opacity',
        type: 'number',
        property: 'opacity',
        min: 0,
        max: 1,
        step: 0.1,
        defaultValue: 1,
        filter: (styles) => !!styles.opacity
      },
      {
        label: 'Border Radius',
        type: 'number',
        property: 'border-radius',
        min: 0,
        max: 100,
        step: 0.1,
        defaultValue: 0,
        suffix: '%',
        filter: (styles) => !!styles['border-radius']
      },
      {
        label: 'Text Align',
        type: 'text',
        property: 'text-align',
        min: 0,
        max: 100,
        defaultValue: 'left',
        filter: (styles) => !!styles['text-align']
      },
      {
        label: 'Margin',
        type: 'number',
        property: 'margin',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 0,
        suffix: 'px',
        filter: (styles) => !!styles.margin
      },
      {
        label: 'Width',
        type: 'number',
        property: 'width',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 100,
        suffix: '%',
        filter: (styles) => !!styles.width
      },
      {
        label: 'Max Width',
        type: 'number',
        property: 'max-width',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 100,
        suffix: '%',
        filter: (styles) => !!styles['max-width']
      },
      {
        label: 'Height',
        type: 'number',
        property: 'height',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 10,
        suffix: 'px',
        filter: (styles) => !!styles.height
      },
      {
        label: 'Display',
        type: 'text',
        property: 'display',
        min: 0,
        max: 0,
        defaultValue: 'block',
        filter: (styles) => !!styles.display
      },
      {
        label: 'Border',
        type: 'number',
        property: 'border',
        min: 0,
        max: 0,
        step: 1,
        defaultValue: 0,
        suffix: 'px',
        filter: (styles) => !!styles.border
      },
      {
        label: 'Cursor',
        type: 'text',
        property: 'cursor',
        min: 0,
        max: 0,
        defaultValue: 'pointer',
        filter: (styles) => !!styles.cursor
      }
    ];
  }

  getFormControl(property: StyleProperty): FormControl<string | number | null> {
    return this.form.get(property) as FormControl<string | number | null>;
  }

  formatLabel(value: number | null): string {
    return value !== null ? `${value}` : '';
  }
}
