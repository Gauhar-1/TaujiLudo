import { stat } from "fs";
import State from "../models/State";


export const createState = async( req:any , res: any, next: any)=>{
    
    const { phoneNumber , userName , editClicked , email  } = req.body;

    if(!phoneNumber){
        return console.log('phone Number missing');
    }
    console.log("phone number: "+ phoneNumber);

    try{

        if(userName === "" || email === ""){
            const newState = await State.find({phoneNumber});
            if(!newState){
                console.log("newState isn't found");
            }

            return res.status(200).json(newState);
        }
        
    const state = await State.findOneAndUpdate({phoneNumber}, {
        userName,
        editClicked,
        email
    });

    if(state){
        console.log("State found :" + state.toString());
        return res.status(200).json(state)
    }
    else{
        const newState = await State.create({
            phoneNumber,
            userName,
            editClicked,
            email
        });
    
        res.status(200).json(newState);
    }

}
    catch(err){
        console.log("Error: " + err);
    }
}