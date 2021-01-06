import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { NativeAudio } from "@ionic-native/native-audio/ngx";
import { Platform } from '@ionic/angular';

import { Sound } from './sound.model';

@Injectable({
  providedIn: "root",
})
export class SoundService {
  public soundList: Sound[] = [];

  constructor(
    private platform: Platform,
    private file: File,
    private nativeAudio: NativeAudio
  ) {
    console.log('lol');
    if (this.platform.is('capacitor')) {
      this.file.listDir(this.file.applicationDirectory, 'public/assets/sounds').then(dirEntry => {
        console.log(dirEntry);
        for (const entry of dirEntry) {
          if (entry.isFile && entry.name.slice(-4).toLowerCase() === '.mp3') {
            let sound: Sound = new Sound(entry.name.slice(0, -4), entry.fullPath.slice(8));
            this.soundList.push(sound);
            this.nativeAudio.preloadSimple(sound.name, sound.path);
          }
        }
      });
    }
  }

  addSound(sound: Sound) {
    this.soundList.push(sound);
  }

  removeSound(soundId: number) {
    for (let i = 0; i < this.soundList.length; i++) {
      const sound = this.soundList[i];
      if (sound.id === soundId) {
        this.soundList.splice(i, 1);
      }
    }
  }
}
