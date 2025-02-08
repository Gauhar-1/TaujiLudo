import Profile from "../models/Profile";
import User from "../models/User";
import crypto from 'crypto';
import { faker } from "@faker-js/faker"; // Import faker

export const createProfile = async (req: any, res: any, next: any) => {
  const { phoneNumber } = req.body;


  if (!phoneNumber) {
    console.log("PhoneNumber is not Missing " + phoneNumber);
  }

  try {
    const user = await User.findOne({phone: phoneNumber});
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const oldProfile = await Profile.findOne({ phoneNumber });
    if (oldProfile) {
      return res.status(200).json(oldProfile);
    }

    const Referal = crypto.randomBytes(5).toString('hex');

    console.log("Referal: "+ Referal);

    const randomName = faker.person.firstName(); // Generates a random first name
const randomEmail = `${randomName.toLowerCase()}${Math.floor(Math.random() * 1000)}@gmail.com`; // Generates a unique email

    const profile = await Profile.create({
      userId: user._id,
      name: randomName,
      email: randomEmail,
      phoneNumber,
      amount: 5,
      imgUrl: "image",
      status: "active",
      cashWon: 0,
      BattlePlayed: 0,
      Referal,
      gameWon: 0, // Corrected field name
      gameLost: 0, // Corrected field name
    });

    if (!profile) {
      console.log("Profile creation failed");
      return res.status(500).json({ message: "Profile creation failed" });
    }
    console.log("Profile creation success");

    res.status(200).json(profile);
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(500).json({ message: "Error creating profile", err});
  }
};


