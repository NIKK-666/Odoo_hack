Here's an updated `README.md` that includes the deployed link to your project:

---

# Odoo Hack

A powerful web-based **Skill Swap Platform** built using HTML, CSS, TypeScript, Firebase, and modern UI design. This project was created as part of the **Odoo Hack** challenge.

🔗 **Live Demo:** [https://subtle-bubblegum-799e49.netlify.app](https://subtle-bubblegum-799e49.netlify.app)

---

## 🚀 Features

* 🔐 **Authentication**: Firebase login system for secure access.
* 📝 **User Profile**: Add your name, skills offered, skills to learn, and availability.
* 🔍 **Skill Search**: Find people based on skills using a dynamic search system.
* 🔄 **Swap Requests**:

  * Send, accept, reject, or delete swap requests.
  * See pending and accepted swaps.
* 🌟 **Rating & Feedback**: Provide feedback after a skill swap (coming soon).
* 🛠️ **Admin Dashboard**:

  * Ban users violating policy.
  * Approve/reject inappropriate profiles or swaps.
  * View usage reports and platform analytics.

---

## 🗂️ File Structure

```text
Odoo_hack/
├── public/                # Static files (HTML/CSS)
├── src/                   # TypeScript app logic
│   ├── app.ts             # Main app logic
│   ├── firebase.ts        # Firebase initialization
│   ├── auth.ts            # Auth logic
│   ├── swaps.ts           # Swap request handling
│   └── admin.ts           # Admin features
├── firebase.json          # Firebase hosting & rules
├── tsconfig.json          # TypeScript config
├── package.json           # Dependencies
└── README.md
```

---

## 🛠️ Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/NIKK-666/Odoo_hack.git
   cd Odoo_hack
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run locally**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

---

## 🧩 Tech Stack

* **Frontend**: HTML, CSS, TypeScript
* **Backend**: Firebase (Auth, Realtime Database)
* **Deployment**: Netlify
* **Auth & DB Security**: Firebase security rules

---




## 📄 License

This project is licensed under the MIT License.

---


