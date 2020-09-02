# angular-dialogflow-chatbot

The idea here is to create a simple Dialogflow agent and create an Angular application that interacts with the agent through APIs.

There is an offering already available, [Dialogflow Web Demo](https://cloud.google.com/dialogflow/es/docs/integrations/web-demo), that can be leveraged to integrate the Dialogflow chatbot directly into your web application. With this implementation, you directly render the chatbot within an iframe in your application. This also means that you do not get to customize the branding or look and feel of the chatbot. Another limitation is that this integration only supports text responses.

Implementing an application that interacts with the Dialogflow agent through APIs opens up ways where you can overcome the limitations of the Web Demo offering. We can build the bot with our own branding standards and also support rich content.

## Creating a small talk Dialogflow agent

Navigate to the dialogflow console and [create a new Agent](https://dialogflow.cloud.google.com/#/newAgent)
![New-agent](/docs/images/New-agent.JPG)

Enable small talk by navigating to the small talk menu option on the left navigation menu
![New-agent](/docs/images/Enable-smalltalk.JPG)

Open the chatbot settings and click on project name
![New-agent](/docs/images/Enable-Dialogflow-APIs-1.JPG)

Navigate to APIs and Services

Click on Enable APIs and Services
![New-agent](/docs/images/Enable-Dialogflow-APIs-4.JPG)

Search for Dialogflow in the API library and click on the Dialogflow API
![New-agent](/docs/images/Enable-Dialogflow-APIs-5.JPG)

Click Enable
![New-agent](/docs/images/Enable-Dialogflow-APIs-6.JPG)

Let us now get the service account credentials file

Go back to your dialogflow console and click on Service Account
![New-agent](/docs/images/Service-account-1.JPG)

Choose 'Create Key' by clicking on the vertical ellipsis
![New-agent](/docs/images/Service-account-2.JPG)

Choose key type as JSON and click create
![New-agent](/docs/images/Service-account-3.JPG)

A JSON file gets downloaded to your machine. Preserve this file. This is our credentials file, and we will need this to connect with the Dialogflow APIs

## Creating an angular project
Open command prompt and navigate to the folder where you wish to create the application

Create a new Angular project
```
ng new angular-dialogflow-chatbot
```

Select 'y' when prompted if you want to add Routing into the application
Select 'SCSS' when prompted to select styling

Navigate into the project
```
cd angular-dialogflow-chatbot
```

Also open the code in the editor
Note: If you are using Visual Studio Code, simply type ```code.``` in the command prompt window.

Check if the boiler plate app works fine
```
ng serve
```
Once the code gets compiled, the below message should get printed on the command prompt
```
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
: Compiled successfully.
```
Open a browser window and type the URL ```http://localhost:4200/```. You should now be able to see the boilerplate angular app running.

We use bootstrap for styling in this application. Run the below command to add ng-bootstrap library into the project. 
```
ng add @ng-bootstrap/ng-bootstrap
```
Link for [Reference](https://ng-bootstrap.github.io/#/getting-started#installation).

Add reference to the bootstrap.scss into the "styles" array in 'angular.json' file to import the bootstrap styles into the application
```
"node_modules/bootstrap/scss/bootstrap.scss"
```

Remove the boilerplate code that was generated by default from ```app.component.html```. Only the below line of code should be present in this file
```
<router-outlet></router-outlet>
```

We will also go ahead and add the 'FormsModule' and 'HttpClientModule' into our application. The 'FormsModule' would be required to achieve two way data binding, while we will be using 'HttpClientModule' to make API calls to the Dialogflow chatbot APIs

In the file 'app.module.ts', import the below modules
```
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
```
Add both the modules into the _imports_ array
```
imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ]
```

With this done, we are now ready to jump into implementing this application.

## Build the required components, models and services

Create a new component named 'home'. We will use this as out landing route, and provide a navigation option from here to access the chatbot.
```
ng g c home
```

Create a new component named 'chatbot'.
```
ng g c chatbot
```

Create/Register the home and chat routes in the application by making the below changes to ```app-routing.module.ts``` file.
```
import { HomeComponent } from './home/home.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'chat', component: ChatbotComponent},
];
```

If you now go and refresh the link ```http://localhost:4200/``` you should see a page that says 'home works!', and using the link ```http://localhost:4200/chat ``` should show a page that says 'chatbot works!'

Provide navigation links within the application to navigate between the routes. Update ```app.component.html``` with the options to navigate
```
<header>
    <div class="container">
        <a href="#" class="logo">Chatbot Application</a>
        <nav>
            <ul>
                <li><a href="#" routerLink="/">Home</a></li>
                <li><a href="#" routerLink="/chat">Chatbot</a></li>
            </ul>
        </nav>
    </div>
</header>
<router-outlet></router-outlet>
```

Add the below code into ```home.component.html``` to display a different message when we land on the home screen instead of just 'home works!' 
```
<div class="container">
    <h2>Welcome to the chatbot application!</h2>
    <p>This is a chatbot application created to demostrate the Dialogflow chatbot integration. Use the navigation bar or <span (click) = "goToChat()">Click here</span> to try it out.</p>
</div>
```

Notice that there is a try it out option provided within the home screen content as well, just to demonstrate routing from the '.ts' file. 

Import the angular router into ```home.component.ts``` file...
```
import { Router } from '@angular/router';
```
...and create the 'goToChat()' method that would navigate the application to the '/chat' route
```
  goToChat(): void {
    this.router.navigateByUrl('/chat');
  }
```

Create a 'models' folder under 'src/app' and then create a file by the name 'message.ts' under it. We will use this to create a ```Message``` class that holds the content of the messages being exchanged between the bot and the user.
```
export class Message {
  content: string;
  avatar: string;
  timestamp: Date;

  constructor(content: string, avatar: string, timestamp: Date) {
    this.content = content;
    this.avatar = avatar;
    this.timestamp = timestamp;
  }
}
```

Create a 'services' folder under 'src/app'. 
Navigate to this folder on the command prompt and use the below command to generate a service
```
ng g s chatbot
```

Create a function ```getBotResponse``` that can be used to invoke the Dialogflow API and return response back to the user. We will hardcode a response for now and add the API calls later.
```
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor() { }

  public getBotResponse(message: string): Observable<string> {
    // Hardcoded bot response - placeholder till we create the service
    const hardCodedResponseMessage: string = `I'm still being built!`;
    return of(hardCodedResponseMessage);
  }
}
```

Add the below code into ```chatbot.component.html```. This code provides a basic layout that allows user to enter and send a message. The top section would be used to list the messages being exchanged between the user and the bot.
```
<div class="container">
	<div>
		<ul class="list-group">
			<li class="list-group-item" *ngFor="let message of messages">
				<img [src]="message.avatar" [ngStyle]="{'width': '50px'}">
				<div>
					{{message.content}}
				</div>
				<div>
					<i class="fa fa-clock-o" aria-hidden="true"></i>
					<span>at {{message.timestamp | date : 'dd/MM/yyyy HH:mm' }}</span>
				</div>
			</li>
		</ul>
	</div>
	<form (onsubmit)="sendMessage()">
		<div class="input-group mb-3">
			<input type="text" class="form-control" placeholder="Enter your Message" name="content"
				aria-label="Enter your Message" aria-describedby="Enter your Message" [(ngModel)]="message.content" />
			<div class="input-group-append">
				<button class="btn btn-primary" (click)="sendMessage()" type="submit">Send</button>
			</div>
		</div>
	</form>
</div>
```

Go to ```chatbot.component.ts``` and import the 'Message' model
```
import { Message } from '../models/message';
```
Also import the ```ChatbotService```
```
import { ChatbotService } from '../services/chatbot.service';
```

Add the function ```sendMessage()``` which would invoke the chatbot service function to get the bot response. Below is how the implementation would look like.
```
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
      console.log(response);
      const responseMessage: Message = new Message(response, 'assets/images/bot.png', new Date());
      this.messages.push(responseMessage);
    });

    this.message = new Message('', 'assets/images/user.png', new Date());
  }

}
```

Refresh the link ```http://localhost:4200/```, we now have an interface where we can type and send text and a system that simply responds with a hardcoded message "*I'm still being built!*".

