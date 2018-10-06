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
            "Authorization": "Bearer v^1.1#i^1#I^3#p^1#f^0#r^0#t^H4sIAAAAAAAAAOVXbWwURRju9dpiKYWgBJWP5FjEGGH3Zm9v7/Y2vYtHC9JQ+nWlYgmpc7uz7dK73WNnzvZ+CLUKEcOHGn5gxNhKREAQiUD8gJpIAgo/CCFGtBFN0IQffkRixCios3tHuRbCZxES789lZ95553me93lnd0B3Semjq+atOlfuGlXY2w26C10uvgyUlhTPHOsunFRcAPICXL3dD3UX9bjPVGCYTKTkRoRTpoGRpyuZMLDsDIaZtGXIJsQ6lg2YRFgmihyLLqiRfRyQU5ZJTMVMMJ7qqjCjQoR8mhgSfJoaCmgiHTUu5mwyw0xIRaoi8ryAApo/JEh0HuM0qjYwgQYJMz7ASywPWBBo4kXZH5DFIBcCvhbG04wsrJsGDeEAE3Hgys5aKw/r1aFCjJFFaBImUh2dG6uLVlfNqW2q8ObliuR0iBFI0njoU6WpIk8zTKTR1bfBTrQcSysKwpjxRrI7DE0qRy+CuQn4jtRBAJEvGIpD4JOCUIiPiJRzTSsJydVx2CO6ympOqIwMopPMtRSlasSXIoXknmppiuoqj/3XkIYJXdORFWbmzI4+Ga2vZyJP6ImEDpM1rALTGGGSZusbq1hVkzQkSiGVhXxIC/CqkNsomy0n87CdKk1D1W3RsKfWJLMRRY2GayPkaUOD6ow6K6oRG1F+XDCnoRTyt9hFzVYxTdoNu64oSYXwOI/XrsDgakIsPZ4maDDD8AlHojADUyldZYZPOl7M2acLh5l2QlKy19vZ2cl1CpxptXl9APDeRQtqYko7SkKGxtq9no3Xr72A1R0qCqIrsS6TTIpi6aJepQCMNiYi8H7R78vpPhRWZPjoZQN5nL1DO2KkOkSIx/2CIAB/QFM1qI1Eg0RyHvXaMFAcZtgktDoQSSWggliF2iydRJauyoKo+QTqV1YNhDTWH9I0Ni6qAZbXEAIIxeNKSPo/9cn1Oj2mmClUbyZ0JTMifh85r1tqPbRIJoao5kbb9Zr+iiSxTfL207N7/UYo2jkwTQJTOmd7m1PMpNeE9Eyzh1od1LfEW6evw7uqqJRglqmuZt9jnEOXw08rnIWwmbboK5yrs4/1JrMDGbRLiGUmEshq5m9JiZE70O/QYX5FVkpCpzK23m3MbvCYvElvQ3InWRf1uFouZ86LgiT5gcQHb4lbpVPXpsx/cWjdSGHnmZgg9TZ8f3iH3oYiBc6P73HtBT2u3fRCBbxgBj8dTCtxLyxyj5mEdYI4HWoc1tsM+pFvIa4DZVJQtwpLXIunvLetNe/+1bsEPDB4Ayt182V51zEw5dJMMT/u/nJe4gEI8KI/IAZbwPRLs0X8xKIJ85oqWx/TPD+07OrYt3Fgx+dnG5jxoHwwyOUqLqDGKHjnnk93XSiesL/zs2PH/1pX9gJ3uOzbyv7Gxp+Nsn3f7Xzu7y7w56Ezf0zuPr/86Np0v7fG1fzU2Lnu1Xt3BIkZ/XX7qRWjvz66bs1K/fSBrzZsqi1+/5D4ZdfAZvHMi0f6zy1fsufe/XXiRunhDd//4ouMORyN98mzDvx0snzNJnXWKHbmVmHib+XLXlsycPo49zy3mYi+bY9vWT9j7Y/zP9hncLNPvPyMm68wF03oH9CnytNWLH2X376lr+RAefD30Y9MXQV3H6k7/GbfuOPTz0c9H5/e+eEX4yOnXtp67MHzB//5ZP7br06+wJ545eRbpaul9pZvzt7XQJa9XpFgnl04f3HJysbdY/d8dPCNXiFbvn8BVyvg1RkPAAA=",
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
                const old_uid = context["params"]["id"]
                console.log("Successfully created new user:", new_uid);
                
                var userRef = functions.database.ref("users/");
                
                let random_location = Math.floor(Math.random() * 1000).toString();
                
                var updates = {};
                postData = {
                      conversations: {
                        old_uid: random_location
                      },
                      credentials: {
                             "dollarsDonated": "0",
                             "email": random_email,
                             "name": title,
                             "profilePicLink": "https://firebasestorage.googleapis.com/v0/b/cause-stuff-9b2c0.appspot.com/o/usersProfilePics%2Fuwdallas.jfif?alt=media&token=1225b8af-820e-440f-8d4f-f0f96bfb26cb"
                        }
                   }
                
                updates['/users/' + new_uid] = postData;

                functions.database.ref().update(updates);
                
//                userRef.set({
//                   new_uid: {
//                      conversations: {
//                        old_uid: random_location
//                      },
//                      credentials: {
//                             "dollarsDonated": "0",
//                             "email": random_email,
//                             "name": title,
//                             "profilePicLink": "https://firebasestorage.googleapis.com/v0/b/cause-stuff-9b2c0.appspot.com/o/usersProfilePics%2Fuwdallas.jfif?alt=media&token=1225b8af-820e-440f-8d4f-f0f96bfb26cb"
//                        }
//                   },
//                });
                
                var messageRef = functions.database.ref("conversations/");
                
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