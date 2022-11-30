import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { Folder } from '../model/folder';
import { Carpeta, User } from '../model/user';
import { UserAuth } from '../model/userAuth';
import { CoreService } from '../services/core.service';
  
@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  
    // Variable to store shortLink from api response
    shortLink: string = "";
    loading: boolean = false; // Flag variable
    file: File | any = null; // Variable to store file

    private userAuth: UserAuth = {
        name: '',
        surname: '',
        username: '',
        password: ''
    };

    private user : User = {
        name: '',
        surname: '',
        username: '',
        password: '',
        mainCarpeta: {
            nom: '',
            subCarpetes: [],
            videos: [],
        }
    };

    currentPath!: string; // main es l'inicial
    currentFolderName!: string;
    currentSubFolders!: Carpeta[];

    //CreateFolder
    displayStylePopup = "none";
    formCreateFolder = new FormGroup({
        folderName: new FormControl('', [Validators.required]),
    });
    
  
    // Inject service 
    constructor(
        private fileUploadService: FileUploadService,
        private router: Router,
        private coreService: CoreService
    ) {
        this.userAuth.username = JSON.parse(sessionStorage.getItem("username")!);
        this.userAuth.password = JSON.parse(sessionStorage.getItem("password")!);
        //console.log(this.userAuth);
        
    }
  
    ngOnInit(): void {
        this.coreService.getUser(this.userAuth.username!).subscribe((res: User) => {
            //console.log(res);
            this.user = res;
            console.log(this.user);

            //Genero els path
            this.currentPath = "main";
            this.currentFolderName = "main";
            this.currentSubFolders = this.user.mainCarpeta.subCarpetes;
        })
    }
  
    // On file Select
    onChange(event: any) {
        this.file = event.target.files[0];
    }
  
    // OnClick of button Upload
    onUpload() {
        this.loading = !this.loading;
        console.log(this.file);
        this.fileUploadService.upload(this.file).subscribe(
            (event: any) => {
                if (typeof (event) === 'object') {
  
                    // Short link via api response
                    this.shortLink = event.link;
  
                    this.loading = false; // Flag variable 
                }
            }
        );
    }

    goToPage(pageName: string){
        this.router.navigateByUrl(pageName);
    }

    createFolder(){
        console.log('create folder');

    }

    uploadFile(){
        console.log('upload file');

    }

    logOut(){
        this.userAuth = {};
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("password");
        this.goToPage("login")
    }

    openPopupCreateFolder() {
        this.displayStylePopup = "block";
    }

    closePopupCreateFolder() {
        this.displayStylePopup = "none";
    }

    closePopupCreateFolderSubmit() {
        this.displayStylePopup = "none";
        console.log(this.formCreateFolder.value);

        let folder: Folder = {
            path: this.currentPath,
            folderName: this.formCreateFolder.controls['folderName'].value
        }

        this.coreService.addFolder(this.user.username, folder).subscribe((res: User) => {
            console.log(res);
            this.user = res;
            this.updateCurrentSubfolders();
        })
        this.formCreateFolder.reset();
    }

    private updateCurrentSubfolders(){
        let parts = this.currentPath.split("/").splice(1, this.currentPath.split("/").length); //trec la main
        let actual: Carpeta = this.user.mainCarpeta;
        let resSubFolders: Carpeta[] = this.user.mainCarpeta.subCarpetes;
        for (let i = 0; i < parts.length; i++) {
            for(let j = 0; j < actual.subCarpetes.length; j++){
                if(actual.subCarpetes[j].nom === parts[i]){
                    actual = actual.subCarpetes[j];
                    resSubFolders = actual.subCarpetes;
                }
            }
        }
        this.currentSubFolders = resSubFolders;
        //console.log(this.subFolders);
    }
}