import { Component, inject } from '@angular/core';
import { FactoryService } from '../../services/factory-service';

@Component({
  selector: 'app-factory-service-example',
  imports: [],
  templateUrl: './factory-service-example.html',
  styleUrl: './factory-service-example.css',
})
export class FactoryServiceExample {
  readonly service = inject(FactoryService);
}
