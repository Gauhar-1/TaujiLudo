import Profile from "../models/Profile";
import User from "../models/User";

export const createProfile = async (req: any, res: any, next: any) => {
  const { phoneNumber } = req.query;


  if (phoneNumber) {
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

    const profile = await Profile.create({
      userId: user._id,
      name: "Noobie",
      email: "@gmail.com",
      phoneNumber,
      amount: 5,
      imgUrl: "image",
      cashWon: 0,
      BattlePlayed: 0,
      Referal: 0,
      gameWon: 0, // Corrected field name
      gameLost: 0, // Corrected field name
    });

    if (!profile) {
      console.log("Profile creation failed");
      return res.status(500).json({ message: "Profile creation failed" });
    }

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

    const profile =await Profile.find();

    if(!profile){
      console.log("profile not found");
    }

    res.status(200).json(profile);
  }
  catch(err){
    console.log("Error: " + err);
  }
}

export const updateAmount = async(req:any, res:any, next:any)=>{
  const { phoneNumber, amount } = req.body;

  if(!phoneNumber || !amount){
    console.log("missing fields" + phoneNumber + " " + amount );
  }

  try{
          const profile = await Profile.findOneAndUpdate({ phoneNumber }, { amount });
          res.status(200).json(profile)
  }
  catch(error){
    console.error( "Update Amount: " +error);
    res.status(500).json("Amount update feel: "+ error);
  }

}