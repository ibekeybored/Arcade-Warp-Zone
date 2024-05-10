import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  /*currentPlayer: string = 'X';
  cells: string[] = Array(9).fill('');

  cellClicked(index: number) {
    if (!this.cells[index]) {
      this.cells[index] = this.currentPlayer;
      if (this.checkWinner()) {
        alert(this.currentPlayer + ' wins!');
        this.resetGame();
        return;
      }
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  checkWinner(): boolean {
    const winPatterns: number[][] = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let pattern of winPatterns) {
      let [a, b, c] = pattern;
      if (this.cells[a] && this.cells[a] === this.cells[b] && this.cells[a] === this.cells[c]) {
        return true;
      }
    }
    return false;
  }

  resetGame() {
    this.cells = Array(9).fill('');
    this.currentPlayer = 'X';
  }*/

  currentPlayer: string = 'X';
  cells: string[] = Array(9).fill('');
  isPlayerTurn: boolean = true; // Flag to track whether it's the player's turn
  

  cellClicked(index: number) {
    if (!this.cells[index] && this.isPlayerTurn) {
      // If it's the player's turn and the clicked cell is empty
      this.cells[index] = this.currentPlayer;
      if (this.checkWinner()) {
        alert(this.currentPlayer + ' wins!');
        this.resetGame();
        return;
      }
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      this.isPlayerTurn = false; // Switch to CPU's turn
      this.cpuMove(); // Call function to make CPU move
    }
  }

  cpuMove() {
    if (!this.isPlayerTurn) {
      // If it's CPU's turn
      const availableIndices = this.cells
        .map((cell, index) => cell === '' ? index : -1)
        .filter(index => index !== -1);

      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const cellIndex = availableIndices[randomIndex];

      this.cells[cellIndex] = this.currentPlayer;
      if (this.checkWinner()) {
        alert(this.currentPlayer + ' wins!');
        this.resetGame();
        return;
      }
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      this.isPlayerTurn = true; // Switch back to player's turn
    }
  }

  checkWinner(): boolean {
    const winPatterns: number[][] = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (let pattern of winPatterns) {
      let [a, b, c] = pattern;
      if (this.cells[a] && this.cells[a] === this.cells[b] && this.cells[a] === this.cells[c]) {
        return true;
      }
    }
    return false;
  }

  resetGame() {
    this.cells = Array(9).fill('');
    this.currentPlayer = 'X';
    this.isPlayerTurn = true; // Reset to player's turn
  }

}
