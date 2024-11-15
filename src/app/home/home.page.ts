
import { Component, OnInit } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service'; // Importa o serviço de receitas
import { TranslateService } from '../services/translate.service'; // Importa o serviço de tradução
import { Recipe } from '../model/recipe.interface'; // Importa a interface Recipe
import { TranslatePipe } from '../pipes/translate.pipe';

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
  foodName: string = '';
  translatedText: string = '';  // Para armazenar o texto traduzido

  constructor(private spoonacularService: SpoonacularService, private translateService: TranslateService) {}

  async ngOnInit() {
    // Traduzir as categorias ao carregar a página
    
    this.getRandomRecipes(); // Carrega as receitas aleatórias
  }
  
  async getRandomRecipes() {
    this.spoonacularService.getRandomRecipes().subscribe(
      (response) => {
        this.recipeData = response.recipes;
  
        // Traduzir os títulos das receitas
        this.recipeData.forEach((recipe) => {
          this.translateService.translateText(recipe.title, 'pt').subscribe(
            (translatedTitle: any) => {
              console.log('Traduzido:', translatedTitle); // Verifique a estrutura da resposta
              // A tradução está dentro de `data.translations[0].translatedText`
              recipe.translatedTitle = translatedTitle.data.translations[0].translatedText || recipe.title;
            },
            (error) => {
              console.error('Erro ao traduzir título da receita:', error);
              recipe.translatedTitle = recipe.title; // Fallback para o título original
            }
          );
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

getRecipes() {
  if (this.foods.length > 0) {
    this.spoonacularService.getRecipesBasedOnFoods(this.foods).subscribe(
      (response) => {
        console.log('Resposta da API:', response);

        if (response.length === 0) {
          console.log('Nenhuma receita encontrada para os ingredientes fornecidos.');
          this.recipeData = [];
          this.isFoodOptionsVisible = false;
        } else {
          // Mapeando a resposta e tratando as instruções e tradução do título
          this.recipeData = response.map((recipe: any) => ({
            ...recipe,
            title: this.translateRecipeTitle(recipe.title), // Traduz o título
            analyzedInstructions: Array.isArray(recipe.analyzedInstructions)
              ? recipe.analyzedInstructions.map((instruction: any) => ({
                  ...instruction,
                  steps: Array.isArray(instruction.steps) ? instruction.steps : []
                }))
              : [],
            showInstructions: false,
          }));
          this.isFoodOptionsVisible = true;
        }
      },
      (error) => {
        console.error('Erro ao buscar receitas:', error);
      }
    );
  } else {
    console.log('Nenhum alimento adicionado.');
  }
}

// Exemplo de tradução de título
translateRecipeTitle(title: string): string {
  // Aqui você pode usar um serviço de tradução como o Google Translate
  return title; // Apenas retornando o título como está por enquanto
}

toggleInstructions(recipe: any) {
  // Alterna entre mostrar e esconder as instruções
  recipe.showInstructions = !recipe.showInstructions;
}


async togglePreparation(recipe: any) {
  recipe.showInstructions = !recipe.showInstructions;
  
  if (recipe.showInstructions && recipe.analyzedInstructions.length > 0) {
    for (let instruction of recipe.analyzedInstructions) {
      for (let step of instruction.steps) {
        if (!step.translatedStep) {  // Verifica se já foi traduzido
          step.translatedStep = await this.translateService.translateWithDelay(step.step, 'pt').toPromise();
        }
      }
    }
  }
}


  filterByCategory(categoria: any) {
    this.selectedCategory = categoria;
    this.spoonacularService.getRecipesByCategory(this.selectedCategory).subscribe(
      (response: any) => {
        this.recipeData = response.results || [];
        console.log('Receitas filtradas:', this.recipeData);
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
          if (data && data.results && Array.isArray(data.results) && data.results.length > 0) {
            this.recipeData = data.results.map((recipe: any) => ({
              ...recipe,
              showInstructions: false,
              isFavorite: false
            }));
            this.isFoodOptionsVisible = true;
          } else {
            console.log('Nenhuma receita encontrada com esses ingredientes.');
            this.isFoodOptionsVisible = false; // Esconde as opções se nenhuma receita for encontrada
          }
        },
        (error) => {
          console.error('Erro ao buscar receitas por nome:', error);
        }
      );
    }
  }
 
  addFood() {
    const foodName = this.foodName.trim(); // Remover espaços antes e depois
  
    if (foodName) {
      this.foods.push(foodName);
      this.foodName = ''; // Limpa o campo de entrada após adicionar
      console.log('Alimentos adicionados:', this.foods); // Verifique no console
    }
  }

  translateFood(foodName: string) {
    this.translateService.translateText(foodName, 'pt').subscribe(
      (response: any) => {
        if (response && response.data && response.data.translations && response.data.translations.length > 0) {
          const translatedFoodName = response.data.translations[0].translatedText;
          console.log('Alimento traduzido:', translatedFoodName);
  
          // Atualiza o array de alimentos com o nome traduzido
          this.foods[this.foods.length - 1] = translatedFoodName;  // Substitui o último alimento no array
          console.log('Alimentos após tradução:', this.foods);  // Verifique no console
  
          // Após a tradução, chama a função de busca de receitas
          this.getRecipes(); // Chama a função para buscar as receitas
        } else {
          console.log('Nenhuma tradução encontrada para o alimento:', foodName);
        }
      },
      (error: any) => {
        console.error('Erro ao traduzir o alimento:', error);
      }
    );
  }
  


  removeFood(index: number) {
    this.foods.splice(index, 1); // Remove o alimento da lista
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
