import React, { useRef, useState } from "react";
import { Upload, FileWarning } from "lucide-react";
import * as XLSX from "xlsx";
import { Client } from "../types";

interface FileUploadProps {
  onClientsLoaded: (clients: Client[]) => void;
}
interface ExcelRow {
  Cliente: string;
  Contatos: string;
  Vencimento: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onClientsLoaded }) => {
  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState<string | null>(null);
  // Estado para armazenar o nome do arquivo selecionado
  const [fileName, setFileName] = useState<string | null>(null);

  // Função para lidar com a seleção de um arquivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    // Verifica se o arquivo é um Excel válido
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Por favor, envie um arquivo do tipo Excel (.xlsx ou .xls)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // Lê os dados do arquivo como um ArrayBuffer
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // Obtém a primeira planilha do arquivo
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        // Converte a planilha para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Valida e transforma os dados extraídos
        const clients = jsonData.map((row: unknown, index) => {
          const excelRow = row as ExcelRow;
          // Verifica se todas as colunas necessárias estão preenchidas
          if (
            !excelRow.Cliente ||
            !excelRow["Contatos"] ||
            !excelRow["Vencimento"]
          ) {
            throw new Error(
              "Campos obrigatórios ausentes. Certifique-se de que o arquivo Excel contém as colunas Nome, Número de Telefone e Data de Vencimento."
            );
          }

          return {
            id: `client-${index}`,
            name: excelRow.Cliente,
            phoneNumber: excelRow["Contatos"].toString(),
            dueDate: excelRow["Vencimento"],
          };
        });

        onClientsLoaded(clients);
      } catch (err) {
        setError(
          (err as Error).message || "Falha ao processar o arquivo Excel"
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setFileName(null);
      }
    };

    reader.onerror = () => {
      setError("Falha ao ler o arquivo");
      setFileName(null);
    };

    reader.readAsArrayBuffer(file);
  };

  // Função para simular o clique no input de arquivo
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
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
