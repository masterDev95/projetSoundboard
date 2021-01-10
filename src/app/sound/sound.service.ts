import { Injectable } from '@angular/core';
import { Entry, File } from '@ionic-native/file/ngx';
import { Media } from '@ionic-native/media/ngx';
import { Platform } from '@ionic/angular';

import { FileService } from '../file.service';
import { Sound } from './sound.model';

@Injectable({
  providedIn: "root",
})
export class SoundService {
  public soundList: Sound[] = [];

  constructor(
    private platform: Platform,
    private file: File,
    private media: Media,
    private fileService: FileService
  ) {
    this.fetchSound();
  }

  fetchSound() {
    if (this.platform.is('android')) {
      // App sounds
      this.fileService.listAppSoundDir().then(dirEntry => {
        for (const entry of dirEntry) {
          if (this.fileService.entryIsSound(entry)) {
            this.addSoundFromFile(entry.toURL());
          }
        }
      });

      // User sounds
      this.fileService.listUserSoundDir().then(async dirEntry => {
        for (const entry of dirEntry) {
          if (this.fileService.entryIsSound(entry)) {
            this.addSound(entry)
          }
        }
      });
    }
  }

  async addSound(file: Entry) {
    let soundPath = this.file.externalDataDirectory + file.name,
      sound = this.media.create(soundPath),
      soundDuration: number;
    
    sound.play();
    sound.setVolume(0);
    
    await sound.getCurrentPosition().then(position => {
      soundDuration = sound.getDuration();
    });

    this.soundList.push(
      new Sound(file.name.slice(0, -4), Math.floor(soundDuration), soundPath)
    );
  }

  async addSoundFromFile(soundPath: string) {
    return await this.file.resolveLocalFilesystemUrl(soundPath).then(async soundChosen => {
      // If sound already exist
      let soundExist = await this.fileService.listUserSoundDir().then(async soundDirEntries => {
        for (const soundFile of soundDirEntries) {
          if (soundChosen.name === soundFile.name) {
            return true;
          }
        }
      });

      if (soundExist) return false;

      let path = soundPath.slice(0, soundPath.length - soundChosen.name.length);

      // Copy file to user sound directory
      return this.file
        .copyFile(
          path,
          soundChosen.name,
          this.file.externalDataDirectory,
          soundChosen.name
        )
        .then(async (copiedFile) => {
          this.addSound(copiedFile);
          return true;
        });
    });
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
