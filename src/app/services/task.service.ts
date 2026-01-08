import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { ITask } from "../interfaces/task.interface";
import { TaskStatusEnum } from "../enums/task-status.enum";
import { generateUniqueIdWithTimestamp } from "../utils/generate-unique-id-with-timestamp";
import { ITaskFormControls } from "../interfaces/task-form-controls.interface";
import { TaskStatus } from "../types/task-status";

@Injectable({
  providedIn: 'root'
})

export class TaskService{
	// tarefas em a fazer
	private todoTasks$ = new BehaviorSubject<ITask[]>([]);
	readonly todoTasks = this.todoTasks$
		.asObservable()
		.pipe(map((tasks) => structuredClone(tasks)));

	// tarefas em andamento
	private doingTasks$ = new BehaviorSubject<ITask[]>([]);
	readonly doingTasks = this.doingTasks$
		.asObservable()
		.pipe(map((tasks) => structuredClone(tasks)));

	// tarefas concluídas
	private doneTasks$ = new BehaviorSubject<ITask[]>([]);
	readonly doneTasks = this.doneTasks$
		.asObservable()
		.pipe(map((tasks) => structuredClone(tasks)));

	addTask(taskInfos: ITaskFormControls){
		const newTask: ITask = {
			id: generateUniqueIdWithTimestamp(),
			...taskInfos,
			status:TaskStatusEnum.TODO,
			comments: []
		}

		const currentTodoTasks = this.todoTasks$.value;
		this.todoTasks$.next([...currentTodoTasks, newTask]);
	}

	updateTaskStatus(taskId: string, taskCurrentStatus: TaskStatus, textNextStatus: TaskStatus){
		const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
		const nextTaskList = this.getTaskListByStatus(textNextStatus);
		const currentTask = currentTaskList.value.find((task) => task.id === taskId);

		if(currentTask){
			// atualizando o status da tarefa
			currentTask.status = textNextStatus;

			// removendo a tarefa da lista atual
			const currentTaskListWithoutTask = currentTaskList.value.filter((task) => task.id !== taskId);
			currentTaskList.next([...currentTaskListWithoutTask]);

			//adicionando a tarefa na nova lista
			nextTaskList.next([...nextTaskList.value, {...currentTask}]);
		}
	}

	private getTaskListByStatus(taskStatus: TaskStatus){
		const taskListObj = {
			[TaskStatusEnum.TODO]: this.todoTasks$,
			[TaskStatusEnum.DOING]: this.doingTasks$,
			[TaskStatusEnum.DONE]: this.doneTasks$
		}
		return taskListObj[taskStatus];
	}

	loadListToDoTasks(){
		console.log(this.todoTasks$.value)
	}
}
