import { Component, OnInit } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service'; // Importa o serviço de receitas
import { TranslateService } from '../services/translate.service'; // Importa o serviço de tradução
import { Recipe } from '../model/recipe.interface'; // Importa a interface Recipe

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})


export class HomePage implements OnInit {



    // Função para verificar se a receita tem instruções
    hasInstructions(recipe: any): boolean {
      return recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 &&
             recipe.analyzedInstructions[0].steps && recipe.analyzedInstructions[0].steps.length > 0;
    }
  searchQuery: string = ''; // Variável para armazenar a consulta de pesquisa
  searchResults: any[] = []; // Armazena os resultados
  recipeData: Recipe[] = []; // Dados das receitas
  isFoodOptionsVisible: boolean = false; // Para controlar a exibição de receitas
  foodInput: string = ''; // Valor do input de alimento
  foods: string[] = []; // Lista de alimentos adicionados
  selectedCategory: string = 'breakfast'; // Categoria selecionada
  categories = [
    { value: 'breakfast', label: 'Café da Manhã' },
    { value: 'lunch', label: 'Almoço' },
    { value: 'dessert', label: 'Sobremesa' },
    { value: 'dinner', label: 'Janta' }
  ];
  stepsToShow: number = 3; // número de passos a serem exibidos inicialmente
  receitas: any[] = []; // Receitas filtradas
  isLoading: boolean = true;
  translatedText: string = '';  // Para armazenar o texto traduzido

  constructor(private spoonacularService: SpoonacularService, private translateService: TranslateService) {}

  async ngOnInit() {
    // Traduzir as categorias ao carregar a página
    await this.translateCategories();
    this.getRandomRecipes(); // Carrega as receitas aleatórias
  }
  
  // Função para traduzir as categorias ao carregar a página
  async translateCategories() {
    for (let i = 0; i < this.categories.length; i++) {
      const category = this.categories[i];
      category.label = await this.translateService.translateWithDelay(category.label, 'pt'); // Traduz para o português
    }
  }

 // Exemplo de uso do método bulkTranslate
async getRandomRecipes() {
  this.spoonacularService.getRandomRecipes().subscribe(
    async (response) => {
      this.recipeData = response.recipes;

      // Coletando todos os títulos de receitas para tradução em lote
      const titles = this.recipeData.map(recipe => recipe.title);
      const translatedTitles = await this.translateService.bulkTranslate(titles, 'pt');

      // Atualizando os títulos das receitas com as traduções
      this.recipeData.forEach((recipe, index) => {
        recipe.title = translatedTitles[index];
      });

      console.log('Receitas aleatórias:', this.recipeData);
      this.isFoodOptionsVisible = true;
    },
    (error) => {
      console.error('Erro ao buscar receitas aleatórias:', error);
    }
  );
}


// Função para obter o primeiro passo da receita
getFirstStep(recipe: any): string {
  if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
    // A primeira instrução
    const instruction = recipe.analyzedInstructions[0];
    
    if (instruction.steps && instruction.steps.length > 0) {
      // Retorna o primeiro passo
      return instruction.steps[0].step;
    }
  }
  return ''; // Caso não haja instruções ou passos, retorna uma string vazia
}

  // Função para buscar receitas com base nos alimentos
  getRecipes() {
    if (this.foods.length > 0) {
      this.spoonacularService.getRecipesBasedOnFoods(this.foods).subscribe(
        (response) => {
          console.log('Resposta da API:', response);
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

  // Função para alternar a exibição dos passos das receitas
  async togglePreparation(recipe: any) {
    recipe.showInstructions = !recipe.showInstructions;
    if (recipe.showInstructions && recipe.analyzedInstructions.length > 0) {
      for (let instruction of recipe.analyzedInstructions) {
        for (let step of instruction.steps) {
          step.step = await this.translateService.translateWithDelay(step.step, 'pt'); // Traduz cada passo
        }
      }
    }
  }

  // Função para filtrar receitas por categoria
  filterByCategory(categoria: any) {
    const selectedValue = categoria !== undefined ? String(categoria) : '';

    if (!selectedValue) {
      this.getRecipes();
      return;
    }

 

    this.selectedCategory = selectedValue;
    this.spoonacularService.getRecipesByCategory(this.selectedCategory).subscribe(
      (response: any) => {
        this.receitas = response.results || []; // Atribui as receitas filtradas
        console.log('Receitas filtradas:', this.receitas);
      },
      (error) => {
        console.error('Erro ao buscar receitas por categoria:', error);
      }
    );
  }

  // Função de pesquisa de receitas
  searchRecipes() {
    if (this.searchQuery) {
      this.spoonacularService.searchRecipes(this.searchQuery).subscribe(
        (data) => {
          this.recipeData = data.results.map((recipe: any) => ({
            ...recipe,
            showInstructions: false,
            isFavorite: false
          }));
          this.isFoodOptionsVisible = true;
        },
        (error) => {
          console.error('Erro ao buscar receitas:', error);
        }
      );
    }
  }

  // Função para adicionar alimentos à lista
  addFood(food: string) {
    if (food) {
      this.foods.push(food);
      this.foodInput = ''; // Limpa o campo após adicionar
    }
  }

  // Função para remover alimentos da lista
  removeFood(index: number) {
    this.foods.splice(index, 1);
  }

  // Função para alternar o status de favorito
  toggleFavorite(recipe: Recipe) {
    recipe.isFavorite = !recipe.isFavorite;
  }

  // Função para adicionar os ingredientes à lista de compras
  addToShoppingList(recipe: Recipe) {
    console.log('Adicionando à lista de compras:', recipe.title);
  }

  // Função para compartilhar receita
  shareRecipe(recipe: Recipe) {
    console.log('Compartilhando receita:', recipe.title);
  }


  async testTranslation() {
    try {
      const text = 'Hello world';
      const translated = await this.translateService.translateText(text, 'pt');
      console.log('Texto traduzido:', translated);
    } catch (error) {
      console.error('Erro ao testar tradução:', error);
    }
  }





}