import { count } from "console";
import Admin from "../models/Admin";
import Profile from "../models/Profile";
import Transaction from "../models/Transaction";
import User from "../models/User"
import Battle from "../models/Battle";

export const createAdminDetails = async(req: any, res: any)=>{

    const sumFieldValues = async(Model : any , field : any, value : any)=>{
        try{ 
       const filter = value ? { [field]: value } : {};
       const result = await Model.aggregate([
        { $group: { _id: null, total: { $sum: `$${filter}` } } }
      ]);
      console.log("Result= " + result.data)
       return  result.length > 0 ? result[0].total: 0;
    }
       catch(err){
           console.log("Error in getTotalSum:"+ err);
           return 0;
       }
    }
    const getTotalCount = async (Model : any , field : any, value: any) => {
        try {
            const filter = value ? { [field]: value } : {}; // Apply filter if value exists
            return await Model.countDocuments(filter);
        } catch (err) {
            console.error("Error in getTotalCount:", err);
            return 0;
        }
    };
    const getTodaysCount = async (Model : any , field : any, value: any) => {
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
    
            if(field && value){
                return await Model.countDocuments({ createdAt: { $gte: startOfDay }, [field]: value });
            }
            else if( field && !value){
                if(field === "prize"){
                    const result = await Model.aggregate([
                        { $group: { _id: null, total: { $sum: `$${field}` } } }
                    ]);
            
                    return result.length > 0 ? result[0].total : 0;
                }
                else {
                    const result = await Model.aggregate([
                        { $match: { type: field, createdAt: { $gte: startOfDay } } },
                        { $group: { _id: null, total: { $sum: "$amount" } } }
                    ]);
            
                    return result.length > 0 ? result[0].total : 0;
                }
            }
            else{
                if(Model === Transaction){
                    return await Model.countDocuments({ date: { $gte: startOfDay } });
                }
                else{
                    return await Model.countDocuments({ createdAt: { $gte: startOfDay } });
                }
            }
        } catch (err) {
            console.error("Error in getTodayNewUsers:", err);
            return 0;
        }
    };

    const getCommision = async()=>{
        const entry = await sumFieldValues(Battle, "amount", null ); 
        const prize = await sumFieldValues(Battle, "prize", null ); 
        return ( (2 *  entry )- prize)
    }

    await Admin.create({
        totalUsers: getTotalCount(User, "status" , "active" ),
        totalUsersWalletBallance: sumFieldValues(Profile, "wallet", null ),
        todayNewUsersr: getTodaysCount(User, "status", "active"),
        todayBlockedUsers: getTodaysCount(User, "status", "blocked"),
        todayGames: getTodaysCount(Battle, null , null),
        allGames: getTotalCount(Battle, null ,null),
        totalSucessGame : getTotalCount(Battle, "status", "completed"),
        todayCancelGame : getTodaysCount(Battle, "status", "canceled"),
        totalAdminCommission : getCommision(),
        todayTotalDeposit : getTodaysCount(Transaction, "deposit" , null),
        todayTotalWithdraw : getTodaysCount(Transaction, "withdraw", null),
        todayWonAmount : getTodaysCount(Transaction, "prize", null),
        totalPendingKYC : getTotalCount(Profile, "status", "pending"),
        totalApprovedKYC : getTotalCount(Profile, "status", "active"),
        createdAt : Date.now(),
    })
}