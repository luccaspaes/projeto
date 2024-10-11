import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpoonacularService {
  // URL base da API
  private apiUrl = 'https://platform.fatsecret.com/rest/server.api';
  private authUrl = 'https://oauth.fatsecret.com/connect/token';

  // Suas credenciais que você pegou no site do FatSecret
  private consumerKey = '087f0fbce31b4a128e1f84bfd05042f5';
  private consumerSecret = '1a16bacc498b492ea65d4f11cb8c8eea';

  constructor(private http: HttpClient) {}

  // Função para obter o Access Token
  getAccessToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // Parâmetros necessários para a requisição de token
    const body = new HttpParams()
      .set('grant_type', 'client_credentials') // Tipo da requisição OAuth
      .set('client_id', this.consumerKey) // Usando a consumerKey
      .set('client_secret', this.consumerSecret); // Usando a consumerSecret

    // Aqui o link do token está sendo usado para fazer a requisição
    return this.http.post(this.authUrl, body.toString(), { headers });
  }
}


 
