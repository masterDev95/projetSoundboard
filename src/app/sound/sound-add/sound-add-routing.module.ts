import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoundAddPage } from './sound-add.page';

const routes: Routes = [
  {
    path: '',
    component: SoundAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoundAddPageRoutingModule {}
