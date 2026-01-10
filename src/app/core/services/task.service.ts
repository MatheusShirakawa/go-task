import { Injectable } from "@angular/core";
import { BehaviorSubject, map, tap } from "rxjs";
import { ITaskFormControls } from "../interfaces/task-form-controls.interface";
import { TaskStatusEnum } from "../../domain/tasks/enums/task-status.enum";
import { IComment } from "../../domain/tasks/interfaces/comment.interface";
import { ITask } from "../../domain/tasks/interfaces/task.interface";
import { TaskStatus } from "../../domain/tasks/types/task-status";
import { generateUniqueIdWithTimestamp } from "../../shared/utils/generate-unique-id-with-timestamp";


@Injectable({
  providedIn: 'root'
})

export class TaskService{
	// tarefas em a fazer
	private todoTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.TODO));
	readonly todoTasks = this.todoTasks$
		.asObservable()
		.pipe(
			map((tasks) => structuredClone(tasks)),
			tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.TODO, tasks))
		);

	// tarefas em andamento
	private doingTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.DOING));
	readonly doingTasks = this.doingTasks$
		.asObservable()
		.pipe(
			map((tasks) => structuredClone(tasks)),
			tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.DOING, tasks))
		);

	// tarefas concluídas
	private doneTasks$ = new BehaviorSubject<ITask[]>(this.loadTasksFromLocalStorage(TaskStatusEnum.DONE));
	readonly doneTasks = this.doneTasks$
		.asObservable()
		.pipe(
			map((tasks) => structuredClone(tasks)),
			tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.DONE, tasks))
		);

	private getTaskListByStatus(taskStatus: TaskStatus){
		const taskListObj = {
			[TaskStatusEnum.TODO]: this.todoTasks$,
			[TaskStatusEnum.DOING]: this.doingTasks$,
			[TaskStatusEnum.DONE]: this.doneTasks$
		}
		return taskListObj[taskStatus];
	}

	private saveTasksOnLocalStorage(key:string, tasks: ITask[]){
		try{
			localStorage.setItem(key, JSON.stringify(tasks));
		}catch(error){
			console.error("Erro ao salvar tarefas no localStorage:", error);
		}
	}

	private loadTasksFromLocalStorage(key:string): ITask[] {
		try{
			const tasksJSON = localStorage.getItem(key);
			if(tasksJSON){
				return JSON.parse(tasksJSON) as ITask[];
			}
			return [];
		}catch(error){
			console.error("Erro ao carregar tarefas do localStorage:", error);
			return [];
		}
	}

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

	updateTaskNameAndDescription(taskId: string, taskCurrentStatus:TaskStatus, newTaskName: string, newTaskDescription: string){
		const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
		const currentTaskIndex = currentTaskList.value.findIndex((task) => task.id === taskId);


		if(currentTaskIndex > -1){
			const updatedTaskList = [...currentTaskList.value]

			updatedTaskList[currentTaskIndex] = {
				...updatedTaskList[currentTaskIndex],
				name: newTaskName,
				description: newTaskDescription
			}
			currentTaskList.next(updatedTaskList);
		}
	}

	updateTaskComments(taskId: string, taskCurrentStatus: TaskStatus, newTaskComments: IComment[]){
		const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
		const currentTaskIndex = currentTaskList.value.findIndex((task) => task.id === taskId);

		if(currentTaskIndex > -1){
			const updatedTaskList = [...currentTaskList.value]

			updatedTaskList[currentTaskIndex] = {
				...updatedTaskList[currentTaskIndex],
				comments: newTaskComments
			}
			currentTaskList.next(updatedTaskList);
		}
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

	loadListToDoTasks(){
		console.log(this.todoTasks$.value)
	}

	deleteTask(taskId: string, taskCurrentStatus: TaskStatus){
		const currentTaskList = this.getTaskListByStatus(taskCurrentStatus);
		const updatedTaskList = currentTaskList.value.filter((task) => task.id !== taskId);
		currentTaskList.next(updatedTaskList);
	}
}
