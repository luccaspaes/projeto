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

   // Função para autenticar o usuário com e-mail e senha
   loginWithEmailAndPassword(email: string, password: string) {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  // Enviar e-mail de verificação para o usuário autenticado
  async sendVerificationEmail() {
    try {
      // Utilizando a Promise para garantir que o usuário é retornado
      const user = await this.afAuth.currentUser;  // Obtendo o usuário autenticado

      // Verifique se o usuário está logado
      if (user) {
        await user.sendEmailVerification();  // Enviar o e-mail de verificação
        console.log('E-mail de verificação enviado');
      } else {
        console.log('Usuário não autenticado');
      }
    } catch (error) {
      console.error('Erro ao enviar o e-mail de verificação:', error);
      throw error;  // Re-lança o erro para ser tratado em outro lugar
    }
  }

  // Criar um novo usuário com email e senha
  async createUserWithEmailAndPassword(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log('Usuário criado com sucesso');
      // Aqui, o e-mail de verificação NÃO é enviado ainda, pois será enviado na página de sucesso
      return userCredential;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }
}