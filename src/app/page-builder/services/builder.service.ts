import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Page } from '../models/page.model';
import { TextComponent, ImageComponent, ButtonComponent, DividerComponent, VideoComponent, SectionComponent, ComponentStyles, BaseComponent } from '../models/component.model';

interface StylePreset {
  id: string;
  name: string;
  styles: ComponentStyles;
}

@Injectable({
  providedIn: 'root'
})
export class BuilderService {
  private currentPageSubject = new BehaviorSubject<Page>(this.createDefaultPage());
  currentPage$ = this.currentPageSubject.asObservable();

  private history: Page[] = [];
  private historyIndex = -1;

  private stylePresets: StylePreset[] = [];

  private afterRedoCallbacks: (() => void)[] = [];

  canUndo$ = new BehaviorSubject<boolean>(false);
  canRedo$ = new BehaviorSubject<boolean>(false);
  
  constructor() {
    this.loadPresetsFromStorage();
    this.saveToHistory();
  }

  getCurrentPage(): Page {
    return this.currentPageSubject.value;
  }

  addComponent(componentType: string): void {
  const page = this.getCurrentPage();
  let newComponent;

  switch (componentType) {
    case 'text':
      newComponent = new TextComponent();
      break;
    case 'image':
      newComponent = new ImageComponent();
      break;
    case 'button':
      newComponent = new ButtonComponent();
      break;
    case 'divider':
      newComponent = new DividerComponent();
      break;
    case 'video':
      newComponent = new VideoComponent();
      break;
    case 'section':
      newComponent = new SectionComponent();
      break;
    default:
      return;
  }

  page.components.push(newComponent);
  this.currentPageSubject.next(page);
  this.saveToHistory();
}

savePreset(preset: StylePreset): void {
    // Remove existing preset with same ID if it exists
    this.stylePresets = this.stylePresets.filter(p => p.id !== preset.id);
    this.stylePresets.push(preset);
    this.savePresetsToStorage();
  }

  getPresets(): StylePreset[] {
    return [...this.stylePresets]; // Return a copy
  }

  applyPreset(componentId: string, presetId: string): boolean {
    const preset = this.stylePresets.find(p => p.id === presetId);
    if (!preset) return false;

    this.updateComponentStyles(componentId, preset.styles);
    return true;
  }

  deletePreset(presetId: string): void {
    this.stylePresets = this.stylePresets.filter(p => p.id !== presetId);
    this.savePresetsToStorage();
  }

  // Private helper to persist presets
  private savePresetsToStorage(): void {
    localStorage.setItem('stylePresets', JSON.stringify(this.stylePresets));
  }

  // Initialize presets from storage
  private loadPresetsFromStorage(): void {
    const presets = localStorage.getItem('stylePresets');
    if (presets) {
      try {
        this.stylePresets = JSON.parse(presets);
      } catch (e) {
        console.error('Failed to load presets', e);
        this.stylePresets = [];
      }
    }
  }

  updateComponentStyles(componentId: string, styles: ComponentStyles, merge: boolean = true): void {
    const currentPage = this.getCurrentPage();
    const component = this.findComponentById(currentPage.components, componentId);

    if (component) {
      if (merge) {
        // Merge new styles with existing styles
        component.styles = { ...component.styles, ...styles };
      } else {
        // Replace all styles
        component.styles = { ...styles };
      }

      // Notify subscribers of the change
      this.currentPageSubject.next(currentPage);
      this.saveToHistory();
    } else {
      console.warn(`Component with ID ${componentId} not found`);
    }
  }

  private findComponentById(components: BaseComponent[], componentId: string): BaseComponent | null {
    for (const component of components) {
      if (component.id === componentId) {
        return component;
      }
    }
    return null;
  }

  removeComponent(component: any): void {
    const page = this.getCurrentPage();
    page.components = page.components.filter(c => c !== component);
    this.currentPageSubject.next(page);
    this.saveToHistory();
  }

  updateComponent(component: any, updates: any): void {
    Object.assign(component, updates);
    this.currentPageSubject.next(this.getCurrentPage());
    this.saveToHistory();
  }

  savePage(): void {
    // Implement API call to save page
    console.log('Page saved:', this.getCurrentPage());
  }

  exportPage(): string {
    return JSON.stringify(this.getCurrentPage());
  }

  undo(): void {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.currentPageSubject.next(this.history[this.historyIndex]);
      this.updateUndoRedoState();
    }
  }

  redo(): void {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.currentPageSubject.next(this.history[this.historyIndex]);
      this.updateUndoRedoState();

      // Execute all registered callbacks
      this.afterRedoCallbacks.forEach(callback => callback());
      this.afterRedoCallbacks = []; // Clear callbacks after execution
    }
  }

  registerAfterRedoCallback(callback: () => void): void {
    this.afterRedoCallbacks.push(callback);
  }

  private updateUndoRedoState(): void {
    this.canUndo$.next(this.historyIndex > 0);
    this.canRedo$.next(this.historyIndex < this.history.length - 1);
  }

  private createDefaultPage(): Page {
    return {
      id: '1',
      title: 'New Page',
      components: [],
      styles: {}
    };
  }

  private saveToHistory(): void {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(JSON.parse(JSON.stringify(this.getCurrentPage())));
    this.historyIndex = this.history.length - 1;
    this.updateUndoRedoState();
  }
}