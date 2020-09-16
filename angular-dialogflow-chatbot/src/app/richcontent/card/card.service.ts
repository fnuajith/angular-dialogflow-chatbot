import { Injectable } from '@angular/core';
import { ResponseData } from '../../models/responseData';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private cards: ResponseData[] = [];

  constructor() { }

  setCards(cards: ResponseData[]): void {
    this.cards = [...cards];
  }

  getCards(): ResponseData[] {
    return [...this.cards];
  }
}
