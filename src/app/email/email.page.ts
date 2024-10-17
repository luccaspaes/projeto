import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage implements OnInit {
  emailForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Criando o formulário com validações
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
    }, { validators: this.emailMatcher });  // Validação personalizada para checar os e-mails
  }

  // Validação personalizada para os campos de e-mail
  emailMatcher(group: FormGroup) {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirmEmail')?.value;
    return email && confirmEmail && email === confirmEmail ? null : { emailMismatch: true };
  }

  onSubmit() {
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      console.log('Email submetido:', email);
  
      // Cria o novo usuário com o email, mas sem enviar o e-mail de verificação ainda
      const password = 'defaultPassword'; // Defina ou gere uma senha segura de acordo com a necessidade
      this.authService.createUserWithEmailAndPassword(email, password).then(() => {
        // Navega para a página de senha, passando o e-mail como parâmetro
        this.navCtrl.navigateForward(['/senha'], { queryParams: { email: email } });
      }).catch((error: unknown) => {
        console.error('Erro ao criar o usuário:', error);
      });
    } else {
      console.log('Por favor, preencha todos os campos corretamente.');
    }
  }
}