import React from "react";
import { Upload, FileWarning } from "lucide-react";
import { useFileUpload } from "../components/hooks/useFileUpload";
import { Client } from "../types";

interface FileUploadProps {
  onClientsLoaded: (clients: Client[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onClientsLoaded }) => {
  const { fileInputRef, fileName, error, handleFileChange, triggerFileInput } =
    useFileUpload({ onClientsLoaded });

  return (
    <div className="w-full">
      <div
        onClick={triggerFileInput}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {/* Input de arquivo oculto */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".xlsx,.xls"
        />
        {/* Ícone de upload */}
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        {/* Texto de instrução */}
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {fileName ? fileName : "Envie os dados dos clientes"}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Faça o upload de um arquivo Excel (.xlsx) com os detalhes dos clientes
        </p>
      </div>

      {/* Exibição de erro, se houver */}
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <FileWarning className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
