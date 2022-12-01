import { LocationStrategy } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
    
    //Application Paths
    currentPath!: string; // main es l'inicial
    currentFolderName!: string;
    currentSubFolders!: Carpeta[];

    //CreateFolder
    displayStylePopupCreateFolder = "none";
    formCreateFolder = new FormGroup({
        folderName: new FormControl('', [Validators.required]),
    });

    //DeleteFolder
    displayStylePopupDeleteFolder = "none";
    folderDeleteRename: Carpeta = {
        nom: '',
        subCarpetes: [],
        videos: []
    };

    //RenameFolder
    formRenameFolder = new FormGroup({
        folderName: new FormControl('', [Validators.required]),
        newFolderName: new FormControl('', [Validators.required]),
    });  

  
    // Inject service 
    constructor(
        private fileUploadService: FileUploadService,
        private router: Router,
        private coreService: CoreService,
    ) {
        this.userAuth.username = JSON.parse(sessionStorage.getItem("username")!);
        this.userAuth.password = JSON.parse(sessionStorage.getItem("password")!);
        //console.log(this.userAuth);

        window.addEventListener('popstate', (event) => {
            // The popstate event is fired each time when the current history entry changes.
        
            // logout or do any thing you like
            console.log("putyaaaa");
            console.log(history);

        }, false);
        
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
        this.displayStylePopupCreateFolder = "block";
    }

    closePopupCreateFolder() {
        this.displayStylePopupCreateFolder = "none";
    }

    closePopupCreateFolderSubmit() {
        this.displayStylePopupCreateFolder = "none";
        console.log(this.formCreateFolder.value);

        let folder: Folder = {
            path: this.currentPath,
            folderName: this.formCreateFolder.controls['folderName'].value,
            newFolderName: ''
        }

        this.coreService.addFolder(this.user.username, folder).subscribe((res: User) => {
            console.log(res);
            this.user = res;
            this.updateCurrentSubfolders();
        });
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


    rigthClickCard($event: MouseEvent, folder: Carpeta) {       
        /* Use the following properties to differentiate between left and right click respectively.
        * $event.type will be "click" or "contextmenu"
        * $event.which will be "1" or "3"
        */
      
        // To prevent browser's default contextmenu
        $event.preventDefault();
        $event.stopPropagation();

        this.formRenameFolder.controls['folderName'].setValue(folder.nom);
        this.formRenameFolder.controls['folderName'].disable();

        // To show your modal or popover or any page
        this.folderDeleteRename = folder;
        this.openPopupDeleteFolder();
    }

    openPopupDeleteFolder() {
        this.displayStylePopupDeleteFolder = "block";
    }

    closePopupDeleteFolder() {
        this.displayStylePopupDeleteFolder = "none";
        this.formRenameFolder.reset();
    }

    closePopupDeleteFolderSubmit() {
        this.displayStylePopupDeleteFolder = "none";
        let folder: Folder = {
            path: this.currentPath,
            folderName: this.folderDeleteRename.nom,
            newFolderName: ''
        }

        this.coreService.removeFolder(this.user.username, folder).subscribe((res: User) => {
            console.log(res);
            this.user = res;
            this.updateCurrentSubfolders();
        });
    }

    closePopupRenameFolder() {
        this.displayStylePopupDeleteFolder = "none";
        this.formRenameFolder.reset();
    }

    closePopupRenameFolderSubmit() {
        this.displayStylePopupDeleteFolder = "none";
        let folder: Folder = {
            path: this.currentPath,
            folderName: this.folderDeleteRename.nom,
            newFolderName: this.formRenameFolder.controls['newFolderName'].value
        }

        console.log(folder);
        

        this.coreService.renameFolder(this.user.username, folder).subscribe((res: User) => {
            console.log(res);
            this.user = res;
            this.updateCurrentSubfolders();
        });

        this.formRenameFolder.reset();
    }

    doubleClick(folder: Carpeta){
        this.currentPath = this.currentPath.concat("/").concat(folder.nom);
        this.currentFolderName = folder.nom;
        this.currentSubFolders = folder.subCarpetes;
    }


}
