const express = require("express");
const auth = require("./middleware/auth");
const Agora = require("agora-access-token");
const app = express();
require("dotenv").config();
var multer = require('multer');
var upload = multer();

const port = process.env.PORT || 3000;
// for parsing application/json
app.use(express.json()); 

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// for parsing multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

// End point for RTC token 

app.get("/", (req, res) => {
  res.send("Test API");
});

app.post("/rtctoken", (req, res) => {
  const appID = process.env.appIDSecure;
  const appCertificate = process.env.appCertificateSecure;

  const callerIdInitiate = req.body.CallerId;
  const recieverIdTake = req.body.RecieverId;
  
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

  let channelName = channel.toString();
 
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
  const uid = Math.floor(Math.random() * 100000);
  const role = Agora.RtcRole.PUBLISHER;
  const token = Agora.RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

res.send({ AgoraUid:uid,ChannelName: channelName, AccessToken: token });
});

app.listen(port, () =>
  console.log(`Agora Auth Token Server listening at Port ${port}`)
);
