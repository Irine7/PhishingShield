import { ethers } from 'ethers';

// Helper function to determine if a string is likely a transaction hash
export const isTransactionHash = (input: string): boolean => {
  return /^0x([A-Fa-f0-9]{64})$/.test(input);
};

// Helper function to determine if a string is likely an Ethereum address
export const isEthereumAddress = (input: string): boolean => {
  return /^0x([A-Fa-f0-9]{40})$/.test(input);
};

// Helper function to extract function name from transaction data
export const extractFunctionName = (input: string): string | null => {
  // Look for common patterns like functionName( or .functionName(
  const functionMatch = input.match(/\.([\w]+)\(|(\w+)\(/);
  if (functionMatch) {
    return functionMatch[1] || functionMatch[2] || null;
  }
  return null;
};

// Helper function to check if address has code (is a contract)
export const isContract = async (address: string, provider: ethers.JsonRpcProvider): Promise<boolean> => {
  try {
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch (error) {
    console.error('Error checking if address is contract:', error);
    return false;
  }
};

// Helper function to check if a transaction is an approval
export const isApprovalTransaction = (input: string): boolean => {
  return input.includes('approve(') || input.includes('setApprovalForAll(');
};

// Helper function to check if unlimited approval
export const isUnlimitedApproval = (input: string): boolean => {
  // Common max uint256 value patterns in approvals
  const maxValuePatterns = [
    'ffffffffffffffffffffffffffffffffffffffff',
    '115792089237316195423570985008687907853269984665640564039457584007913129639935'
  ];
  
  return maxValuePatterns.some(pattern => input.includes(pattern));
};

// Helper function to parse transaction data
export const parseTransaction = (txData: string): ethers.TransactionRequest | null => {
  try {
    // If it's already a JSON string, try to parse it
    if (txData.trim().startsWith('{')) {
      return JSON.parse(txData);
    }
    
    // Otherwise, try to extract components manually
    const toMatch = txData.match(/to:?\s*["']?(0x[a-fA-F0-9]{40})["']?/i);
    const valueMatch = txData.match(/value:?\s*["']?(\d+)["']?/i);
    const dataMatch = txData.match(/data:?\s*["']?(0x[a-fA-F0-9]*)["']?/i);
    
    if (toMatch) {
      return {
        to: toMatch[1],
        value: valueMatch ? valueMatch[1] : '0',
        data: dataMatch ? dataMatch[1] : '0x'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing transaction data:', error);
    return null;
  }
};
