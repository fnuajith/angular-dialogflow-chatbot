import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../models/message';
import { Subscription } from 'rxjs';
import { ChatbotService } from '../services/chatbot.service';
import { CheckboxService } from '../richcontent/checkbox/checkbox.service';
import { RadioService } from '../richcontent/radio/radio.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy {

  public message: Message;
  public messages: Message[];
  getCheckboxInput = false;
  getRadioInput = false;
  checkboxSelectionSubscription: Subscription;
  radioSelectionSubscription: Subscription;

  constructor(
    private chatbotService: ChatbotService,
    private checkboxService: CheckboxService,
    private radioService: RadioService) { }

  ngOnInit(): void {
    this.messages = [];
    const welcomeMessage: Message = new Message('Hi there!', 'assets/images/bot.png', new Date());
    this.messages.push(welcomeMessage);

    this.message = new Message('', 'assets/images/user.png', new Date());

    this.getCheckboxInput = false;
    this.getRadioInput = false;

    this.checkboxSelectionSubscription = this.checkboxService.getCheckboxSelectionSubmittedListener()
      .subscribe((checkboxesSelected: any) => {
        console.log('Checkboxes selected by user :' + checkboxesSelected);
        this.getCheckboxInput = false; // Hide checkbox
        this.message = new Message(
          'TEMPORARILY DISPLAYING MY SELECTIONS BEFORE SENDING TO BOT: ' + checkboxesSelected,
          'assets/images/user.png',
          new Date());
        this.sendMessage(); // Send selections to the bot
      });

    this.radioSelectionSubscription = this.radioService.getRadioSelectionSubmittedListener()
      .subscribe((radioSelected: any) => {
        console.log('Radio option selected by user :' + radioSelected);
        this.getRadioInput = false; // Hide checkbox
        this.message = new Message('TEMPORARILY DISPLAYING MY SELECTIONS BEFORE SENDING TO BOT: ' + radioSelected,
        'assets/images/user.png',
        new Date());
        this.sendMessage(); // Send selections to the bot
      });
  }

  sendMessage(): void{
    this.message.timestamp = new Date();
    this.messages.push(this.message);

    const tempMessage = this.message.content.slice();
    console.log('Sending to bot :' + tempMessage);
    this.chatbotService.getBotResponse(this.message.content).subscribe(response => {
      console.log('Bot response :' + response.data);
      const responseMessage: Message = new Message(response.data, 'assets/images/bot.png', new Date());
      this.messages.push(responseMessage);

      // Temporarily trigger checkbox based on user input. To be switched to be displayed based on bot response
      if (tempMessage === 'checkbox') {
        // Hardcoded for now
        const checkboxes = [{
          name: 'Checking',
          value: 'chq'
        }, {
          name: 'Savings',
          value: 'svg'
        }, {
          name: 'Credit Card',
          value: 'ccd'
        }];
        this.checkboxService.setCheckboxOptions(checkboxes);
        this.getCheckboxInput = true;
      }

      // Temporarily trigger radio based on user input. To be switched to be displayed based on bot response
      if (tempMessage === 'radio') {
        // Hardcoded for now
        const radioOptions = [{
          name: 'Male',
          value: 'male'
        }, {
          name: 'Female',
          value: 'female'
        }, {
          name: 'Other',
          value: 'other'
        }];
        this.radioService.setRadioOptions(radioOptions);
        this.getRadioInput = true;
      }
    });

    this.message = new Message('', 'assets/images/user.png', new Date());
  }

  ngOnDestroy(): void {
    this.checkboxSelectionSubscription.unsubscribe();
  }

}
