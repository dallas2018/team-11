require('isomorphic-fetch');
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.receiveImage = functions.database.ref('/pictures/{uid}/{id}').onCreate(event => {
    
    console.log(event);
    const label = event.data
    console.log(label)
    
    const url = "https://api.ebay.com/buy/browse/v1/item_summary/search?q=" + label + "&limit=1"

    const otherParams = {
        headers: {
            "Authorization": "Bearer v^1.1#i^1#I^3#p^1#r^0#f^0#t^H4sIAAAAAAAAAOVXbWwURRju9UvKdxBbaQoeC2qA7N7s7d12b+EOzhbSE2grd5YvTZnbnS0Le7vHzpztBYKlKolIDBI/EyNNkIAoEUwISonRBEUSfugP4QcgCQkBgcQEAYMx4uzeUa6V8FmExPtz2Zl333me533emR3QWV4xeW3D2j+GeR4p7u4EncUeDz8EVJSXTRleUlxdVgQKAjzdnRM7S7tKzkzDMGWk5XkIpy0TI29HyjCx7A6GmYxtyhbEOpZNmEJYJoocj86dI/s5IKdti1iKZTDeWH2YUZJBMcSDgKbxSRWqiI6a13ImrDDj16AKkkgRQ0JtQIM8ncc4g2ImJtAkdB7wEssDFogJIMmCJAf9nCD6FzHeFmRj3TJpCAeYiAtXdt+1C7DeHCrEGNmEJmEiseiseFM0Vj+zMTHNV5ArktchTiDJ4L5PdZaKvC3QyKCbL4PdaDmeURSEMeOL5Fbom1SOXgNzF/BdqQUhoAXUUEAEAbG2VkgOiJSzLDsFyc1xOCO6ympuqIxMopPsrRSlaiSXIYXknxppili91/l7LgMNXdORHWZmPhNdGG1uZiLzdcPQYWoOq8AMRphk2OZ59ayqSRoKSiGVhXxIE3lVyC+Uy5aXud9KdZap6o5o2NtokWcQRY36a+Mv0IYGNZlNdlQjDqKCOB5c0zAYXOQUNVfFDFlqOnVFKSqE1328dQV63ybE1pMZgnoz9J9wJQozMJ3WVab/pOvFvH06cJhZSkha9vna29u5doGz7DafHwDet2DunLiyFKUgQ2OdXs/F67d+gdVdKgptYxovk2yaYumgXqUAzDYmIvCBYMCf170vrEj/0X8NFHD29e2IgeoQpCAgoKRUq0AAJCgORIdE8ib1OThQEmbZFLSXI5I2oIJYhfosk0K2rspCUPML1LCsKoY0NhDSNDYZVEWW1xACCCWTSkj6PzXK7Vo9rlhp1GwZupIdEMMPnNlttRnaJBtHVHOz7XZdf0OS2CF53+k5vX5HFJ0cmCaBaZ1zvM0pVspnQbqpOUOtLup74q3T8/ChKiolmGOqq7mDjHPpcvglhbMRtjI2PcO5JmdfT1jLkUm7hNiWYSC7hb8nJQZuR39Au/kNWSmGTmVsfdiY3eE2eZfehuQBsi7t8iy+AXM+KEgSH+SFe6trnVvXRPY/2LTuqLANFiZIvQ8fIL6+16FIkfvjuzy7QZdnF71RAR94kp8AxpeXPF9aMrQa6wRxOtQ4rLeZ9CvfRtxylE1D3S4u9yyu2flJa8EFrPtF8HjvFayihB9ScB8DNddnyvgRVcN4iQdABJIgBf2LwITrs6V8ZenoPQ1LTv1cvF4fxQ4NHR781YzQZxsmgmG9QR5PWRF1RtHRnqrXpwY8l6q3Dd/36Ci+cu0LU7dcNksmTZ99bMEq873vfdk3vr76Vt1FfV739HSs/q+iI4cGhWvOHr/wREX6F/341oNnak7s27Fs+/bWUz38yk0rNuzAVbM//fOHcSP3nfro/LO7u6WNV7aeW9Gz/8LC6aMHv3ny/NWz3lf3n7+w/sNNr2ysCyXGeC3voIY9V3f63kk2XT4499B4sXL2yers26fRa0ee+sJe8/emDQfWnRw5DZ37ae93jx1DVZsrVzU3LojtqlxdJ3b8+n5o9cQDY788/W7Cnuz9fNvHpzsarmweEbsUX/L04S1T1o0xXj46H/Zs+2bcbxen7p016cS31sqxl3/84Pc1LTPKgxdH9uTK9w8v7m9HGg8AAA==",
            "Content-Type": "application/json; charset=UTF-8",
            "X-EBAY-C-ENDUSERCTX": "affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>"
        },
        method: "GET"
    }

    fetch(url, otherParams)
        .then(data => {return data.json()})
        .then(res => {
            let price = res["itemSummaries"][0]["price"]["value"];
            let title = res["itemSummaries"][0]["title"]
            console.log(title)
            console.log(price)
            
            console.log(event.data.ref.parent)
        })
        .catch(err => console.log(err))
    
//    admin.auth().createUser({
//      email: "user@example.com",
//      emailVerified: true,
//      phoneNumber: "+11234567890",
//      password: "secretPassword",
//      displayName: message,
//      photoURL: "https://firebasestorage.googleapis.com/v0/b/cause-stuff-9b2c0.appspot.com/o/usersProfilePics%2Fuwdallas.jfif?alt=media&token=1225b8af-820e-440f-8d4f-f0f96bfb26cb",
//      disabled: false
//    })
//      .then(function(userRecord) {
//        // See the UserRecord reference doc for the contents of userRecord.
//        console.log("Successfully created new user:", userRecord.uid);
//      })
//      .catch(function(error) {
//        console.log("Error creating new user:", error);
//      });
})