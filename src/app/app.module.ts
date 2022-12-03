import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth.service';
import { CoreService } from './services/core.service';
import { AuthGuard } from './guard/auth-guard.guard';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "fileupload", component: FileUploadComponent, canActivate: [AuthGuard]}, //si no es passa la autenticacio del guard, no poden accedir a aquest recurs
  {path: "**", redirectTo: "login"}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FileUploadComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  providers: [AuthService, CoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
