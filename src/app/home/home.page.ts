import { Component, OnInit } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service'; // Importa o serviço
interface Recipe {
  title: string;
  image: string;
  instructions: string;
  isFavorite?: boolean; // Propriedade opcional
  showInstructions?: boolean; // Propriedade opcional
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  searchQuery: string = ''; // Variável para armazenar a consulta de pesquisa
  recipeData: Recipe[] = [];
  isFoodOptionsVisible: boolean = false; // Para controlar a exibição de receitas
  foodInput: string = ''; // Valor do input de alimento
  foods: string[] = []; // Lista de alimentos adicionados
  selectedCategory: string = '';

  

  constructor(private spoonacularService: SpoonacularService) {}

  ngOnInit() {
    this.getRandomRecipes();
    // Caso você queira buscar receitas aleatórias ao carregar a página
    // this.getRandomRecipes(); 
  }

  
  // Função para buscar receitas aleatórias
  getRandomRecipes() {
    this.spoonacularService.getRandomRecipes().subscribe(
      (response) => {
        this.recipeData = response.recipes;
        console.log('Receitas aleatórias:', this.recipeData);
        this.isFoodOptionsVisible = true;
      },
      (error) => {
        console.error('Erro ao buscar receitas aleatórias:', error);
      }
    );
  }


  // Função para buscar receitas baseadas nos alimentos
  getRecipes() {
    if (this.foods.length > 0) {
      // Chama o serviço para buscar receitas baseadas nos alimentos adicionados
      this.spoonacularService.getRecipesBasedOnFoods(this.foods).subscribe(
        (response) => {
          this.recipeData = response; // Armazena as receitas retornadas
          console.log('Receitas encontradas:', this.recipeData);
          this.isFoodOptionsVisible = true;
        },
        (error) => {
          console.error('Erro ao buscar receitas:', error);
        }
      );
    } else {
      console.log('Nenhum alimento adicionado.');
    }
  }

  
 // Função para alternar a exibição do modo de preparo
 togglePreparation(recipe: any) {
  recipe.showInstructions = !recipe.showInstructions; // Alterna entre mostrar ou esconder
}

// Função de busca de receitas
searchRecipes() {
  // lógica para buscar receitas baseadas no searchQuery
  if (this.searchQuery) {
    // Lógica para buscar receitas baseadas na consulta de pesquisa
    console.log('Busca personalizada para:', this.searchQuery);
    // Adicione o código para enviar a consulta de pesquisa ao serviço
  }
}

filterByCategory() {
  // lógica para filtrar receitas baseadas em selectedCategory
  if (this.selectedCategory) {
    // Lógica para filtrar receitas baseadas em selectedCategory
    console.log('Categoria selecionada:', this.selectedCategory);
    // Adicione o código para enviar a categoria selecionada ao serviço
  }
}

addFood(food: string) {
  if (food) {
    this.foods.push(food);
  }
}


toggleFavorite(recipe: Recipe) {
  recipe.isFavorite = !recipe.isFavorite;
}

addToShoppingList(recipe: Recipe) {
  // lógica para adicionar os ingredientes da receita na lista de compras
  console.log('Adicionando à lista de compras:', recipe.title);
}

shareRecipe(recipe: Recipe) {
  // lógica para compartilhar receita
  console.log('Compartilhando receita:', recipe.title);
}



}