import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(private navCtrl: NavController, private fb: FormBuilder) {}

  ngOnInit() {
    // Definir as validações para os campos de e-mail e senha
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // E-mail obrigatório e deve ser válido
      password: ['', [Validators.required, Validators.minLength(6)]], // Senha obrigatória e com no mínimo 6 caracteres
    });
  }

  // Função para efetuar o login
  login() {
    if (this.loginForm.valid) {
      console.log('Email:', this.loginForm.value.email, 'Senha:', this.loginForm.value.password);
      // Aqui você pode adicionar sua lógica de autenticação
      // Exemplo: chamar um serviço de autenticação
      this.navCtrl.navigateForward('/home'); // Navegação após o login bem-sucedido
    } else {
      console.log('Por favor, preencha todos os campos corretamente.');
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