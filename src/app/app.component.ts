import { Component } from '@angular/core';
import { TranslateService } from './services/translate.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translateService: TranslateService
  ) {}

  showReceitas() {

  }

  translate(text: string, targetLang: string) {
    this.translateService.translateText(text, targetLang).subscribe(
      (response) => {
        const translatedText = response.data.translations[0].translatedText;
        console.log('Texto traduzido:', translatedText);
      },
      (error) => {
        console.error('Erro ao traduzir o texto:', error);
      }
    );
  }

}
