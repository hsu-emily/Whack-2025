import React from 'react';

/**
 * Layout component that applies a pink-to-white radial gradient background
 * and centers its children. Use this to wrap all pages for a consistent look.
 *
 * Usage:
 * <Layout>
 *   <YourPageComponent />
 * </Layout>
 */
export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center relative"
      style={{
        background: 'radial-gradient(circle at 50% 30%, #ffe4f0 0%, #fff 80%)',
        fontFamily: '"Press Start 2P", cursive',
      }}
    >
      {children}
    </div>
  );
} 