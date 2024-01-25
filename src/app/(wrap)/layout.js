import ClientLayout from '@/components/layouts/ClientLayout';
import React from 'react';

const layout = ({ children }) => {
  return (
    <>
      <ClientLayout>{children}</ClientLayout>
    </>
  );
};

export default layout;
