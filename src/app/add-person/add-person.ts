// src/app/add-person/add-person.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Person } from '../models/person';
import { PersonService } from '../services/person.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-person',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-person.html',
  styleUrls: ['./add-person.css']
})
export class AddPerson {
  person: Person = { address: {} };
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private personService: PersonService, private router: Router) {}

  save() {
    // Resetowanie komunikatu błędu
    this.errorMessage = '';
    this.isLoading = true;

    // walidacja minimalna
    if (!this.person.firstName?.trim() && !this.person.familyName?.trim()) {
      this.errorMessage = 'Podaj przynajmniej imię lub nazwisko.';
      this.isLoading = false;
      return;
    }

    // walidacja wieku
    if (this.person.age !== undefined && this.person.age !== null) {
      const n = Number(this.person.age);
      if (isNaN(n)) {
        this.errorMessage = 'Wiek musi być liczbą.';
        this.isLoading = false;
        return;
      }
      if (n < 0 || n > 110) {
        this.errorMessage = 'Wiek musi być w zakresie 0-110 lat.';
        this.isLoading = false;
        return;
      }
      this.person.age = n;
    }

    this.personService.add(this.person).subscribe({
      next: () => {
        this.isLoading = false;
        // po dodaniu przekierowujemy na listę
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Błąd podczas dodawania osoby:', error);

        // Wyświetlenie odpowiedniego komunikatu w zależności od błędu
        if (error.status === 400) {
          this.errorMessage = error.message || 'Nieprawidłowe dane: ' + (error.details || '');
        } else if (error.status === 409) {
          this.errorMessage = 'Konflikt danych: ' + (error.details || '');
        } else if (error.status >= 500) {
          this.errorMessage = 'Wewnętrzny błąd serwera. Spróbuj ponownie później.';
        } else {
          this.errorMessage = error.message || 'Nie udało się dodać osoby. Spróbuj ponownie.';
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
