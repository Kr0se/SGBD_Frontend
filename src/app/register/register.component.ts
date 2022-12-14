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
      if(res){
        this.usernameExists = false;
        sessionStorage.setItem("accountCreatedSuccessfully", JSON.stringify(true));
        this.goToPage("login");
      }
      else {
        this.showUsernameExistsMessage();
      }
    })
  }

  formValid(){
    return this.form.valid && this.form.controls['password'].value === this.form.controls['confirmPassword'].value;
  }

  showErrorPasswordsNotMatch(){
    return this.form.valid && this.form.controls['password'].value !== this.form.controls['confirmPassword'].value;
  }

  showErrorMinLengthRequired(){
    return this.form.controls['password'].touched && this.form.controls['confirmPassword'].touched && (this.form.get('password')!.value?.length < 5 || this.form.get('confirmPassword')!.value?.length < 5);
  }

  showRequiredField(field: string): boolean{
    return this.form.controls[field].touched && !this.form.controls[field].value;
  }

  showUsernameExistsMessage(){
    this.usernameExists = true;
    setTimeout(() => {
      this.usernameExists = false;
    }, 3000);
  }


}