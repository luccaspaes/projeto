import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { sendPasswordResetEmail } from 'firebase/auth';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage implements OnInit {
  email: string = '';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    console.log("Página de redefinir senha carregada");
  }

  async resetPassword() {
    try {
      await this.authService.resetPassword(this.email);
      alert("E-mail de redefinição de senha enviado.");
    } catch (error) {
      console.error("Erro ao redefinir senha: ", error);
    }
  }

}
