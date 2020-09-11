import { Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Message } from '../models/message';
import { Subscription } from 'rxjs';
import { ChatbotService } from '../services/chatbot.service';
import { CheckboxService } from '../richcontent/checkbox/checkbox.service';
import { RadioService } from '../richcontent/radio/radio.service';
import { QuickreplyService } from '../richcontent/quickreply/quickreply.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {

  public message: Message;
  public messages: Message[];
  getCheckboxInput = false;
  getRadioInput = false;
  getQuickReplyInput = false;
  checkboxSelectionSubscription: Subscription;
  radioSelectionSubscription: Subscription;
  quickReplySelectionSubscription: Subscription;

  constructor(
    private chatbotService: ChatbotService,
    private checkboxService: CheckboxService,
    private radioService: RadioService,
    private quickreplyService: QuickreplyService,
    private cdr: ChangeDetectorRef) { }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.messages = [];
    const welcomeMessage: Message = new Message('Hi there!', 'assets/images/bot.png', new Date());
    this.messages.push(welcomeMessage);

    this.message = new Message('', 'assets/images/user.png', new Date());

    this.getCheckboxInput = false;
    this.getRadioInput = false;
    this.getQuickReplyInput = false;

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
        this.getRadioInput = false; // Hide Radio
        this.message = new Message('TEMPORARILY DISPLAYING MY SELECTION BEFORE SENDING TO BOT: ' + radioSelected,
        'assets/images/user.png',
        new Date());
        this.sendMessage(); // Send selections to the bot
      });

    this.quickReplySelectionSubscription = this.quickreplyService.getQuickReplySelectionSubmittedListener()
      .subscribe((quickReplySelected: any) => {
        console.log('Quick Reply selected by user :' + quickReplySelected);
        this.getQuickReplyInput = false; // Hide quickreply
        this.message = new Message('TEMPORARILY DISPLAYING MY SELECTION BEFORE SENDING TO BOT: ' + quickReplySelected,
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
        const checkboxes = [
          { name: 'Checking', value: 'chq' },
          { name: 'Savings', value: 'svg' },
          { name: 'Credit Card', value: 'ccd'}];
        this.checkboxService.setCheckboxOptions(checkboxes);
        this.getCheckboxInput = true;
      }

      // Temporarily trigger radio based on user input. To be switched to be displayed based on bot response
      if (tempMessage === 'radio') {
        // Hardcoded for now
        const radioOptions = [
          { name: 'Male', value: 'male' },
          { name: 'Female', value: 'female' },
          { name: 'Other', value: 'other'}];
        this.radioService.setRadioOptions(radioOptions);
        this.getRadioInput = true;
      }

      // Temporarily trigger quickreply based on user input. To be switched to be displayed based on bot response
      if (tempMessage === 'quickreply') {
        // Hardcoded for now
        const replies = [{ name: 'Yes' }, { name: 'No' }, { name: 'Maybe' }];
        this.quickreplyService.setQuickReplyOptions(replies);
        this.getQuickReplyInput = true;
      }
    });

    this.message = new Message('', 'assets/images/user.png', new Date());
  }

  ngOnDestroy(): void {
    this.checkboxSelectionSubscription.unsubscribe();
    this.radioSelectionSubscription.unsubscribe();
    this.quickReplySelectionSubscription.unsubscribe();
  }

}
