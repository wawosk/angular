// src/app/add-person/add-person.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Person } from '../models/person';
import { PersonService } from '../services/person.service';
import { Router } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-add-person',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatIconModule],
  templateUrl: './add-person.html',
  styleUrls: ['./add-person.css']
})
export class AddPerson {
  person: Person = { address: {} };

  constructor(private personService: PersonService, private router: Router) {}

  save() {
    // walidacja minimalna
    if (!this.person.firstName && !this.person.familyName) {
      alert('Podaj przynajmniej imię lub nazwisko.');
      return;
    }
    // jeżeli age nie jest liczbą, spróbuj zamienić
    if (this.person.age !== undefined && this.person.age !== null) {
      const n = Number(this.person.age);
      if (isNaN(n)) {
        alert('Wiek musi być liczbą.');
        return;
      }
      this.person.age = n;
    }
    this.personService.add(this.person);
    // po dodaniu przekierowujemy na listę
    this.router.navigate(['/']);
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
