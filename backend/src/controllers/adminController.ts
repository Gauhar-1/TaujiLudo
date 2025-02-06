import Admin from "../models/Admin";
import Profile from "../models/Profile";
import Transaction from "../models/Transaction";
import User from "../models/User";
import Battle from "../models/Battle";

export const createAdminDetails = async (req: any, res: any) => {
    
    const sumFieldValues = async (Model: any, field: string, filter: any = {}) => {
        try {
            const result = await Model.aggregate([
                { $match: filter },
                { $group: { _id: null, total: { $sum: `$${field}` } } }
            ]);

            return result.length > 0 ? result[0].total : 0;
        } catch (err) {
            console.error("Error in sumFieldValues:", err);
            return 0;
        }
    };

    const getTotalCount = async (Model: any, field: string | null, value: any | null) => {
        try {
            const filter = field && value ? { [field]: value } : {};
            return await Model.countDocuments(filter);
        } catch (err) {
            console.error("Error in getTotalCount:", err);
            return 0;
        }
    };

    const getTodaysCount = async (Model: any, field: string | null, value: any | null) => {
        try {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            if (field && value) {
                return await Model.countDocuments({ createdAt: { $gte: startOfDay }, [field]: value });
            } 
            
            if (field) {
                return await sumFieldValues(Model, "amount", { type: field, createdAt: { $gte: startOfDay } });
            }

            return await Model.countDocuments({ createdAt: { $gte: startOfDay } });
        } catch (err) {
            console.error("Error in getTodaysCount:", err);
            return 0;
        }
    };

    const getCommission = async () => {
        const entry = await sumFieldValues(Battle, "amount");
        const prize = await sumFieldValues(Battle, "prize");
        return (2 * entry) - prize;
    };

    const adminDetails = {
        totalUsers: await getTotalCount(User, "status", "active"),
        totalUsersWalletBalance: await sumFieldValues(Profile, "wallet"),
        todayNewUsers: await getTodaysCount(User, "status", "active"),
        todayBlockedUsers: await getTodaysCount(User, "status", "blocked"),
        todayGames: await getTodaysCount(Battle, null, null),
        allGames: await getTotalCount(Battle, null, null),
        totalSuccessGame: await getTotalCount(Battle, "status", "completed"),
        todayCancelGame: await getTodaysCount(Battle, "status", "canceled"),
        totalAdminCommission: await getCommission(),
        todayTotalDeposit: await getTodaysCount(Transaction, "deposit", null),
        todayTotalWithdraw: await getTodaysCount(Transaction, "withdraw", null),
        todayWonAmount: await getTodaysCount(Transaction, "prize", null),
        totalPendingKYC: await getTotalCount(Profile, "status", "pending"),
        totalApprovedKYC: await getTotalCount(Profile, "status", "active"),
        createdAt: new Date()
    };

    await Admin.create(adminDetails);

    console.log("Admin details created successfully.");

    res.status(200).json("Admin details created successfully.");
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
};
