import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent {
@Input() nameOfPlayer;
@Input() playerActive:boolean=false;

}
