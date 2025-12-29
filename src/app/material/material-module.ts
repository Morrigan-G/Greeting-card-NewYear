import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const MaterialComponents = [MatButtonModule,MatSlideToggleModule]

@NgModule({
 
  imports: [MaterialComponents,MatSlideToggleModule], 
  exports: [MaterialComponents,MatSlideToggleModule]
})
export class MaterialModule { }
