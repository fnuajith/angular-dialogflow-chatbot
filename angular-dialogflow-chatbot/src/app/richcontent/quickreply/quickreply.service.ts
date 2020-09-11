import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuickreplyService {

  private quickReplyOptions: {name: string}[] = [];
  private quickReplySelected = new Subject<any>();

  constructor() { }

  getQuickReplySelectionSubmittedListener(): Observable<any> {
    return this.quickReplySelected.asObservable();
  }

  setQuickReplyOptions(quickReplyOptions: {name: string}[]): void {
    this.quickReplyOptions = [...quickReplyOptions];
    console.log('Set quick reply options :' + this.quickReplyOptions);
  }

  getQuickReplyOptions(): {name: string}[] {
    console.log('Get quick reply options :' + this.quickReplyOptions);
    return [...this.quickReplyOptions];
  }

  onQuickReplySelection(selection: any): void {
    console.log('Publishing selection :' + selection);
    this.quickReplySelected.next(selection.slice());
  }
}
