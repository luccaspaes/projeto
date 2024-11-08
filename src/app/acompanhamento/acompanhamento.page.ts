import { Component, OnInit } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { AuthService } from '../services/auth.service';
// Registre as escalas, controladores e outros componentes necessários
Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { Alimento } from '../model/alimento';  // Importe a interface




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
  userId: string = '';  // ID do usuário, que será obtido após o login
  caloriasAdicionadas: number = 0;  // Declaração da variável
  carboidratosAdicionados: number = 0
  proteinasAdicionadas: number = 0
  gordurasAdicionadas: number = 0

  historicoSemanal: any[] = [];

   // Armazene a instância do gráfico
   private weeklyProgressChart: Chart | null = null;

  constructor(private spoonacularService: SpoonacularService, private authService: AuthService) {}

  ngOnInit() {
    // Verifica se o usuário está logado e carrega seus dados nutricionais
    this.userId = localStorage.getItem('userId')!; // Ou use outra forma de obter o userId, como um serviço global

    if (this.userId) {
      this.getData();  // Carrega os dados do Firestore
    }
   
  }

   
   // Buscar dados nutricionais do Firestore usando o userId
   getData() {
    this.authService.getDataNutricional(this.userId).subscribe(data => {
      if (data) {
        this.macronutrientes = data;
        console.log('Dados nutricionais do Firestore:', this.macronutrientes);
      } else {
        console.log('Nenhum dado encontrado para esse usuário');
      }
    });
  }


 // Atualizar os dados nutricionais no Firestore
 updateData() {
  const updatedData = {
    calorias: { consumidas: 1500, meta: 2000 },
    carboidratos: { consumidos: 200, meta: 250 },
    proteinas: { consumidos: 100, meta: 150 },
    gorduras: { consumidos: 50, meta: 80 },
  };

  if (this.userId) {
    this.authService.updateDataNutricional(this.userId, updatedData)
      .then(() => {
        console.log('Dados atualizados no Firestore');
      })
      .catch((error) => {
        console.error('Erro ao atualizar dados:', error);
      });
  }
}

 

adicionarCalorias() {
  const hoje = new Date();
  const diaDaSemana = hoje.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

  // Atualize os macronutrientes com base nos valores inseridos
  this.macronutrientes.calorias.consumidas += this.caloriasAdicionadas;
  this.macronutrientes.carboidratos.consumidos += this.carboidratosAdicionados;
  this.macronutrientes.proteinas.consumidos += this.proteinasAdicionadas;
  this.macronutrientes.gorduras.consumidos += this.gordurasAdicionadas;

  // Verifique se o gráfico está definido e se a estrutura de dados existe
  if (this.weeklyProgressChart && 
      this.weeklyProgressChart.data && 
      this.weeklyProgressChart.data.datasets && 
      this.weeklyProgressChart.data.datasets[0] && 
      typeof this.weeklyProgressChart.data.datasets[0].data[diaDaSemana] === 'number') {
      
    // Atualize o gráfico com os dados mais recentes no índice correto do dia da semana
    this.weeklyProgressChart.data.datasets[0].data[diaDaSemana] = 
      (this.weeklyProgressChart.data.datasets[0].data[diaDaSemana] as number) + this.caloriasAdicionadas;

    this.weeklyProgressChart.update(); // Atualiza o gráfico com os dados mais recentes
  } else {
    console.error("Erro: weeklyProgressChart ou dados não estão definidos corretamente.");
  }

  // Atualiza os dados no Firestore
  const updatedData = {
    calorias: this.macronutrientes.calorias,
    carboidratos: this.macronutrientes.carboidratos,
    proteinas: this.macronutrientes.proteinas,
    gorduras: this.macronutrientes.gorduras,
  };

  this.authService.updateDataNutricional(this.userId, updatedData).then(() => {
    console.log('Dados nutricionais atualizados no Firestore');
  }).catch((error) => {
    console.error('Erro ao atualizar dados nutricionais:', error);
  });

  // Atualiza os campos dos cards, resetando os valores de adição
  this.updateCards();
}

  // Função para atualizar os cards
updateCards() {
  // Atualiza os valores dos cards com os dados mais recentes
  this.caloriasAdicionadas = 0;
  this.carboidratosAdicionados = 0;
  this.proteinasAdicionadas = 0;
  this.gordurasAdicionadas = 0;
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
  ngAfterViewInit() {
    setTimeout(() => {
      this.createWeeklyProgressChart();  // Garantindo que o gráfico seja criado depois que a visualização estiver pronta
    }, 0);
  }
   // Atualiza ou cria o gráfico semanal
   createWeeklyProgressChart() {
    const canvas = document.getElementById('weeklyProgressChart') as HTMLCanvasElement;
    console.log(canvas);  // Verifique se o canvas está sendo encontrado
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      // Se o gráfico já existir, atualize os dados
      if (this.weeklyProgressChart) {
        this.weeklyProgressChart.data.datasets[0].data = [
          this.macronutrientes.calorias.consumidas,
          this.macronutrientes.carboidratos.consumidos,
          this.macronutrientes.proteinas.consumidos,
          this.macronutrientes.gorduras.consumidos
        ];
        this.weeklyProgressChart.update(); // Atualiza o gráfico
      } else {
        // Caso contrário, crie um novo gráfico
        this.weeklyProgressChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            datasets: [{
              label: 'Macronutrientes Consumidos',
              data: [
                this.macronutrientes.calorias.consumidas,
                this.macronutrientes.carboidratos.consumidos,
                this.macronutrientes.proteinas.consumidos,
                this.macronutrientes.gorduras.consumidos
              ],
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
      }
    } else {
      console.error('Erro: O contexto 2D do canvas não foi encontrado.');
    }
  }

}



