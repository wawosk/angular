// src/app/services/person.service.ts
import { Injectable } from '@angular/core';
import { Person } from '../models/person';

const STORAGE_KEY = 'persons_v1';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private storageKey = STORAGE_KEY;

  constructor() {}

  private readStorage(): Person[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }
    try {
      const arr = JSON.parse(raw) as Person[];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  private writeStorage(items: Person[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  getAll(): Person[] {
    return this.readStorage();
  }

  get(index: number): Person | null {
    const all = this.readStorage();
    if (index < 0 || index >= all.length) return null;
    return all[index];
  }

  add(person: Person): void {
    const all = this.readStorage();
    all.push(person);
    this.writeStorage(all);
  }

  remove(index: number): boolean {
    const all = this.readStorage();
    if (index < 0 || index >= all.length) return false;
    all.splice(index, 1);
    this.writeStorage(all);
    return true;
  }

  // pomocniczo: nadpisz wszystkie (użyteczne do testów)
  setAll(items: Person[]): void {
    this.writeStorage(items);
  }
}
