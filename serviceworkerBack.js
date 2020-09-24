 const webpush = require('web-push'); // for notifications

// https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user

// const vapidKeys = { // create keys by command  $ npm install -g web-push $ web-push generate-vapid-keys 
//   publicKey:
//   'BP-HmCF4giJVZkWsxilER7S0_YDijywpvS7Q-1XrXDVQzbmZFzWFlr_MT2-rpO0kBZ_6A8yMDyOaa0gi29wdaMg',
//   privateKey: 'A86Lwz9JfsaWMeo8lQeKbaqnoMjMCoKh5flBj8KckG8'
// };

const options = { // options for webpush 
  //gcmAPIKey: 'NOT IN USE',
  TTL: 60,
  vapidDetails: {
      subject: 'mailto:web-push-book@vit91112@gmail.com',
      publicKey: 'BP-HmCF4giJVZkWsxilER7S0_YDijywpvS7Q-1XrXDVQzbmZFzWFlr_MT2-rpO0kBZ_6A8yMDyOaa0gi29wdaMg',
      privateKey: 'A86Lwz9JfsaWMeo8lQeKbaqnoMjMCoKh5flBj8KckG8'
    },
    contentEncoding: 'aes128gcm'
};

// webpush.setVapidDetails(
//   'mailto:web-push-book@vit91112@gmail.com',
//   vapidKeys.publicKey,
//   vapidKeys.privateKey
// );

const isValidSaveRequest = (req, res) => { // middleware for check subscription request
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint.'
      }
    }));
    return false;
  }
  return true;
};

async function saveSubscriptionToDatabase(subscription) {
  try{
    const id = await Subscriptions.create({subscription: JSON.stringify(subscription), fkUserId: 1})
    return id
  }catch(e){
    console.log({e})
  }
};

async function getSubscriptionsFromDatabase() {
  try{
    const subscriptions = await Subscriptions.findAll()
    return subscriptions
  }catch(e){
    console.log({e})
  }
}

const triggerPushMsg = function(subscription, dataToSend) {
  return webpush.sendNotification(JSON.parse(subscription), 'success', options) // send notification on front
  .catch((err) => {
    console.log({err})
    // if (err.statusCode === 404 || err.statusCode === 410) {
    //   console.log('Subscription has expired or is no longer valid: ', err);
    //   return deleteSubscriptionFromDatabase(subscription._id);
    // } else {
    //   throw err;
    // }
  });
};
 
 
 signNotification: async (req, res) => { // add subscriptions to db
    try{
     if(!isValidSaveRequest(req, res)) return;

      console.log(req.body)

      return saveSubscriptionToDatabase(req.body)
      .then(function(subscriptionId) {
        res.status(200).json({ data: { success: true } });
      })
    }catch(e) {
      res.status(500).json({
        error: {
          id: 'unable-to-save-subscription',
          message: 'The subscription was received but we were unable to save it to our database.'
        }
      })
    }
  },
  
  pushSubscription: async (req, res) => { // send notification from front by user
    try{
        const subscriptions = await getSubscriptionsFromDatabase();
        let promiseChain = Promise.resolve();
        for (let i = 0; i < subscriptions.length; i++) {
          const {subscription} = subscriptions[i];
          promiseChain = promiseChain.then( async () => {
            try{
              setTimeout(async () => await triggerPushMsg(subscription, {msg: 'privet'}), 1000)
              return res.status(200).json({ data: { success: true }})
            }catch(err) {
              return res.status(500).json({
                error: {
                  id: 'unable-to-send-messages',
                  message: `We were unable to send messages to all subscriptions : ` +
                    `'${err.message}'`
                }
              });
            }         
                 
        })
      }
    }catch(e) {

    }
  }
