import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BuilderService } from './services/builder.service';
import { Page } from './models/page.model';

@Component({
  selector: 'app-page-builder',
  standalone: false,
  templateUrl: './page-builder.component.html',
  styleUrl: './page-builder.component.scss'
})

export class PageBuilderComponent implements OnInit {
  currentPage!: Page;
  selectedComponent = {
    styles: {
      'color': '#000000',
      'font-size': '16px'
    },
    content: 'Sample text'
  };

  // Store the pre-preview state
  private prePreviewState: {
    page: any;
    selectedComponent: any;
    componentStates: Map<string, any>;
  } | null = null;

  previewMode = false;
  previewDisabled = false;  // Set to true when no content to preview


  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key === 'p' || event.key === 'P') {
  //     if (!event.ctrlKey && !event.metaKey) {
  //       this.togglePreviewMode();
  //       event.preventDefault();
  //     }
  //   } else if (event.key === 'Escape' && this.previewMode) {
  //     this.togglePreviewMode();
  //     event.preventDefault();
  //   }
  // }

  // togglePreviewMode() {
  //   if (this.previewDisabled) return;
    
  //   this.previewMode = !this.previewMode;
  //   console.log(`Preview mode ${this.previewMode ? 'activated' : 'deactivated'}`);
    
  //   // Add any additional logic needed when toggling preview
  //   this.handlePreviewModeChange();
  // }

  // private handlePreviewModeChange() {
  //   if (this.previewMode) {
  //     // Actions to perform when entering preview mode
  //     document.body.style.overflow = 'hidden'; // Prevent scrolling
  //     this.disableEditing();
  //   } else {
  //     // Actions to perform when exiting preview mode
  //     document.body.style.overflow = '';
  //     this.enableEditing();
  //   }
  // }

  // private disableEditing() {
  //   // Disable editing functionality
  // }

  // private enableEditing() {
  //   // Enable editing functionality
  // }

  constructor(private builderService: BuilderService, private changeDetectorRef: ChangeDetectorRef) {
      
  }

  ngOnInit(): void {
    this.currentPage = this.builderService.getCurrentPage();

    // Make sure you're properly subscribing to changes
    this.builderService.currentPage$.subscribe(page => {
      this.currentPage = page;
      this.changeDetectorRef.detectChanges(); // Manually trigger change detection if needed
    });
  }

  onComponentSelect(component: any): void {
    this.selectedComponent = component;
  }

  onComponentDelete(component: any): void {
    this.builderService.removeComponent(component);
    if (this.selectedComponent === component) {
    this.selectedComponent = {
      styles: {
        'color': '#000000',
        'font-size': '16px'
      },
      content: 'Sample text'
    };
    }
  }

  updateStyles(styles: any) {
    this.selectedComponent.styles = { ...this.selectedComponent.styles, ...styles };
  }

  updateContent(content: string) {
    this.selectedComponent.content = content;
  }

  onToolbarTogglePreview(newState: boolean) {
    this.previewMode = newState;
    if (this.previewMode) {
      this.saveCurrentState();
    } else {
      this.restoreState();
    }
  }

  private saveCurrentState(): void {
    // Deep clone the current page
    const pageCopy = JSON.parse(JSON.stringify(this.currentPage));
    
    // Save all component states
    const componentStates = new Map<string, any>();
    if (this.currentPage?.components) {
      this.currentPage.components.forEach((comp: any) => {
        componentStates.set(comp.id, {
          styles: {...comp.styles},
          content: comp.content
        });
      });
    }
    
    this.prePreviewState = {
      page: pageCopy,
      selectedComponent: this.selectedComponent ? {...this.selectedComponent} : null,
      componentStates
    };
    
    console.log('State saved', this.prePreviewState);
  }

  private restoreState(): void {
    if (!this.prePreviewState) return;
    
    // Restore the page
    this.currentPage = JSON.parse(JSON.stringify(this.prePreviewState.page));
    
    // Restore component states
    if (this.currentPage?.components) {
      this.currentPage.components.forEach((comp: any) => {
        const savedState = this.prePreviewState?.componentStates.get(comp.id);
        if (savedState) {
          comp.styles = {...savedState.styles};
          comp.content = savedState.content;
        }
      });
    }
    
    // Restore selected component
    this.selectedComponent = this.prePreviewState.selectedComponent 
      ? {...this.prePreviewState.selectedComponent} 
      : null;
  }

  savePage(): void {
    this.builderService.savePage();
  }

  exportPage(): void {
    this.builderService.exportPage();
  }

  undo() : void {
    this.builderService.undo();
  }

  redo() : void {
    this.builderService.redo();
  }

  updateComponent(selectedComponent: any, $event: any) : void {
    this.builderService.updateComponent(selectedComponent, $event);
  }

  savePreset($event: any): void {
    this.builderService.savePreset($event);
  }
}