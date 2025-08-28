# TurnaroundAI ✈️

**TurnaroundAI** is a comprehensive, cross-platform mobile application developed with React Native and Firebase, designed to streamline and optimize aircraft turnaround operations for airlines. This project tackles the significant challenge of ground crew coordination by providing a single, real-time source of truth, reducing costly delays and improving operational efficiency.

## The Problem

In the aviation industry, time is money. An aircraft on the ground is a non-performing asset. The turnaround process—unloading, cleaning, catering, refueling, and maintenance—is a complex ballet of different teams working under immense time pressure. Inefficient communication, lack of real-time visibility, and manual processes often lead to delays that have a cascading effect across an airline's network.

TurnaroundAI addresses these issues by replacing fragmented radio chatter and paper checklists with a smart, collaborative mobile tool.

## ✨ Key Features

* **Role-Based Dashboards:** A tailored UI for every user, whether they are a Supervisor, Ramp Agent, or Maintenance Engineer.
* **Real-Time Interactive Checklists:** Tasks updated by one crew member are instantly synced across all other team members' devices.
* **Supervisor Oversight:** Supervisors get a high-level view of all ongoing turnarounds, with the ability to drill down into specifics.
* **Detailed Task Assignment:** Tasks are assigned to specific individuals, not just roles, ensuring clear accountability.
* **Delay Reporting & Tracking:** A formal workflow for staff to report delays with specific reasons, providing valuable data for operational analysis.
* **Secure Authentication:** Powered by Firebase Authentication for secure, role-based access.

## 🛠️ Technology Stack

* **Cross-Platform Framework:** React Native (with Expo)
* **Styling:** NativeWind (Tailwind CSS for React Native)
* **Backend & Database:** Google Firebase (Firestore, Authentication)
* **Icons:** Lucide React Native

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

* Node.js (LTS version)
* Expo Go app on your mobile device or an Android/iOS simulator
* A Firebase project

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/TurnaroundAI.git](https://github.com/your-username/TurnaroundAI.git)
    cd TurnaroundAI
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Configure Firebase:**
    * Create a project on the [Firebase Console](https://console.firebase.google.com/).
    * Enable **Email/Password** authentication in the Authentication tab.
    * Create a **Firestore Database** and start in **test mode**.
    * In your project settings, register a new **Web app** and copy the `firebaseConfig` object.
    * Paste your `firebaseConfig` object into the `App.js` file.

4.  **Set up the Database Seeding Script:**
    * In your Firebase project settings, go to **Service Accounts** and generate a new private key.
    * Save the downloaded `.json` file as `serviceAccountKey.json` in the root of the project.
    * Create a few users in the Firebase Authentication tab (e.g., `supervisor@test.com`).
    * Open the `seedDatabase.js` file and replace the placeholder UIDs with the actual UIDs of the users you created.

5.  **Populate the database:**
    ```sh
    npm run seed
    ```

### Running the Application

1.  **Start the Metro bundler:**
    ```sh
    npx expo start
    ```
2.  Scan the QR code with the Expo Go app on your phone, or press `a` or `i` to launch on a simulator.

## 🔮 Future Development

The next major phase of this project is to integrate the "AI" into TurnaroundAI:

* **Sprint 3: Predictive Scheduling:** Develop an AI model to analyze historical data and predict the most efficient task schedule for any given flight, flagging potential bottlenecks before they happen.
* **Sprint 4: AI Vision for Damage Assessment:** Implement a computer vision model allowing maintenance crew to take a photo of minor fuselage damage and get an instant preliminary assessment.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/TurnaroundAI/issues).

## 📄 License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
