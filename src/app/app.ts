import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Random } from './random/random';
import { List } from './list/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, Random, List],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  customMessage: string = 'Witaj w mojej aplikacji Angular!';
}
