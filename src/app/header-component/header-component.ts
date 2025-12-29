import { Component } from '@angular/core';
import { MatSlideToggle } from "@angular/material/slide-toggle";
import {MatButtonModule} from '@angular/material/button'


@Component({
  selector: 'app-header-component',
  imports: [MatButtonModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {

}
