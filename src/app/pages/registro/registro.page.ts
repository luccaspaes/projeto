import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  registroForm!: FormGroup; // FormGroup garantido com '!', será inicializado depois

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder // Injeta o FormBuilder
  ) {}

  ngOnInit() {
    // Inicialização do FormGroup com um campo 'nome'
    this.registroForm = this.fb.group({
      nome: ['', [Validators.required]], // Validação: campo 'nome' obrigatório
    });
  }

  continuar() {
    if (this.registroForm.valid) {
      this.navCtrl.navigateForward('/email'); // Navega para a próxima página se válido
    } else {
      console.log('Formulário inválido');
    }
  }
}