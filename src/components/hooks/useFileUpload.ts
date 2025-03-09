/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Client } from "../../types";

interface UseFileUploadProps {
  onClientsLoaded: (clients: Client[]) => void;
}

export const useFileUpload = ({ onClientsLoaded }: UseFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      setError("Por favor, envie um arquivo do tipo Excel (.xlsx ou .xls)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const clients = jsonData.map((row: any, index: number) => {
          if (!row.Cliente || !row.Contatos || !row.Vencimento) {
            throw new Error("Colunas obrigatórias ausentes no arquivo Excel.");
          }

          return {
            id: `client-${index}`,
            name: row.Cliente,
            phoneNumber: row.Contatos.toString(),
            dueDate: row.Vencimento,
          };
        });

        onClientsLoaded(clients);
      } catch (err) {
        setError((err as Error).message || "Erro ao processar o arquivo");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setFileName(null);
      }
    };

    reader.onerror = () => {
      setError("Falha ao ler o arquivo");
      setFileName(null);
    };

    reader.readAsArrayBuffer(file);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  return { fileInputRef, fileName, error, handleFileChange, triggerFileInput };
};
