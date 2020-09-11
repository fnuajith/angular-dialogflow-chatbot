import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickreplyComponent } from './quickreply.component';

describe('QuickreplyComponent', () => {
  let component: QuickreplyComponent;
  let fixture: ComponentFixture<QuickreplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickreplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickreplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
