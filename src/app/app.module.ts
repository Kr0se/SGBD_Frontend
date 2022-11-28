import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth/auth.service';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "fileupload", component: FileUploadComponent},
  {path: "register", component: RegisterComponent},
  {path: "**", redirectTo: "login"}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FileUploadComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
