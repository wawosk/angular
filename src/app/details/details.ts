// src/app/details/details.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../services/person.service';
import { Person } from '../models/person';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class Details implements OnInit {
  person: Person | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPerson();
  }

  loadPerson(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? +idParam : 0;

    if (id > 0) {
      this.isLoading = true;
      this.errorMessage = '';

      this.personService.get(id).subscribe({
        next: (data) => {
          this.person = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.person = null;
          this.isLoading = false;

          if (err.status === 404) {
            this.errorMessage = 'Nie znaleziono osoby o podanym ID.';
          } else if (err.status >= 500) {
            this.errorMessage = 'Wewnętrzny błąd serwera. Nie można załadować danych osoby.';
          } else {
            this.errorMessage = err.message || 'Nie udało się załadować danych osoby.';
          }

          this.cdr.detectChanges();
        }
      });
    } else {
      this.errorMessage = 'Nieprawidłowy identyfikator osoby.';
    }
  }
}
