//  MIT License

//  Copyright (c) 2017 Haik Aslanyan

//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:

//  The above copyright notice and this permission notice shall be included in all
//  copies or substantial portions of the Software.

//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//  SOFTWARE.


import Foundation
import UIKit
import Firebase

class User: NSObject {
    
    //MARK: Properties
    let name: String
    let email: String
    let id: String
    var profilePic: UIImage
    var charities: [String]
    
    //MARK: Methods
    class func registerUser(withName: String, email: String, password: String, profilePic: UIImage, completion: @escaping (Bool) -> Swift.Void) {
        Auth.auth().createUser(withEmail: email, password: password, completion: { (user, error) in
            if error != nil {
                return
            }
            guard let uid = user?.user.uid else {
                return
            }
            let ref = Database.database().reference()
            let userRef = ref.child("users").child(uid)
            let storageRef = Storage.storage().reference().child("usersProfilePics").child(uid)
            let imageData = UIImageJPEGRepresentation(profilePic, 0.1)
                user?.user.sendEmailVerification(completion: nil)
                storageRef.putData(imageData!, metadata: nil, completion: { (metadata, err) in
                    if err == nil {
//                        let path = metadata?.downloadURL()?.absoluteString
                        storageRef.downloadURL { (url, error) in
                            guard let path = url else {
                                // Uh-oh, an error occurred!
                                return
                            }
                            let stringPath = path.absoluteString
                            let values = ["name": withName, "email": email, "profilePicLink": stringPath, "dollarsDonated": "0"]
                        userRef.child("credentials").updateChildValues(values, withCompletionBlock: { (errr, _) in
                                if errr == nil {
                                    let userInfo = ["email" : email, "password" : password]
                                    UserDefaults.standard.set(userInfo, forKey: "userInformation")
                                    completion(true)
                                }
                            })
                        }
                    }
                })
//            else {
//                completion(false)
//            }
        })
    }
    
   class func loginUser(withEmail: String, password: String, completion: @escaping (Bool) -> Swift.Void) {
    Auth.auth().signIn(withEmail: withEmail, password: password, completion: { (user, error) in
            if error == nil {
                let userInfo = ["email": withEmail, "password": password]
                UserDefaults.standard.set(userInfo, forKey: "userInformation")
                completion(true)
            } else {
                completion(false)
            }
        })
    }
    
    class func logOutUser(completion: @escaping (Bool) -> Swift.Void) {
        do {
            try Auth.auth().signOut()
            UserDefaults.standard.removeObject(forKey: "userInformation")
            completion(true)
        } catch _ {
            completion(false)
        }
    }
    
   class func info(forUserID: String, completion: @escaping (User) -> Swift.Void) {
    Database.database().reference().child("users").child(forUserID).child("credentials").observeSingleEvent(of: .value, with: { (snapshot) in
            if let data = snapshot.value as? [String: String] {
                let name = data["name"]!
                let email = data["email"]!
                let link = URL.init(string: data["profilePicLink"]!)
                URLSession.shared.dataTask(with: link!, completionHandler: { (data, response, error) in
                    if error == nil {
                        let profilePic = UIImage.init(data: data!)
                        let charities = ["MANY MANSIONS A CALIFORNIA NON PROFIT CORPORATION", "Minnesota Concil of Nonprofits, Inc.", "Institte for Nonprofit News", "MARYLAND ASSOCIATION OF NON-PROFIT ORGANIZATIONS INC", "NONPROFITS FIRST INC", "Oklahoma Center for Nonprofits, Inc.", "Nonprofit Coordinating Committee of New York, Inc.", "High Fives Non-Profit Fondation", "A Noise Within", "CENTER FOR NONPROFIT EXCELLENCE", "THE NONPROFIT CONCIL", "GLOBAL PAINT FOR CHARITY INC", "DELAWARE ALLIANCE FOR NONPROFIT ADVANCEMENT INC", "OHIO ASSOCIATION OF NONPROFIT ORGANIZATIONS", "French Blldog Resce Network a Nonprofit Corporation", "INSTITTE OF ARTS MSIC & SCIENCE A CALIFORNIA NON PROFIT PBLIC BEN", "GlobalGiving", "GideStar SA", "MONTEREY BAY AQARIM FONDATION", "WABASH VALLEY COMMNITY FONDATION INC", "WHITEFISH COMMNITY FONDATION INC", "Pre, Inc. dba Pre Charity", "Madison Commnity Fondation", "Direct Relief", "Commnity Fondation Santa Crz Conty"]
                        let user = User.init(name: name, email: email, id: forUserID, profilePic: profilePic!, charities: charities)
<<<<<<< HEAD
=======

>>>>>>> new_master
                        completion(user)
                    }
                }).resume()
            }
        })
    }
    
    class func downloadAllUsers(exceptID: String, completion: @escaping (User) -> Swift.Void) {
        Database.database().reference().child("users").observe(.childAdded, with: { (snapshot) in
            let id = snapshot.key
            let data = snapshot.value as! [String: Any]
            let credentials = data["credentials"] as! [String: String]
            if id != exceptID {
                let name = credentials["name"]!
                let email = credentials["email"]!
                let link = URL.init(string: credentials["profilePicLink"]!)
                URLSession.shared.dataTask(with: link!, completionHandler: { (data, response, error) in
                    if error == nil {
                        let profilePic = UIImage.init(data: data!)
                        let charities = ["MANY MANSIONS A CALIFORNIA NON PROFIT CORPORATION", "Minnesota Concil of Nonprofits, Inc.", "Institte for Nonprofit News", "MARYLAND ASSOCIATION OF NON-PROFIT ORGANIZATIONS INC", "NONPROFITS FIRST INC", "Oklahoma Center for Nonprofits, Inc.", "Nonprofit Coordinating Committee of New York, Inc.", "High Fives Non-Profit Fondation", "A Noise Within", "CENTER FOR NONPROFIT EXCELLENCE", "THE NONPROFIT CONCIL", "GLOBAL PAINT FOR CHARITY INC", "DELAWARE ALLIANCE FOR NONPROFIT ADVANCEMENT INC", "OHIO ASSOCIATION OF NONPROFIT ORGANIZATIONS", "French Blldog Resce Network a Nonprofit Corporation", "INSTITTE OF ARTS MSIC & SCIENCE A CALIFORNIA NON PROFIT PBLIC BEN", "GlobalGiving", "GideStar SA", "MONTEREY BAY AQARIM FONDATION", "WABASH VALLEY COMMNITY FONDATION INC", "WHITEFISH COMMNITY FONDATION INC", "Pre, Inc. dba Pre Charity", "Madison Commnity Fondation", "Direct Relief", "Commnity Fondation Santa Crz Conty"]
                        let user = User.init(name: name, email: email, id: id, profilePic: profilePic!, charities: charities)
                        completion(user)
                    }
                }).resume()
            }
        })
    }
    
    class func checkUserVerification(completion: @escaping (Bool) -> Swift.Void) {
        Auth.auth().currentUser?.reload(completion: { (_) in
            let status = (Auth.auth().currentUser?.isEmailVerified)!
            completion(status)
        })
    }

    
    //MARK: Inits
    init(name: String, email: String, id: String, profilePic: UIImage, charities: [String]) {
        self.name = name
        self.email = email
        self.id = id
        self.profilePic = profilePic
        self.charities = charities
    }
}

