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

 // spoonacular.service.ts
getRecipesBasedOnFoods(foods: string[]): Observable<any> {
  // Verifica se o array de alimentos não está vazio
  if (foods.length === 0) {
    return new Observable((observer) => {
      observer.next({ results: [] });
      observer.complete();
    });
  }

  // Converte o array de alimentos em uma string separada por vírgulas
  const ingredients = foods.join(',');

  // URL da API com a chave da API e os alimentos na query string
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${this.apiKey}&ignorePantry=true`;

  // Log para depuração
  console.log('URL da API:', url);

  // Realiza a requisição à API e retorna um observable com os resultados
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
// Verifique se a string de ingredientes está sendo corretamente construída
searchRecipes(ingredients: string): Observable<any> {
  const encodedIngredients = encodeURIComponent(ingredients); // Codifica para garantir a integridade da URL
  console.log('Ingredients being sent:', ingredients); // Log para depuração
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodedIngredients}&number=5&apiKey=${this.apiKey}`;
  return this.http.get<any>(url);
}
   // Método para buscar alimentos
   buscarAlimentos(): Observable<any> {
    // A URL pode ser ajustada conforme a sua necessidade e autenticação
    return this.http.get<any>(`${this.apiUrl}/search?query=apple&apiKey=YOUR_API_KEY`);
  }




}
 
