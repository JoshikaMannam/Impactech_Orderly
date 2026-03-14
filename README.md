
# Orderly – AI Voice Activated Order Management System

## Overview

**Orderly** is an AI-powered voice-controlled order management system that allows users to create, modify, track, and cancel orders using natural voice commands instead of manual input.

The system converts voice commands into structured actions using speech recognition and AI-powered intent detection.

Example commands:

* “Create a new order for two burgers”
* “Add one pizza to my order”
* “Cancel my last order”
* “Track order number 15”

The system then processes the request and updates the order in real time.

---

# Core Idea

The goal of **Orderly** is to demonstrate how **voice interfaces and AI-powered natural language understanding can simplify order management systems** used in:

* Restaurants
* Warehouses
* Logistics
* Retail systems
* Inventory management

Instead of typing or clicking, users interact with the system **using natural conversation**.

---

# System Architecture

The system follows a modular pipeline:

```
User Voice
   ↓
Web Speech API (Speech-to-Text)
   ↓
Frontend Command Processing
   ↓
AI Intent Detection (OpenAI / Gemini)
   ↓
Backend API (FastAPI)
   ↓
Order Management Logic
   ↓
MySQL Database
   ↓
Response Generator
   ↓
UI Update + Voice Feedback
```

Each module performs a specific role to keep the architecture clean and scalable.

---

# Tech Stack

## Frontend

The frontend provides the **voice interface and dashboard**.

Technologies used:

* **React** – UI framework
* **JavaScript**
* **TailwindCSS / Bootstrap** – UI styling
* **Web Speech API** – voice input
* **SpeechSynthesis API** – voice responses
* **Chart.js / Recharts** – analytics dashboards

Development Tool:

* VS Code

Hosting:

* **Vercel**

Advantages:

* fast deployment
* automatic GitHub deployments
* public demo URL

---

# Backend

The backend handles the **core business logic and order management operations**.

Technology:

* **Python**
* **FastAPI**
* REST APIs
* JWT Authentication

Responsibilities:

* Create orders
* Modify orders
* Cancel orders
* Track orders
* Generate recommendations
* Communicate with AI services

---

# AI Layer

The AI layer enables the system to **understand natural language voice commands**.

APIs used:

* OpenAI API or Gemini API

The AI performs:

### Intent Recognition

Detects what the user wants to do.

Example:

```
"Add one pizza to my order"
```

Intent:

```
ADD_ITEM
```

---

### Entity Extraction

Extracts structured data.

Example:

```
Item: Pizza
Quantity: 1
```

---

### Context Understanding

The system remembers the current order so users can say:

```
"Add fries"
```

without specifying the order number.

---

### Smart Recommendations

Example:

```
Customers who ordered burgers often add fries.
Would you like to add fries?
```

---

# Database

The system uses **MySQL** for structured storage.

Tables include:

### Users

Stores user information.

### Orders

Stores:

* Order ID
* User ID
* Status
* Timestamp
* Estimated delivery time

### Order Items

Stores:

* item name
* quantity
* order ID

### Order History

Stores previous orders for analytics.

---

# Backend Hosting

Since the frontend is deployed on **Vercel**, the backend can run on:

* **Render**
* **Railway**
* **Localhost** (for hackathon demo)

Using localhost during judging is acceptable for hackathons.

---

# Core Features

### Voice Order Creation

Users can create orders using voice commands.

Example:

```
Create a new order for two burgers
```

---

### Voice Order Modification

Users can update existing orders.

Example:

```
Add one pizza to my order
```

---

### Order Tracking

Users can check order status.

Example:

```
Track order number 15
```

---

### Order Cancellation

Users can cancel orders via voice.

Example:

```
Cancel my order
```

---

### Voice Feedback

The system responds with voice.

Example:

```
"Your order has been updated."
```

---

# Analytics Dashboard

The system includes a simple analytics dashboard showing:

* orders processed
* most popular items
* average order time
* order status distribution

Graphs are built using **Chart.js or Recharts**.

---


Processing steps:

1. Web Speech API converts voice → text
2. Text sent to AI model
3. AI extracts intent and entities
4. Backend processes request
5. Database updated
6. UI dashboard updates
7. Voice response confirms action

---

# Development Tools

* VS Code
* GitHub
* Vercel
* Postman (API testing)

---

# Deployment

Frontend:

* Vercel

Backend:

* Render / Railway / Localhost

Database:

* MySQL

---

# Future Enhancements

Potential improvements include:

* multilingual voice support
* AI-powered upselling
* POS system integration
* predictive analytics