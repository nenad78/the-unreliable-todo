import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Todo } from './../../models/todo.model';
import { TodoService } from 'src/app/services/todo.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit, OnDestroy {
  todos: Todo[];
  isSessionCreated = false;
  sessionSubscription: Subscription;
  todoSubscription: Subscription;
  selectedTodo: Todo;

  constructor(
    private todoService: TodoService,
    private sessionService: SessionService) { }

  ngOnInit() {
    this.todoService.getTodos();
    this.todoSubscription = this.todoService.getTodosUpdateListener()
      .subscribe(todoData => {
        this.todos = todoData.todos;
      });

    this.isSessionCreated = this.sessionService.getIsSessionCreated();
    this.sessionSubscription = this.sessionService.getSessionStatusListener()
      .subscribe(sessionStatus => {
        this.isSessionCreated = sessionStatus;
      });
  }

  onSelect(todo: Todo) {
    this.selectedTodo = todo;
    this.todoService.selectedTodo.next(todo);
  }

  onCheck(todo: Todo) {
    this.selectedTodo = todo;
    this.selectedTodo.isCompleted = !this.selectedTodo.isCompleted;
  }

  onDelete(todo: Todo) {
    if (confirm('Are you sure you want to delete todo?')) {
      this.todoService.deleteTodo(todo);
    } else {
      return;
    }
  }

  ngOnDestroy() {
    this.sessionSubscription.unsubscribe();
    this.todoSubscription.unsubscribe();
  }

}
