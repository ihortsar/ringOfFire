import { Component, inject } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';
import { GameComponent } from '../game/game.component';



@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  private gameComponent: GameComponent;
  constructor(private router: Router) {

  }
  game
  firestore: Firestore = inject(Firestore);


  async newGame() {
    this.game = new Game()
    await addDoc(this.getReferenceForCollection(),
      this.game.toJson()
    )
      .then((gameInfo: any) => {
        console.log(gameInfo);
        this.router.navigateByUrl('/game/' + gameInfo.id)
      })

  }

  getReferenceForCollection() {
    return collection(this.firestore, 'games')
  }

}
