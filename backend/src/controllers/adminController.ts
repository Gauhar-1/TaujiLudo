import Admin from "../models/Admin";
import Profile from "../models/Profile";
import Transaction from "../models/Transaction";
import User from "../models/User";
import Battle from "../models/Battle";

export const createAdminDetails = async (req: any, res: any) => {
    try {
        const sumFieldValues = async (Model: any, field: any, filter: any = {}) => {
            try {
                const result = await Model.aggregate([
                    { $match: filter },
                    { $group: { _id: null, total: { $sum: `$${field}` } } }
                ]);
                return result.length > 0 ? result[0].total : 0;
            } catch (err) {
                console.error(`Error summing ${field}:`, err);
                return 0;
            }
        };

        const getTotalCount = async (Model: any, field: any | null, value: any | null) => {
            try {
                return await Model.countDocuments(field && value ? { [field]: value } : {});
            } catch (err) {
                console.error(`Error counting documents in ${Model.collection.name}:`, err);
                return 0;
            }
        };

        const getTodaysCount = async (Model: any, field: any, value: any | null) => {
            try {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const filter: Record<string, any> = { createdAt: { $gte: startOfDay } };

                if (field && value) {
                    filter[field as string] = value; // Explicitly cast `field` as string
                }

                return field ? await sumFieldValues(Model, "amount", filter) : await Model.countDocuments(filter);
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

        // Run database queries in parallel
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
            sumFieldValues(Profile, "wallet"),
            getTodaysCount(User, "status", "active"),
            getTodaysCount(User, "status", "blocked"),
            getTodaysCount(Battle, null, null),
            getTotalCount(Battle, null, null),
            getTotalCount(Battle, "status", "completed"),
            getTodaysCount(Battle, "status", "canceled"),
            getCommission(),
            getTodaysCount(Transaction, "deposit", null),
            getTodaysCount(Transaction, "withdraw", null),
            getTodaysCount(Transaction, "prize", null),
            getTotalCount(Profile, "status", "pending"),
            getTotalCount(Profile, "status", "active")
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

        // Update if exists, otherwise create a new one
        const updatedAdmin = await Admin.findOneAndUpdate(
            {},  // Empty filter to match the first available document
            adminDetails,
            { upsert: true, new: true } // Creates if not found and returns the updated document
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