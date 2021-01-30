import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';

import { FileService } from 'src/app/file.service';
import { SoundService } from '../sound.service';
import { FilePath } from '@ionic-native/file-path/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

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
    private navController: NavController,
    private file: File,
    private fileChooser: FileChooser,
    private fileService: FileService,
    private platform: Platform,
    private alertController: AlertController,
    private filePath: FilePath,
    private androidPermissions: AndroidPermissions
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
            this.filePath.resolveNativePath(entry.nativeURL).then(path => this.realUri = path);
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

    console.log('J\'ai les permission ?')
    await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
      res => console.log('WRITE_EXTERNAL_STORAGE', res.hasPermission),
      async err => await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        res => console.log('\tEt la ?', res.hasPermission)
      )
    );
    
    await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      res => console.log('READ_EXTERNAL_STORAGE', res.hasPermission),
      async err => await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
        res => console.log('\tEt la ?', res.hasPermission)
      )
    );

    if (this.addSoundForm.valid) {
      let successfullyAdded = await this.soundService.addSoundFromFile(
        this.realUri,
        this.addSoundForm.controls['name'].value
      );

      if (successfullyAdded) {
        this.navController.navigateBack('/home');
      } else {
        let alertErreur = await this.alertController.create({
          header: 'Erreur',
          message: 'Il y a déjà un fichier du même nom',
          buttons: ['Ok']
        });
        alertErreur.present();
      }
    }
  }
}
