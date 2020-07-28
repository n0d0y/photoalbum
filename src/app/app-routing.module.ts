import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FotosComponent } from './components/fotos/fotos.component';
import { CargaComponent } from './components/carga/carga.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
{ path: 'fotos', component: FotosComponent, canActivate: [ AuthGuard ] },
{ path: 'carga', component: CargaComponent, canActivate: [ AuthGuard ] },
{ path: 'login', component: LoginComponent },
{ path: '**', pathMatch: 'full', redirectTo: 'login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
