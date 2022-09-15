const express = require("express");
const auth = require("./middleware/auth");
const Agora = require("agora-access-token");
const app = express();
app.use(express.json());
require("dotenv").config();

const port = process.env.PORT || 3000;

// End point for RTC token 

app.get("/", (req, res) => {
  res.send("Test API");
});

app.post("/rtctoken", (req, res) => {
  const appID = process.env.appIDSecure;
  const appCertificate = process.env.appCertificateSecure;

  const callerIdInitiate = req.query.CallerId;
  const recieverIdTake = req.query.RecieverId;
  
  const callerID = !callerIdInitiate
    ? res.status(500).json({ error: "CallerId is required" })
    : callerIdInitiate;
  const recieverId = !recieverIdTake
    ? res.status(500).json({ error: "RecieverId is required" })
    : recieverIdTake;

  const numArray = callerID + recieverId;
  let arr = [];
  for (let i = 0; i < numArray.length; i++) {
    arr.push(numArray[i]);
  }

  const numArrayRes = arr.sort(function (a, b) {
    return a - b;
  });
  let finalRes = numArrayRes.toString();

  let channel = finalRes.replace(/,/g, "");

  let channelData = channel.toString();

  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const expirationTimestamp = currentTimestamp + expirationTimeInSeconds;
  const token = Agora.RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelData,
    callerID,
    recieverId,
    expirationTimestamp
  );

  res.send({ ChannelName: channelData, AccessToken: token });
});

app.listen(port, () =>
  console.log(`Agora Auth Token Server listening at Port ${port}`)
);
