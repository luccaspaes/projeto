import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Import para autenticação
import firebase from 'firebase/compat/app';  // Importa o Firebase
import { from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

    // Método de login com email e senha
  async login(email: string, password: string) {
    try {
      const user = await this.afAuth.signInWithEmailAndPassword(email, password);
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Método de logout
  async logout() {
    return this.afAuth.signOut();
  }

   // Cria o usuário com e-mail e senha
  createUserWithEmailAndPassword(email: string, senha: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, senha);
  }

  // Envia o e-mail de verificação para o usuário logado
  sendEmailVerification() {
    return this.afAuth.currentUser.then(user => {
      if (user) {
        return user.sendEmailVerification();
      } else {
        throw new Error('Usuário não está logado');
      }
    });
  }
}