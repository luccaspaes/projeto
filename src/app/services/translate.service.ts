import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  // URL da API de tradução
  private apiUrl = 'https://translation.googleapis.com/language/translate/v2';
  // Sua chave de API
  private apiKey = 'AIzaSyCc3_GgNaJ4j93mrqlqkOeuTU169wmA0tQ'; // Substitua pela sua chave gerada no Google Cloud

  constructor(private http: HttpClient) {}

  // Método para traduzir o texto
  translateText(text: string, targetLang: string): Observable<any> {
    // Enviando a requisição para a API
    const params = new HttpParams()
      .set('q', text)           // Texto a ser traduzido
      .set('target', targetLang) // Idioma de destino (ex: 'pt' para português)
      .set('key', this.apiKey);  // Sua chave de API

    return this.http.post<any>(this.apiUrl, {}, { params });
  }

  
  translateWithDelay(text: string, targetLang: string, delayTime: number = 1000): Observable<string> {
    return of(null).pipe(
      delay(delayTime),
      switchMap(() => 
        this.translateText(text, targetLang).pipe(
          switchMap((response: any) => of(response.data.translations[0].translatedText))
        )
      )
    );
  }




}