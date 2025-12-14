// src/app/services/person.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Person } from '../models/person';

const API_URL = 'http://localhost:8080/api/persons';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Person[]> {
    return this.http.get<Person[]>(API_URL).pipe(
      catchError(this.handleError)
    );
  }

  get(id: number): Observable<Person> {
    return this.http.get<Person>(`${API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  add(person: Person): Observable<Person> {
    return this.http.post<Person>(API_URL, person).pipe(
      catchError(this.handleError)
    );
  }

  remove(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/${id}`, { observe: 'response' }).pipe(
      catchError(this.handleError)
    );
  }

  // pomocniczo - już nie potrzebne dla localStorage
  setAll(items: Person[]): void {
    console.warn('setAll nie jest obsługiwane przez API');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Wystąpił nieznany błąd';

    if (error.error instanceof ErrorEvent) {
      // Błąd po stronie klienta
      errorMessage = `Błąd klienta: ${error.error.message}`;
    } else {
      // Błąd po stronie serwera
      switch (error.status) {
        case 400:
          errorMessage = error.error || 'Nieprawidłowe dane';
          break;
        case 404:
          errorMessage = error.error || 'Nie znaleziono zasobu';
          break;
        case 409:
          errorMessage = 'Konflikt danych';
          break;
        case 500:
          errorMessage = error.error || 'Wewnętrzny błąd serwera';
          break;
        default:
          errorMessage = `Błąd serwera: ${error.status} ${error.statusText}`;
      }
    }

    console.error('Błąd HTTP:', errorMessage, error);
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      details: error.error
    }));
  }
}
