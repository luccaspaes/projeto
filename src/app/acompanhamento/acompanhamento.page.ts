import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { SpoonacularService } from '../services/spoonacular.service';
import { AuthService } from '../services/auth.service';
import { AlimentoService } from '../services/alimento.service';
import { Alimento } from '../model/alimento';

// Registre os componentes necessários do Chart.js
Chart.register(BarController, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

@Component({
  selector: 'app-acompanhamento',
  templateUrl: './acompanhamento.page.html',
  styleUrls: ['./acompanhamento.page.scss'],
})
export class AcompanhamentoPage implements OnInit, AfterViewInit {
  // **Estados e Dados**
  alimentosAdicionados: Alimento[] = [];
  macronutrientesTotais = {
    calorias: 0,
    carboidratos: 0,
    proteinas: 0,
    gorduras: 0,
  };
  userId: string = '';
  caloriasAdicionadas: number = 0;
  carboidratosAdicionados: number = 0;
  proteinasAdicionadas: number = 0;
  gordurasAdicionadas: number = 0;
  nomeAlimento: string = '';
  alimentos: any[] = []; 

  // Histórico semanal e gráfico
  historicoSemanal: any[] = [];
  private weeklyProgressChart: Chart | null = null;

  macronutrientes = {
    calorias: { meta: 2000, consumidas: 1500 },
    carboidratos: { meta: 300, consumidos: 200 },
    proteinas: { meta: 100, consumidos: 80 },
    gorduras: { meta: 70, consumidos: 50 },
  };

  alimentosplus = [
    {
      nome: 'Arroz',
      calorias: 200,
      carboidratos: 45,
      proteinas: 4,
      gorduras: 1,
    },
    {
      nome: 'Frango Grelhado',
      calorias: 150,
      carboidratos: 0,
      proteinas: 30,
      gorduras: 3,
    },
    {
      nome: 'Banana',
      calorias: 100,
      carboidratos: 27,
      proteinas: 1,
      gorduras: 0,
    },
  ];

  removerAlimento(alimento: any) {
    this.alimentosplus = this.alimentos.filter(a => a !== alimento);
  }

 
  constructor(
    private spoonacularService: SpoonacularService,
    private authService: AuthService,
    private alimentoService: AlimentoService
  ) {}

  ngOnInit() {
    // Obtenha o userId e carregue dados
    this.userId = localStorage.getItem('userId') || '';
    if (this.userId) {
      this.getData();
    }

    // Inicialize os alimentos e macronutrientes
    this.carregarDados();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createWeeklyProgressChart();
    }, 0);
  }

  // **Carregar Dados**
  carregarDados() {
    this.alimentosAdicionados = this.alimentoService.getAlimentosAdicionados();
    this.macronutrientesTotais = this.alimentoService.getMacronutrientesTotais();
  }

  
  adicionarAlimento() {
    // Acessando a variável 'nomeAlimento' com 'this'
    if (this.nomeAlimento.trim() !== '') {
      this.alimentoService.buscarInformacoesNutricionais(this.nomeAlimento).subscribe(data => {
        console.log('Resposta da API:', data);

        if (data && data.food) {  // Verifique a estrutura da resposta da API
          this.alimentos.push({
            name: data.food.name || 'Nome não disponível',
            calories: data.food.nutrition?.calories || 'N/A',
            carbs: data.food.nutrition?.carbs || 'N/A',
            proteins: data.food.nutrition?.proteins || 'N/A',
            fats: data.food.nutrition?.fats || 'N/A',
          });
          this.nomeAlimento = '';  // Limpar o campo de entrada após adicionar
        } else {
          alert('Não foi possível encontrar o alimento');
        }
      }, error => {
        console.error('Erro ao buscar alimento:', error);
        alert('Erro ao buscar o alimento');
      });
    } else {
      alert('Por favor, insira o nome de um alimento');
    }
  }



  getData() {
    this.authService.getDataNutricional(this.userId).subscribe(data => {
      if (data) {
        // Preenche automaticamente os macronutrientes com os dados do Firebase ou de outro serviço
        this.macronutrientes.calorias.consumidas = data.calorias.consumidas;
        this.macronutrientes.carboidratos.consumidos = data.carboidratos.consumidos;
        this.macronutrientes.proteinas.consumidos = data.proteinas.consumidos;
        this.macronutrientes.gorduras.consumidos = data.gorduras.consumidos;
  
        // Atualiza a lista de alimentos consumidos
        this.alimentosAdicionados = data.alimentos || []; // Alimentos consumidos, caso estejam salvos no Firebase
      } else {
        console.log('Nenhum dado encontrado para o usuário.');
      }
    });
  }







  updateData() {
    const updatedData = {
      calorias: this.macronutrientesTotais.calorias,
      carboidratos: this.macronutrientesTotais.carboidratos,
      proteinas: this.macronutrientesTotais.proteinas,
      gorduras: this.macronutrientesTotais.gorduras,
    };

    this.authService.updateDataNutricional(this.userId, updatedData)
      .then(() => console.log('Dados atualizados no Firestore'))
      .catch(error => console.error('Erro ao atualizar dados:', error));
  }

  // **Adicionar Calorias**
  adicionarCalorias() {
    const hoje = new Date();
    const diaDaSemana = hoje.getDay(); // Obtém o índice do dia da semana

    // Atualize os macronutrientes
    this.macronutrientesTotais.calorias += this.caloriasAdicionadas;
    this.macronutrientesTotais.carboidratos += this.carboidratosAdicionados;
    this.macronutrientesTotais.proteinas += this.proteinasAdicionadas;
    this.macronutrientesTotais.gorduras += this.gordurasAdicionadas;

    // Atualize o gráfico
    if (this.weeklyProgressChart && this.weeklyProgressChart.data.datasets) {
      const dataset = this.weeklyProgressChart.data.datasets[0];
      dataset.data[diaDaSemana] = (dataset.data[diaDaSemana] as number) + this.caloriasAdicionadas;
      this.weeklyProgressChart.update();
    }

    // Atualize os dados no Firestore
    this.updateData();
    this.resetInputs();
  }

  // **Resetar Campos de Entrada**
  resetInputs() {
    this.caloriasAdicionadas = 0;
    this.carboidratosAdicionados = 0;
    this.proteinasAdicionadas = 0;
    this.gordurasAdicionadas = 0;
  }

  // **Criar ou Atualizar Gráfico**
  createWeeklyProgressChart() {
    const canvas = document.getElementById('weeklyProgressChart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      if (this.weeklyProgressChart) {
        // Atualiza dados se o gráfico já existir
        this.weeklyProgressChart.data.datasets[0].data = [
          this.macronutrientesTotais.calorias,
          this.macronutrientesTotais.carboidratos,
          this.macronutrientesTotais.proteinas,
          this.macronutrientesTotais.gorduras,
        ];
        this.weeklyProgressChart.update();
      } else {
        // Cria um novo gráfico
        this.weeklyProgressChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
            datasets: [{
              label: 'Consumo Semanal',
              data: [
                this.macronutrientesTotais.calorias,
                this.macronutrientesTotais.carboidratos,
                this.macronutrientesTotais.proteinas,
                this.macronutrientesTotais.gorduras,
              ],
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      }
    } else {
      console.error('Canvas não encontrado.');
    }
  }

  updateChart() {
    if (this.weeklyProgressChart) {
      this.weeklyProgressChart.update();
    }
  }
}