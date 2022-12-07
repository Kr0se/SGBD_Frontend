import { LocationStrategy } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FileDB } from '../model/file';
import { Folder } from '../model/folder';
import { Carpeta, Fitxer, User } from '../model/user';
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
            files: [],
        }
    };
    
    //Application Paths
    currentPath!: string; // main es l'inicial
    currentFolderName!: string;
    currentSubFolders!: Carpeta[];
    currentFiles!: Fitxer[];

    currentPathStack: string[] = [];
    currentFolderNameStack: string[] = [];
    currentSubFoldersStack: Carpeta[][] = [];
    currentFilesStack: Fitxer[][] = [];

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
        files: []
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
        private location: LocationStrategy,
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
            this.currentFiles = this.user.mainCarpeta.files;
        })

        history.pushState(null, "", window.location.href);
        // check if back or forward button is pressed.
        this.location.onPopState(() => {
            history.pushState(null, "", window.location.href);

            if(this.currentPathStack.length > 0){
                this.currentPath = this.currentPathStack[this.currentPathStack.length-1];
                this.currentFolderName = this.currentFolderNameStack[this.currentFolderNameStack.length-1];
                this.currentSubFolders = this.currentSubFoldersStack[this.currentSubFoldersStack.length-1];
                this.currentFiles = this.currentFilesStack[this.currentFilesStack.length-1];

                this.currentPathStack.pop();
                this.currentFolderNameStack.pop();
                this.currentSubFoldersStack.pop();
                this.currentFilesStack.pop();
            }
        });
    }
  
    // On file Select
    onChange(event: any) {
        this.file = event.target.files[0];
    }
  
    // OnClick of button Upload
    uploadFile() {
        console.log(this.file);
        const formData = new FormData(); 
        formData.append("file", this.file);
        formData.append("path", this.currentPath);

        this.coreService.uploadFile(formData, this.user.username).subscribe((res: User) => {
            this.user = res;
            this.updateCurrentSubfoldersAndFiles();
        });
    }

    showCurrentPath(): string {
        if(this.currentPath == undefined) return "";
        else return this.currentPath.replaceAll("/", " -> ");
    }

    goToPage(pageName: string){
        this.router.navigateByUrl(pageName);
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
            this.updateCurrentSubfoldersAndFiles();
        });
        this.formCreateFolder.reset();
    }

    private updateCurrentSubfoldersAndFiles(){
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
        this.currentFiles = actual.files;
        //console.log(this.subFolders);
    }


    rigthClickCardFolder($event: MouseEvent, folder: Carpeta) {       
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

    rigthClickCardFile($event: MouseEvent, file: Fitxer) {

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
            this.updateCurrentSubfoldersAndFiles();
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
            this.updateCurrentSubfoldersAndFiles();
        });

        this.formRenameFolder.reset();
    }

    doubleClickFolder(folder: Carpeta){
        this.currentPathStack.push(this.currentPath.toString());
        this.currentFolderNameStack.push(this.currentFolderName);
        this.currentSubFoldersStack.push(this.currentSubFolders);
        this.currentFilesStack.push(this.currentFiles);        

        this.currentPath = this.currentPath.concat("/").concat(folder.nom);
        this.currentFolderName = folder.nom;

        this.coreService.getUser(this.user.username).subscribe((res: User) => {
            this.user = res;
            this.updateCurrentSubfoldersAndFiles();
        });
    }

    doubleClickFile(file: Fitxer){
        this.coreService.getFile(file.id).subscribe((res: FileDB) => {
            console.log(res);

            /*const data = res;
            const blob = new Blob([data], { type: 'application/octet-stream' });
            const url= window.URL.createObjectURL(blob);
            window.open(url);*/

            /*const data = 'some text';
            const blob = new Blob([data], { type: 'application/octet-stream' });
            const url= window.URL.createObjectURL(blob);
            window.open(url);*/

            /*const link = document.createElement('a');
            link.setAttribute('target', '_blank');
            link.setAttribute('href', 'assets/images/fitxer.png');
            link.setAttribute('download', "logo.png");
            document.body.appendChild(link);
            link.click();
            link.remove();*/


            
        });
    }


}