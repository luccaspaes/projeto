import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';  // Variável para o email
  password: string = '';  // Variável para a senha

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  // Função para efetuar o login
  login() {
    if (this.email && this.password) {
      console.log('Email:', this.email, 'Senha:', this.password);
      // Aqui você pode adicionar sua lógica de autenticação
      // Exemplo: chamar um serviço de autenticação
    } else {
      console.log('Por favor, preencha todos os campos.');
    }
  }

  // Função para navegar para a página de recuperação de senha
  forgotPassword() {
    this.navCtrl.navigateForward('/forgot-password');
  }

  // Função para navegar para a página de registro
  register() {
    this.navCtrl.navigateForward('/register');
  }
}
