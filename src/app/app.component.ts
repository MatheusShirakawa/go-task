import { Component } from '@angular/core';
import { DialogModule } from '@angular/cdk/dialog';
import { MainContentComponent } from "./features/tasks/components/main-content/main-content.component";
import { HeaderComponent } from './core/layout/header/header.component';
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
