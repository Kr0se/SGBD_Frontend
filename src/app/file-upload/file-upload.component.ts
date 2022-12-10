import { LocationStrategy } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FileDTO, ShareFileDTO } from '../model/file';
import { Folder } from '../model/folder';
import { Carpeta, Fitxer, User } from '../model/user';
import { UserAuth } from '../model/userAuth';
import { CoreService } from '../services/core.service';
import { SearchService } from '../services/search.service';

  
@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  
    // Variable to store shortLink from api response
    shortLink: string = "";
    file: File | any = null; // Variable to store file

    @ViewChild('myInput')
    inputChooseFile!: ElementRef;

    @ViewChild('inputSearchUser')
    inputSearchUser!: ElementRef;

    private userAuth: UserAuth = {
        name: '',
        surname: '',
        username: '',
        password: ''
    };

    user : User = {
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

    //Search Bar
    private readonly searchSubject = new Subject<string | undefined>();
    private searchSubscription?: Subscription;

    //Search User
    private readonly searchUserSubject = new Subject<string | undefined>();
    private searchUserSubscription?: Subscription;
    usersSearchBar: User[] = [];
    
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

    //DeleteFile
    displayStylePopupDeleteFile = "none";
    fileDeleteRename: Fitxer = {
        nom: '',
        dataPujada: 0,
        id: '',
        fitxerDBId: '',
        tipus: ''
    };

    //RenameFile
    formRenameFile = new FormGroup({
        fileName: new FormControl('', [Validators.required]),
        newFileName: new FormControl('', [Validators.required]),
    });

    //ShareFile
    formShareFile = new FormGroup({
        usernameToShare: new FormControl('', [Validators.required]),
    });
    filesSharedByOtherUsers: Fitxer[] = [];

  
    // Inject service 
    constructor(
        private fileUploadService: FileUploadService,
        private router: Router,
        private coreService: CoreService,
        private location: LocationStrategy,
        private searchService: SearchService
    ) {
        this.userAuth.username = JSON.parse(sessionStorage.getItem("username")!);
        this.userAuth.password = JSON.parse(sessionStorage.getItem("password")!);
        //console.log(this.userAuth);
    }
  
    ngOnInit(): void {
        //Obtenim l'usuari
        this.getUser();

        //Obtenim els fitxers compartits
        this.getSharedFiles();

        //Modifiquem el boto de tirar enrere
        history.pushState(null, "", window.location.href);
        // check if back or forward button is pressed.
        this.location.onPopState(() => {
            history.pushState(null, "", window.location.href);

            if(this.currentPathStack.length > 0){
                if(this.currentPathStack.length === 1){ //abans d'anar a la main, actualitzem els fitxers compartits
                    this.getSharedFiles();                    
                }

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

        //Definim el debounceTime de la cerca de fitxers
        /*this.searchSubscription = this.searchSubject
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((searchQuery) => this.searchService.search(searchQuery))
        )
        .subscribe((results) => (this.searchResults = results));*/

        this.defineDebounceTimeGetAllUsersByUsername();

        //Always disabled
        this.formShareFile.controls['usernameToShare'].disable();
    }

    private getUser(){
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
    }

    private getSharedFiles(){
        this.coreService.getSharedFiles(this.userAuth.username!).subscribe((res: Fitxer[]) => {
            this.filesSharedByOtherUsers = res;
        })
    }

    private defineDebounceTimeGetAllUsersByUsername(){
        //Definim el debounceTime de la cerca d'usuaris per Username
        this.searchUserSubscription = this.searchUserSubject
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((query) => this.searchService.getAllUsersByUsername(this.user.username, query))
        )
        .subscribe((results: User[]) => (
            this.usersSearchBar = results
        ));
    }

    public onSearchQueryInput(event: Event): void {
        const searchQuery = (event.target as HTMLInputElement).value;
        this.searchSubject.next(searchQuery?.trim());
    }

    public onSearchUserQueryInput(event: Event): void {
        const searchQuery = (event.target as HTMLInputElement).value;
        this.searchUserSubject.next(searchQuery?.trim());
    }

    public ngOnDestroy(): void {
        this.searchSubscription?.unsubscribe();
        this.searchUserSubscription?.unsubscribe();
    }
  
    // On file Select
    onChange(event: any) {
        this.file = event.target.files[0];       
    }
  
    // OnClick of button Upload
    uploadFile() {
        const formData = new FormData(); 
        formData.append("file", this.file);
        formData.append("path", this.currentPath);

        this.coreService.uploadFile(formData, this.user.username).subscribe((res: User) => {
            this.user = res;
            this.updateCurrentSubfoldersAndFiles();
            this.inputChooseFile.nativeElement.value = "";
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
        // To prevent browser's default contextmenu
        $event.preventDefault();
        $event.stopPropagation();
        
        this.formRenameFile.controls['fileName'].setValue(file.nom);
        this.formRenameFile.controls['fileName'].disable();
        
        // To show your modal or popover or any page
        this.fileDeleteRename = file;
        this.openPopupDeleteFile();
    }

    openPopupDeleteFolder() {
        this.displayStylePopupDeleteFolder = "block";
    }

    openPopupDeleteFile() {
        this.displayStylePopupDeleteFile = "block";
    }

    closePopupDeleteRenameFolder() {
        this.displayStylePopupDeleteFolder = "none";
        this.formRenameFolder.reset();
    }

    closePopupDeleteRenameFile() {
        this.displayStylePopupDeleteFile = "none";
        this.formRenameFile.reset();
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

    closePopupDeleteFileSubmit() {
        this.displayStylePopupDeleteFile = "none";
        let file: FileDTO = {
            path: this.currentPath,
            nom: this.fileDeleteRename.nom,
            nouNom: ''
        }        
    
        this.coreService.removeFile(this.fileDeleteRename.id, file).subscribe((res: User) => {
            console.log(res);
            this.user = res;
            this.updateCurrentSubfoldersAndFiles();
        });
    }

    closePopupRenameFolderSubmit() {
        this.displayStylePopupDeleteFolder = "none";
        let folder: Folder = {
            path: this.currentPath,
            folderName: this.folderDeleteRename.nom,
            newFolderName: this.formRenameFolder.controls['newFolderName'].value
        }        

        this.coreService.renameFolder(this.user.username, folder).subscribe((res: User) => {
            console.log(res);
            this.user = res;
            this.updateCurrentSubfoldersAndFiles();
        });

        this.formRenameFolder.reset();
    }

    closePopupRenameFileSubmit() {
        this.displayStylePopupDeleteFile = "none";
        let file: FileDTO = {
            path: this.currentPath,
            nom: this.fileDeleteRename.nom,
            nouNom: this.formRenameFile.controls['newFileName'].value
        }         

        this.coreService.renameFile(this.fileDeleteRename.id, file).subscribe((res: User) => {
            console.log(res);
            this.user = res;
            this.updateCurrentSubfoldersAndFiles();
        });

        this.formRenameFile.reset();
    }

    closePopupShareFileSubmit() {
        this.displayStylePopupDeleteFile = "none";

        let file: ShareFileDTO = {
            fitxerId: this.fileDeleteRename.id,
            username: this.formShareFile.controls['usernameToShare'].value
        }

        console.log(file);
        
        this.coreService.shareFile(this.user.username, file).subscribe((res: User) => {
            console.log(res);
            this.user = res;
            this.updateCurrentSubfoldersAndFiles();
        });

        this.formShareFile.reset();
    }

    usernameClicked(event: any) {
        let username: string = event.target.innerHTML;
        this.formShareFile.controls['usernameToShare'].setValue(username);        
        this.usersSearchBar = [];
        this.inputSearchUser.nativeElement.value = "";
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
        this.coreService.getFile(file.id).subscribe((res: any) => {
            //console.log(res);
            let dataType = res.type;
            let binaryData = [];
            binaryData.push(res);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            if (file.nom)
                downloadLink.setAttribute('download', file.nom);
            document.body.appendChild(downloadLink);
            downloadLink.click();
        });
    }

    mainPage(): boolean{
        return this.currentPathStack.length === 0;
    }


}