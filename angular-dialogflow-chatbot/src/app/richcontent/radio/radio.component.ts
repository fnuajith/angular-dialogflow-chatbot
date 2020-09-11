import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RadioService } from './radio.service';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit, AfterViewInit {

  // Reference https://coryrylan.com/blog/creating-dynamic-radio-lists-with-angular-forms

  radioGroup: FormGroup;
  submittedValue: any;
  subscription: Subscription;
  container: HTMLElement;

  radioOptions: {name: string, value: string}[];

  constructor(private fb: FormBuilder, private radioService: RadioService) { }

  ngOnInit(): void {
    this.radioGroup = this.fb.group({
      radioOptions: ['']
    });

    this.radioOptions = this.radioService.getRadioOptions();
    // this.radioGroup.controls.radioOptions.patchValue(this.radioOptions[0].value); //For selecting first option by default
  }

  submit(): void {
    this.submittedValue = this.radioGroup.value;
    this.radioService.onRadioSelectionSubmitted(this.submittedValue);
  }

  ngAfterViewInit(): void {
    // Reference https://medium.com/helper-studio/how-to-make-autoscroll-of-chat-when-new-message-adds-in-angular-68dd4e1e8acd
    console.log('ngAfterViewInit...');
    this.container = document.getElementById('msgContainer');
    this.container.scrollTop = this.container.scrollHeight;
  }

}
