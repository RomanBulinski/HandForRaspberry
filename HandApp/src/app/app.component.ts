import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {filter, map, withLatestFrom} from 'rxjs/operators';
import {Router} from '@angular/router';
import {HandGesture} from './hand-gesture.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('video') video: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('home') homeLink: ElementRef<HTMLAnchorElement>;
  @ViewChild('about') aboutLink: ElementRef<HTMLAnchorElement>;

  opened$ = this._recognizer.swipe$.pipe(
    filter((value) => value === 'left' || value === 'right'),
    map((value) => value === 'right')
  );

  selection$ = this._recognizer.gesture$.pipe(
    filter((value) => value === 'one' || value === 'two'),
    map((value) => (value === 'one' ? 'home' : 'about'))
  );

  // tslint:disable-next-line:variable-name
  constructor(private _recognizer: HandGesture, private _router: Router) {
    // @ts-ignore
    this._recognizer.gesture$
      .pipe(
        filter((value) => value === 'ok'),
        withLatestFrom(this.selection$)
      )
      .subscribe(([_, page]) => this._router.navigateByUrl(page));
  }

  get stream(): MediaStream {
    return this._recognizer.stream;
  }

  ngAfterViewInit(): void {
    this._recognizer.initialize(
      this.canvas.nativeElement,
      this.video.nativeElement
    );
  }
}
