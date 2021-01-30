import { Injectable } from '@angular/core';
import { Entry, File } from '@ionic-native/file/ngx';
import { Media } from '@ionic-native/media/ngx';
import { LoadingController, Platform } from '@ionic/angular';

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
    private fileService: FileService, 
    private loadingController: LoadingController
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

  async addSoundFromFile(soundURI: string, name?: string) {
    console.log('-----------------------------------------------------------------');
    console.log('Adding sound from file:', soundURI);

    const loading = await this.loadingController.create({
      message: 'Veuillez patientez...'
    });
    loading.present();

    return await this.file.resolveLocalFilesystemUrl(soundURI).then(async soundChosen => {
      let newName = name ? name + '.mp3' : soundChosen.name;

      // Check if sound already exist
      console.log('File found:', soundChosen);
      console.log(`Checking if user sound ${newName} exist...`);

      let soundExist = await this.fileService.listUserSoundDir().then(async soundDirEntries => {
        for (const soundFile of soundDirEntries) {
          if (newName === soundFile.name) {
            return true;
          }
        }
      });

      if (soundExist) {
        loading.dismiss();
        console.log('❌ File exist, aborting');
        return false;
      }

      console.log('✔ File don\'t exist');

      // Copy file to user sound directory
      let path = soundChosen.nativeURL.slice(0, soundURI.length - soundChosen.name.length);
      
      console.log(`Copying: ${path}${soundChosen.name}`);

      await this.file.resolveDirectoryUrl(this.fileService.userSoundDir).then(async dirEntry => {
        console.log(`to: ${path}${newName}...`);
        let fileToCopy: string;

        // console.log('Creating binary file...');
        // await this.file.readAsBinaryString(path, soundChosen.name).then(
        //   bin => fileToCopy = bin
        // );
        // console.log('Binary file created:', fileToCopy);

        // console.log('Writing file...');
        // await this.file.writeFile(this.fileService.userSoundDir, newName, fileToCopy).then(
        //   copiedFile => {
        //     console.log('File successfully copied:', copiedFile);
        //     this.addSound(copiedFile);
        //   }, err => console.error(err)
        // );

        this.file.copyFile(
          path,
          soundChosen.name,
          dirEntry.nativeURL,
          newName
        ).then(copiedFile => {
          console.log('File successfully copied:', copiedFile);
          this.addSound(copiedFile);
        }).catch(console.error);

        loading.dismiss();

        //#region 
        // soundChosen.copyTo(
        //   dirEntry,
        //   newName,
        //   copiedFile => {
        //     loading.dismiss();
        //     console.log('File successfully copied:', copiedFile);
        //     this.addSound(copiedFile);
        //     this.copyFinished = true;
        //   },
        //   error => {
        //     loading.dismiss();
        //     console.error(error);
        //     this.copyFinished = false;
        //   }
        // );
        //#endregion
      });

      return true;
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
