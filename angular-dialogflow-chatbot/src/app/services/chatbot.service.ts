import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  url: string ='http://localhost:3000/sendToDialogflow?message=';

  constructor(private http: HttpClient) {}

  public getBotResponse(userInputMessage: string): any {
    return this.http.post(`http://localhost:3000/sendToDialogflow`, {message: userInputMessage});
  }
}
