import { Component, inject } from '@angular/core';
import { NormalService } from '../../services/normal-service';

@Component({
  selector: 'app-normal-service-example',
  imports: [],
  templateUrl: './normal-service-example.html',
  styleUrl: './normal-service-example.css',
})
export class NormalServiceExample {
  readonly service = inject(NormalService);
}
