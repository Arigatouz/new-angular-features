import { Component, signal } from '@angular/core';
import { FactoryServiceExample } from './components/factory-service-example/factory-service-example';
import { NormalServiceExample } from './components/normal-service-example/normal-service-example';
import { FactoryServiceDestructingExample } from './components/factory-service-destructing-example/factory-service-destructing-example';

export type ServiceDecoratorType = 'factory' | 'normal' | 'destructuring';

@Component({
  selector: 'app-service-decorator-container',
  imports: [FactoryServiceExample, NormalServiceExample, FactoryServiceDestructingExample],
  templateUrl: './service-decorator-container.html',
  styleUrl: './service-decorator-container.css',
})
export class ServiceDecoratorContainer {
  selectedTab = signal<ServiceDecoratorType>('factory');

  selectTab(tab: ServiceDecoratorType) {
    this.selectedTab.set(tab);
  }
}
