import { Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Message } from '../models/message';
import { Subscription } from 'rxjs';
import { ChatbotService } from '../services/chatbot.service';
import { CheckboxService } from '../richcontent/checkbox/checkbox.service';
import { RadioService } from '../richcontent/radio/radio.service';
import { QuickreplyService } from '../richcontent/quickreply/quickreply.service';
import { ContentChange } from 'ngx-quill';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, OnDestroy, AfterViewChecked {

  messageList: string[] = [];
  richText: string;

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'link'], // toggled buttons
      ['blockquote', 'code-block'],
      [{header: 1 }, {header: 2 }], // custom button values
      [{list: 'ordered'}, {list: 'bullet' }],
      [{script: 'sub'}, {script: 'super' }], // superscript/subscript
      [{indent: '-1'}, {indent: '+1' }], // outdent/indent
      [{size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{header: [1, 2, 3, 4, 5, 6, false] }],
      [{color: [] }, {background: [] }], // dropdown with defaults from theme
      [{font: [] }],
      [{align: [] }],
      ['clean'] // remove formatting button
    ]
  };

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

  onContentChange(event: ContentChange): void {
    console.log('editor-change', event);
  }

  onAddToList(): void {
    if (this.richText && this.richText !== '') {
      this.messageList.push(this.richText.slice());
    }
    this.richText = '';
  }

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
          content: checkboxesSelected,
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
          content: radioSelected,
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
          content: quickReplySelected,
          avatar: 'assets/images/user.png',
          timestamp: new Date()
        };
        this.sendMessage(); // Send selections to the bot
      });
  }

  sendMessage(): void{
    this.message.timestamp = new Date();
    if (this.imagePreview && this.imagePreview !== '') {
      this.message.imageSrc = this.imagePreview.slice();
    }
    this.messages.push(this.message);
    this.imagePreview = '';

    this.chatbotService.getBotResponse(this.message.content).subscribe(response => {
      console.log('Bot response :' + response);
      const responseType = response.responseType;
      const responseMessage: Message = {
        content: '',
        avatar: 'assets/images/bot.png',
        timestamp: new Date()
      };
      switch (responseType) {
        case 'text':
          responseMessage.content = response.responseData.content;
          break;
        case 'text-with-image':
          responseMessage.content = response.responseData.content;
          responseMessage.imageSrc = response.responseData.imageSourceLink;
          responseMessage.imageLink = response.responseData.imageRedirectLink;
          break;
        case 'checkbox':
          responseMessage.content = response.responseData.content;
          this.checkboxService.setCheckboxOptions(response.responseData.options);
          this.getCheckboxInput = true;
          break;
        case 'radio':
          responseMessage.content = response.responseData.content;
          this.radioService.setRadioOptions(response.responseData.options);
          this.getRadioInput = true;
          break;
        case 'quickreply':
          responseMessage.content = response.responseData.content;
          this.quickreplyService.setQuickReplyOptions(response.responseData.options);
          this.getQuickReplyInput = true;
          break;
        default:
          responseMessage.content = 'Unknown response type received as response. Contact support!!';
          break;
      }
      this.messages.push(responseMessage);
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
