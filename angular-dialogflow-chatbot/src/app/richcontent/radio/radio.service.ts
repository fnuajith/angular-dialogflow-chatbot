import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RadioService {

  private radioOptions: {name: string, value: string}[] = [];
  private radioSelectionSubmitted = new Subject<any>();

  constructor() { }

  getRadioSelectionSubmittedListener(): Observable<any> {
    return this.radioSelectionSubmitted.asObservable();
  }

  setRadioOptions(radioOptions: {name: string, value: string}[]): void {
    this.radioOptions = [...radioOptions];
    console.log('Set radio options :' + this.radioOptions);
  }

  getRadioOptions(): {name: string, value: string}[] {
    console.log('Get radio options :' + this.radioOptions);
    return [...this.radioOptions];
  }

  onRadioSelectionSubmitted(selection: any): void {
    console.log('selection :' + selection);
    const radioSelected = selection.radioOptions;
    console.log('Publishing :' + radioSelected);
    this.radioSelectionSubmitted.next(radioSelected.slice());
  }
}
