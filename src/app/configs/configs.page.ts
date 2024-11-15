import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-configs',
  templateUrl: './configs.page.html',
  styleUrls: ['./configs.page.scss'],
})
export class ConfigsPage implements OnInit {
  isDarkMode: boolean;
  notificationsEnabled = true; // Estado inicial das notificações

  constructor(private alertController: AlertController) {
    // Verificar se o tema escuro já está ativado
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('darkMode');
    this.isDarkMode = storedTheme ? storedTheme === 'true' : prefersDark;

    // Aplicar o tema ao carregar a página
    document.body.classList.toggle('dark', this.isDarkMode);
   }

  ngOnInit() {
  }

   // Alternar tema
   toggleTheme(event: any) {
    this.isDarkMode = event.detail.checked;
    document.body.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }

  // Alterar idioma
  changeLanguage(event: any) {
    const selectedLanguage = event.detail.value;
    console.log(`Idioma selecionado: ${selectedLanguage}`);
    // Adicione aqui a lógica para salvar a preferência e alterar o idioma
  }

  // Ativar/Desativar notificações
  toggleNotifications(event: any) {
    this.notificationsEnabled = event.detail.checked;
    console.log(`Notificações: ${this.notificationsEnabled ? 'Ativadas' : 'Desativadas'}`);
    // Adicione lógica para salvar a preferência ou integrar com serviços de notificação
  }

  // Exibir informações sobre o aplicativo
  async showAbout() {
    const alert = await this.alertController.create({
      header: 'Sobre',
      message: `
        <p>Versão: 1.0.0</p>
        <p>Desenvolvido por: Sua Equipe</p>
        <p>Contato: contato@seuapp.com</p>
      `,
      buttons: ['Fechar'],
    });
    await alert.present();
  }

}
