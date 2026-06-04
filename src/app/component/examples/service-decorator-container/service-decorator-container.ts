import { Component, inject, signal } from '@angular/core';
import { FactoryServiceExample } from './components/factory-service-example/factory-service-example';
import { NormalServiceExample } from './components/normal-service-example/normal-service-example';
import { FactoryServiceDestructingExample } from './components/factory-service-destructing-example/factory-service-destructing-example';
import {  DEFAULT_THEME } from '../../../service/theme';
import { CounterTwo } from '../../../service/countertwo';

export type ServiceDecoratorType = 'factory' | 'normal' | 'destructuring';

@Component({
  selector: 'app-service-decorator-container',
  imports: [FactoryServiceExample, NormalServiceExample, FactoryServiceDestructingExample],
  templateUrl: './service-decorator-container.html',
  styleUrl: './service-decorator-container.css',
  providers:[  CounterTwo]
})
export class ServiceDecoratorContainer {
  selectedTab = signal<ServiceDecoratorType>('factory');
  // themeToken = inject(DEFAULT_THEME)
  // zeo = inject(CounterTwo)
  selectTab(tab: ServiceDecoratorType) {
    this.selectedTab.set(tab);
    // this.themeToken.toggle();
    // console.log(this.themeToken.theme());
    // console.log(this.themeToken.number())
  }
}
