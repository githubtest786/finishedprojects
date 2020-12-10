import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class UploadService {

    constructor(private httpClient: HttpClient) {

    }

    public upload(formData) { // Uploades images to the server.
        return this.httpClient.post<any>("api/api/products/addnewproduct", formData);
    }

    public updateUpload(formData) { 
        return this.httpClient.patch<any>("api/api/products/updateproduct", formData)
    }

}