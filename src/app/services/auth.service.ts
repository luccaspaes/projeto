import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Import para autenticação
import firebase from 'firebase/compat/app';  // Importa o Firebase
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore, private router: Router) { }

  // auth.service.ts
  async login(email: string, password: string): Promise<string> {
    try {
      const user = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (user && user.user) {
        return user.user.uid;  // Retorna o userId do Firebase
      } else {
        throw new Error('Usuário não encontrado');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro no login:', error.message);
        throw new Error(error.message); // Lança o erro com a mensagem correta
      } else {
        console.error('Erro desconhecido no login');
        throw new Error("Ocorreu um erro desconhecido ao tentar fazer login.");
      }
    }
  }

  // Método para definir a persistência de login
  async setAuthPersistence(rememberMe: boolean): Promise<void> {
    const persistenceType = rememberMe ? 'local' : 'session';
    await this.afAuth.setPersistence(persistenceType);
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

  // Recupera os dados nutricionais de um usuário
  getDataNutricional(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).valueChanges(); // Recupera os dados de um documento específico do usuário
  }

  // Atualiza ou adiciona os dados nutricionais de um usuário
  updateDataNutricional(userId: string, data: any): Promise<void> {
    return this.firestore.collection('users').doc(userId).set(data, { merge: true }); // Usa merge para não sobrescrever os dados existentes
  }

  // Método para resetar senha usando AngularFireAuth
  resetPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  async loginWithGoogle(): Promise<void> {
    try {
      // Realiza o login com o Google
      await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

      // Realiza a navegação apenas uma vez após o login
      this.router.navigate(['/home']);
    } catch (error: unknown) {
      console.error('Erro ao fazer login com Google', error);
    }
  }

  

  // Verifica se o usuário está autenticado
  get user() {
    return this.afAuth.authState;
  }
}