import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  url: string ='http://localhost:3000/sendToDialogflow?message=';

  constructor(private http: HttpClient) {}

  public getBotResponse(message: string): any {
    return this.http.get(`http://localhost:3000/sendToDialogflow?message=${message}`);
    // Hardcoded bot response - placeholder till we create the service
    //const hardCodedResponseMessage: string = `I'm still being built!`;
    //return of(hardCodedResponseMessage);
  }
}
