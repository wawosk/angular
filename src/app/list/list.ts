import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.html',
  styleUrl: './list.css'
})
export class List {
  newItem: string = '';
  items: string[] = ['Pierwszy element', 'Drugi element', 'Trzeci element'];

  addItem(): void {
    if (this.newItem.trim()) {
      this.items.push(this.newItem.trim());
      this.newItem = '';
    }
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  onKeyPress(event: any): void {  // ZMIENIONE: z KeyboardEvent na any
    if (event.key === 'Enter') {
      this.addItem();
    }
  }
}
