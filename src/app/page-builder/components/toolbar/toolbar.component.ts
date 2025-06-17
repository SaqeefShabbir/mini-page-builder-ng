import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BuilderService } from '../../services/builder.service';
import { MatDialog } from '@angular/material/dialog';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-toolbar',
  standalone: false,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  @Input() previewMode = false;
  @Input() previewDisabled = false;  // New input to disable preview button

  @Output() togglePreview = new EventEmitter<boolean>();
  @Output() toggleEditing = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
  @Output() undo = new EventEmitter<void>();
  @Output() redo = new EventEmitter<void>();

  canUndo = false;
  canRedo = false;
  
  constructor(private builderService: BuilderService, private exportService: ExportService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.builderService.canUndo$.subscribe(canUndo => this.canUndo = canUndo);
    this.builderService.canRedo$.subscribe(canRedo => this.canRedo = canRedo);
  }

  onTogglePreview() {
      const newPreviewState = !this.previewMode;
      this.togglePreview.emit(newPreviewState);
      this.toggleEditing.emit(!this.previewMode);

      // Visual feedback
      this.animatePreviewButton();
    }

    private animatePreviewButton() {
      const button = document.querySelector('.preview-button');
      button?.classList.add('animate');
      setTimeout(() => {
        button?.classList.remove('animate');
      }, 300);
    }

  private animateButton(button: HTMLElement, className: string) {
    button.classList.add(className);
    setTimeout(() => {
      button.classList.remove(className);
    }, 400);
  }

  private createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size/2;
    const y = event.clientY - rect.top - size/2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  onSave(): void {
    this.builderService.savePage();
    this.snackBar.open('Page Saved!', 'Close', {
      duration: 2000
    });
    this.save.emit();
  }

  onExport(format: 'json' | 'html'): void {
    
    if(format == 'html')
    {
      let exportData = {content: '', type: 'html'};
      exportData.content = this.exportService.exportAsHTML();
      this.dialog.open(ExportDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'modern-dialog',
      data: { content: exportData.content, type: exportData.type }
    });
      this.export.emit();  
    }
    
    if(format == 'json')
    {
      let exportData = {content: '', type: 'json'};
      exportData.content = this.exportService.exportAsJson();
      this.dialog.open(ExportDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'modern-dialog',
      data: { content: exportData.content, type: exportData.type }
    });
      this.export.emit();  
    }
  }

  onUndo(event: MouseEvent): void {
    this.animateButton(event.target as HTMLElement, 'undo-active');
    this.createRipple(event);
    this.undo.emit();
  }

  onRedo(event: MouseEvent): void {
    this.animateButton(event.target as HTMLElement, 'redo-active');
    this.createRipple(event);
    this.redo.emit();
  }
}