import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    email: { type: String, required: true,  },
    phoneNumber: { type: String, required: true ,unique: true},
    amount: { type: Number, required: true },
    imgUrl : {type: String, required: true},
    cashWon : {type: Number, required: true},
    gameWon : {type: Number, required: true},
    gameLost : {type: Number, required: true},
    BattlePlayed : {type: Number, required: true},
    Referal : {type: Number, required: true},
    createdAt: { type: Date, default: Date.now },
  });
  
  const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;
