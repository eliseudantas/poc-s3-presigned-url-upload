import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-upload',
  template: `
<div class="mb-3">
  <label
    for="formFileLg"
    class="mb-2 inline-block text-neutral-500 dark:text-neutral-400"
    >Large file input example</label
  >
  <input
    class="relative m-0 block w-full min-w-0 flex-auto cursor-pointer rounded border border-solid border-secondary-500 bg-transparent bg-clip-padding px-3 py-[0.32rem] text-base font-normal leading-[2.15] text-surface transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:me-3 file:cursor-pointer file:overflow-hidden file:rounded-none file:border-0 file:border-e file:border-solid file:border-inherit file:bg-transparent file:px-3  file:py-[0.32rem] file:text-surface focus:border-primary focus:text-gray-700 focus:shadow-inset focus:outline-none dark:border-white/70 dark:text-white  file:dark:text-white"
    id="formFileLg"
    type="file" />
</div>
<!--   
    <div>
      
      <input type="file" (change)="onFileSelected($event)" />
      <button (click)="onUpload()">Upload</button>
    </div> -->
  `,
  styles: [`
    div {
      margin: 20px;
    }
    input[type="file"] {
      border: 1px solid #ccc;
      padding: 10px 20px;
      height: 40px;
      width: 300px;
    }
    button {
      height: 40px;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      border: none;
      cursor: pointer;
    }
  `]
})
export class UploadComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post('your-api-endpoint', formData).subscribe(
        (response) => {
          console.log('File uploaded successfully');
          // Handle success response here
        },
        (error) => {
          console.error('Error uploading file:', error);
          // Handle error response here
        }
      );
    }
  }
}
