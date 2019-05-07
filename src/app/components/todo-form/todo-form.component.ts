import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css']
})
export class TodoFormComponent implements OnInit {
  @ViewChild('todoForm') formValues;
  showTodoForm = false;
  isNew = true;
  todoId: string;
  todoText: string;
  todoIsCompleted: boolean;
  todoUrgency: number;

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.todoService.selectedTodo.subscribe(todo => {
      if (todo.id !== null) {
        this.isNew = false;
        this.todoId = todo.id;
        this.todoText = todo.text;
        this.todoIsCompleted = todo.isCompleted;
        this.todoUrgency = todo.urgency;
      }
    });
  }

  onSubmit(form: NgForm) {
    if (this.isNew) {
      if (form.invalid) {
        return;
      }

      this.todoService.addTodo(form.value.todoText, form.value.todoUrgency);
    } else {
      this.todoService.updateTodo(
        form.value.todoText,
        form.value.todoUrgency,
        this.todoId,
        form.value.todoIsCompleted);
    }

    this.clearState();
  }

  clearState() {
    this.isNew = true;
    this.todoId = '';
    this.todoText = '';
    this.todoUrgency = null;
    this.formValues.resetForm();
  }

}
