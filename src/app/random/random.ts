import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RandomService } from '../services/random-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-random',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './random.html',
  styleUrl: './random.css'
})
export class Random implements OnInit {
  @Input() maxValue: number = 10;
  currentRandom: number = 0;
  isBelowHalf: boolean = false;

  constructor(private randomService: RandomService) {}

  ngOnInit(): void {
    this.generateRandom();
  }

  generateRandom(): void {
    this.currentRandom = this.randomService.getRandomNumber(this.maxValue);
    this.isBelowHalf = this.currentRandom <= (0.5 * this.maxValue);
  }

  getColor(): string {
    return this.isBelowHalf ? 'green' : 'red';
  }

  getStatusText(): string {
    const half = 0.5 * this.maxValue;
    if (this.currentRandom <= half) {
      return `Wylosowano: ${this.currentRandom} (≤ ${half}) - Mała liczba`;
    } else {
      return `Wylosowano: ${this.currentRandom} (> ${half}) - Duża liczba`;
    }
  }
}
