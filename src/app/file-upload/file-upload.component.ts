import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadService } from 'src/app/services/file-upload.service';
  
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
  
    // Inject service 
    constructor(
        private fileUploadService: FileUploadService,
        private router: Router
    ) { }
  
    ngOnInit(): void {
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
}