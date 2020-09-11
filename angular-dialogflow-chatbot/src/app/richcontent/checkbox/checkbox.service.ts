import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckboxService {

  private checkboxes: {name: string, value: string}[] = [];
  private checkboxSelectionSubmitted = new Subject<any>();

  constructor() { }

  getCheckboxSelectionSubmittedListener(): Observable<any> {
    return this.checkboxSelectionSubmitted.asObservable();
  }

  setCheckboxOptions(checkboxes: {name: string, value: string}[]): void {
    this.checkboxes = [...checkboxes];
    console.log('Set checkboxes :' + this.checkboxes);
  }

  getCheckboxOptions(): {name: string, value: string}[] {
    console.log('Get checkboxes :' + this.checkboxes);
    return [...this.checkboxes];
  }

  onCheckboxSelectionSubmitted(selections: any): void {
    const checkboxesSelected = selections.checkboxes;
    console.log('Publishing :' + checkboxesSelected);
    this.checkboxSelectionSubmitted.next([...checkboxesSelected]);
  }
}
