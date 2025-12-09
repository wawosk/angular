// src/app/list/list.ts
import { Component, OnInit } from '@angular/core';
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

  constructor(private personService: PersonService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.people = this.personService.getAll();
  }

  goAdd() {
    this.router.navigate(['/add']);
  }

  viewDetails(index: number) {
    this.router.navigate(['/details', index]);
  }

  delete(index: number) {
    const ok = confirm('Czy na pewno chcesz usunąć ten wpis?');
    if (!ok) return;
    const success = this.personService.remove(index);
    if (success) {
      this.load();
    } else {
      alert('Błąd podczas usuwania.');
    }
  }
}
