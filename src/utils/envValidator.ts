export const validateEnvironmentVariables = () => {
  const requiredVariables = [
    'NEXT_PUBLIC_ZERODEV_RPC',
    'NEXT_PUBLIC_CHAIN',
    'NEXT_PUBLIC_ZERODEV_PROJECT_ID',
    'NEXT_PUBLIC_PRIVY_APP_ID',
  ];

  const missingVariables = requiredVariables.filter((varName) => {
    const value = process.env[varName];
    return !value || value.trim() === '';
  });

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(', ')}\n` +
      `Please configure these variables in your .env file:\n` +
      requiredVariables.map(v => `- ${v}`).join('\n')
    );
  }
};
