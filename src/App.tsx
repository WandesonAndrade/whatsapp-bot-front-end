import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ClientTable from "./components/ClientTable";
import Header from "./components/Header";
import StatusBar from "./components/StatusBar";
import { Client } from "./types";
import { FileSpreadsheet } from "lucide-react";

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [status, setStatus] = useState<{
    type: "info" | "success" | "error";
    message: string;
  } | null>(null);

  const handleClientsLoaded = (loadedClients: Client[]) => {
    setClients(loadedClients);
    setStatus({
      type: "success",
      message: `Successfully loaded ${loadedClients.length} client records.`,
    });
  };

  const dismissStatus = () => {
    setStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {status && (
          <div className="mb-6">
            <StatusBar
              type={status.type}
              message={status.message}
              onDismiss={dismissStatus}
            />
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Upload Client Data
          </h2>
          <FileUpload onClientsLoaded={handleClientsLoaded} />
        </div>

        {clients.length > 0 ? (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Client Messages
            </h2>
            <ClientTable clients={clients} />
          </div>
        ) : (
          <div className="mt-8 bg-white shadow rounded-lg p-12 text-center">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No client data
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload an Excel file to see client data here
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white mt-12 py-6 border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            WhatsApp Messaging Automation System © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
