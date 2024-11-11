import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';  // Certifique-se de importar corretamente
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user: any = {};  // Inicialize o objeto 'user'
  email: string = '';
  password: string = '';
  loginForm!: FormGroup;
  rememberMe: boolean = false;
  isNavigating = false;  // Variável para bloquear navegações simultâneas

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private authService: AuthService, 
    private alertController: AlertController,
    private afAuth: AngularFireAuth
  ) {
    // Ouvir eventos de navegação
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating = true;  // Marca que a navegação está ocorrendo
      }

      if (event instanceof NavigationEnd) {
        // Libera a navegação assim que a navegação terminar
        this.isNavigating = false;
      }
    });
  }

  ngOnInit() {
    this.afAuth.getRedirectResult().then((result) => {
      if (result.user) {
          console.log('Usuário autenticado via redirecionamento:', result.user);
          this.router.navigate(['/home'], { replaceUrl: true });
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

  async autenticar() {
    if (this.loginForm.valid && !this.isNavigating) {
      try {
        this.isNavigating = true;  // Bloqueia navegações simultâneas
        const { email, password } = this.loginForm.value;
  
        // Definir persistência de sessão
        if (this.rememberMe) {
          await this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        } else {
          await this.afAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        }
  
        // Realiza o login
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        if (user) {
          console.log('Login realizado com sucesso:', user);
  
          // Realiza o redirecionamento para a página Home após o login
          this.router.navigate(['/home'], { replaceUrl: true });
        }
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

  // Navegação para a página de redefinir senha
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

  // Método de login social com Google
  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
  }
}