import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationStart } from '@angular/router';
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
  isNavigating = false;  // Variável para bloquear navegações simultâneas

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private authService: AuthService, 
    private alertController: AlertController,
    private afAuth: AngularFireAuth  // Para capturar o redirecionamento
  ) {
    // Ouvir eventos de navegação
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating = true;  // Marca que a navegação está ocorrendo
      }
    });
  }

  ngOnInit() {
    // Ouvir o resultado do redirecionamento, se houver
    this.afAuth.getRedirectResult().then((result) => {
      if (result.user) {
        this.router.navigate(['/home'], { replaceUrl: true });  // Redireciona e substitui a URL
      }
    }).catch((error) => {
      console.error('Erro ao recuperar o redirecionamento:', error);
    });

    // Cria o formulário com as validações
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Função para autenticar o usuário
  async autenticar() {
    if (this.loginForm.valid && !this.isNavigating) {
      try {
        this.isNavigating = true;  // Bloqueia navegações simultâneas
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);  // Chama o método de login do seu AuthService
        if (this.rememberMe) {
          // Armazene a sessão, se necessário (exemplo com LocalStorage ou Firebase)
        }
        this.router.navigate(['/home'], { replaceUrl: true });  // Redireciona para a página inicial
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        this.presentAlert('Erro de autenticação', errorMessage);
      } finally {
        this.isNavigating = false;  // Libera navegação após o processo de login
      }
    } else {
      this.presentAlert('Erro', 'Por favor, preencha todos os campos corretamente.');
    }
  }

  // Função para navegar para a página de reset de senha
  navigateToResetPassword() {
    if (!this.isNavigating) {
      this.router.navigate(['/resetpassword']);
    }
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
      this.isNavigating = true;  // Bloqueia navegações simultâneas
      const result = await this.afAuth.signInWithPopup(provider);
      if (result.user) {
        console.log('Usuário logado com sucesso:', result.user);
        // Verificar se o usuário foi autenticado
        await this.afAuth.currentUser;  // Espera o usuário ser resolvido

        console.log('Redirecionando para a página Home');
        this.router.navigate(['/home'], { replaceUrl: true });  // Use o replaceUrl para evitar manter o login na navegação
      } else {
        console.log('Nenhum usuário encontrado após o login');
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error).message || 'Erro desconhecido';
      console.error('Erro no login com Google', errorMessage);
      this.presentAlert('Erro no login com Google', errorMessage);
    } finally {
      this.isNavigating = false;  // Libera navegação após o processo de login
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