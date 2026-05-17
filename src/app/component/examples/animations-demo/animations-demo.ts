import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface AnimationExample {
  name: string;
  className: string;
  description: string;
}

@Component({
  selector: 'app-animations-demo',
  imports: [],
  templateUrl: './animations-demo.html',
  styleUrl: './animations-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimationsDemo {
  readonly activeAnimation = signal('animate__bounce');
  readonly isAnimating = signal(false);

  readonly showFadeElement = signal(true);
  readonly showZoomElement = signal(true);
  readonly showSlideElement = signal(true);
  readonly showFlipElement = signal(true);
  readonly showBounceElement = signal(true);
  readonly showRotateElement = signal(true);
  readonly showElasticElement = signal(true);

  readonly animations: AnimationExample[] = [
    { name: 'Bounce', className: 'animate__bounce', description: 'Classic bounce effect' },
    { name: 'Pulse', className: 'animate__pulse', description: 'Pulsing heartbeat' },
    { name: 'Rubber Band', className: 'animate__rubberBand', description: 'Stretch and snap' },
    { name: 'Shake', className: 'animate__shakeX', description: 'Horizontal shake' },
    { name: 'Swing', className: 'animate__swing', description: 'Pendulum swing' },
    { name: 'Tada', className: 'animate__tada', description: 'Attention seeker' },
    { name: 'Wobble', className: 'animate__wobble', description: 'Unsteady wobble' },
    { name: 'Jello', className: 'animate__jello', description: 'Jello wiggle' },
    { name: 'Heart Beat', className: 'animate__heartBeat', description: 'Double thump' },
    { name: 'Flip', className: 'animate__flip', description: '3D flip' },
  ];

  triggerAnimation(className: string): void {
    this.isAnimating.set(false);
    this.activeAnimation.set(className);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.isAnimating.set(true);
      });
    });
  }

  toggleElement(which: 'fade' | 'zoom' | 'slide' | 'flip' | 'bounce' | 'rotate' | 'elastic'): void {
    switch (which) {
      case 'fade':
        this.showFadeElement.update((v) => !v);
        break;
      case 'zoom':
        this.showZoomElement.update((v) => !v);
        break;
      case 'slide':
        this.showSlideElement.update((v) => !v);
        break;
      case 'flip':
        this.showFlipElement.update((v) => !v);
        break;
      case 'bounce':
        this.showBounceElement.update((v) => !v);
        break;
      case 'rotate':
        this.showRotateElement.update((v) => !v);
        break;
      case 'elastic':
        this.showElasticElement.update((v) => !v);
        break;
    }
  }
}
