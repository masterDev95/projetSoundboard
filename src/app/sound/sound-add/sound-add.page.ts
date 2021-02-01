import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';

import { FileService } from 'src/app/file.service';
import { SoundService } from '../sound.service';

@Component({
  selector: 'app-sound-add',
  templateUrl: './sound-add.page.html',
  styleUrls: ['./sound-add.page.scss'],
})
export class SoundAddPage implements OnInit {
  public addSoundForm: FormGroup;
  private realUri: string;

  constructor(
    private formBuilder: FormBuilder,
    private soundService: SoundService,
    private file: File,
    private fileChooser: FileChooser,
    private fileService: FileService,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.addSoundForm = this.formBuilder.group({
      path: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  pickSound() {
    if (this.platform.is('capacitor')) {
      console.log('------------------------------------------');
      console.log('Choosing file...');
      this.fileChooser.open().then(uri => {
        console.log('Chosen file:', uri);
        this.file.resolveLocalFilesystemUrl(uri).then(entry => {
          console.log('File found:', entry);
          if (this.fileService.entryIsSound(entry)) {
            this.realUri = entry.nativeURL;
            this.addSoundForm.controls['path'].setValue(entry.fullPath.split(':')[1]);
            this.addSoundForm.controls['name'].setValue(entry.name.slice(0, -4));
          }
        });
      });
    } else {
      console.log('Not on capacitor');
    }
  }

  async saveSound() {
    if (this.addSoundForm.valid) {
      this.soundService.addSoundFromFile(
        this.realUri,
        this.addSoundForm.controls['name'].value + '.mp3',
        true
      );
    }
  }
}
