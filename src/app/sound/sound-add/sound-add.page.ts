import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';

import { FileService } from 'src/app/file.service';
import { SoundService } from '../sound.service';
import { FilePath } from '@ionic-native/file-path/ngx';

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
    private platform: Platform,
    private filePath: FilePath
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

      this.fileChooser.open().then(async uri => {
        console.log('Chosen file:', uri);
        this.realUri = uri;

        await this.filePath.resolveNativePath(uri).then(path => {
          this.file.resolveLocalFilesystemUrl(path).then(async entry => {
            console.log('File found:', entry);

            if (this.fileService.entryIsSound(entry)) {
              this.addSoundForm.controls['path'].setValue(entry.fullPath);
              this.addSoundForm.controls['name'].setValue(entry.name.slice(0, -4));
            }
          });
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
