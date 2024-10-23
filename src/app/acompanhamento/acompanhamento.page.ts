import { Component, OnInit } from '@angular/core';
import { SpoonacularService } from '../services/spoonacular.service';


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
    this.carregarHistoricoSemanal();
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

  

}



