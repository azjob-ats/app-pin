import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  input,
  OnInit,
  OnDestroy,
  viewChild,
} from '@angular/core';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
  selector: 'app-lottie-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #container [style.width]="width()" [style.height]="height()"></div>`,
  styles: [':host { display: block; }'],
})
export class LottiePlayerComponent implements OnInit, OnDestroy {
  readonly jsonPath = input.required<string>();
  readonly loop = input(true);
  readonly autoplay = input(true);
  readonly speed = input(1);
  readonly width = input('150px');
  readonly height = input('150px');

  readonly container = viewChild.required<ElementRef>('container');

  private animation!: AnimationItem;

  ngOnInit(): void {
    this.animation = lottie.loadAnimation({
      container: this.container().nativeElement,
      renderer: 'svg',
      loop: this.loop(),
      autoplay: this.autoplay(),
      path: this.jsonPath(),
    });
    this.animation.setSpeed(this.speed());
  }

  ngOnDestroy(): void {
    if (this.animation) {
      this.animation.destroy();
    }
  }
}
