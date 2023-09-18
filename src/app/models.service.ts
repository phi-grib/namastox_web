import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  constructor(private http: HttpClient) {}

  getModels() {
    const url: string = environment.baseUrl + 'models';
    return this.http.get(url);
  }
  getPrediction(ra_name: string, names, versions) {
    const formData = new FormData();
    formData.append('models', names);
    formData.append('versions', versions);
    const url: string = environment.baseUrl + 'predict/' + ra_name;
    return this.http.put(url, formData);
  }
  /**
   * Get documentation of model
   * @param m_name
   * @param version
   */
  getModelDocumentation(m_name: string, version: number) {
    const url: string =
      environment.baseUrl + 'model_documentation/' + m_name + '/' + version;
    return this.http.get(url);
  }
}
