import { Component, OnInit } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service'; // Importa o serviço

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  recipeData: any[] = [];
  isFoodOptionsVisible: boolean = false; // Dados das receitas

  constructor(private spoonacularService: SpoonacularService) {}

  ngOnInit() {
    this.getRecipes(); // Chama a função para buscar receitas
  }

  // Função para buscar receitas da API
  getRecipes() {
    this.spoonacularService.getRandomRecipes().subscribe(
      (response) => {
        this.recipeData = response.recipes; // Armazena as receitas
        console.log('Dados das Receitas:', this.recipeData);
        this.isFoodOptionsVisible = true
      },
      (error) => {
        console.error('Erro ao buscar receitas:', error);
      }
    );
  }

  // Função para adicionar alimento
  addFood() {
    console.log('Adicionando alimento...');
    this.getRecipes();
    // Aqui você pode adicionar lógica para adicionar um alimento (pode ser uma requisição à API, por exemplo)
  }

  // Função para buscar alimento (ou outra lógica)
  searchFood() {
    console.log('Buscando alimento...');
    // Aqui você pode adicionar lógica para buscar alimento, usando o serviço se necessário
  }
}

