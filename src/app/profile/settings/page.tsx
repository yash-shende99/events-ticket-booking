import React from 'react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Accounts & Settings</h1>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p>Manage your account settings here.</p>
        </div>
      </div>
    </div>
  );
}
