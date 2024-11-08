import { Component, OnInit } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service';
import { AuthService } from '../services/auth.service';
import { Alimento } from '../model/alimento';  // Importe a interface

@Component({
  selector: 'app-alimento',
  templateUrl: './alimento.page.html',
  styleUrls: ['./alimento.page.scss'],
})
export class AlimentoPage implements OnInit {
  searchQuery: string = '';
  alimentosDisponiveis: Alimento[] = [];  // Lista de alimentos disponíveis (seguindo a interface Alimento)
  alimentoSelecionado: Alimento | null = null;  // Alimento que o usuário selecionou
  quantidade: number = 1;  // Quantidade de alimentos que o usuário deseja adicionar

  constructor(private spoonacularService: SpoonacularService) { }

  ngOnInit() {
    this.carregarAlimentos();
  }

  carregarAlimentos() {
    this.spoonacularService.buscarAlimentos().subscribe((dados: Alimento[]) => {
      this.alimentosDisponiveis = dados;  // Tipar dados como Alimento[]
    });
  }

  adicionarAlimento() {
    if (this.alimentoSelecionado && this.alimentoSelecionado.quantidade != undefined) {
      // Processar normalmente
      const quantidade = this.alimentoSelecionado.quantidade;
      // Restante da lógica
    } else {
      // Valor default se 'quantidade' for undefined
      const quantidade = 1;
      // Restante da lógica
    }

      // Função que filtra alimentos com base na pesquisa
  
  }
   // Atualizar os macronutrientes com os dados do alimento adicionado
   atualizarMacronutrientes(alimento: Alimento) {
    // Aqui você pode adicionar a lógica de como atualizar os macronutrientes ou salvar os dados em um serviço
    
  }

}
