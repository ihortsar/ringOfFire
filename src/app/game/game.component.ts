import { Component } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  pickCardAnimation = false;
  game!: Game;
  name: string;
  currentCard: string = '';


  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
    this.newGame()
  }

  pickCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();

      this.pickCardAnimation = true

      this.game.currentPlayer++
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length
      setTimeout(() => {
        this.game.playedCard.push(this.currentCard)
        this.pickCardAnimation = false
      }, 1500);
    }
  }

  newGame() {
    this.game = new Game()
    console.log(this.game)
  }

  openDialog(): void {
    console.log('The dialog is open');
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name)
      }
    });
  }
}



