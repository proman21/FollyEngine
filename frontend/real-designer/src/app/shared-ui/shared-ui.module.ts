import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchListComponent, IterablePipe } from './search-list/search-list.component';
import { MaterialModule } from './../material.module';

@NgModule({
  imports: [CommonModule, MaterialModule],
  exports: [SearchListComponent, IterablePipe],
  declarations: [SearchListComponent, IterablePipe]
})
export class SharedUiModule {}
