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

     // Envia a verificação de e-mail quando o usuário acessar esta página
     this.authService.sendEmailVerification().then(() => {
      console.log('E-mail de verificação enviado!');
      
      // Redireciona para a home após alguns segundos
      setTimeout(() => {
        this.navCtrl.navigateRoot('/home');
      }, 3000);  // 3 segundos de espera
    }).catch((error: unknown) => {
      console.error('Erro ao enviar o e-mail de verificação:', error);
    });
  }
}