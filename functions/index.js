require('isomorphic-fetch');
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);


exports.receiveImage = functions.database.ref('/pictures/{uid}/{id}').onCreate((snap, context) => {
    
    console.log("snap", snap)
    console.log("context", context)
    const label = context["params"]["id"]
    console.log("label", label)
    
    const url = "https://api.ebay.com/buy/browse/v1/item_summary/search?q=" + label + "&limit=1"

    const otherParams = {
        headers: {
            "Authorization": "Bearer v^1.1#i^1#I^3#f^0#p^1#r^0#t^H4sIAAAAAAAAAOVXbWwURRju9doSgtAoIqSpeiwQGmT3Zu5jb2/hTg+OjwulvXKlQIvWvd3Zdsvd7roza7kQQ20MJiZGIkQFv9DEBP4gkCAJQZoY4w9S9YeJaChFDZAKhD+YKDGis9ujXAvhswqJ9+cyM++88z7P+7zv7ICeqonztizf8vtkz4TyXT2gp9zjgZPAxKrKp6Z4y2sqy0CJgWdXz+yeil7v0EIs5XOmuAph09Ax8m3M53QsupMxxrZ00ZCwhkVdyiMsElnMJFbWiwEOiKZlEEM2cowvlYwxWRDkoRyIgEBIifBSgM7qV302GzEmEoZCNBsQQABFBQToMsY2SumYSDqJMQEABRYCFvDNEIphKIIIx0cCrYyvBVlYM3RqwgEm7kYrunutklBvHqmEMbIIdcLEU4mlmcZEKrmkoXmhv8RXvEhDhkjExqNHiw0F+VqknI1ufgx2rcWMLcsIY8YfHz5htFMxcTWYuwjfZTrEo1BYAGFKdSDEg+i4ULnUsPISuXkczoymsKprKiKdaKRwK0YpG9kuJJPiqIG6SCV9zl+TLeU0VUNWjFmyKLEukU4z8TVaLqdJ+XpWlmyMMLHZ9Kokq6iCisJCVGElGFV5qASLBw17K9I85qTFhq5oDmnY12CQRYhGjcZyEyrhhho16o1WQiVORKV2wasc8nyrk9ThLNqkU3fyivKUCJ87vHUGRnYTYmlZm6ARD2MXXIpijGSamsKMXXS1WJTPRhxjOgkxRb+/u7ub6w5yhtXhDwAA/WtX1mfkTpSXGMfWqXXXXrv1BlZzociI7sSaSAomjWUj1SoNQO9g4kEYCocCRd5HhxUfO3vdRAlm/+iKGK8KiSoChCEg8CGgCsFweDwqJF4Uqd+JA2WlApuXrA2ImDlJRqxMdWbnkaUpYjCsBoJUsKzCR1U2FFVVNhtWeBaqCAGEslk5KvyfCuV2pZ6RDROljZwmF8ZH8OMmdktJSxYpZBDlXO+4XdXfECR2QP778JxavxOIjg9MnUimxjna5mQj7zck2tScqXY36nvCrdH78IFKKgU4jFRThi8yzoXL4RdlzkLYsC16h3ONTl9vNjYgnVYJsYxcDlkt8J6YGMeOfn+6+Q1RyTmN0tj+oCG7wzZ5l9qWyP1EXdHrab0eOQwHBSFAO3HknrAtdvPaXPgvmtadJHa5gQlS/oUPEP/o11C8zP3BXs9B0OvZTx9UwA/mwFlgZpV3dYX3oRqsEcRpksphrUOnX/kW4jaggilpVnmVp6123572kvfXrmfBjJEX2EQvnFTyHAO111YqYfX0yVCAAPAQhiGItIJZ11Yr4GMVjy7c/+5X3MMfDh7a3Pben68dbTo2aP0NJo8YeTyVZVQYZZkfT53c4bMnpKMnVp1dFu87dvLK3pefyM79fsXZRLp398UDl061fXT5Ve50//SZ25/0Tlv0U10nuhyd8cznA8+3eM18dpMytO+3L9Z1/fH19L9W157ftndqW/8PdW9NWQCnJt6vXbPmufqhTQf5FzoH26rWLzF//u6zvtSZt0Nky4JUNT/46fwj2vzybb6kebhr6emaX9vsZPKVbwdm1dUcP9LXHHn6BH84yKyXdvdt3bz1wMqGaS/1P9J15Z2jj68daDy7dqD1wvZzHwiHzhwJRpu+vDTUP7upQ3/jeLUsHU5drPukevb6ue0r/B8PbNpxYecvy4zz6pzV34DOy+1XXgc7Z84vlL1pn5u3Zzh9/wCE4OYoGQ8AAA==",
            "Content-Type": "application/json; charset=UTF-8",
            "X-EBAY-C-ENDUSERCTX": "affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>"
        },
        method: "GET"
    }

    fetch(url, otherParams)
        .then(data => {return data.json()})
        .then(res => {
            console.log(res)
            let price = res["itemSummaries"][0]["price"]["value"];
            let title = res["itemSummaries"][0]["title"]
            console.log("title", title)
            console.log("price", price)
            
//            console.log(event.data.ref.parent)
            let r = Math.floor(Math.random() * 100).toString();
            let random_email = "user" + r +"@example.com"
            console.log(random_email)
                
            admin.auth().createUser({
              email: random_email,
              emailVerified: true,
//              phoneNumber: "+11234567890",
              password: "secretPassword",
              displayName: title,
              photoURL: "https://firebasestorage.googleapis.com/v0/b/cause-stuff-9b2c0.appspot.com/o/usersProfilePics%2Fuwdallas.jfif?alt=media&token=1225b8af-820e-440f-8d4f-f0f96bfb26cb",
              disabled: false
            })
              .then(function(userRecord) {
                // See the UserRecord reference doc for the contents of userRecord.
                const new_uid = userRecord.uid
                const old_uid = event.params.uid
                console.log("Successfully created new user:", new_uid);
                
                var userRef = firebase.database().ref("users/");
                
                userRef.set({
                   new_uid: {
                      conversations: {
                        old_uid: location
                      },
                      credentials: {
                             "dollarsDonated": "0",
                             "email": random_email,
                             "name": title,
                             "profilePicLink": "https://firebasestorage.googleapis.com/v0/b/cause-stuff-9b2c0.appspot.com/o/usersProfilePics%2Fuwdallas.jfif?alt=media&token=1225b8af-820e-440f-8d4f-f0f96bfb26cb"
                        }
                   },
                });
                
                var messageRef = firebase.database().ref("conversations/");
                
                let location_id = messageRef.push({
                    "1": {
                        content: price,
                        fromID: new_uid,
                        isRead: false,
                        timestamp: Math.floor(Date.now() / 1000),
                        toID: uid,
                        type: "text"
                    }
                })
                
                console.log("new message at location", location_id)
                
              })
              .catch(function(error) {
                console.log("Error creating new user:", error);
              });
        })
        .catch(err => console.log(err))
})