## Creating a API wrapper project to invoke the Dialogflow APIs using NodeJS

Create a new folder 'node-dialogflow-api-wrapper' in your workspace. We will be building an express js API wrapper inside this folder. We will then integrate this API with the angular application to achieve the end-to-end dialogflow integration.


Navigate into the project
```
cd node-dialogflow-api-wrapper
```
Initialize a node project by running the below command
```
npm init
```
Simply hit RETURN to accept the defaults

Install express
```
npm install express --save
```

Install dialogflow client library. This will be used to invoke the Dialogflow APIs [Reference](https://cloud.google.com/dialogflow/es/docs/quick/setup#lib)
```
npm install dialogflow
```

Using the google documentation on how to consume APIs as a [reference](https://cloud.google.com/dialogflow/es/docs/quick/api#detect_intent), the below code has been generated to expose an end point '/sendToDialogflow' that invokes the Dialogflow API and returns the response from Dialogflow API.

Paste the below code into ```index.js``` file
```
const express = require("express");
const dialogflow = require("dialogflow");
const app = express();
const port = 3000;

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();

  app.options("*", (req, res) => {
    // allowed XHR methods
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PATCH, PUT, POST, DELETE, OPTIONS"
    );
    res.send();
  });
});

const projectId = "<your-project-id>"; // projectId: ID of the GCP project where Dialogflow agent is deployed
const sessionId = "654789"; // sessionId: String representing a random number or hashed user identifier
const languageCode = "en"; // languageCode: Indicates the language Dialogflow agent should use to detect intents

// Instantiates a session client
//const sessionClient = new dialogflow.SessionsClient();
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "<path-to-your-service-account-json-key-file>",
});

async function detectIntent(
  projectId,
  sessionId,
  query,
  contexts,
  languageCode
) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode,
      },
    },
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts,
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

app.get("/sendToDialogflow", async (req, res) => {
  try {
    const message = req.query.message;
    console.log(`Sending text: ${message}`);
    let intentResponse = await detectIntent(
      projectId,
      sessionId,
      message,
      [],
      languageCode
    );
    console.log(
      `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
    );
    res
      .status(200)
      .json({ data: `${intentResponse.queryResult.fulfillmentText}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```

You will need to replace '\<your-project-id\>' with your own project id that is linked to the Dialogflow chatbot, and replace '\<path-to-your-service-account-json-key-file\>' with the path to your own service account json key file.

Run this NodeJS/Express wrapper using the below command
```
node index.js
```

You should see the below message
```
Example app listening at http://localhost:3000
```

We can now test this API by simply invoking the wrapper end point that we exposed and we should be able to see a response being sent back from Dialogflow
```
http://localhost:3000/sendToDialogflow?message=Hello
```

We have now successfully created a wrapper API that our angular application will use to talk to the Dialogflow API.

## Integrate the wrapper API into the angular app

Open the ```chatbot.service.ts``` file and replace the content with the below code. The code replaces the hardcoded response we previously had with a call to the wrapper API
```
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  url: string ='http://localhost:3000/sendToDialogflow?message=';

  constructor(private http: HttpClient) {}

  public getBotResponse(message: string): any {
    return this.http.get(`http://localhost:3000/sendToDialogflow?message=${message}`);
  }
}
```

The response text from the API response can be accessed using 'response.data' property. Update the 'sendMessage()' method in 'chatbot.component.ts' to access the text response and push the response to the messages array.
```
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
```

Thats it! We should now have a working small talk chatbot integrated with our Angular application.

Refresh the link ```http://localhost:4200/``` and send messages like 'Hello', 'Good morning', 'How are you' to see the responses from Dialogflow appearing in our angular application.

### TODO: Document the steps within dialogflow to create a chatbot, enable small talk and service account creation steps
