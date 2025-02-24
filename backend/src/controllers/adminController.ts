import Admin from "../models/Admin";
import Profile from "../models/Profile";
import Transaction from "../models/Transaction";
import User from "../models/User";
import Battle from "../models/Battle";

export const createAdminDetails = async (req: any, res: any) => {
    try {
        const sumFieldValues = async (Model: any, field: string, filter: object = {}) => {
            try {
                const pipeline = [];
        
                // Add filter condition only if it exists
                if (Object.keys(filter).length > 0) {
                    pipeline.push({ $match: filter });
                }
        
                pipeline.push({
                    $group: { _id: null, total: { $sum: `$${field}` } }
                });
        
                const result = await Model.aggregate(pipeline);
                return result.length > 0 ? result[0].total : 0;
            } catch (err) {
                console.error(`Error summing ${field}:`, err);
                return 0;
            }
        };
        

        const getTotalCount = async (Model: any, field?: string, value?: any) => {
            try {
                return await Model.countDocuments(field ? { [field]: value } : {});
            } catch (err) {
                console.error(`Error counting documents in ${Model.collection.name}:`, err);
                return 0;
            }
        };

        const calculateTotalAmount = async (transactionType: "deposit" | "withdraw"): Promise<number> => {
            try {

                 // Get start of the day (midnight)
              const startOfDay = new Date();
              startOfDay.setHours(0, 0, 0, 0);
          

              const totalAmount = await Transaction.aggregate([
                { $match: { type: transactionType,  date: { $gte: startOfDay }, status : "completed" } }, // Filter by transaction type
                { $group: { _id: null, total: { $sum: "$amount" } } }, // Sum all amounts
              ]);
          
              return totalAmount.length > 0 ? totalAmount[0].total : 0; // Return total or 0 if no transactions
            } catch (error) {
              console.error("Error calculating total amount:", error);
              return 0;
            }
          };
          

        const getTodaysCount = async (Model: any, field?: string, value?: any) => {
            try {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                let filter: Record<string, any> = { createdAt: { $gte: startOfDay } };
        
                if (field && !value) {
                    return await sumFieldValues(Model, field, filter);
                }
        
                if (field && value) {
                    filter[field] = value;
                }
        
                return field ? await Model.countDocuments(filter) : await Model.countDocuments(filter);
            } catch (err) {
                console.error(`Error getting today's count for ${Model.collection.name}:`, err);
                return 0;
            }
        };
        

        const getCommission = async () => {
            const [entry, prize] = await Promise.all([
                sumFieldValues(Battle, "amount"),
                sumFieldValues(Battle, "prize"),
            ]);
            return (2 * entry) - prize;
        };

        const [
            totalUsers,
            totalUsersWalletBalance,
            todayNewUsers,
            todayBlockedUsers,
            todayGames,
            allGames,
            totalSuccessGame,
            todayCancelGame,
            totalAdminCommission,
            todayTotalDeposit,
            todayTotalWithdraw,
            todayWonAmount,
            totalPendingKYC,
            totalApprovedKYC
        ] = await Promise.all([
            getTotalCount(User, "status", "active"),
            sumFieldValues(Profile, "amount"),
            getTodaysCount(Profile, "status", "active"),
            getTodaysCount(Profile, "status", "blocked"),
            getTodaysCount(Battle),
            getTotalCount(Battle),
            getTotalCount(Battle, "status", "completed"),
            getTodaysCount(Battle, "status", "canceled"),
            getCommission(),
            calculateTotalAmount("deposit"),
            calculateTotalAmount("withdraw"),
            getTodaysCount(Battle, "prize"),
            getTotalCount(Profile, "kycDetails.status", "pending"),
            getTotalCount(Profile, "kycDetails.status", "verified")
        ]);

        const adminDetails = {
            totalUsers,
            totalUsersWalletBalance,
            todayNewUsers,
            todayBlockedUsers,
            todayGames,
            allGames,
            totalSuccessGame,
            todayCancelGame,
            totalAdminCommission,
            todayTotalDeposit,
            todayTotalWithdraw,
            todayWonAmount,
            totalPendingKYC,
            totalApprovedKYC,
            createdAt: new Date(),
        };

        const updatedAdmin = await Admin.findOneAndUpdate(
            {},
            adminDetails,
            { upsert: true, new: true }
        );

        console.log("Admin details updated successfully.");
        res.status(200).json({ message: "Admin details updated successfully.", data: updatedAdmin });

    } catch (err) {
        console.error("Error updating admin details:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const supportSettings = async (req: any, res: any) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber) {
            return res.status(400).json({ error: "PhoneNumber missing" });
        }

        const admin = await Admin.findOneAndUpdate(
            {}, 
            { $set: { "adminSetting.phoneNumber": phoneNumber } }, 
            { new: true } // Returns the updated document
        );

        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.status(200).json({ message: "Support setting changed successfully" });
    } catch (error : any) {
        res.status(500).json({ error: error.message });
    }
};

export const infoSettings = async (req: any, res: any) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }

        const admin = await Admin.findOneAndUpdate(
            {}, 
            { $set: { "adminSetting.content": content } }, 
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.status(200).json({ message: "Info setting changed successfully" });
    } catch (error : any) {
        res.status(500).json({ error: error.message });
    }
};

export const QRsettings = async (req: any, res: any) => {
    try {
        if (!req.file) {
            console.log("File not found", req.file);
            return res.status(400).json({ success: false, message: "File not found. Please upload a valid file." });
        }

        const admin = await Admin.findOneAndUpdate(
            {}, 
            { $set: { "paymentSetting.QR": req.file.filename } }, 
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        return res.status(200).json({ success: true, message: "QR settings updated successfully", filename: req.file.filename });
    } catch (error : any) {
        console.error("Error updating QR settings:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};
export const UPIsettings = async (req: any, res: any) => {
    try {

        const { UPI } = req.body;

        if (!UPI) {
            console.log("UPI not found", UPI);
            return res.status(400).json({ success: false, message: "UPI not found." });
        }

        const admin = await Admin.findOneAndUpdate(
            {}, 
            { $set: { "paymentSetting.UPI": UPI } }, 
            { new: true }
        );

        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        return res.status(200).json({ success: true, message: "UPI settings updated successfully", UPI });
    } catch (error : any) {
        console.error("Error updating QR settings:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const getAdmin = async(req: any, res: any)=>{

    try{
        const admin = await Admin.find();
        if(!admin){
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        return res.status(200).json({ success: true, message: "UPI settings updated successfully", admin });
    }
    catch(error : any){
        console.error("Error updating QR settings:", error);
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const onlyAdmins = async(req: any, res:any )=>{
    try {
        const { phoneNumber } = req.query;
    
        // ✅ Fetch the stored admin phone number
        const admin = await Admin.findOne();
    
        if (!admin || !admin.Admins.includes(phoneNumber)) {
            return res.status(403).json({ isAdmin: false, message: "Access denied" });
          }

        return res.status(200).json({ isAdmin: true });
      } catch (error) {
        console.error("Error checking admin:", error);
        res.status(500).json({ message: "Server error" });
      }
}