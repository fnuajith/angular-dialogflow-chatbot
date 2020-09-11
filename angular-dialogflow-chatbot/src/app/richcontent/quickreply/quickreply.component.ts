import { Component, OnInit, AfterViewInit } from '@angular/core';
import { QuickreplyService } from './quickreply.service'

@Component({
  selector: 'app-quickreply',
  templateUrl: './quickreply.component.html',
  styleUrls: ['./quickreply.component.scss'],
})
export class QuickreplyComponent implements OnInit, AfterViewInit {
  replies: {name: string}[];
  selected: string;
  container: HTMLElement;

  constructor(private radioService: QuickreplyService) {}

  ngOnInit(): void {
    this.replies = this.radioService.getQuickReplyOptions();
  }

  changeSelected(e): void {
    console.log(e);
    this.selected = e.source.value;
    this.radioService.onQuickReplySelection(this.selected);
  }

  ngAfterViewInit(): void {
    // Reference https://medium.com/helper-studio/how-to-make-autoscroll-of-chat-when-new-message-adds-in-angular-68dd4e1e8acd
    console.log('ngAfterViewInit...');
    this.container = document.getElementById('msgContainer');
    this.container.scrollTop = this.container.scrollHeight;
  }
}
