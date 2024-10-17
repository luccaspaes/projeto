import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-sucesso',
  templateUrl: './sucesso.page.html',
  styleUrls: ['./sucesso.page.scss'],
})
export class SucessoPage implements OnInit {

  constructor( private navCtrl: NavController, private authService: AuthService) { }

  ngOnInit() {

      // Enviar e-mail de verificação
      this.sendVerificationEmail();
  }

  // Função para enviar o e-mail de verificação
  async sendVerificationEmail() {
    try {
      await this.authService.sendVerificationEmail();
      console.log('E-mail de verificação enviado');
      
      // Redireciona para a página inicial do aplicativo após 3 segundos
      setTimeout(() => {
        this.navCtrl.navigateRoot('/home');  // Ou para qualquer página do seu app
      }, 3000);  // 3 segundos
    } catch (error) {
      console.error('Erro ao enviar o e-mail de verificação:', error);
    }
  }

}
