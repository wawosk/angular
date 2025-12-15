// src/app/details/details.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../services/person.service';
import { Person } from '../models/person';
import { Subscription } from 'rxjs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {RouterModule } from '@angular/router';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule,MatCardModule,
    MatListModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule, RouterModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class Details implements OnInit, OnDestroy {
  person: Person | null = null;
  paramSub?: Subscription;
  idIndex: number | null = null;

  constructor(private route: ActivatedRoute, private personService: PersonService) {}

  ngOnInit(): void {
    // subskrybujemy zmiany parametrów ścieżki
    this.paramSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.idIndex = id !== null ? parseInt(id, 10) : null;
      if (this.idIndex === null || isNaN(this.idIndex)) {
        this.person = null;
      } else {
        this.person = this.personService.get(this.idIndex);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
  }
}
