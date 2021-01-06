import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Media } from '@ionic-native/media/ngx';
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
    private media: Media
  ) {
    if (this.platform.is('android')) {
      this.file.listDir(this.file.applicationDirectory, 'public/assets/sounds').then(async dirEntry => {
        for (const entry of dirEntry) {
          if (entry.isFile && entry.name.slice(-4).toLowerCase() === ".mp3") {
            let soundPath = this.file.applicationDirectory + entry.fullPath.slice(1),
              sound = this.media.create(soundPath),
              soundDuration: number;

            sound.play();
            sound.setVolume(0);
            await sound.getCurrentPosition().then(position => {
              soundDuration = sound.getDuration();
            });

            this.soundList.push(
              new Sound(
                entry.name.slice(0, -4),
                Math.floor(soundDuration),
                soundPath
              )
            );
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
