import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(private http: HttpClient) {}

  updateGeneralInformation(ra_name: string, info: any, file: File) {
    const formData = new FormData();
    formData.append('general', JSON.stringify(info));
    formData.append('custom_workflow_file', file);
    const url: string = environment.baseUrl + 'general_info/' + ra_name;
    return this.http.put(url, formData);
  }

  importModel(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    const url: string = environment.baseUrl + 'import_model';
    return this.http.post(url, formData);
  }

  updateResult(ra_name: string, info: any) {
    const formData = new FormData();
    formData.append('result', JSON.stringify(info));
    const url: string = environment.baseUrl + 'result/' + ra_name;
    return this.http.put(url, formData);
  }

  updateNameRA(ra_name: string, newRAname: string) {
    const url: string = environment.baseUrl + 'rename/' + ra_name +"/"+newRAname;
    return this.http.put(url, null);
  }

  updateLink(ra_name: string, file: any) {
    const formData = new FormData();
    formData.append('file', file);
    const url: string = environment.baseUrl + 'link/' + ra_name;
    return this.http.post(url, formData);
  }
  updateTable(ra_name: string, file: any) {
    const formData = new FormData();
    formData.append('file', file);
    const url: string = environment.baseUrl + 'table/' + ra_name;
    return this.http.post(url, formData);
  }

  updateUsersPermissions(ra_name: string, permissions) {
    const formData = new FormData();
    formData.append('read', permissions.read);
    formData.append('write', permissions.write);
    const url: string = environment.baseUrl + 'users/' + ra_name;
    return this.http.put(url, formData);
  }

  uploadSubstances(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    const url: string = environment.baseUrl + 'substances';
    return this.http.put(url, formData);
  }

  updateModelsRepo(path: string) {
    let encodeUrl = encodeURI(path);
    const url: string = environment.baseUrl + 'newrepo/' + encodeUrl;
    return this.http.get(url);
  }
}
