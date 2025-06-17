import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Page } from '../../models/page.model';
import { BaseComponent } from '../../models/component.model';
import { BuilderService } from '../../services/builder.service';

@Component({
  selector: 'app-builder-canvas',
  standalone: false,
  templateUrl: './builder-canvas.component.html',
  styleUrl: './builder-canvas.component.scss',
})
export class BuilderCanvasComponent implements AfterViewInit {
  @Input() page!: Page;
  @Input() previewMode = false;

  @Output() componentSelect = new EventEmitter<BaseComponent | null>();
  @Output() componentDelete = new EventEmitter<BaseComponent>();
  
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLElement>;
  selectedComponent: BaseComponent | null = null;
  canvasRect?: DOMRect;

  constructor(private builderService: BuilderService) {}

  ngAfterViewInit(): void {
    this.updateCanvasRect();
    setTimeout(() => this.updateCanvasRect(), 100); // Extra check after render
  }

  updateCanvasRect(): void {
    this.canvasRect = this.canvasRef?.nativeElement?.getBoundingClientRect();
  }

  onComponentClick(component: BaseComponent, event: MouseEvent): void {
    event.stopPropagation();
    this.selectedComponent = component;
    this.componentSelect.emit(component);

    // Register our canvas click to be called after redo
    this.builderService.registerAfterRedoCallback(() => {
      this.onCanvasClick();
    });
  }

  onCanvasClick(): void {
    this.selectedComponent = null;
    this.componentSelect.emit(null);
  }

  onDeleteComponent(component: BaseComponent, event: MouseEvent): void {
    event.stopPropagation();
    this.componentDelete.emit(component);
    if (this.selectedComponent?.id === component.id) {
      this.selectedComponent = null;
    }
  }

  onDrop(event: CdkDragDrop<BaseComponent[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getComponentStyles(styles: any): any {
    return {
      ...styles,
      'border': this.previewMode ? 'none' : '1px dashed #ccc',
      'pointer-events': this.previewMode ? 'none' : 'auto'
    };
  }

  trackByFn(index: number, item: BaseComponent): string {
    return item.id;
  }
}