import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { HttpEventType, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { Tooltip, initTWE, Dropdown, Ripple } from 'tw-elements';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, interval, Observable, Subscription, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import config from '../config';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UploadComponent,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  private pollingSubscription!: Subscription;



  selectedFileRowCount: number = 0;

  executionJobs: any[] = [];

  title = 'Frontend';

  // initialize the UserId with a random string
  @Input() UserId = Math.random().toString(36).substring(7);
  
  @Input() backendUrl = config.api;
  
  avgMillisecondsPerRow: number = 300;
  maxRowsPerChunk: number = 200;
  uploadFileProgress = 0;

  selectedFile: File | null = null;

  fileDetails: string = '';

  constructor(private http: HttpClient) {
    this.executionJobs = [];
    this.http.get<any[]>(`${this.backendUrl}api/s3/list-objects`)
      .subscribe(
      data => {
        console.log('Data from backend:', data);

        data.map(item => {
          this.executionJobs.push({
            id: item.key,
            status: 'COMPLETED',
            progress: 100,
            rowCount: 0,
          });
        });

        localStorage.setItem('executionJobs', JSON.stringify(this.executionJobs));
      },
      error => {
        console.error('Error fetching data from backend:', error);
      }
      );

    // this.executionJobs = JSON.parse(localStorage.getItem('executionJobs') || '[]');

    this.pollingSubscription = interval(1000).subscribe(() => {
      this.checkStatus();
    });
  }

  checkStatus(){
    this.executionJobs.forEach((job) => {

      if (job.staus != 'COMPLETED') {
      if (job.progress < 100) {
        job.progress += 10;
        job.status = 'IN_PROGRESS';
      }else {
        job.status = 'COMPLETED';
        job.endTime = new Date();
        job.duration = (job.endTime - job.startTime) / 1000;
        localStorage.setItem('executionJobs', JSON.stringify(this.executionJobs));
      }
    }
    });
    
  }

  onChangeSettings(){
    if (this.selectedFile){
      this.updateFileDetails(this.selectedFile);
    }
  }

  onSelectedFile(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.updateFileDetails(this.selectedFile);
      
    }
  }

  updateFileDetails(file: File) {

    function formatFileSize(size: number): string {
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      let index = 0;
      while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
      }
      return `${size.toFixed(2)} ${units[index]}`;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      const rows = fileContent.split('\n');
      const rowCount = rows.length - 1; // Subtract 1 to exclude the header row


      var timeToProcessInMinutes = ((rowCount / this.maxRowsPerChunk) * this.avgMillisecondsPerRow / 1000 / 60).toFixed(2);


      var numberOfChunks = Math.ceil(rowCount / this.maxRowsPerChunk);

      this.selectedFileRowCount = rowCount;
      this.fileDetails = `Rows: ${rowCount.toLocaleString()} | Size: ${formatFileSize(file.size)}` + ` | Time to process: ${timeToProcessInMinutes} min` + ` | Number of Chunks: ${numberOfChunks}`;
    };

    reader.readAsText(file);

  }

  async uploadFile(){
    console.log('Uploading file: ', this.selectedFile);
    const file = this.selectedFile as File;


    const getURLRequest = { 
      FileName : file.name,
      FileType : file.type,
      Status: "NOT_PROCESSED",
      UserId: this.UserId,
      RowCount: this.selectedFileRowCount,
    };
    var response = await fetch(this.backendUrl + "api/S3/get-presigned-url-upload", {
      "headers": {
        "accept": "application/json, text/plain, */*",
       "content-type": "application/json",
      },
      "body": `{\"FileName\":\"${getURLRequest.FileName}\",\"FileType\":\"${getURLRequest.FileType}\",\"Status\":\"${getURLRequest.Status}\",\"UserId\":\"${getURLRequest.UserId}\",\"RowCount\":${getURLRequest.RowCount}}`,
      "method": "POST",
    }).then(response => response.json());

    const { uploadUrl, key } = response;

    this.http.put(uploadUrl, file, { 
      reportProgress: true,
      observe: 'events',
      headers: {
        'Content-Type': getURLRequest.FileType,
        'x-amz-meta-filename': getURLRequest.FileName,
        'x-amz-meta-status': getURLRequest.Status,
        'x-amz-meta-uploadedby': getURLRequest.UserId,
        'x-amz-meta-rowcount': getURLRequest.RowCount.toString(),
      } })
      .subscribe(event => {
        console.log('Event: ', event);

        switch (event.type) {
          case HttpEventType.UploadProgress:
            var percentage = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            this.uploadFileProgress = percentage;
            console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
            break;
          case HttpEventType.Response:
            this.uploadFileProgress = 0;
            this.selectedFile = null;
            this.fileDetails = '';

            // Clean up input files in DOM
            const inputElement = document.getElementById('fileSelector') as HTMLInputElement;
            if (inputElement) {
              inputElement.value = '';
            }

            console.log('Finished uploading!');

            console.log('You have can send a request to que api here...');

            this.executionJobs.push({
              
              id: key,
              status: 'NOT_STARTED',
              rowCount: this.selectedFileRowCount,
              progress: 0,
              startTime: new Date(),
              endTime: null,
              duration: null,
            });
            console.log('Execution Jobs: ', this.executionJobs);
            this.selectedFileRowCount = 0;
            localStorage.setItem('executionJobs', JSON.stringify(this.executionJobs));
            break;
        }
      });

  }

  private _rowCounts = 200;
  @Input()
  get rowCounts(): number {
    return this._rowCounts;
  }
  set rowCounts(newValue: number) {
    this._rowCounts = newValue;
  }
  deleteJob(job: any) {
    console.log('Deleting job: ', job);
    this.executionJobs = this.executionJobs.filter(j => j.id !== job.id);
    localStorage.setItem('executionJobs', JSON.stringify(this.executionJobs));
  }

  ngOnInit() {
    initTWE({ Tooltip, Dropdown, Ripple });
  }
  possibleCodes: string[] = ['XPTO007', 'XYZ123', 'ABC456', 'DEF789'];
  possibleColors: string[] = ['RED', 'GREEN', 'BLUE', 'YELLOW'];
  // Step 1: Create mock data
  generateCsvData(rowCount: number): string[][] {
    const data: string[][] = [];
    data.push(['CODE', 'COLOR']); 

    for (let i = 1; i <= rowCount; i++) {
      const code = this.possibleCodes[Math.floor(Math.random() * this.possibleCodes.length)];
      const color = this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
      data.push([code, color]);
    }

    return data;
  }

  // Step 2: Convert to CSV
  convertToCsv(data: string[][]): string {
    return data.map(row => row.join(',')).join('\n');
  }

  // Step 3: Create and download CSV
  downloadCsv(csvData: string, fileName: string): void {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  // Step 4: Generate and download CSV
  generateAndDownloadCsv(): void {
    const data = this.generateCsvData(this.rowCounts);
    const csv = this.convertToCsv(data);
    const fileName = `${Math.floor(Math.random() * 100000)}_${this.rowCounts}R.csv`;
    this.downloadCsv(csv, fileName);
  }

  async downloadFile(s3Key: string) {
    try {
      const response = await fetch(`${this.backendUrl}api/S3/get-presigned-url-download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: s3Key }),
      }).then(res => res.json());

      const { downloadUrl } = response;

      console.log('Download URL: ', downloadUrl);

      const fileResponse = await fetch(downloadUrl, {
        headers: {
          'Content-Type': 'text/csv',
        },
      });

      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = s3Key + '.csv';
      anchor.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  async deleteFile(s3Key: string) {
    try {
      const response = await fetch(`${this.backendUrl}api/S3/delete-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key: s3Key }),
      }).then(res => res.json());

      console.log('Delete response: ', response);

      this.executionJobs = this.executionJobs.filter(j => j.id !== s3Key);
      localStorage.setItem('executionJobs', JSON.stringify(this.executionJobs));

    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
  
  

}
