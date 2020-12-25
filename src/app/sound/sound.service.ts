import { Injectable } from '@angular/core';

import { Sound } from './sound.model';

@Injectable({
  providedIn: "root",
})
export class SoundService {
  public soundList: Sound[] = [
    new Sound("Cyka", "6:66"),
    new Sound("Tripaloski", '3:25')
  ];

  constructor() {}

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
