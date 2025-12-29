import { Component, NgModule, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header-component/header-component";
import { ContentComponent } from "./content-component/content-component";
import { MaterialModule } from './material/material-module';
import { FooterComponent } from "./footer-component/footer-component";


export class Module{}
@Component({
  selector: 'app-root',
  imports: [ContentComponent, MaterialModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Greeting-card');
}

