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
  searchResults: any[] = []; // Armazena os resultados
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
  stepsToShow: number = 3; // número de passos a serem exibidos inicialmente
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

  removeFood(index: number) {
    this.foods.splice(index, 1);
  }

    // Função para mostrar mais passos
    showMoreSteps(recipe: Recipe) {
      this.stepsToShow += 3; // aumenta a quantidade de passos mostrados
    }

  


 // Função para buscar receitas baseadas nos alimentos
getRecipes() {
  if (this.foods.length > 0) {
    this.spoonacularService.getRecipesBasedOnFoods(this.foods).subscribe(
      (response) => {
        console.log('Resposta da API:', response); // Inspecione a resposta completa
        this.recipeData = response.map((recipe: any) => ({
          ...recipe,
          analyzedInstructions: Array.isArray(recipe.analyzedInstructions) 
            ? recipe.analyzedInstructions.map((instruction: any) => ({
                ...instruction,
                steps: Array.isArray(instruction.steps) ? instruction.steps : [] // Garante que steps seja um array
              }))
            : [], // Garante que analyzedInstructions seja um array, mesmo se vazio
          showInstructions: false, // Inicializa showInstructions como false para cada receita
        }));
        console.log('Estrutura de recipeData:', JSON.stringify(this.recipeData, null, 2));

        console.log('Dados das receitas recebidas:', this.recipeData);
        this.isFoodOptionsVisible = this.recipeData.length > 0; // Atualiza a visibilidade das opções de receitas
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

searchRecipes() {
  if (this.searchQuery) {
    this.spoonacularService.searchRecipes(this.searchQuery).subscribe(
      (data) => {
        this.recipeData = data.results.map((recipe: any) => ({
          ...recipe,
          showInstructions: false, // Para controlar a exibição do modo de preparo
          isFavorite: false        // Para controle de favoritos
        }));
        this.isFoodOptionsVisible = true; // Para garantir a exibição da seção de opções
      },
      (error) => {
        console.error('Erro ao buscar receitas:', error);
      }
    );
  }
}







addFood(food: string) {
  if (food) {
    this.foods.push(food);
    this.foodInput = ''; // Limpa o campo de entrada após adicionar
  }
}

hasInstructions(recipe: any): boolean {
  const hasInstructions = recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0;
  console.log(`Recipe ID ${recipe.id} - Has instructions:`, hasInstructions);
  return hasInstructions;
}




getFirstStep(recipe: any): string {
  return this.hasInstructions(recipe) ? recipe.analyzedInstructions[0].steps[0].step : 'Nenhuma instrução disponível.';
}

formatRecipesData(recipes: any[]) {
  recipes.forEach(recipe => {
    recipe.hasInstructions = recipe.analyzedInstructions?.length > 0 && recipe.analyzedInstructions[0].steps?.length > 0;
  });
  this.searchResults = recipes;
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