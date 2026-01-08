import { Component, inject } from '@angular/core';
import { ModalControllerService } from '../../services/modal-controller.service';
import { generateUniqueIdWithTimestamp } from '../../utils/generate-unique-id-with-timestamp';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-welcome-section',
  imports: [],
  templateUrl: './welcome-section.component.html',
  styleUrl: './welcome-section.component.css'
})
export class WelcomeSectionComponent {
	private readonly _modalControllerService = inject(ModalControllerService)
	private readonly _taskService = inject(TaskService)

	openNewTaskModal(){
		const dialogRef = this._modalControllerService.openNewTaskModal()

		dialogRef.closed.subscribe(taskForm => {
			console.log('New Task Modal closed with data:', taskForm)
			if(taskForm){
				this._taskService.addTask(taskForm)
			}
		})
	}
}
