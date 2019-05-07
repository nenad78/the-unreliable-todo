import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { TodosComponent } from './components/todos/todos.component';
import { SessionsComponent } from './components/sessions/sessions.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'todos', component: TodosComponent },
  { path: 'session', component: SessionsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
