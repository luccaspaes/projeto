import { Component } from '@angular/core';
import { TranslateService } from './services/translate.service';
import { TranslatePipe } from './pipes/translate.pipe';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from './services/auth.service'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translateService: TranslateService, private alertController: AlertController, private navCtrl: NavController, private authService: AuthService,  private router: Router
  ) {
  }

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

  async confirmSignOut() {
    const alert = await this.alertController.create({
      header: 'Confirmação',
      message: 'Deseja sair do aplicativo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sair',
          handler: async () => {
            try {
              await this.authService.logout(); // Método do serviço AuthService
              console.log('Usuário saiu do aplicativo');
              this.navCtrl.navigateRoot('/login'); // Redireciona para a página de login
            } catch (error) {
              console.error('Erro ao fazer logout:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }
}
