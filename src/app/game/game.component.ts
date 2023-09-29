import { Component, inject } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, addDoc, collection, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  gameId: string

  game: Game;
  name: string;

  firestore: Firestore = inject(Firestore);

  constructor(public dialog: MatDialog, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.newGame()
    this.route.params.subscribe((params) => {
      this.readSingleDocumentFromFirestore(params['id'])
      this.gameId = params['id']
    })
  }

  pickCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true
      this.game.currentPlayer++
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length
      this.updateDocument()
      setTimeout(() => {
        this.game.playedCard.push(this.game.currentCard)
        this.game.pickCardAnimation = false
        this.updateDocument()
      }, 1500);
    }
  }

  newGame() {
    this.game = new Game()
    /*   this.addDocumentToCollection() */
    /*    this.updateDocument(this.game) */

  }



  openDialog(): void {
    console.log('The dialog is open');
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name)
        this.updateDocument()
      }
    });
  }

  //reference to collection
  getReferenceForCollection() {
    return collection(this.firestore, 'games')
  }

  //reference to single document
  getSingleReferenceForDocument(docId) {
    return doc(this.getReferenceForCollection(), docId)
  }


  readGamesFromFirestore() {
    return onSnapshot(this.getReferenceForCollection(), (game) => {
      game.forEach(element => {
        console.log(element.data(), element.id);

      })
    })
  }

  readSingleDocumentFromFirestore(docId) {
    return onSnapshot(this.getSingleReferenceForDocument(docId), (document: any) => {
      {
        this.game.currentPlayer = document.data().currentPlayer;
        this.game.playedCard = document.data().playedCard;
        this.game.players = document.data().players;
        this.game.stack = document.data().stack;
        this.game.currentCard = document.data().currentCard;
        this.game.pickCardAnimation = document.data().pickCardAnimation;
      }
    }
    )
  }


  async addDocumentToCollection() {
    await addDoc(this.getReferenceForCollection(),
      this.game.toJson()
    );
  }


  async updateDocument() {
    await updateDoc(this.getSingleReferenceForDocument(this.gameId), this.game.toJson())
  }
}