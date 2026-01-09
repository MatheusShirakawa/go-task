import { Component } from '@angular/core';
import { HeaderComponent } from "./components/header/header.component";
import { DialogModule } from '@angular/cdk/dialog';
import { MainContentComponent } from "./components/main-content/main-content.component";
// @Injectable({ providedIn: 'platform' })

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, MainContentComponent,DialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
	title = 'go-task';
}
