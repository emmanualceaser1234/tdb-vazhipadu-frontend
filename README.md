# 🛕 Travancore Devaswom Board (TDB) – Vazhipadu Online Booking Portal

A modern, high-performance, accessible web application for online Vazhipadu (temple offering) bookings and temple administration under the Travancore Devaswom Board, Kerala.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Vitest**, adhering to strict **SonarQube** code quality standards and **WCAG 2.1 AA** accessibility specifications.

---

## 📋 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [How to Run](#-how-to-run)
   - [1. Install Dependencies](#1-install-dependencies)
   - [2. Start Development Server](#2-start-development-server)
   - [3. Run Automated Tests](#3-run-automated-tests)
   - [4. Build for Production](#4-build-for-production)
3. [How to Use the Application](#-how-to-use-the-application)
   - [A. Devotee Portal (Booking Flow)](#a-devotee-portal-booking-flow)
   - [B. Staff Portal (Login & Administration)](#b-staff-portal-login--administration)
   - [C. Managing Offerings](#c-managing-offerings)
   - [D. Managing Booked Orders](#d-managing-booked-orders)
4. [Dummy Login Credentials](#-dummy-login-credentials)
5. [Architecture & Features](#-architecture--features)

---

## ⚙️ Prerequisites

Before you start, ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (`v20.x` LTS recommended)
- **npm**: `v9.0.0` or higher
- **Git**

Verify your installation:
```bash
node -v
npm -v
```

---

## 🚀 How to Run

### 1. Install Dependencies
Open your terminal in the project directory (`tdb-vazhipadu-frontend`) and run:
```bash
npm install
```

### 2. Start Development Server
To launch the app with Hot Module Replacement (HMR):
```bash
npm run dev
```
Once started, open your browser and navigate to:
```
http://localhost:5173
```

### 3. Run Automated Tests
The project includes 55 comprehensive unit, integration, and accessibility tests across 7 test suites:
```bash
# Run all tests once
npm test -- --run

# Or run Vitest in interactive watch mode
npm test
```

### 4. Build for Production
To perform TypeScript compilation and produce an optimized production bundle:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 📖 How to Use the Application

### A. Devotee Portal (Booking Flow)
1. **Select a Temple**:
   - Use the temple selector dropdown at the top to choose a temple (e.g., *Sree Sabarimala Sastha Temple*, *Chottanikara Bhagavathy Temple*, *Ambalappuzha Sree Krishna Temple*).
2. **Browse & Filter Offerings**:
   - Browse the offerings list cards showing Malayalam and English names, pricing in ₹, category tags, and descriptions.
   - Use the search bar to filter offerings by name (e.g., *"Neyyabhishekam"*, *"Aravana"*, *"Pushpanjali"*).
3. **Add Offerings to Cart**:
   - Click **"Add"** on any offering card.
   - Adjust quantities using the `+` and `−` buttons.
   - The cart floating indicator updates in real-time.
4. **Review Cart & Fill Devotee Details**:
   - Click the **Cart button** in the top navigation bar to open the Cart Drawer.
   - Check the itemized formula breakdown (`Offering Subtotal + Optional Postal Prasadam Delivery`).
   - Fill in the required devotee booking form:
     - **Devotee Full Name**: (2–60 characters).
     - **Vedic Nakshatra (Star)**: Select from all 27 traditional Nakshatras (Ashwati, Bharani, Karthika, Rohini, etc.).
     - **Vazhipadu Date**: Select booking date (today or future dates).
     - **10-Digit Mobile Number**: Standard Indian phone format (`6-9` followed by 9 digits).
     - **Postal Prasadam Delivery (Optional)**: Toggle if you wish to receive consecrated prasadam at home via speed post (+₹50 delivery charge).
     - **Full Postal Address**: Required when postal delivery is selected.
5. **Submit & Confirm Booking**:
   - Click **"Place Order & Pay"**.
   - Built-in idempotency protection prevents duplicate charges on double-clicks.
   - Upon confirmation, an official TDB **Order Confirmation Card** is displayed showing your unique Order ID (`ORD-XXXXX`), devotee details, star, itemized receipt, and printable confirmation.

---

### B. Staff Portal (Login & Administration)
1. **Accessing Staff Portal**:
   - Click the **"Staff Portal"** button in the top navigation bar, or navigate directly to `http://localhost:5173/staff/orders`.
2. **Signing In**:
   - The staff area is protected behind an authentication gate.
   - Enter your official staff email and password, OR click any of the **Quick-Fill Demo Account** cards for 1-click access:
     - 🛡️ **TDB Central Administrator**
     - 🏛️ **Sabarimala Temple Officer**
     - 🛕 **Chottanikara Temple Officer**
   - Click **"Sign In to Staff Portal"**.
3. **Staff Dashboard Navigation**:
   - Once logged in, your name, administrative role badge (`ADMIN` or `TEMPLE_OFFICER`), and temple assignment are displayed at the top.
   - Use the sub-tabs to switch between:
     - 📋 **Booked Orders**
     - 🏷️ **Manage Offerings**
4. **Signing Out**:
   - Click the **"Sign Out"** button in the top right of the staff header at any time to end your session.

---

### C. Managing Offerings
*(Available once logged in as Staff)*
1. Click the **"Manage Offerings"** tab.
2. **Filter & Search Offerings**:
   - Filter offerings by temple assignment or search across all offerings.
3. **Modify an Offering**:
   - Click the **"Modify"** (pencil) button on any offering row.
   - An accessible modal dialog will open allowing you to edit:
     - **Offering Name** (English / Malayalam title)
     - **Price in Rupees (₹)**
     - **Category** (*Abhishekam*, *Archana*, *Payasam*, *Nivedyam*, *Special*)
     - **Description**
   - Click **"Save Changes"**. The offering updates immediately in the live system and devotee catalog.
4. **Toggle Availability (Active / Inactive)**:
   - Click the status badge (**"Active"** / **"Inactive"**) to enable or pause devotee bookings for specific vazhipadus during festival seasons or stock shortages.

---

### D. Managing Booked Orders
*(Available once logged in as Staff)*
1. Click the **"Booked Orders"** tab.
2. **Filter Orders**:
   - Filter by **Status**: `All`, `Confirmed`, `Completed`, or `Cancelled`.
   - Filter by **Date Range**: Today, This Week, This Month.
   - Search by **Devotee Mobile Number** or **Order Number**.
   - Notice that filters synchronize seamlessly with URL query parameters for bookmarkable search results.
3. **Cancel an Order**:
   - Click **"Cancel Order"** on any confirmed order to open the cancellation modal, record the reason, and release booking slots.

---

## 🔑 Dummy Login Credentials

The portal is pre-configured with three official staff accounts:

| Role | Officer Name | Official Email | Password | Temple Assignment |
| :--- | :--- | :--- | :--- | :--- |
| **Central Admin** | Narayanan Namboothiri | `admin@tdb.gov.in` | `admin123` | All Temples (TDB HQ) |
| **Temple Officer** | K. Radhakrishnan | `sabarimala@tdb.gov.in` | `ayyappa123` | Sabarimala Sastha Temple |
| **Temple Officer** | Sarada Devi | `chottanikara@tdb.gov.in` | `devi123` | Chottanikara Bhagavathy |

> 💡 **Tip:** On the Staff Login screen, you can click on any of the three demo cards to automatically populate the credentials and test instantly!

---

## 🏗️ Architecture & Features

- **Frontend Framework**: React 19 + TypeScript (Strict Type Safety).
- **Styling**: Tailwind CSS v4 with custom dark mode glassmorphism and Kerala temple gold/emerald aesthetics.
- **Routing**: React Router with URL query parameter state synchronization.
- **Form Validation**: Real-time accessible error feedback with Indian mobile phone and date range checks.
- **Accessibility (a11y)**:
  - Skip to main content link for keyboard users (`Tab`).
  - High-contrast text exceeding WCAG 2.1 AA 4.5:1 ratio.
  - Interactive touch targets sized at 44×44px or greater.
  - ARIA dialogs with `Escape` key close and focus retention.
  - `aria-live="polite"` regions announcing search results and status updates to screen readers.
- **Offline / Resilient Mock API**:
  - In-memory mock client with simulated latency and idempotency key caching.
  - Safe error recovery and retry buttons.
