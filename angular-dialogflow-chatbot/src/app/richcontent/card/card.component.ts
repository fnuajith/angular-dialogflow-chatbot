import { Component, OnInit, Input } from '@angular/core';
import { ResponseData } from '../../models/responseData';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() cardData: ResponseData;

  constructor() { }

  ngOnInit(): void {
  }

}
