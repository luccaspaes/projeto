import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AuthService } from '../services/auth.service';
import { Alimento } from '../model/alimento';
import { SpoonacularService } from '../services/spoonacular.service';
import { Observable } from 'rxjs';

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

@Component({
  selector: 'app-acompanhamento',
  templateUrl: './acompanhamento.page.html',
  styleUrls: ['./acompanhamento.page.scss'],
})
export class AcompanhamentoPage implements OnInit, AfterViewInit {
  alimentos: Alimento[] = [];
  nomeAlimento: string = '';
  userId: string = '';
  calorias: number = 0;
  carboidratos: number = 0;
  proteinas: number = 0;
  gorduras: number = 0;
  meta: { calorias: number; carboidratos: number; proteinas: number; gorduras: number } = {
    calorias: 2000,
    carboidratos: 300,
    proteinas: 100,
    gorduras: 70,
  };
  chart: any;

  macronutrientes = {
    calorias: { meta: 2000, consumidas: 0 },
    carboidratos: { meta: 300, consumidos: 0 },
    proteinas: { meta: 150, consumidos: 0 },
    gorduras: { meta: 70, consumidos: 0 }
  };
  
// Supondo que você tenha uma função que observa as mudanças nos macronutrientes

  constructor(private authService: AuthService, private SpoonacularService: SpoonacularService) {}





  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    if (this.userId) {
      this.authService.getRealtimeUpdates(this.userId).subscribe(data => {
        if (data) {
          this.alimentos = data.alimentos || [];
          this.updateCardsAndChart(); // Atualiza os cards e o gráfico
        }
        if (data.meta) {
          this.meta = data.meta;
        }
      });
    }
    this.spotAlimentos();
  }
  adicionarAlimento() {
    const novoAlimento: Alimento = {
      id: this.alimentos.length + 1,  // Gerando um ID único baseado no tamanho da lista
      nome: 'Novo Alimento',
      calorias: 100,
      carboidratos: 25,
      proteinas: 10,
      gorduras: 5
    };
  
    this.alimentos.push(novoAlimento);
    this.atualizarMacronutrientes(novoAlimento);
  }


atualizarMacronutrientes(alimento: Alimento) {
  this.macronutrientes.calorias.consumidas += alimento.calorias;
  this.macronutrientes.carboidratos.consumidos += alimento.carboidratos;
  this.macronutrientes.proteinas.consumidos += alimento.proteinas;
  this.macronutrientes.gorduras.consumidos += alimento.gorduras;
}

 
excluirAlimento(alimento: Alimento) {
  // Lógica para excluir o alimento
  const index = this.alimentos.indexOf(alimento);
  if (index !== -1) {
    this.alimentos.splice(index, 1);
  }
}
  
  atualizarMacronutrientesApósExclusao(alimento: Alimento) {
    this.macronutrientes.calorias.consumidas -= alimento.calorias;
    this.macronutrientes.carboidratos.consumidos -= alimento.carboidratos;
    this.macronutrientes.proteinas.consumidos -= alimento.proteinas;
    this.macronutrientes.gorduras.consumidos -= alimento.gorduras;
  }

  removerAlimento(alimento: Alimento) {
    this.alimentos = this.alimentos.filter(item => item !== alimento);
    this.authService.updateDataNutricional(this.userId, { alimentos: this.alimentos }).catch(error => {
      console.error('Erro ao remover alimento:', error);
    });
  }

  definirMeta() {
    this.authService.updateDataNutricional(this.userId, { meta: this.meta }).then(() => {
      console.log('Meta atualizada com sucesso!');
    });
  }

  updateCardsAndChart() {
    this.calorias = this.alimentos.reduce((sum, item) => sum + item.calorias, 0);
    this.carboidratos = this.alimentos.reduce((sum, item) => sum + item.carboidratos, 0);
    this.proteinas = this.alimentos.reduce((sum, item) => sum + item.proteinas, 0);
    this.gorduras = this.alimentos.reduce((sum, item) => sum + item.gorduras, 0);

    if (this.chart) {
      this.chart.data.datasets[0].data = [this.calorias, this.carboidratos, this.proteinas, this.gorduras];
      this.chart.update();
    }
  }

 // Função para buscar alimentos da API Spoonacular
 spotAlimentos() {
  this.SpoonacularService.getAlimentos().subscribe(
    (data) => {
      this.alimentos = data;
      this.updateCardsAndChart(); // Atualiza os cards e gráfico após receber os dados da API
    },
    (error) => {
      console.error('Erro ao buscar alimentos', error);
    }
  );
}


  atualizarGrafico() {
    // Aqui, você pode atualizar o gráfico usando os dados de alimentos
  }


  ngAfterViewInit() {
    this.chart = new Chart('chartCanvas', {
      type: 'bar',
      data: {
        labels: ['Calorias', 'Carboidratos', 'Proteínas', 'Gorduras'],
        datasets: [
          {
            label: 'Consumo Atual',
            data: [this.calorias, this.carboidratos, this.proteinas, this.gorduras],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Consumo Nutricional' },
        },
      },
    });
  }
}