export const updateProfile = async(req: any, res: any, next: any)=>{
    const { phoneNumber, name, email} = req.body;
    if (!name || !phoneNumber || !email) {
      return console.log( 'All fields are required.' + name + " " + phoneNumber + " " + email);
    }
    try {
      const updatedProfile = await Profile.findOneAndUpdate(
        {phoneNumber},
         { name, email },
         { new: true });
      if (!updatedProfile) {
        console.log("Profile not found");
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(200).json(updatedProfile);
    } catch (err) {
      console.log("Error: " + err)
      res.status(500).json({ message: "Error updating profile", error: err });
    }
}

export const getProfile = async(req: any, res: any, next: any)=>{
  

  try{

    const profile =await Profile.find({
      status : "active",
      "kycDetails.status": "pending" 
    }).sort({ createdAt : -1 });

    if(!profile){
      console.log("profile not found");
    }

    if (profile.length === 0) {
      return res.status(404).json({ message: "No profiles with pending KYC found" });
    }

    res.status(200).json(profile);
  }
  catch(err){
    console.log("Error: " + err);
  }
}
export const findProfile = async(req: any, res: any, next: any)=>{
  const { userId } = req.query;


  try{
      let profile =await Profile.find({userId});

    if(!profile){
      console.log("profile not found");
    }

    res.status(200).json(profile);

    
  }
  catch(err){
    console.log("Error: " + err);
  }
}

export const blockedPlayer = async(req: any, res: any, next: any)=>{
   
  const { userId } = req.body;

  try{const user = await User.findByIdAndUpdate(userId,
    {
      status : "blocked"
    }
  );

  if(!user){
    return console.log("User not found");
  }

  const profile = await Profile.findOneAndUpdate({userId},
    {
      status : "blocked"
    }
  );

  if(!profile){
   return console.log("Profile not found");
  }

  res.status(200).json(profile);}
  catch(err){
    console.log("Error: "+ err);
  }
}

export const getBlockedOnes = async(req : any, res: any, next: any)=>{

  try{
    const profile = await Profile.find({status : "blocked"}).sort({ createdAt : -1 });

    if(!profile){
      return console.log("Profile not found");
    }

    res.status(200).json(profile);
  }
  catch(err){
    console.log("Error :" + err);
  }
}

export const unBlockPlayer = async(req: any, res: any, next: any)=>{

  const { userId } = req.body;
  try{

    const user = User.findByIdAndUpdate(userId, 
      {
        status : "active"
      }
    )

    const profile = await Profile.findOneAndUpdate({userId}, 
      {
        status : "active"
      }
    );
    if(!profile){
      console.log("Profile not found");
    }
    res.status(200).json(profile);
  }
  catch(err){
    console.log("Error: "+ err);
  }
}

export const updateAmount = async(req:any, res:any, next:any)=>{
  const { phoneNumber } = req.body;

  if(!phoneNumber){
    console.log("missing fields" + phoneNumber  );
  }

  try{
          const profile = await Profile.findOne({ phoneNumber });

          if(!profile){
            return res.status(404).json({ success: false, message: 'profile not found' })
          }
          res.status(200).json(profile)
  }
  catch(error){
    console.error( "Update Amount: " +error);
    res.status(500).json("Amount update feel: "+ error);
  }

}
export const completeKYC = async(req: any, res: any, next: any)=>{

    const { userId, Name ,DOB, state, documentName, documentNumber  }  = req.body;

    if(!userId || !Name|| !DOB || !state || !documentName || !documentNumber){
        console.log("Fields not found", userId,DOB, state, documentName, documentNumber);
    }
    if(!req.file){
        console.log("file not found")
    }
 
    try {
        const profile = await Profile.findOneAndUpdate({userId} ,{
          filename: req.file?.filename,
          path: req.file?.path,
          kycDetails : {
            Name,
            DOB,
            state,
            documentName,
            documentNumber,
            status: "pending"
          }
        });

        if(!profile){
            console.log("battle is not found");
        }


        res.status(200).json({ message: 'Image uploaded successfully', profile });
      } catch (err) {
        console.log("error: " + err);
        res.status(500).json({ error: 'Failed to upload image' });
      }
}

export const  verifyKyc = async (req: any ,res : any) => {
  const { userId } = req.body;

  if (!userId) {
      return res.status(400).json({ success: false, message: "Profile ID is required." });
  }

  try {

      // Find the transaction by payment reference
      const profile = await Profile.findOne({userId});

      if (!profile) {
          console.log('Profile not found');
          return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      // Update the transaction as completed
      if(profile.kycDetails)
      profile.kycDetails.status = 'verified';
      await profile.save();

  
      // Add tokens to the user's wallet (mocked here)
      // Replace with your wallet update logic

      // Update notification as transaction completed
      // await Notification.updateOne({paymentReference : transaction.paymentReference, status:'success'})

      res.status(200).json({ success: true, message: 'Kyc verified and notification sent' });
  } catch (err : any) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Kyc verification failed', error: err.message });
  }
}

export const  rejectKyc = async (req: any ,res : any) => {
  const { userId , reason } = req.body;

  if (!userId) {
      return res.status(400).json({ success: false, message: "Profile ID is required." });
  }
  if (! reason ) {
      return res.status(400).json({ success: false, message: "reason is required." });
  }

  try {
      // Find the transaction by payment reference
      const profile = await Profile.findOne({userId});

      if (!profile) {
          console.log('Profile not found');
          return res.status(404).json({ success: false, message: 'Profile not found' });
      }

      if(profile.kycDetails){
        profile.kycDetails.status = 'pending';
        profile.kycDetails.reason = reason;
      }
      await profile.save();

      // Update notification as transaction completed
    //   const notification = await Notification.findOneAndUpdate({paymentReference : transaction.paymentReference}, 
    //  { status:'failed', reason});

      // if (!notification) {
      //     console.log('notification not found');
      //     return res.status(404).json({ success: false, message: 'notification  not found' });
      // }

      res.status(200).json({ success: true, message: 'Kyc Rejected and notification sent' });
  } catch (err : any) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Kyc rejection failed', error: err.message });
  }
}

export const getReferal = async(req: any, res:any)=>{

  const userId = req.query.userId
  try {
    const profile = await Profile.findOne({userId});
    if (!profile) return res.status(404).json({ message: "profile not found" });

    const referralLink = `https://taujiludo.in/?ref=${profile.Referal}`;
    res.json({ referralLink });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  } 
}