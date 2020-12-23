import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SoundAddPage } from './sound-add.page';

describe('SoundAddPage', () => {
  let component: SoundAddPage;
  let fixture: ComponentFixture<SoundAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoundAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SoundAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
