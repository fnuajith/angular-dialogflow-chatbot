import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { ChatbotService } from '../services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  public message: Message;
  public messages: Message[];

  constructor(private chatbotService: ChatbotService) { }

  ngOnInit(): void {
    const welcomeMessage: Message = new Message('Hi there!', 'assets/images/bot.png', new Date());

    this.message = new Message('', 'assets/images/user.png', new Date());
    this.messages = [];

    this.messages.push(welcomeMessage);
  }

  sendMessage(): void{
    this.message.timestamp = new Date();
    this.messages.push(this.message);

    this.chatbotService.getBotResponse(this.message.content).subscribe(response => {
      console.log('RESPONSE :' + response.data);
      const responseMessage: Message = new Message(response.data, 'assets/images/bot.png', new Date());
      this.messages.push(responseMessage);
    });

    this.message = new Message('', 'assets/images/user.png', new Date());
  }

}
