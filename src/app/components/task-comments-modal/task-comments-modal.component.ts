import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IComment } from '../../interfaces/comment.interface';
import { generateUniqueIdWithTimestamp } from '../../utils/generate-unique-id-with-timestamp';
import { ITask } from '../../interfaces/task.interface';

@Component({
  selector: 'app-task-comments-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-comments-modal.component.html',
  styleUrl: './task-comments-modal.component.css'
})
export class TaskCommentsModalComponent {
	taskCommmentsChanged = false;
	commentControl = new FormControl('',[Validators.required]);

	readonly _task: ITask = inject(DIALOG_DATA)
	readonly _dialogRef: DialogRef<boolean> = inject(DialogRef)

	onAddComment(){
		console.log('comentário adicionado:', this.commentControl.value);

		// criar comentario
		const newComment: IComment = {
			id: generateUniqueIdWithTimestamp(), // substituir por uma geração de ID única
			description: this.commentControl.value as string
		}

		// adicionar comentario na task
		this._task.comments.unshift(newComment);

		// resetar o form control
		this.commentControl.reset();

		// atualizar a flag/prop se houve alteração nos comentários
		this.taskCommmentsChanged = true;
	}

	onCloseModal(formValues: any | undefined = undefined){
		this._dialogRef.close(formValues);
	}
}
