const express = require("express");
const bodyParser = require("body-parser");
const dialogflow = require("dialogflow");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Enable CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
      "Access-Control-Allow-Methods", 
      "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const projectId = "<YOUR-PROJECT-ID>"; // projectId: ID of the GCP project where Dialogflow agent is deployed
const sessionId = "12345678"; // sessionId: String representing a random number or hashed user identifier
const languageCode = "en"; // languageCode: Indicates the language Dialogflow agent should use to detect intents

// Instantiates a session client
//const sessionClient = new dialogflow.SessionsClient();
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "<NAME-OF-THE-KEY-FILE-WITH-PATH>",
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

app.post('/sendToDialogflow', async(req, res) => {
  try {
    const message = req.body.message;
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
    // res.status(200).json({ data: `${intentResponse.queryResult.fulfillmentText}` });
    res.status(200).json(getDummyResponses(message, intentResponse.queryResult.fulfillmentText));
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

getDummyResponses = (userInputMessage, botResponseMessage) => {
  var response;
  if (userInputMessage.includes('text-with-image')) {
    response = {
      responseType: "text-with-image",
      responseData: {
        content: "This should brighten up your day!",
        imageSourceLink: "https://homepages.cae.wisc.edu/~ece533/images/tulips.png",
        imageRedirectLink: "https://homepages.cae.wisc.edu/~ece533/images/tulips.png"
      }
    }
  }
  else if (userInputMessage.includes('checkbox')) {
    response = {
      responseType: "checkbox",
      responseData: {
        content: "Please choose account types from the below options",
        options: [
          { name: 'Checking', value: 'Checking' },
          { name: 'Savings', value: 'Savings' },
          { name: 'Credit Card', value: 'Credit Card'}
        ]
      }
    };
  }
  else if (userInputMessage.includes('radio')) {
    response = {
      responseType: "radio",
      responseData: {
        content: "Please choose a gender",
        options: [
          { name: 'Male', value: 'Male' },
          { name: 'Female', value: 'Female' },
          { name: 'Other', value: 'Other'}
        ]
      }
    };
  }
  else if (userInputMessage.includes('quickreply')) {
    response = {
      responseType: "quickreply",
      responseData: {
        content: "Do you agree?",
        options: [
          { name: "Yes" },
          { name: "No" },
          { name: "Maybe" }
        ]
      }
    }
  }
  else if (userInputMessage.includes('cards')) {
    response = {
      responseType: "cards",
      responseData: [{
        content: "This is our Chefs' speciality. It is sure to tingle your taste buds!",
        imageSourceLink: "https://images.freeimages.com/images/large-previews/45d/pizza-1312224.jpg",
        imageRedirectLink: "http://www.google.com"
      },
      {
        content: "Treat yourself to this all vegetarian delight. Trust us, you will not be disappointed!",
        imageSourceLink: "https://images.freeimages.com/images/large-previews/22e/pizza-1-1326545.jpg",
        imageRedirectLink: "http://www.google.com"
      }]
    }
  }
  else {
    response = {
      responseType: "text",
      responseData: {
        content: botResponseMessage
      }
    };
  }
  return response;
};

// Start the node server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
