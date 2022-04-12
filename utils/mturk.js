const {
  MTurkClient,
  CreateHITTypeCommand,
  CreateHITWithHITTypeCommand,
} = require("@aws-sdk/client-mturk");

const AWSConfig = {
  credentials: {
    accessKeyId: process.env.MTURK_ACCESS_KEY,
    secretAccessKey: process.env.MTURK_SECRET_KEY,
  },
  region: process.env.MTURK_REGION,
  endpoint: process.env.MTURK_ENDPOINT,
};

// a client can be shared by different commands.
const client = new MTurkClient(AWSConfig);

const HITTypeData = {
  AssignmentDurationInSeconds: 300,
  Description:
    "Help us collect data about companies by verifying the identity of this company's founder.",
  Keywords:
    "identification, simple, quick, company, founder, linkedin, crunchbase",
  Reward: "0.01",
  Title: `Is This Founder Who They Say They Are? | ${new Date()
    .toISOString()
    .slice(0, 10)}`,
};

const createQuestion = ({
  linkedInName,
  linkedInImg,
  crunchbaseName,
  crunchbaseSlug,
}) => `
  <HTMLQuestion xmlns="http://mechanicalturk.amazonaws.com/AWSMechanicalTurkDataSchemas/2011-11-11/HTMLQuestion.xsd">
  <HTMLContent><![CDATA[
  <!DOCTYPE html>
  <html>
  <head>
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'/>
    <script type='text/javascript' src='https://s3.amazonaws.com/mturk-public/externalHIT_v1.js'></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css">
  </head>
  <body>
    <form name='mturk_form' method='post' id='mturk_form' action='https://www.mturk.com/mturk/externalSubmit'>
    <input type='hidden' value='' name='assignmentId' id='assignmentId'/>
    <h1>Is this person, ${linkedInName}, the founder of ${crunchbaseName}?</h1>
    <img src=${linkedInImg} style="width:120px;" />
    <h3>We're looking to verify whether the person above (${linkedInName}) is the founder of the company at the following link:</h3>
    <p><b>The company: </b><a target="_blank" href=https://www.crunchbase.com/organization/${crunchbaseSlug}>${crunchbaseName}</a><p>
    <p>Using LinkedIn, news articles, or some other reputable source, please determine whether this person is a founder of this company. </p>
    <input type="radio" id="yes" name="identity" value="yes">
    <label for="yes">Yes</label>
    <input type="radio" id="no" name="identity" value="no">
    <label for="no">No</label>
    <input type="text" id="proof" name="proof" placeholder="Link to proof:" required>
    <p><input type='submit' id='submitButton' value='Submit' /></p></form>
    <script language='Javascript'>turkSetAssignmentID();</script>
  </body>
  </html>
  ]]>
  </HTMLContent>
  <FrameHeight>450</FrameHeight>
  </HTMLQuestion>
`;

const createHITData = (HITTypeId, founderData) => {
  return {
    HITTypeId,
    LifetimeInSeconds: 172800,
    // TODO: change in testing
    MaxAssignments: process.env.NODE_ENV === 'development' ? 1 : 3,
    Question: createQuestion(founderData),
    RequesterAnnotation: `${founderData.linkedInSlug}|${founderData.crunchbaseSlug}`,
  };
};

async function createHITs(verificationObjects) {
  try {
    const createHITType = new CreateHITTypeCommand(HITTypeData);
    const { HITTypeId } = await client.send(createHITType);
    const createHITCmds = verificationObjects.map(
      (obj) => new CreateHITWithHITTypeCommand(createHITData(HITTypeId, obj))
    );
    const responses = await Promise.allSettled(
      createHITCmds.map((cmd) => client.send(cmd))
    );
    return responses;
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = {
  createHITs
}

// Testing
// createHITs([{
//   linkedInName: "Fake Person 2",
//   linkedInImg: "https://ichef.bbci.co.uk/news/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg",
//   crunchbaseName: "Fake Startup",
//   crunchbaseSlug: "shadow-1"
// }])
