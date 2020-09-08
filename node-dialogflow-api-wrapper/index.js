const express = require("express");
const dialogflow = require("dialogflow");
const app = express();
const port = 3000;

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
