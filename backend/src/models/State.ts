import mongoose from 'mongoose';

const StateSchema = new mongoose.Schema({
    userName: { type: String, default : null },
    email: { type: String, default : null },
    editClicked : { type: Boolean , default : null},
    phoneNumber : { type: String , default : null},
  });
  
const State = mongoose.model('State', StateSchema);

export default State;
