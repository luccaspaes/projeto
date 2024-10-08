import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // Aqui, você define os dados dos macronutrientes
  macronutrientes = {
    calorias: { consumidas: 1291, restantes: 826, queimadas: 244 },
    carboidratos: { consumidos: 206, meta: 258 },
    proteinas: { consumidos: 35, meta: 103 },
    gorduras: { consumidos: 32, meta: 68 }
  };

  constructor() {}

}