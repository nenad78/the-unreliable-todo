import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Todo } from '../models/todo.model';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = [];
  private todosUpdated = new Subject<{ todos: Todo[] }>();
  selectedTodo = new Subject<Todo>();

  constructor(
    private http: HttpClient,
    private sessionService: SessionService) { }

  getTodosUpdateListener() {
    return this.todosUpdated.asObservable();
  }

  getTodos() {
    const sessionId = this.sessionService.getSessionId();
    let headers = new HttpHeaders();
    headers = headers.append('sessionId', sessionId);

    if (sessionId) {
      this.http.get<{ status: string, todos: Todo[] }>('http://localhost:9000/api/todos', { headers })
        .subscribe(response => {
          const newTodos = Object.values(response.todos);
          this.todos = newTodos;
          this.todosUpdated.next({ todos: [...this.todos] });
        }, error => {
          console.log(error);
        });
    } else {
      return;
    }
  }

  addTodo(text: string, urgency: number) {
    const todoData = { text, urgency, isCompleted: false };

    const sessionId = this.sessionService.getSessionId();
    let headers = new HttpHeaders();
    headers = headers.append('sessionId', sessionId);

    this.http.post<{ status: string, todo: Todo }>('http://localhost:9000/api/todos', todoData, { headers })
      .subscribe(response => {
        const updatedTodos = [...this.todos];
        updatedTodos.push(response.todo);
        this.todos = updatedTodos;
        this.todosUpdated.next({ todos: [...this.todos] });
      });
  }

  updateTodo(text: string, urgency: number, todoId: string, isCompleted: boolean) {
    const updatedTodoData = { text, urgency, isCompleted };

    const sessionId = this.sessionService.getSessionId();
    let headers = new HttpHeaders();
    headers = headers.append('sessionId', sessionId);

    this.http.patch<{ status: string, todo: Todo }>(`http://localhost:9000/api/todos/${todoId}`, updatedTodoData, { headers })
      .subscribe(response => {
        const updatedTodos = [...this.todos];
        const updatedTodosIndex = updatedTodos.findIndex(todo => todo.id === response.todo.id);
        updatedTodos[updatedTodosIndex] = response.todo;
        this.todos = updatedTodos;
        this.todosUpdated.next({ todos: [...this.todos] });
      });
  }

  deleteTodo(todo: Todo) {
    const sessionId = this.sessionService.getSessionId();
    let headers = new HttpHeaders();
    headers = headers.append('sessionId', sessionId);

    this.http.delete<{ status: string, todos: Todo[] }>(`http://localhost:9000/api/todos/${todo.id}`, { headers })
      .subscribe(response => {
        const updatedTodos = Object.values(response.todos);
        this.todos = updatedTodos;
        this.todosUpdated.next({ todos: [...this.todos] });
      });
  }

}
