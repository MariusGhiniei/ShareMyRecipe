import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostModelComponent } from './post-model.component';

describe('PostModelComponent', () => {
  let component: PostModelComponent;
  let fixture: ComponentFixture<PostModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
