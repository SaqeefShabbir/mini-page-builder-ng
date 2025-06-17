import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @Input() dragData: any;
  @Output() onDrop: EventEmitter<any> = new EventEmitter();

  private isDragging = false;

  constructor(private el: ElementRef) {
    this.el.nativeElement.draggable = true;
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(event: DragEvent): void {
    this.isDragging = true;
    event.dataTransfer?.setData('text/plain', JSON.stringify(this.dragData));
    this.el.nativeElement.classList.add('dragging');
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(event: DragEvent): void {
    this.isDragging = false;
    this.el.nativeElement.classList.remove('dragging');
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    if (this.isDragging) return;
    event.preventDefault();
    this.el.nativeElement.classList.add('drag-over');
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    this.el.nativeElement.classList.remove('drag-over');
  }

  @HostListener('drop', ['$event'])
  onDropEvent(event: DragEvent): void {
    event.preventDefault();
    this.el.nativeElement.classList.remove('drag-over');
    
    const data = event.dataTransfer?.getData('text/plain');
    if (data) {
      this.onDrop.emit(JSON.parse(data));
    }
  }
}