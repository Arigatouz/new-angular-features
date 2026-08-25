import { Injectable, Service } from '@angular/core';

@Service({
  autoProvided:false
})
export class CounterTwo {
  constructor() {
    console.log('CounterTwo created');
  }
}
