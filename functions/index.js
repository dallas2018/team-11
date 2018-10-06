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
            "Authorization": "Bearer v^1.1#i^1#r^0#I^3#p^1#f^0#t^H4sIAAAAAAAAAOVXbWwURRju9a6FCgUjYE2p5tgCJujuzdzH3t1KLx4ttZVCC1cqlmDd250ta/d2LzuzXE+rqY02wRDDhz8IqNSQGCAigqiIgUSN4EdADFGJ/4yJgCZGUwOpBOPs3lGulfBZhMT7c9mZd995nud93pkd0FtaNqe/of9suWtc8UAv6C12ueAEUFZa8sAkd3FlSREoCHAN9M7s9fS5T83FYkpLC0sQThs6Rt7ulKZjwRmsYSxTFwwRq1jQxRTCApGERHxhk+DngJA2DWJIhsZ4G+tqmHAQBqQghCAghWA0ieiofiFnq0HnQ3IkFA7KUPLz0WAY0nmMLdSoYyLqpIbxAxhhIWAB3wqDQigo+AEXivDtjLcNmVg1dBrCASbmwBWcd80CrJeHKmKMTEKTMLHGeH2iOd5YN39R61xfQa5YXocEEYmFRz7VGjLytomahS6/DHaihYQlSQhjxhfLrTAyqRC/AOY64DtSJ/kgHw3xER5EZV6JoDGRst4wUyK5PA57RJVZxQkVkE5Ukr2SolSN5FNIIvmnRTRFY53X/ltsiZqqqMisYebPiz8eb2lhYo+pmqaKqSZWEi2MMLHYliV1rKxEFBSKRGVWhFGFh3Igv1AuW17mUSvVGrqs2qJh7yKDzEMUNRqtTbBAGxrUrDebcYXYiArj+AsahiPtdlFzVbTISt2uK0pRIbzO45UrMPw2IaaatAgazjB6wpGohhHTaVVmRk86XszbpxvXMCsJSQs+XyaT4TIBzjA7fX4AoG/ZwqaEtBKlRIbG2r2ei1ev/AKrOlQk6i0aL5BsmmLppl6lAPROJhaAwVDQn9d9JKzY6NF/DRRw9o3siLHqEBRRQBDIAV6EgbBflMaiQ2J5k/psHCgpZtmUaHYhktZECbES9ZmVQqYqC4GQ4g9Qw7IyH1XYYFRR2GRI5lmoIAQQSialaOT/1ChXa/WEZKRRi6GpUnZMDD92ZjflFtEk2QSimuudV+v6S5LENsmbTs/u9WuiaOfANImYVjnb25xkpHyGSDc1e6jDQX1DvFV6Ht5WRaUEc0xVOXeQcQ5dDq+SOBNhwzLpGc412/t6q9GFdNolxDQ0DZlt8IaUGLsd/Rbt5pdkJWkqlbHjdmN2jdvkdXpbJLeQtafPtfwSzGEoEIkEwjwPbohbrVPX1ux/sGldU2EbDEyQfBM+QHwjr0OxIucH+1zvgT7XbnqjAj4wC1aDGaXupR73xEqsEsSposJhtVOnX/km4rpQNi2qZnGpa3nVO9s7Ci5gAyvAPcNXsDI3nFBwHwNVF2dK4OSKchiBAPBOa4J2UH1x1gPv9kxd1vBTe9PL1u5fH1owRTlxYB2Xcf8GyoeDXK6SIuqMomdXNy1r8exZf0d/W/3Dk1Z9NvW1nnH7J4Q3nDo2fe6Lp4+/3rXkzb13nq6YseBk35yDnZm/dj7IffncR/veej7msXaOPywPvnrmh/e3VfeDad3rz+2ZPes7pWdh+t3S38f3LL5/xdueT48pz7jPlv0NG2aqtb/M/n7HicQX905EW6J7D/458OO+uz74I4m7xg1+1bl0c3dbWWx3VeZJ87j2+dDAfY+8Ado2Hf320TNT1gYOdKz7usu77fjH/hPd+49WVG81Dr1SuWnrSyfJmrXbz5+a6h3atXnaoQ2txf5vDp0D5RWDkzeqL+ycUrnrwJZPjuxqOn/4iaIj64ZWJ9dv/PDp/eDnoR2ek+JgVd/p6T3Tc+X7B2qq5XoaDwAA",
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