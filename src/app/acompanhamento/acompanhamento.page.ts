import { Component, OnInit } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';



@Component({
  selector: 'app-acompanhamento',
  templateUrl: './acompanhamento.page.html',
  styleUrls: ['./acompanhamento.page.scss'],
})
export class AcompanhamentoPage implements OnInit {

  macronutrientes: any = {
    calorias: { consumidas: 0, restantes: 0 },
    carboidratos: { consumidos: 0, meta: 0 },
    proteinas: { consumidos: 0, meta: 0 },
    gorduras: { consumidos: 0, meta: 0 }
  };

  historicoSemanal: any[] = [];

  constructor(private spoonacularService: SpoonacularService) {}

  ngOnInit() {
    // Código de inicialização aqui, se necessário
   
  }

  ionViewDidEnter() {
    this.createWeeklyProgressChart();
  }


  // Carrega histórico semanal do serviço/API
  carregarHistoricoSemanal() {
    const userId = 'EXEMPLO_USER_ID'; // Pode ser obtido de um login ou perfil do usuário
    this.spoonacularService.getWeeklyHistory(userId).subscribe(
      (response) => {
        this.historicoSemanal = response.data; // Ajuste de acordo com o formato da resposta da API
        this.calcularProgresso();
      },
      (error) => {
        console.error('Erro ao carregar histórico semanal:', error);
      }
    );
  }

  calcularProgresso() {
    // Processa o histórico semanal e atualiza o estado de macronutrientes conforme necessário
    // Exemplo básico de cálculo (ajuste conforme necessário):
    this.historicoSemanal.forEach(dia => {
      this.macronutrientes.calorias.consumidas += dia.caloriasConsumidas;
      this.macronutrientes.carboidratos.consumidos += dia.carboidratosConsumidos;
      this.macronutrientes.proteinas.consumidos += dia.proteinasConsumidas;
      this.macronutrientes.gorduras.consumidos += dia.gordurasConsumidas;
    });

    // Atualiza metas ou restantes com base nos valores diários
    this.macronutrientes.calorias.restantes = 2000 - this.macronutrientes.calorias.consumidas; // Exemplo de meta de 2000 calorias
  }

   // Função para ser chamada quando o card de calorias for clicado
   viewCaloriasDetails() {
    // Exemplo de lógica: exibir um alerta com detalhes das calorias
    alert(`Meta de Calorias: ${this.macronutrientes.calorias.meta}\nConsumidas: ${this.macronutrientes.calorias.consumidas}`);

    // Se você quiser navegar para outra página, pode usar o NavController
    // this.navCtrl.navigateForward('/detalhes-calorias');
  }

  createWeeklyProgressChart() {
    // Registrando componentes necessários
    Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

    const canvas = document.getElementById('weeklyProgressChart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
          datasets: [{
            label: 'Calorias Consumidas',
            data: [1200, 1500, 1300, 1600, 1800, 1700, 1900],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    } else {
      console.error('Erro: O contexto 2D do canvas não foi encontrado.');
    }
  }
  

}



