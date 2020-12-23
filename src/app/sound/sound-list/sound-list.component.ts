import { Component, OnInit } from '@angular/core';

import { SoundService } from '../sound.service';

@Component({
  selector: 'app-sound-list',
  templateUrl: './sound-list.component.html',
  styleUrls: ['./sound-list.component.scss'],
})
export class SoundListComponent implements OnInit {

  constructor(private soundService: SoundService) { }

  ngOnInit() {}

  get sounds() {
    return this.soundService.soundList;
  }

}
