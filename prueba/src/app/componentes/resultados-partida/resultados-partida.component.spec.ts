import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadosPartidaComponent } from './resultados-partida.component';

describe('ResultadosPartidaComponent', () => {
  let component: ResultadosPartidaComponent;
  let fixture: ComponentFixture<ResultadosPartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultadosPartidaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultadosPartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
