// Temporarily disabled for deployment
// import { usePrivy } from '@privy-io/react-auth';

import React from 'react';

const LoginMethodTest: React.FC = () => {
  return (
    <div style={{ 
      padding: '1rem', 
      background: '#f0f0f0', 
      borderRadius: '8px', 
      margin: '1rem 0',
      textAlign: 'center'
    }}>
      <p>🚧 Login methods temporarily disabled for deployment</p>
      <p>Full authentication functionality will be restored after resolving dependency conflicts</p>
    </div>
  );
};

// Export both default and named export for compatibility
export default LoginMethodTest;
export { LoginMethodTest };

// Original code commented out for deployment:
/*
import { usePrivy } from '@privy-io/react-auth';
import React from 'react';

const LoginMethodTest: React.FC = () => {
  const { login, logout, authenticated, user } = usePrivy();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Login Method Test</h2>
      
      {!authenticated ? (
        <button
          onClick={login}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      ) : (
        <div>
          <p className="mb-2">Welcome, {user?.email || 'User'}!</p>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginMethodTest;
*/ 