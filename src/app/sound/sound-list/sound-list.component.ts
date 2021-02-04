import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, IonItem, IonItemSliding } from '@ionic/angular';
import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { SoundService } from '../sound.service';
import { Sound } from '../sound.model';
import { StringFormatService } from 'src/app/string-format.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sound-list',
  templateUrl: './sound-list.component.html',
  styleUrls: ['./sound-list.component.scss'],
})
export class SoundListComponent implements OnInit {
  private medias: MediaObject[] = [];
  private mediasStatus: MEDIA_STATUS[] = [];

  constructor(
    private soundService: SoundService,
    private media: Media,
    private alertController: AlertController,
    private socialSharing: SocialSharing,
    private changeDetector: ChangeDetectorRef,
    public stringFormatService: StringFormatService
  ) { }

  ngOnInit() { }

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
    if (!this.medias[sound.id]) {
      this.medias[sound.id] = this.media.create(sound.path);
      this.medias[sound.id].onStatusUpdate.subscribe(status => {
        this.mediasStatus[sound.id] = status;
        this.changeDetector.detectChanges();
      });
    }
    this.medias[sound.id].play();
  }

  pauseSound(soundId: number) {
    this.medias[soundId].pause();
  }

  spamSound(soundPath: string) {
    this.media.create(soundPath).play();
  }

  stopSound(soundId: number) {
    this.medias[soundId].stop();
  }

  soundIsPlaying(soundId: number) {
    return this.mediasStatus[soundId] === this.media.MEDIA_RUNNING;
  }

  soundIsNotFinished(soundId: number) {
    return (
      this.mediasStatus[soundId] === this.media.MEDIA_RUNNING ||
      this.mediasStatus[soundId] === this.media.MEDIA_PAUSED
    );
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
