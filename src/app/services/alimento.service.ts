import { Injectable } from '@angular/core';
import { Alimento } from  '../model/alimento';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpoonacularService } from '../services/spoonacular.service';
import { AuthService } from '../services/auth.service';



@Injectable({
    providedIn: 'root',
})


export class AlimentoService {

  private apiKey = '95206646e8b2486eb8f9ddc3199b66d2';
  private apiUrl = 'https://api.spoonacular.com/food/ingredients/autocomplete';



    alimentosAdicionados: Alimento[] = [];
    macronutrientesTotais = { calorias: 0, carboidratos: 0, proteinas: 0, gorduras: 0 };

     // Definição da variável 'nomeAlimento'
  nomeAlimento: string = '';
  alimentos: any[] = [];

    adicionarAlimento(alimento: Alimento) {
        this.alimentosAdicionados.push(alimento);
        this.atualizarMacronutrientes(alimento);
    }

    private atualizarMacronutrientes(alimento: Alimento) {
        const quantidade = alimento.quantidade || 1;
        this.macronutrientesTotais.calorias += alimento.calorias * quantidade;
        this.macronutrientesTotais.carboidratos += alimento.carboidratos * quantidade;
        this.macronutrientesTotais.proteinas += alimento.proteinas * quantidade;
        this.macronutrientesTotais.gorduras += alimento.gorduras * quantidade;
    }

    getMacronutrientesTotais() {
        return this.macronutrientesTotais;
    }

    getAlimentosAdicionados() {
        return this.alimentosAdicionados;
    }


   
  // Método para buscar informações nutricionais de um alimento
  buscarInformacoesNutricionais(nome: string): Observable<any> {
    const url = `${this.apiUrl}?query=${nome}&apiKey=${this.apiKey}`;  // Usando 'nome' como parâmetro
    return this.http.get<any>(url);
  }
    constructor(private SpoonacularService: SpoonacularService, private http: HttpClient) {

    }



}