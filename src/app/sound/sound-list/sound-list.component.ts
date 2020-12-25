import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';

import { SoundService } from '../sound.service';

@Component({
  selector: 'app-sound-list',
  templateUrl: './sound-list.component.html',
  styleUrls: ['./sound-list.component.scss'],
})
export class SoundListComponent implements OnInit {
  public item: Object = {};
  

  constructor(private soundService: SoundService) { }

  ngOnInit() {}

  get sounds() {
    return this.soundService.soundList;
  }

  deleteSound(soundId: number, itemIndex: number, slider: IonItemSliding) {
    let item = document.querySelector(`ion-col[id="item${itemIndex}"]`);
    let attr = item.getAttribute('class');

    slider.close();
    item.setAttribute('class', attr + ' remove');

    setTimeout(() => {
      this.soundService.removeSound(soundId);
    }, 650);
  }
}
