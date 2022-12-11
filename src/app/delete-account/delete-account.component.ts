import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuth } from '../model/userAuth';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {

  invalidCredentials = false;
  displayStylePopupDelete = "none";

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
    private authService: AuthService
  ){}

  ngOnInit(): void {
  }

  goToPage(pageName: string){
    this.router.navigateByUrl(pageName);
  }

  onSubmit(){
    this.user.username = this.form.controls['username'].value;
    this.user.password = this.form.controls['password'].value;

    this.authService.loginUser(this.user).subscribe((res: boolean) => {
      if(res){
        this.invalidCredentials = false;
        this.openPopupDeleteAccount();
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

  showRequiredField(field: string): boolean{
    return this.form.controls[field].touched && !this.form.controls[field].value;
  }

  openPopupDeleteAccount() {
    this.displayStylePopupDelete = "block";
  }

  closePopupDeleteAccount() {
    this.displayStylePopupDelete = "none";
  }

  deleteAccountSubmit(){
    this.displayStylePopupDelete = "none";
    this.authService.deleteUser(this.user.username!).subscribe((res: boolean) => {
      if(res){
        sessionStorage.setItem("accountDeleted", JSON.stringify(true));
        this.goToPage("login");
      }
      else {

      }
    })
  }

}
