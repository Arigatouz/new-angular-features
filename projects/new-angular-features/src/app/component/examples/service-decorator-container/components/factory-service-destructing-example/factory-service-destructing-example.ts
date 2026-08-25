import { Component, inject, injectAsync, signal } from '@angular/core';
import { FactoryService } from '../../services/factory-service';
import { NormalService } from '../../services/normal-service';

export type MessageStatus = { success: boolean; message: string };

@Component({
  selector: 'app-factory-service-destructing-example',
  imports: [],
  templateUrl: './factory-service-destructing-example.html',
  styleUrl: './factory-service-destructing-example.css',
})
export class FactoryServiceDestructingExample {
  readonly factoryService = inject(FactoryService);
  readonly normalService = inject(NormalService);

  readonly factoryStatus = signal<MessageStatus | null>(null);
  readonly normalStatus = signal<MessageStatus | null>(null);

  testFactoryDestructuring() {
    try {
      // ✅ Destructuring works because factory returns a plain object with closures
      const { increment } = this.factoryService;
      increment();
      this.factoryStatus.set({
        success: true,
        message: 'Success! Destructuring just works.',
      });
    } catch (e: any) {
      this.factoryStatus.set({
        success: false,
        message: `Failed: ${e.message}`,
      });
    }
  }

  testNormalDestructuring() {
    try {
      // ❌ Destructuring a class method breaks `this`
      const { increment } = this.normalService;
      increment();
      this.normalStatus.set({
        success: true,
        message: 'Success! (Unexpected)',
      });
    } catch (e: any) {
      this.normalStatus.set({
        success: false,
        message: `Failed: ${e.message}`,
      });
    }
  }
}
