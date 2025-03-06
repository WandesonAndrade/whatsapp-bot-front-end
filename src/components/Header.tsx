import React from 'react';
import { MessageSquare } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <MessageSquare className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">WhatsApp Automation</h1>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Upload client data and send automated WhatsApp messages
        </p>
      </div>
    </header>
  );
};

export default Header;