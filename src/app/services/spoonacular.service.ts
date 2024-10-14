import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpoonacularService {
  // URL base da API
  private apiKey = '95206646e8b2486eb8f9ddc3199b66d2';
  private apiUrl = 'https://api.spoonacular.com/recipes';

 
  

  constructor(private http: HttpClient) {}

  // Função para buscar receitas aleatórias da API
  getRandomRecipes(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Fazendo a chamada à API com a sua chave
    return this.http.get(`${this.apiUrl}/random?number=5&apiKey=${this.apiKey}`, { headers });
  }

  // Função para buscar uma receita por ID
  getRecipeById(recipeId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/${recipeId}/information?apiKey=${this.apiKey}`, { headers });
  }
}


 
