import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';  // Import para autenticação
import firebase from 'firebase/compat/app';  // Importa o Firebase
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,  private firestore: AngularFirestore) { }

  // auth.service.ts
async login(email: string, password: string): Promise<string> {
  try {
    const user = await this.afAuth.signInWithEmailAndPassword(email, password);
    if (user && user.user) {
      return user.user.uid;  // Retorna o userId do Firebase
    } else {
      throw new Error('Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;  // Lança o erro para que a função que chamou este método saiba do erro
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

    // Recupera os dados nutricionais de um usuário
    getDataNutricional(userId: string): Observable<any> {
      return this.firestore.collection('users').doc(userId).valueChanges(); // Recupera os dados de um documento específico do usuário
    }


  // Atualiza ou adiciona os dados nutricionais de um usuário
  updateDataNutricional(userId: string, data: any): Promise<void> {
    return this.firestore.collection('users').doc(userId).set(data, { merge: true }); // Usa merge para não sobrescrever os dados existentes
  }

}