import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { WritingProgramComponent } from './writing-program/writing-program.component';
import { GalleryTestimonialsComponent } from './gallery-testimonials/gallery-testimonials.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login/login.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { AdminGuidesComponent } from './admin-guides/admin-guides.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { GuideDashboardComponent } from './guide-dashboard/guide-dashboard.component';
import { GuideStudentComponent } from './guide-student/guide-student.component';
import { GuideGuard } from './guards/guide.guard';
// import { AboutComponent } from './pages/about.component';
// import { ProgramComponent } from './pages/program.component';
// import { GalleryComponent } from './pages/gallery.component';
// import { JoinComponent } from './pages/join.component';
// import { ContactComponent } from './pages/contact.component';
// import { ReaderComponent } from './reader/reader.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent},
  { path: 'writing-program', component: WritingProgramComponent },
  { path: 'stories', component: GalleryTestimonialsComponent },
  { path: 'join', component: JoinUsComponent },
  { path: 'contact', component: ContactUsComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'guides', component: AdminGuidesComponent },
      { path: 'users', component: AdminUsersComponent },
      {
        path: 'add-student',
        loadComponent: () =>
          import('./admin-add-student/admin-add-student.component')
            .then(m => m.AdminAddStudentComponent)
      }
    ]
  },
  { 
  path: 'student/dashboard', 
  component: StudentDashboardComponent,
  canActivate: [AuthGuard] 
},
{
  path: 'guide',
  canActivate: [GuideGuard],
  children: [
    { path: 'dashboard', component: GuideDashboardComponent },
    { path: 'student/:id', component: GuideStudentComponent }
  ]
},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
