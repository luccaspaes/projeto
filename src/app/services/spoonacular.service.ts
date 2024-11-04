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

    // Exemplo de função para obter dados de nutrição por ingrediente
    getNutritionByIngredient(ingredient: string): Observable<any> {
      return this.http.get(`${this.apiUrl}food/ingredients/search?query=${ingredient}&apiKey=${this.apiKey}`);
    }
  
    // Função para obter histórico semanal - ajuste o endpoint conforme a necessidade da API
    getWeeklyHistory(userId: string): Observable<any> {
      // Essa URL precisa ser ajustada para a endpoint correta da API Spoonacular que forneça o histórico de consumo
      return this.http.get(`${this.apiUrl}users/${userId}/weeklyHistory?apiKey=${this.apiKey}`);
    }

    getRecipesByCategory(category: string): Observable<any> {
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${category}&apiKey=95206646e8b2486eb8f9ddc3199b66d2`;
      console.log('URL da requisição:', url);
    
      return this.http.get(url);
    }


    // Função para buscar receitas personalizadas com base em uma consulta
  searchRecipes(query: string): Observable<any> {
    const url = `${this.apiUrl}/complexSearch?query=${query}&apiKey=${this.apiKey}`;
    return this.http.get<any>(url);
  }


}
 
