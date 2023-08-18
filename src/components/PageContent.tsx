import React, { ReactNode } from 'react';

interface PageContentProps {
  title: string;
  children: ReactNode;
}

function PageContent({ title, children }: PageContentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export default PageContent;

