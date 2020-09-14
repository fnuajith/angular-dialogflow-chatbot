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
  imagePreview: string;

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
    const welcomeMessage: Message = {content: 'Hi there!', avatar: 'assets/images/bot.png', timestamp: new Date()};
    this.messages.push(welcomeMessage);

    this.message = {content: '', avatar: 'assets/images/user.png', timestamp: new Date()};

    this.getCheckboxInput = false;
    this.getRadioInput = false;
    this.getQuickReplyInput = false;

    this.checkboxSelectionSubscription = this.checkboxService.getCheckboxSelectionSubmittedListener()
      .subscribe((checkboxesSelected: any) => {
        console.log('Checkboxes selected by user :' + checkboxesSelected);
        this.getCheckboxInput = false; // Hide checkbox
        this.message = {
          content: 'TEMPORARILY DISPLAYING MY SELECTIONS BEFORE SENDING TO BOT: ' + checkboxesSelected,
          avatar: 'assets/images/user.png',
          timestamp: new Date()
        };
        this.sendMessage(); // Send selections to the bot
      });

    this.radioSelectionSubscription = this.radioService.getRadioSelectionSubmittedListener()
      .subscribe((radioSelected: any) => {
        console.log('Radio option selected by user :' + radioSelected);
        this.getRadioInput = false; // Hide Radio
        this.message = {
          content: 'TEMPORARILY DISPLAYING MY SELECTION BEFORE SENDING TO BOT: ' + radioSelected,
          avatar: 'assets/images/user.png',
          timestamp: new Date()
        };
        this.sendMessage(); // Send selections to the bot
      });

    this.quickReplySelectionSubscription = this.quickreplyService.getQuickReplySelectionSubmittedListener()
      .subscribe((quickReplySelected: any) => {
        console.log('Quick Reply selected by user :' + quickReplySelected);
        this.getQuickReplyInput = false; // Hide quickreply
        this.message = {
          content: 'TEMPORARILY DISPLAYING MY SELECTION BEFORE SENDING TO BOT: ' + quickReplySelected,
          avatar: 'assets/images/user.png',
          timestamp: new Date()
        };
        this.sendMessage(); // Send selections to the bot
      });
  }

  sendMessage(): void{
    this.message.timestamp = new Date();
    if (this.imagePreview && this.imagePreview !== '') {
      this.message.imagePath = this.imagePreview.slice();
    }
    this.messages.push(this.message);
    this.imagePreview = '';

    const tempMessage = this.message.content.slice();
    console.log('Sending to bot :' + tempMessage);
    this.chatbotService.getBotResponse(this.message.content).subscribe(response => {
      console.log('Bot response :' + response.data);
      const responseMessage: Message = {content: response.data, avatar: 'assets/images/bot.png', timestamp: new Date()};
      this.messages.push(responseMessage);

      // Temporarily push a message with image path into the array
      if (tempMessage === 'cheer-me-up') {
        const messageWithImage: Message = {
          content: 'This should brighten up your day!',
          avatar: 'assets/images/bot.png',
          imagePath: 'https://homepages.cae.wisc.edu/~ece533/images/tulips.png',
          timestamp: new Date()};
        this.messages.push(messageWithImage);
      }

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

    this.message = {content: '', avatar: 'assets/images/user.png', timestamp: new Date()};
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.checkboxSelectionSubscription.unsubscribe();
    this.radioSelectionSubscription.unsubscribe();
    this.quickReplySelectionSubscription.unsubscribe();
  }

}
