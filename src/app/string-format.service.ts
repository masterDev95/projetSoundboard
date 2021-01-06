import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringFormatService {

  constructor() { }

  secondsToTime(seconds: number) {
    let min = Math.floor(seconds / 60),
      sec = seconds % 60;
    return `${min < 10 ? 0 : ''}${min}:${sec < 10 ? 0 : ''}${sec}`;
  }
}
