import { Component, OnInit } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service'; // Importa o serviço
interface Recipe {
  id: number
  title: string;
  image: string;
  instructions?: string;
  analyzedInstructions?: {
    name: string;
    steps: { number: number; step: string }[];
  }[];
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
  selectedCategory: string  = 'breakfast';
  categories = [
    { value: 'breakfast', label: 'Café da Manhã' },
    { value: 'lunch', label: 'Almoço' },
    { value: 'dessert', label: 'Sobremesa' },
    { value: 'dinner', label: 'Janta' }
  ];
  receitas: any[] = []; // Adicione esta linha

  

  constructor(private spoonacularService: SpoonacularService) {
    this.selectedCategory = 'breakfast'; // Categoria padrão
  }

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
          // Mapeia as receitas retornadas para adicionar um fallback para analyzedInstructions e showInstructions
          this.recipeData = response.map((recipe: any) => ({
            ...recipe,
            analyzedInstructions: recipe.analyzedInstructions || [], // Garante que analyzedInstructions seja um array vazio caso esteja undefined ou null
            showInstructions: false, // Inicializa showInstructions como false para cada receita
          }));
  
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

filterByCategory(categoria: any) {
  const selectedValue = categoria !== undefined ? String(categoria) : ''; // Força para string

  // Se não houver categoria, busque todas as receitas
  if (!selectedValue) {
    this.getRecipes(); 
    return;
  }

  this.selectedCategory = selectedValue; // Atualiza a categoria selecionada

   // Teste com diferentes valores de query
   const testCategories = ['breakfast', 'lunch', 'dessert', 'dinner']; // Categorias para testar
   const categoryToTest = testCategories[Math.floor(Math.random() * testCategories.length)];

  // Chame o serviço para buscar receitas pela categoria selecionada
  this.spoonacularService.getRecipesByCategory(this.selectedCategory).subscribe(
    (response: any) => {
      console.log('Resposta da API:', response); // Verifique a resposta
      this.receitas = response.results || []; // Atribua as receitas, se existirem
      console.log('Receitas filtradas:', this.receitas);
    },
    (error) => {
      console.error('Erro ao buscar receitas por categoria:', error);
    }
  );
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