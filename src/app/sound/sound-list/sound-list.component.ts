import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { NativeAudio } from "@ionic-native/native-audio/ngx";
import { File } from '@ionic-native/file/ngx';

import { SoundService } from '../sound.service';

@Component({
  selector: 'app-sound-list',
  templateUrl: './sound-list.component.html',
  styleUrls: ['./sound-list.component.scss'],
})
export class SoundListComponent implements OnInit {
  public item: Object = {};
  

  constructor(
    private soundService: SoundService,
    private nativeAudio: NativeAudio,
    private file: File
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

  playSound(soundId: number) {
    for (const sound of this.soundService.soundList) {
      if (sound.id === soundId) {
        console.log(sound.name);
        this.nativeAudio.play(sound.name);
      }
    }
  }
}
