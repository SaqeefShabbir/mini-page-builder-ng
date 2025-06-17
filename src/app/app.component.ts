import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

interface PageElement {
  id: string;
  type: 'header' | 'paragraph' | 'image' | 'button';
  content: string;
  styles?: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  elements: PageElement[] = [
    { id: '1', type: 'header', content: 'Welcome to my page' },
    { id: '2', type: 'paragraph', content: 'This is a sample paragraph' },
    { id: '3', type: 'image', content: 'https://example.com/image.jpg' }
  ];

  availableComponents = [
    { type: 'header', name: 'Header' },
    { type: 'paragraph', name: 'Paragraph' },
    { type: 'image', name: 'Image' },
    { type: 'button', name: 'Button' }
  ];

  selectedElement: PageElement | null = null;

  drop(event: CdkDragDrop<PageElement[]>) {
    moveItemInArray(this.elements, event.previousIndex, event.currentIndex);
  }

  addComponent(type: string) {
    const newElement: PageElement = {
      id: Date.now().toString(),
      type: type as any,
      content: this.getDefaultContent(type)
    };
    this.elements = [...this.elements, newElement];
  }

  selectElement(element: PageElement) {
    this.selectedElement = element;
  }

  deleteElement(id: string) {
    this.elements = this.elements.filter(el => el.id !== id);
    if (this.selectedElement?.id === id) {
      this.selectedElement = null;
    }
  }

  private getDefaultContent(type: string): string {
    switch(type) {
      case 'header': return 'New Header';
      case 'paragraph': return 'Lorem ipsum...';
      case 'image': return 'https://via.placeholder.com/300x150';
      case 'button': return 'Click Me';
      default: return '';
    }
  }
}
