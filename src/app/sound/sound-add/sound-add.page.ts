import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

import { Sound } from '../sound.model';
import { SoundService } from '../sound.service';

@Component({
  selector: 'app-sound-add',
  templateUrl: './sound-add.page.html',
  styleUrls: ['./sound-add.page.scss'],
})
export class SoundAddPage implements OnInit {
  public addSoundForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private soundService: SoundService,
    private navController: NavController
  ) {
    this.addSoundForm = this.formBuilder.group({
      name: ['', Validators.required],
      duration: ['', Validators.required]
    });
  }

  ngOnInit() {}

  saveSound() {
    if (this.addSoundForm.valid) {
      let newSound: Sound = new Sound(
        this.addSoundForm.value.name,
        this.addSoundForm.value.duration
      );
      this.soundService.addSound(newSound);
      this.navController.navigateBack('/home');
      console.log(this.soundService.soundList);
    }
  }
}
