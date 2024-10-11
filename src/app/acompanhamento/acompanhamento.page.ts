import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acompanhamento',
  templateUrl: './acompanhamento.page.html',
  styleUrls: ['./acompanhamento.page.scss'],
})
export class AcompanhamentoPage implements OnInit {

  macronutrientes = {
    calorias: { consumidas: 1291, restantes: 826, queimadas: 244 },
    carboidratos: { consumidos: 206, meta: 258 },
    proteinas: { consumidos: 35, meta: 103 },
    gorduras: { consumidos: 32, meta: 68 }

  };

  constructor() {}

  ngOnInit() {
    // Código de inicialização aqui, se necessário
  }

  

}



