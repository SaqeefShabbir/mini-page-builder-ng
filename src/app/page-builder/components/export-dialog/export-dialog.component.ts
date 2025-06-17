import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-export-dialog',
  standalone: false,
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.scss'
})

export class ExportDialogComponent {
  selectedFormat = 'html';
  exportOptions: any = [];

  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    private exportService: ExportService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.exportOptions = this.exportService.getExportOptions();
  }

  onExport(): void {
    switch (this.selectedFormat) {
      case 'json':
        this.exportService.exportAsJson();
        break;
      case 'html':
        this.exportService.exportAsHTML();
        break;
      case 'png':
        this.exportService.exportAsPNG();
        break;
    }
    this.dialogRef.close();
  }
}