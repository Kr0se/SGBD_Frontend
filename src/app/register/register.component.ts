import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IfStmt } from '@angular/compiler';
import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { AuthService } from '../services/auth.service';
import { UserAuth } from '../model/userAuth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usernameExists: boolean = false;

  private user: UserAuth = {
    name: '',
    surname: '',
    username: '',
    password: ''
  };

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });

  constructor(
    private router: Router,
    private authServie: AuthService
    ){ }

  ngOnInit(): void {
  }

  goToPage(pageName: string){
    this.router.navigateByUrl(pageName);
  }

  onSubmit(){
    this.user.name = this.form.controls['name'].value;
    this.user.surname = this.form.controls['surname'].value;
    this.user.username = this.form.controls['username'].value;
    this.user.password = this.form.controls['password'].value;

    this.authServie.registerUser(this.user).subscribe((res: boolean) => {
      console.log(res);
      if(res){
        this.usernameExists = false;
        this.goToPage("login");
      }
      else {
        this.usernameExists = true;
      }
    })
  }

  formValid(){
    return this.form.valid && this.form.controls['password'].value === this.form.controls['confirmPassword'].value;
  }

  showError(){
    return this.form.valid && this.form.controls['password'].value !== this.form.controls['confirmPassword'].value;
  }

  showUsernameExistsMessage(): boolean{
    return this.usernameExists;
  }


}