import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),  // Pega o estado do usuário apenas uma vez
      map(user => !!user),  // Retorna true se o usuário estiver logado, caso contrário, false
      tap(loggedIn => {
        if (!loggedIn) {
          console.log('Acesso negado - Redirecionando para a página de login');
          this.router.navigate(['/login']);  // Redireciona para o login
        }
      })
    );
  }
}