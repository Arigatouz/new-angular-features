import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ResourceSnapshotDemo } from './resource-snapshot';

describe('ResourceSnapshotDemo', () => {
  let component: ResourceSnapshotDemo;
  let fixture: ComponentFixture<ResourceSnapshotDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceSnapshotDemo],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourceSnapshotDemo);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setLocal() moves the resource to local status with a local value', () => {
    // `.set()` overwrites the value and flips the resource into `local` status synchronously.
    (component as unknown as { setLocal(): void }).setLocal();
    const snap = (component as unknown as { userRes: { snapshot(): { status: string; value?: { name: string } } } }).userRes.snapshot();
    expect(snap.status).toBe('local');
    expect(snap.value?.name).toContain('local');
  });

  it('setIdle() clears the request so the resource reports idle', () => {
    (component as unknown as { setIdle(): void }).setIdle();
    const snap = (component as unknown as { userRes: { snapshot(): { status: string } } }).userRes.snapshot();
    expect(snap.status).toBe('idle');
  });
});
