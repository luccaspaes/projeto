import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {

  private apiUrl = 'https://translation.googleapis.com/language/translate/v2'; // URL da API de tradução
  private apiKey = 'AIzaSyCc3_GgNaJ4j93mrqlqkOeuTU169wmA0tQ'; // Substitua com sua chave gerada no Google Cloud

  constructor(private http: HttpClient) {}

 
  translateText(text: string, targetLang: string): Observable<any> {
    const body = {
      q: text,               // Texto a ser traduzido
      target: targetLang,    // Idioma de destino (ex: 'pt' para português)
      key: this.apiKey       // A chave da API
    };

    return this.http.post<any>(`${this.apiUrl}`, body);
  }
  

  // Função para realizar a tradução com delay
  async translateWithDelay(text: string, targetLang: string, delay: number = 1000): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          const translatedText = await this.translateText(text, targetLang).toPromise();
          resolve(translatedText);
        } catch (error) {
          resolve(text); // Em caso de erro, retorna o texto original
        }
      }, delay);
    });
  }

  // Função para traduzir vários textos em lote
  async bulkTranslate(texts: string[], targetLang: string): Promise<string[]> {
    const concatenatedText = texts.join(' || '); // Junta os textos com um delimitador
    try {
      const translatedConcatenatedText = await this.translateText(concatenatedText, targetLang).toPromise();
      return translatedConcatenatedText.split(' || '); // Divide os textos traduzidos novamente
    } catch (error) {
      console.error('Erro ao traduzir em lote:', error);
      return texts; // Retorna os textos originais caso haja erro
    }
  }
  
    // Função para realizar tradução em batch com o HttpClient (corrigido)
    translateBatch(texts: string[], targetLanguage: string): Observable<any> {
      const requestBody = {
        q: texts,
        target: targetLanguage,
        key: this.apiKey,
      };
  
      // Usando HttpClient para fazer a requisição e retornando o Observable
      return this.http.post<any>(this.apiUrl, requestBody);
    }
  
    // Função para traduzir textos em lotes com espera e processamento de erros
    async translateTextsInBatches(texts: string[], targetLanguage: string) {
      const batchSize = 10;  // Ajuste o tamanho do lote conforme necessário
      const batches = this.chunkArray(texts, batchSize);
      let translatedTexts: string[] = [];
  
      for (let batch of batches) {
        try {
          const result = await this.translateBatch(batch, targetLanguage).toPromise();
          translatedTexts = translatedTexts.concat(result.data.translations.map((t: { translatedText: string }) => t.translatedText));
        } catch (error) {
          console.error('Erro ao traduzir em lote:', error);
          // Você pode tratar o erro aqui, talvez registrar um erro específico
        }
      }
      return translatedTexts;
    }
  
    // Função para dividir os textos em lotes menores
    chunkArray(array: string[], size: number): string[][] {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }
}