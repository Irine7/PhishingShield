# PhishingShield: Phishing Detector for Blockchain Transactions

## 🛡️ Project Overview

PhishingShield is a web application designed to help cryptocurrency users detect and avoid phishing attempts in blockchain transactions and dApp interactions. It analyzes transaction strings, URLs, and contract addresses to identify suspicious patterns that may indicate fraud attempts.

## 🔍 Key Features

- **Transaction Analysis:** Scan transaction data, URLs, or contract addresses for potential phishing attempts.
- **Risk Assessment:** Visual risk gauge indicates threat level from low to high.
- **Detailed Analysis:** Provides specific findings about suspicious elements in the transaction.
- **Security Advice:** Offers actionable recommendations based on detected threats.
- **Scan History:** Maintains a log of previous transaction scans for reference.
- **Educational Resources:** Learn about common phishing tactics and how to avoid them.
- **Mock Transaction Testing:** Test the application with simulated phishing transactions to see how detection works.
- **Persistent Database:** All scan history and phishing patterns are stored in a PostgreSQL database.

## 💻 Technology Stack

- **Frontend:**
  - React with TypeScript
  - TailwindCSS for styling
  - shadcn/ui component library
  - React Query for data fetching
  - Recharts for data visualization

- **Backend:**
  - Express.js server
  - Drizzle ORM with PostgreSQL
  - Zod for validation

- **Analysis Engine:**
  - Pattern matching algorithms
  - Ethereum transaction parsing with ethers.js
  - Risk scoring system

## 🏗️ Project Structure

```
.
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and constants
│   │   ├── pages/        # Application pages
│   │   └── providers/    # Context providers
│
├── server/               # Backend Express application
│   ├── db.ts             # Database connection
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage implementation
│   └── vite.ts           # Vite development server
│
└── shared/               # Shared code between client and server
    └── schema.ts         # Database schema and types
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16+)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies with package manager
3. Set up environment variables:
   - Create a .env file with the DATABASE_URL variable

4. Initialize the database

5. Start the development server

## 📊 How Risk Assessment Works

The application analyzes transactions using multiple detection methods:

1. **Pattern Matching:** Checks transaction data against known phishing patterns.
2. **Domain Analysis:** Validates URLs against a database of suspicious domains.
3. **Contract Verification:** Compares contract addresses with known malicious contracts.
4. **Function Call Analysis:** Examines function calls for suspicious operations like unlimited approvals.

The risk score is calculated based on the severity and number of suspicious patterns found, with higher scores indicating greater risk.

## 🧪 Testing with Mock Transactions

The application includes a feature to test with mock phishing transactions:

1. Click the "Load Mock Transaction" button to insert a sample phishing transaction in the input field.
2. Click "Scan for Phishing" to analyze it.

Alternatively, click "Test Now" to automatically load and analyze a random mock phishing transaction.

## 📝 API Documentation

### Endpoints

- `POST /api/analyze`: Analyze a transaction
  - Request Body: `{ transaction: string }`
  - Response: Analysis result with risk level, findings, and advice

- `GET /api/phishing-patterns`: Get all phishing patterns

- `GET /api/phishing-patterns/:type`: Get phishing patterns by type

- `POST /api/phishing-patterns`: Add a new phishing pattern

- `DELETE /api/phishing-patterns/:id`: Delete a phishing pattern

- `GET /api/scans`: Get scan history

- `GET /api/scans/:id`: Get a specific scan

- `DELETE /api/scans/:id`: Delete a scan

## 🔮 Future Enhancements

- **Machine Learning Integration:** Improve detection with ML-based pattern recognition.
- **Browser Extension:** Direct integration with wallet browsers for real-time protection.
- **Community Reporting:** Allow users to report phishing attempts to improve the database.
- **Multi-blockchain Support:** Extend analysis to other blockchain networks.
- **Reputation System:** Track reputation scores for contracts and domains.
- **Transaction Simulation:** Simulate transactions in a sandbox to identify malicious behavior.

## 🔒 Security Considerations

This tool is intended as an aid to help identify potential phishing attempts but should not replace vigilance and good security practices:

- Always verify transaction details before signing.
- Check contract addresses on block explorers like Etherscan.
- Use hardware wallets when possible.
- Keep seed phrases offline and secure.
- Enable two-factor authentication where available.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
