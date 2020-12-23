import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoundAddPageRoutingModule } from './sound-add-routing.module';

import { SoundAddPage } from './sound-add.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SoundAddPageRoutingModule
  ],
  declarations: [SoundAddPage]
})
export class SoundAddPageModule {}
