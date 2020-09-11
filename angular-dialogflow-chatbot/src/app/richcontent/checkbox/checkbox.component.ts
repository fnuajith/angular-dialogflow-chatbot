import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CheckboxService} from './checkbox.service';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit, OnDestroy, AfterViewInit {

  // Reeference: https://stackoverflow.com/questions/40927167/angular-reactiveforms-producing-an-array-of-checkbox-values

  checkboxGroup: FormGroup;
  submittedValue: any;
  subscription: Subscription;
  container: HTMLElement;

  checkboxes: {name: string, value: string}[];
  /*checkboxes = [{
    name: 'Value 1',
    value: 'value-1'
  }, {
    name: 'Value 2',
    value: 'value-2'
  }, {
    name: 'Value 3',
    value: 'value-3'
  }];*/

  constructor(private fb: FormBuilder, private checkboxService: CheckboxService) { }

  ngOnInit(): void {
    this.checkboxes = this.checkboxService.getCheckboxOptions();
    this.checkboxGroup = this.fb.group({
      checkboxes: this.fb.array(this.checkboxes.map(x => false))
    });

    const checkboxControl = (this.checkboxGroup.controls.checkboxes as FormArray);
    this.subscription = checkboxControl.valueChanges.subscribe(checkbox => {
      checkboxControl.setValue(
        checkboxControl.value.map((value, i) => value ? this.checkboxes[i].value : false),
        { emitEvent: false }
      );
    });
  }

  submit(): void {
    const checkboxControl = (this.checkboxGroup.controls.checkboxes as FormArray);
    const formValue = {
      ...this.checkboxGroup.value,
      checkboxes: checkboxControl.value.filter(value => !!value)
    };
    this.submittedValue = formValue;
    this.checkboxService.onCheckboxSelectionSubmitted(this.submittedValue);
  }

  ngAfterViewInit(): void {
    // Reference https://medium.com/helper-studio/how-to-make-autoscroll-of-chat-when-new-message-adds-in-angular-68dd4e1e8acd
    console.log('ngAfterViewInit...');
    this.container = document.getElementById('msgContainer');
    this.container.scrollTop = this.container.scrollHeight;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
