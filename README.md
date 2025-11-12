
# TaujiLudo - A Ludo Wager-Matching Platform

TaujiLudo is a full-stack platform that allows users to create and join two-player Ludo battles, place wagers, and verify outcomes for matches played on external platforms like Ludo King. It features an integrated wallet, a secure result verification system using screenshot uploads, and a comprehensive admin panel for dispute resolution.

**Live Demo:** [https://tauji-ludo.vercel.app/]

**Note:** The Backend is hosted in Render with a free tier which leds to 50sec of delay on starting after a long period of inactivity. Please Bear 50sec to use it!

-----

## ⚙️ How It Works

The platform facilitates wagers on external Ludo games through a simple, secure workflow:

1.  **Create or Join a Battle:** A user sets a wager amount and creates a new battle, or joins an existing one.
2.  **Exchange Room Codes:** Once two players are matched, the app provides a secure space for them to exchange the room code for a game on an external app (like Ludo King).
3.  **Play Externally:** Players use the code to play their match on the third-party Ludo platform.
4.  **Verify Winner:** After the game, the winner returns to TaujiLudo and uploads a screenshot of their victory screen as proof.
5.  **Payout or Dispute:**
      * If the opponent agrees or doesn't contest, the winner is paid out automatically from the escrowed funds.
      * If both players upload a winning screenshot, a dispute is automatically created for admin intervention.

-----

To test the full functionality of the platform, you can use the following pre-configured demo accounts. Both accounts are pre-loaded with tokens to allow for creating and joining battles.

For the best experience, open the website in two different browsers (or an incognito window) to log in as both players simultaneously.

Player One
Phone Number: 7002926251 (ADMIN ACCESS)

Player Two
Phone Number: 9784889319 (ADMIN ACCESS)

## ✨ Key Features

### User-Facing Features

  * **Battle Matchmaking:** Create and join wager-based Ludo battles.
  * **Secure Code Exchange:** In-app system for players to share external game room codes.
  * **Screenshot Verification System:** Simple and effective proof-of-win upload functionality.
  * **Integrated Digital Wallet:**
      * Securely deposit and withdraw funds.
      * Funds are held in escrow during a battle.
      * View detailed transaction history.
  * **Referral Program:** Invite new users and earn rewards.

### Admin Panel Features

  * **Dispute Resolution Dashboard:** A dedicated interface for admins to review conflicting screenshot evidence and manually declare a winner.
  * **KYC Verification:** Review and approve user identity documents.
  * **Payment Management:** Approve or reject user deposit and withdrawal requests.
  * **User Management & Broadcasts:** Oversee all users and send platform-wide announcements.

-----

## 💻 Tech Stack

This platform was built using a modern and robust set of technologies:

  * **Frontend:** **React.js**, **TypeScript**, **Tailwind CSS**
  * **Backend:** **Node.js**, **Express.js**
  * **Database:** **MongoDB**
  * **Real-time Communication:** **Socket.IO / WebSockets** (for matchmaking and notifications)

-----

## 📜 Copyright and License

© 2025 MD Gohar Khan. All Rights Reserved.

The code in this repository is proprietary and may not be used, copied, modified, or distributed without the express written permission of the owner.

-----

## 📧 Contact

MD Gohar Khan - [mdg\_ug-22@mech.nits.ac.in](mailto:mdg_ug-22@mech.nits.ac.in)
