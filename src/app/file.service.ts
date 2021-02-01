import { Injectable } from '@angular/core';
import { Entry, File } from "@ionic-native/file/ngx";

export enum filePermissions {
  writeExt = 'WRITE_EXTERNAL_STORAGE',
  readExt = 'REAL_EXTERNAL_STORAGE'
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private appSoundBasePath = this.file.applicationDirectory;
  private appSoundPath = 'public/assets/sounds/';
  private userSoundBasePath = this.file.externalDataDirectory;
  private userSoundPath = '';

  public mediaContentType = 'media/mpeg';

  constructor(private file: File) { }

  get appSoundDir() {
    return this.appSoundBasePath + this.appSoundPath;
  }

  get userSoundDir() {
    return this.userSoundBasePath + this.userSoundPath;
  }

  /**
   * List files and directory from the app sound directory.
   *
   * @returns {Promise<Entry[]>} Returns a Promise that resolves to an array of Entry objects or rejects with an error.
   */
  listAppSoundDir() {
    return this.file.listDir(this.appSoundBasePath, this.appSoundPath).then(dirEntry => {
      return dirEntry;
    });
  }

  /**
   * List files and directory from the user sound directory.
   *
   * @returns {Promise<Entry[]>} Returns a Promise that resolves to an array of Entry objects or rejects with an error.
   */
  listUserSoundDir() {
    return this.file.listDir(this.userSoundBasePath, this.userSoundPath).then(dirEntry => {
      return dirEntry;
    });
  }

  /**
   * Check if entry is a sound.
   */
  entryIsSound(entry: Entry) {
    return entry.isFile && entry.name.slice(-4).toLowerCase() === ".mp3";
  }
}
