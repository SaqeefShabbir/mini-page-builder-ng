import { Component, OnInit } from '@angular/core';
import { BuilderService } from '../../services/builder.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface ComponentItem {
  type: string;
  name: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-component-list',
  standalone: false,
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.scss']
})
export class ComponentListComponent implements OnInit {
  floatLabel: FloatLabelType = 'auto';
  searchControl = new FormControl('');
  filteredComponents: ComponentItem[] = [];
  
  components: ComponentItem[] = [
    {
      type: 'text',
      name: 'Text Block',
      icon: 'text_fields',
      description: 'Add a text block to your page'
    },
    {
      type: 'image',
      name: 'Image',
      icon: 'image',
      description: 'Add an image to your page'
    },
    {
      type: 'button',
      name: 'Button',
      icon: 'smart_button',
      description: 'Add a clickable button'
    },
    {
      type: 'divider',
      name: 'Divider',
      icon: 'horizontal_rule',
      description: 'Add a horizontal line'
    },
    {
      type: 'video',
      name: 'Video',
      icon: 'video_library',
      description: 'Embed a video player'
    },
    {
      type: 'section',
      name: 'Section',
      icon: 'view_agenda',
      description: 'Add a content section'
    }
  ];

  constructor(private builderService: BuilderService) {}

  ngOnInit(): void {
    this.filteredComponents = [...this.components];
    
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((searchTerm: any) => {
        this.applyFilter(searchTerm);
      });
  }

  applyFilter(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredComponents = [...this.components];
      return;
    }

    const term = searchTerm.toLowerCase();
    this.filteredComponents = this.components.filter(component => 
      component.name.toLowerCase().includes(term) ||
      component.description.toLowerCase().includes(term) ||
      component.type.toLowerCase().includes(term)
    );
  }

  addComponent(componentType: string): void {
    this.builderService.addComponent(componentType);
  }

  onDrop(event: CdkDragDrop<ComponentItem[]>): void {
    this.addComponent(event.item.data.type);
  }

  trackByFn(index: number, item: ComponentItem): string {
    return item.type;
  }
}