import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReaderComponent } from './reader/reader.component';
export const routes: Routes = [
  { path:'', component: HomeComponent, pathMatch:'full' },
  { path:'chapter/:id', component: ReaderComponent },
  { path:'**', redirectTo:'' }
];