import { Injectable } from '@angular/core';
import { BuilderService } from './builder.service';
import { Page } from '../models/page.model';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(
    private builderService: BuilderService,
    private sanitizer: DomSanitizer
  ) {}

  // Export as JSON
  exportAsJson(): string {
    const page = this.builderService.getCurrentPage();
    const data = JSON.stringify(page, null, 2);
    this.downloadFile(data, 'application/json', `${page.title}.json`);
    return data;
  }

  // Export as HTML
  exportAsHTML(): string {
    const page = this.builderService.getCurrentPage();
    const html = this.generateHTML(page);
    this.downloadFile(html, 'text/html', `${page.title}.html`);
    return html;
  }

  // Export as PNG (simulated - would need canvas in real implementation)
  exportAsPNG(): void {
    // In a real implementation, you would use html2canvas or similar
    console.warn('PNG export would require html2canvas or similar library');
    alert('PNG export would capture the current preview as an image in a real implementation');
  }

  // Generate HTML from page components
  private generateHTML(page: Page): string {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="page-container">`;

    page.components.forEach(component => {
      html += this.generateComponentHTML(component);
    });

    html += `
  </div>
</body>
</html>`;

    return html;
  }

  // Generate HTML for individual components
  private generateComponentHTML(component: any): string {
    const styles = this.convertStyles(component.styles);
    
    switch (component.type) {
      case 'text':
        return `\n    <div style="${styles}">${component.content}</div>`;
      case 'image':
        return `\n    <img src="${component.content}" style="${styles}">`;
      case 'button':
        return `\n    <button style="${styles}">${component.content}</button>`;
      case 'divider':
        return `\n    <div style="${styles}"></div>`;
      case 'video':
        return `\n    <video 
                        src="${component.content}"
                        autoplay
                        loop
                        muted
                        controls
                        style="${styles}"
                        >
                            Your browser does not support the video tag.
                      </video>`;
      case 'section':
        return `\n    <section style="${styles}"></section>`;
      default:
        return `\n    <div style="${styles}">Unsupported component: ${component.type}</div>`;
    }
  }

  // Convert style object to CSS string
  private convertStyles(styles: any): string {
    return Object.keys(styles)
      .map(key => `${key}: ${styles[key]}`)
      .join('; ');
  }

  // Download file helper
  private downloadFile(data: string, type: string, filename: string): void {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Get export options
  getExportOptions(): {id: string, name: string, icon: string}[] {
    return [
      { id: 'json', name: 'JSON', icon: 'code' },
      { id: 'html', name: 'HTML', icon: 'html' },
      { id: 'png', name: 'Image (PNG)', icon: 'image' }
    ];
  }
}