import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Importe o serviço de autenticação
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  rememberMe: boolean = false;

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private authService: AuthService, 
    private alertController: AlertController,
    private afAuth: AngularFireAuth  // Para capturar o redirecionamento
  ) {}

  ngOnInit() {
    // Ouvir o resultado do redirecionamento, se houver
    this.afAuth.getRedirectResult().then((result) => {
      if (result.user) {
        this.router.navigate(['/home']);
      }
    });

    // Cria o formulário com as validações
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Função para autenticar o usuário
  async autenticar() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);  // Chama o método de login do seu AuthService
        if (this.rememberMe) {
          // Armazene a sessão, se necessário (exemplo com LocalStorage ou Firebase)
        }
        this.router.navigate(['/home']);  // Redireciona para a página inicial
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        this.presentAlert('Erro de autenticação', errorMessage);
      }
    } else {
      this.presentAlert('Erro', 'Por favor, preencha todos os campos corretamente.');
    }
  }

  // Função para navegar para a página de reset de senha
  navigateToResetPassword() {
    this.router.navigate(['/resetpassword']);
  }

  // Função de alerta
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async loginWithFacebook() {
    try {
      await this.authService.loginWithFacebook();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no login com Facebook';
      this.presentAlert('Erro no login com Facebook', errorMessage);
    }
  }
  async loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await this.afAuth.signInWithPopup(provider);
      if (result.user) {
        console.log('Usuário logado com sucesso:', result.user);
        // Usar a verificação assíncrona para garantir que o usuário está autenticado
        const currentUser = await this.afAuth.currentUser;  // Espera o usuário ser resolvido
  
        if (currentUser) {
          console.log('Redirecionando para a página Home');
          this.router.navigate(['/home'], { replaceUrl: true });
        } else {
          console.log('Usuário não autenticado');
        }
      } else {
        console.log('Nenhum usuário encontrado após o login');
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Erro desconhecido';
      console.error('Erro no login com Google', errorMessage);
      this.presentAlert('Erro no login com Google', errorMessage);
    }
  }
  async loginWithTwitter() {
    try {
      await this.authService.loginWithTwitter();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido no login com Twitter';
      this.presentAlert('Erro no login com Twitter', errorMessage);
    }
  }
}