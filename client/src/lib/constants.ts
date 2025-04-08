export const PHISHING_TACTICS = [
  {
    title: 'Fake Websites',
    description: 'Scammers create near-identical copies of popular dApps with slight URL differences.',
  },
  {
    title: 'Token Approvals',
    description: 'Malicious contracts request unlimited token allowances to drain wallets later.',
  },
  {
    title: 'Blind Signing',
    description: 'Complex transactions that hide malicious operations behind legitimate-looking requests.',
  },
  {
    title: 'Airdrop Scams',
    description: 'Free token claims that require interacting with malicious contracts.',
  },
];

export const RISK_LEVEL_DESCRIPTIONS = {
  high: 'This transaction appears to be highly suspicious and may be a phishing attempt. We strongly recommend NOT proceeding with this transaction.',
  medium: 'This transaction contains some suspicious elements. Proceed with caution and verify all details carefully.',
  low: 'This transaction appears to be legitimate, but always verify details before signing.',
};

export const SECURITY_ADVICE = {
  high: [
    'Check the URL carefully.',
    'Verify the contract address on a block explorer.',
    'Do not approve unlimited token spending.',
    'Consider rejecting this transaction completely.',
  ],
  medium: [
    'Verify the destination address.',
    'Check that token amounts are as expected.',
    'Consider using a hardware wallet for this transaction.',
  ],
  low: [
    'Even with low-risk transactions, always check the transaction details before signing.',
  ],
};
