// src/app/list/list.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Person } from '../models/person';
import { PersonService } from '../services/person.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list.html',
  styleUrls: ['./list.css']
})
export class List implements OnInit {
  people: Person[] = [];
  isLoading = false;
  errorMessage: string = '';

  constructor(
    private personService: PersonService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.errorMessage = '';

    this.personService.getAll().subscribe({
      next: (data) => {
        this.people = data;
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('Dane załadowane, liczba osób:', this.people.length);
      },
      error: (error) => {
        console.error('Błąd podczas ładowania osób:', error);

        if (error.status === 404) {
          this.errorMessage = 'Nie znaleziono danych osób.';
        } else if (error.status >= 500) {
          this.errorMessage = 'Wewnętrzny błąd serwera. Nie można załadować listy osób.';
        } else {
          this.errorMessage = error.message || 'Nie udało się załadować listy osób.';
        }

        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goAdd() {
    this.router.navigate(['/add']);
  }

  viewDetails(id?: number) {
    if (id !== undefined) {
      this.router.navigate(['/details', id]);
    }
  }

  delete(id?: number) {
    if (id === undefined) {
      alert('Nie można usunąć osoby bez identyfikatora.');
      return;
    }

    const ok = confirm('Czy na pewno chcesz usunąć ten wpis?');
    if (!ok) return;

    this.personService.remove(id).subscribe({
      next: () => {
        // Po udanym usunięciu odśwież listę
        this.load();
      },
      error: (error) => {
        console.error('Błąd podczas usuwania:', error);

        if (error.status === 404) {
          alert('Nie znaleziono osoby do usunięcia. Może została już usunięta.');
          // Jeśli nie znaleziono osoby, i tak odświeżamy listę
          this.load();
        } else if (error.status === 403) {
          alert('Brak uprawnień do usunięcia osoby.');
        } else if (error.status >= 500) {
          alert('Wewnętrzny błąd serwera podczas usuwania.');
        } else {
          alert('Błąd podczas usuwania osoby: ' + (error.message || 'Nieznany błąd'));
        }
      }
    });
  }
}
