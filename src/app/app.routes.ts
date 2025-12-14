// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { List } from './list/list';
import { Details } from './details/details';
import { AddPerson } from './add-person/add-person';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  { path: '', component: List },
  { path: 'details/:id', component: Details },
  { path: 'add', component: AddPerson },
  { path: '**', component: NotFound }
];
