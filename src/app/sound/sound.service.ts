import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Entry, File } from '@ionic-native/file/ngx';
import { Media } from '@ionic-native/media/ngx';
import { AlertController, LoadingController, Platform } from '@ionic/angular';

import { FileService } from '../file.service';
import { Sound } from './sound.model';

@Injectable({
  providedIn: "root",
})
export class SoundService {
  public soundList: Sound[] = [];
  public copied: boolean = null;

  constructor(
    private platform: Platform,
    private file: File,
    private media: Media,
    private fileService: FileService, 
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {
    this.fetchSound();
  }

  fetchSound() {
    if (this.platform.is('android')) {
      // App sounds
      this.fileService.listAppSoundDir().then(async dirEntry => {
        for (const entry of dirEntry) {
          if (this.fileService.entryIsSound(entry)) {
            await this.addSoundFromFile(entry.toURL());
          }
        }
      });

      // User sounds
      this.fileService.listUserSoundDir().then(dirEntry => {
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

  /**
   * Add a sound from a file
   *
   * @param soundURI - URL of the sound
   * @param [fileName] - Output file name
   * @param [newSound] - Is it a new sound ?
   */
  async addSoundFromFile(soundURI: string, fileName?: string, newSound?: boolean) {
    console.log('\n\n-----------------------------------------------------------------');
    console.log('Adding sound from file:', soundURI);

    // CONTROLLERS
    const loading = await this.loadingController.create({
      message: 'Veuillez patientez...'
    });

    const alreadyExistAlert = await this.alertController.create({
      header: 'Erreur',
      message: 'Il y a déjà un fichier du même nom.',
      buttons: ['Ok']
    });

    const copyErrorAlert = await this.alertController.create({
      header: 'Erreur',
      message: 'Il y a eu un problème dans la copie du fichier.',
      buttons: ['Ok']
    });

    loading.present();

    await this.file.resolveLocalFilesystemUrl(soundURI).then(async soundChosen => {
      fileName = fileName || soundChosen.name;

      // PART 1. Check if sound already exist
      console.log('File found:', soundChosen);
      console.log(`Checking if user sound ${fileName} exist...`);

      let exist = await this.fileService.listUserSoundDir().then(async soundDirEntries => {
        for (const soundFile of soundDirEntries) {
          if (fileName === soundFile.name) {
            console.log('❌ File exist, aborting');
            loading.dismiss();

            if (newSound) {
              alreadyExistAlert.present();
            }

            return true;
          }
        }
      });

      if (exist) return;

      console.log('✔ File don\'t exist');

      // PART 2. Copy file to user sound directory
      let path = soundChosen.nativeURL.slice(0, soundURI.length - soundChosen.name.length);
      
      console.log(`Copying: ${path}${soundChosen.name}`);
      console.log(`to: ${this.fileService.userSoundDir}${fileName}...`);

      this.file.resolveDirectoryUrl(this.fileService.userSoundDir).then(dirEntry => {
        soundChosen.copyTo(
          dirEntry,
          fileName,
          copiedFile => {
            loading.dismiss();
            console.log('File successfully copied:', copiedFile);
            this.addSound(copiedFile);
            if (newSound) {
              this.router.navigate(['home']);
            }
          },
          error => {
            loading.dismiss();
            copyErrorAlert.present();
            console.error(error);
          }
        );
      });
    });
  }

  removeSound(soundId: number) {
    let soundName: string;

    for (let i = 0; i < this.soundList.length; i++) {
      const sound = this.soundList[i];
      if (sound.id === soundId) {
        this.soundList.splice(i, 1);
        soundName = sound.name;
      }
    }

    this.fileService.listUserSoundDir().then(dirEntry => {
      for (const entry of dirEntry) {
        if (entry.name.slice(0, -4) === soundName) {
          entry.remove(
            () => {
              console.log(entry.name, 'successfully removed !');
            },
            console.error
          );
        }
      }
    })
  }
}
