import { Injectable } from '@angular/core';

import { ISound, Sound } from './sound.model';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  soundList: Sound[] = [];

  constructor() {}

  addSound(sound: ISound) {
    let newSound: Sound = {
      id: ++Sound.lastId,
      name: sound.name,
      duration: sound.duration
    };
    this.soundList.push(newSound);
  }
}
