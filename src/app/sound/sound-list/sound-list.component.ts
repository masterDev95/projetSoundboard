import { Component, OnInit } from '@angular/core';
import { AlertController, IonItem, IonItemSliding } from '@ionic/angular';
import { Media } from '@ionic-native/media/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { SoundService } from '../sound.service';
import { Sound } from '../sound.model';
import { StringFormatService } from 'src/app/string-format.service';

@Component({
  selector: 'app-sound-list',
  templateUrl: './sound-list.component.html',
  styleUrls: ['./sound-list.component.scss'],
})
export class SoundListComponent implements OnInit {
  public item: Object = {};
  

  constructor(
    private soundService: SoundService,
    private media: Media,
    private alertController: AlertController,
    private socialSharing: SocialSharing,
    public stringFormatService: StringFormatService
  ) { }

  ngOnInit() {}

  get sounds() {
    return this.soundService.soundList;
  }

  async deleteSound(soundId: number, itemIndex: number, slider: IonItemSliding) {
    let item = document.querySelector(`ion-col[id="item${itemIndex}"]`),
      attr = item.getAttribute('class'),
      soundName: string;

    for (const sound of this.sounds) {
      if (soundId === sound.id) {
        soundName = sound.name;
      }
    }

    const deleteConfirmAlert = await this.alertController.create({
      header: 'Confirm!',
      message: `Êtes-vous sur de vouloir supprimer ${soundName} ?`,
      buttons: [
        {
          text: 'Non',
          role: 'cancel'
        }, {
          text: 'Oui',
          handler: () => {
            slider.close();
            item.setAttribute('class', attr + ' remove');

            setTimeout(() => {
              this.soundService.removeSound(soundId);
            }, 650);
          }
        }
      ]
    });

    deleteConfirmAlert.present();
  }

  playSound(sound: Sound) {
    this.media.create(sound.path).play();
  }

  shareSound(soundPath: string, slider: IonItemSliding) {
    this.socialSharing.share(
      '',
      '',
      soundPath
    );

    slider.close();
  }
}
