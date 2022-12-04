import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserAuth } from '../model/userAuth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  invalidCredentials = false;
  accountCreatedSuccessfully = false;

  private user: UserAuth = {
    name: '',
    surname: '',
    username: '',
    password: ''
  };

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private authServie: AuthService
  ){    
    if(JSON.parse(sessionStorage.getItem("accountCreatedSuccessfully")!)){
      this.showAccountCreatedSuccessfullyMessage();
      sessionStorage.removeItem("accountCreatedSuccessfully");
    }
  }

  ngOnInit(): void {
  }

  goToPage(pageName: string){
    this.router.navigateByUrl(pageName);
  }

  onSubmit(){
    this.user.username = this.form.controls['username'].value;
    this.user.password = this.form.controls['password'].value;

    this.authServie.loginUser(this.user).subscribe((res: boolean) => {
      console.log(res);
      if(res){
        this.invalidCredentials = false;
        sessionStorage.setItem("username", JSON.stringify(this.form.controls['username'].value));
        sessionStorage.setItem("password", JSON.stringify(this.form.controls['password'].value));
        this.goToPage("fileupload");
      }
      else {
        this.showInvalidCredentialsMessage();
      }
    })
  }

  showInvalidCredentialsMessage(){
    this.invalidCredentials = true;
    setTimeout(() => {
      this.invalidCredentials = false;
    }, 3000);
  }

  showAccountCreatedSuccessfullyMessage(){
    this.accountCreatedSuccessfully = true;
    setTimeout(() => {
      this.accountCreatedSuccessfully = false;
    }, 4000);
  }

  showRequiredField(field: string): boolean{
    return this.form.controls[field].touched && !this.form.controls[field].value;
  }

}
