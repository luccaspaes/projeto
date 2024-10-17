import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';  // Importando o Router

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private router: Router,  // Usando Router
    private navCtrl: NavController, 
    private fb: FormBuilder, 
    private authService: AuthService,  
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Definindo o FormGroup com as validações
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Função para autenticar o usuário
  async autenticar() {
    if (this.loginForm.valid) {
      try {
        // Passando os valores do formulário
        await this.authService.login(this.loginForm.value.email, this.loginForm.value.password);

        // Navegando para a página home se o login for bem-sucedido
        this.router.navigate(['/home']);
      } catch (error: unknown) {
        // Tratando o erro e exibindo um alerta
        const errorMessage = (error as Error).message || 'Erro desconhecido';
        this.presentAlert('Erro de autenticação', errorMessage);
      }
    } else {
      this.presentAlert('Erro', 'Por favor, preencha todos os campos corretamente.');
    }
  }

  // Função para exibir alertas
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}