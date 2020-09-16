import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Message } from '../../models/message';
import { ResponseData } from '../../models/responseData';
import { CardService } from '../card/card.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit, AfterViewInit {

  @Input() message: Message;
  showCards = false;
  cards: ResponseData[];

  container: HTMLElement;

  constructor(public cardService: CardService) { }

  ngOnInit(): void {
    this.showCards = false;
    this.cards = [];
    if (this.message && this.message.content === 'show-card-response') {
      this.showCards = true;
      this.cards = this.cardService.getCards();
    }
  }

  onImageClick(link: string): void {
    window.open(link);
  }

  ngAfterViewInit(): void {
    // Reference https://medium.com/helper-studio/how-to-make-autoscroll-of-chat-when-new-message-adds-in-angular-68dd4e1e8acd
    console.log('ngAfterViewInit...');
    this.container = document.getElementById('msgContainer');
    this.container.scrollTop = this.container.scrollHeight;
  }

}
