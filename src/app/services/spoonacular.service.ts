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

  // Função para buscar receitas aleatórias
  getRandomRecipes(): Observable<any> {
    const url = `https://api.spoonacular.com/recipes/random?number=10&apiKey=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  // Função para buscar receitas baseadas em alimentos
  getRecipesBasedOnFoods(foods: string[]): Observable<any> {
    const ingredients = foods.join(','); // Junta os alimentos com vírgula
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${this.apiKey}`;
    return this.http.get<any>(url);
  }
}
 
