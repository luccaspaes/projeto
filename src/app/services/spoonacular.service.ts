import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map } from 'rxjs'; // 'of' para criar observáveis
import { catchError, tap } from 'rxjs/operators'; // Operadores RxJS




export interface Alimento {
  id: number;
  nome: string;  // Propriedade correta aqui
  calorias: number;
  carboidratos: number;
  proteinas: number;
  gorduras: number;
}








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

  getRecipesBasedOnFoods(foods: string[]): Observable<any> {
    if (foods.length === 0) {
      console.warn('Nenhum alimento fornecido.');
      return of([]); // Retorna um observable vazio se não houver alimentos
    }
  
    const ingredients = foods.join(',');
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${this.apiKey}&ignorePantry=true`;
  
    console.log('URL da API:', url); // Log da URL gerada para testes
  
    return this.http.get<any>(url).pipe(
      tap((response) => console.log('Resposta da API:', response)), // Log da resposta
      catchError((error) => {
        console.error('Erro ao acessar a API Spoonacular:', error);
        return of([]); // Retorna um array vazio em caso de erro
      })
    );
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
    return this.http.get<any>(`${this.apiUrl}/search?query=apple&apiKey=95206646e8b2486eb8f9ddc3199b66d2`);
  }



  
    // Método para obter dados da API
    getAlimentos(): Observable<Alimento[]> {
      return this.http.get<any[]>('https://api.spoonacular.com/recipes').pipe(
        map((response: any[]) => {
          return response.map((item: any, index: number) => ({
            id: index + 1,                // Gerando um ID único para cada alimento
            nome: item.name || 'Desconhecido', // Supondo que o nome do alimento esteja em `item.name`, caso contrário, um nome padrão
            calorias: item.calories,
            carboidratos: item.carbs,
            proteinas: item.proteins,
            gorduras: item.fats,
          }));
        })
      );
    }


}
 
