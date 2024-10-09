import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Swiper } from 'swiper';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  swiper: Swiper | null = null; // Inicializa como null

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    this.inicializarSwiper();
  }

  continuar() {
    this.navCtrl.navigateForward('/proxima-pagina');
  }

  inicializarSwiper() {
    this.swiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
}