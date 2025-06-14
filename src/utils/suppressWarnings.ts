// Utility to suppress known non-critical warnings in development
export function suppressKnownWarnings() {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
    return;
  }

  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;

  // List of warning patterns to suppress
  const suppressedWarnings = [
    'mathTaming',
    'dateTaming',
    'Removing unpermitted intrinsics',
    'toTemporalInstant',
    'lockdown-install.js'
  ];

  // Override console.warn
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    const shouldSuppress = suppressedWarnings.some(pattern => 
      message.includes(pattern)
    );
    
    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };

  // Override console.error for specific non-critical errors
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    const shouldSuppress = suppressedWarnings.some(pattern => 
      message.includes(pattern)
    );
    
    if (!shouldSuppress) {
      originalError.apply(console, args);
    }
  };

  // Log that suppression is active
  console.log('🔇 Development warning suppression active');
} 