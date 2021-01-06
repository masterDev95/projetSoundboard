import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Media } from '@ionic-native/media/ngx';

import { SoundService } from '../sound.service';
import { Sound } from '../sound.model';
import { StringFormatService } from 'src/app/string-format.service';

@Component({
  selector: 'app-sound-list',
  templateUrl: './sound-list.component.html',
  styleUrls: ['./sound-list.component.scss'],
})
export class SoundListComponent implements OnInit {
  public item: Object = {};
  

  constructor(
    private soundService: SoundService,
    private media: Media,
    public stringFormatService: StringFormatService
  ) { }

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

  playSound(sound: Sound) {
    this.media.create(sound.path).play();
  }
}
