import { Injectable } from '@angular/core';
import { Entry, File } from "@ionic-native/file/ngx";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private file: File) { }

  /**
   * List files and directory from the app sound directory.
   *
   * @returns {Promise<Entry[]>} Returns a Promise that resolves to an array of Entry objects or rejects with an error.
   */
  listAppSoundDir() {
    return this.file.listDir(this.file.applicationDirectory, 'public/assets/sounds').then(dirEntry => {
      return dirEntry;
    });
  }

  /**
   * List files and directory from the user sound directory.
   *
   * @returns {Promise<Entry[]>} Returns a Promise that resolves to an array of Entry objects or rejects with an error.
   */
  listUserSoundDir() {
    return this.file.listDir(this.file.externalDataDirectory, '').then(dirEntry => {
      return dirEntry;
    });
  }

  /**
   * Entry is a sound.
   */
  entryIsSound(entry: Entry) {
    return entry.isFile && entry.name.slice(-4).toLowerCase() === ".mp3";
  }
}
