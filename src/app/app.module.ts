import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuilderCanvasComponent } from './page-builder/components/builder-canvas/builder-canvas.component';
import { ComponentListComponent } from './page-builder/components/component-list/component-list.component';
import { PropertiesPanelComponent } from './page-builder/components/properties-panel/properties-panel.component';
import { ToolbarComponent } from './page-builder/components/toolbar/toolbar.component';
import { PreviewToggleComponent } from './page-builder/components/preview-toggle/preview-toggle.component';
import { ExportDialogComponent } from './page-builder/components/export-dialog/export-dialog.component';
import { PageBuilderComponent } from './page-builder/page-builder.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    AppComponent,
    BuilderCanvasComponent,
    ComponentListComponent,
    PropertiesPanelComponent,
    ToolbarComponent,
    PreviewToggleComponent,
    PageBuilderComponent,
    ExportDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatSelectModule,
    MatTabsModule,
    MatDialogModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
