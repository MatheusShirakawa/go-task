import { Component, inject, Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./components/header/header.component";
import { DialogModule } from '@angular/cdk/dialog';
import { MainContentComponent } from "./components/main-content/main-content.component";
import { TaskFormModalComponent } from "./components/task-form-modal/task-form-modal.component";
import { TaskCommentsModalComponent } from "./components/task-comments-modal/task-comments-modal.component";
import { ModalControllerService } from './services/modal-controller.service';
// @Injectable({ providedIn: 'platform' })

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, MainContentComponent, TaskFormModalComponent, TaskCommentsModalComponent, DialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
	title = 'go-task';
}
