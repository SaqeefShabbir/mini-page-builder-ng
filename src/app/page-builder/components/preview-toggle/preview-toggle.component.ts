import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-preview-toggle',
  standalone: false,
  templateUrl: './preview-toggle.component.html',
  styleUrl: './preview-toggle.component.scss'
})

export class PreviewToggleComponent {
  @Input() previewMode: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  onToggle() {
    this.toggle.emit();
  }
}
