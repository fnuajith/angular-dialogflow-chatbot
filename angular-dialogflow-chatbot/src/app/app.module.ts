import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { HomeComponent } from './home/home.component';
import { CheckboxComponent } from './richcontent/checkbox/checkbox.component';
import { RadioComponent } from './richcontent/radio/radio.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MessageComponent } from './richcontent/message/message.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field'
import { QuickreplyComponent } from './richcontent/quickreply/quickreply.component';
import { QuillModule } from 'ngx-quill';
import { MatQuillModule } from './mat-quill/mat-quill-module';
import { CardComponent } from './richcontent/card/card.component'

@NgModule({
  declarations: [
    AppComponent,
    ChatbotComponent,
    HomeComponent,
    CheckboxComponent,
    RadioComponent,
    MessageComponent,
    QuickreplyComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatQuillModule,
    QuillModule.forRoot()
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
