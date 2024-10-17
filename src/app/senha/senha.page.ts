import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-senha',
  templateUrl: './senha.page.html',
  styleUrls: ['./senha.page.scss'],
})
export class SenhaPage implements OnInit {
  senhaForm!: FormGroup;
  email!: string;  // Para armazenar o e-mail

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute  // Para acessar os parâmetros
  ) { }

  ngOnInit() {
    // Acessando o email da URL
    this.activatedRoute.queryParams.subscribe(params => {
      this.email = params['email'];  // Recupera o e-mail passado

    });

    // Criando o formulário com validações
    this.senhaForm = this.fb.group({
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmSenha: ['', [Validators.required]],
    }, { validators: this.senhaMatcher });
  }

  // Validação personalizada para verificar se as senhas coincidem
  senhaMatcher(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirmSenha = group.get('confirmSenha')?.value;
    return senha && confirmSenha && senha === confirmSenha ? null : { senhaMismatch: true };
  }

    // Método chamado quando o formulário é submetido
  onSubmit() {
    if (this.senhaForm.valid) {
      const senha = this.senhaForm.value.senha;
      console.log('Senha:', senha);
      console.log('Email:', this.email);  // Verifica se o e-mail foi recuperado corretamente

      // Chama o serviço de criação de usuário com o e-mail e a senha
      this.authService.createUserWithEmailAndPassword(this.email, senha).then(() => {
        console.log('Usuário criado com sucesso! Redirecionando para /sucesso');
        this.navCtrl.navigateForward('/sucesso');
      }).catch((error: unknown) => {
        console.error('Erro ao criar o usuário:', error);
      });
    } else {
      console.log('Formulário inválido');  // Caso o formulário seja inválido
    }
  }
}