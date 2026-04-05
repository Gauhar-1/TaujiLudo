# TaujiLudo 🎲

TaujiLudo is a highly secure, full-stack, real-time multiplayer Ludo and wager-matching platform. Originally built as a freelance project, this platform has been completely re-architected and redesigned from the ground up to meet production-level standards. It features an interactive 3D landing page, a custom-built real-time Ludo arena, a robust financial ecosystem with manual KYC, and a comprehensive admin resolution center.

**Live Demo:** [https://taujiludo.qzz.io](https://taujiludo.qzz.io)

> **⚠️ Hosting Note:** The backend is currently hosted on Render's free tier. If the platform has been inactive, the initial load may take up to 50 seconds to spin up. Thank you for your patience!

---

## 🚀 About the Project

TaujiLudo is designed to offer a seamless, high-stakes board game experience. Moving away from third-party application dependencies, the platform now features its own state-managed, real-time Ludo arena. It ensures fair play through strict turn timers, handles complex financial transactions (deposits, withdrawals, and referrals), and maintains platform integrity through a rigorous, admin-controlled KYC and dispute resolution system. 

---

## ✨ Key Features

### 🎮 Immersive Gameplay & Matchmaking
* **3D Landing Experience:** An engaging, interactive 3D landing page built to provide a premium UI/UX from the first click.
* **Custom Matchmaking:** Users have full control over their wagers. They can create new challenges with specific bet amounts or browse and join existing live battle requests.
* **In-App Real-Time Arena:** Players compete directly on the platform in a custom 1v1 classic Ludo environment. 
* **State-Managed Turn System:** Strict, server-enforced timers keep the game moving. Players have 15 seconds to roll the dice and another 15 seconds to execute a move. Missing the window forfeits the turn.
* **Admit Defeat & Pause Mechanics:** Players can formally concede a match. If a player disconnects or pauses, the opponent can request admin intervention.

### 💰 Financial Ecosystem
* **Integrated Escrow Wallet:** Wagers are locked in escrow the moment a match begins and are automatically credited to the victor's wallet upon completion.
* **Manual Verification System:** To prevent fraud, all deposits are manually verified by admins via payment screenshots before wallet funds are credited.
* **Secure Withdrawals:** Users can withdraw winnings directly to their Bank Account or UPI after passing KYC.
* **Automated Referral Engine:** Users earn a 2% commission from the winning matches of anyone they refer, automatically credited to their wallet.

### 🛡️ Security & Admin Control
* **Rigorous KYC Verification:** Withdrawals are locked behind a manual KYC process. Users must upload their Aadhar card, which is securely reviewed and approved by the admin team.
* **Dispute Resolution Dashboard:** Admins have access to backend game logs. If a game is paused indefinitely or disputed, admins can review the match data, dismiss the game, or manually assign a winner.
* **256-Bit Encryption Standard:** Secure login and data protection protocols ensure user privacy and financial safety.

---

## 💻 Tech Stack

This platform leverages a modern, scalable architecture:

* **Frontend:** React.js, TypeScript, Tailwind CSS, Three.js 
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Real-Time Communication:** Socket.IO / WebSockets (powers the live Ludo arena, matchmaking, and instant UI updates)

---

## ⚙️ User Journey: How It Works

1. **Onboarding:** A user signs up, securely logs in, and uploads their Aadhar card for KYC verification to unlock full platform capabilities.
2. **Funding the Wallet:** The user initiates a deposit, transfers funds via UPI/Bank, and uploads a screenshot. An admin verifies the screenshot and credits the wallet.
3. **Entering the Arena:** The user creates a battle request for a specific amount (e.g., ₹50). Another user accepts the challenge.
4. **The Match:** Both players are routed to a secure waiting room, then deployed into the 3D-styled Ludo board. They play in real-time under strict 15-second turn limits.
5. **The Payout:** The winner's wallet is instantly credited with the combined wager.
6. **Withdrawal:** The winner requests a withdrawal to their UPI, which an admin reviews and processes.

---

## 📜 Copyright and License

© 2026 MD Gohar Khan. All Rights Reserved.

The code in this repository is proprietary and may not be used, copied, modified, or distributed without the express written permission of the owner.

---

## 📧 Contact

**MD Gohar Khan** * **Email:** [mdg_ug-22@mech.nits.ac.in](mailto:mdg_ug-22@mech.nits.ac.in)
* **LinkedIn:** [MD Gohar Khan](https://www.linkedin.com/in/md-gohar-khan-bb9275321)
* **GitHub:** [Gauhar-1](https://github.com/Gauhar-1)