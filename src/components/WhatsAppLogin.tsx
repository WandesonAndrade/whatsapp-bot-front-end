// src/components/WhatsAppLogin.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const WhatsAppLogin: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Aguardando conexão...");

  // Função para buscar o QR Code do backend
  const fetchQRCode = async () => {
    try {
      const response = await axios.get("http://localhost:3000/qr");
      setQrCode(response.data.qr); // Atualiza o estado com o QR code
      setStatus("Escaneie o código para se conectar!");
    } catch (error) {
      console.error("Erro ao carregar o QR Code:", error);
      setStatus("Erro ao carregar QR Code.");
    }
  };

  useEffect(() => {
    fetchQRCode();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center bg-white p-8 shadow-xl rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Escaneie o QR Code para se conectar ao WhatsApp
        </h2>
        {qrCode ? (
          <img
            src={qrCode}
            alt="QR Code"
            className="w-full h-auto border border-gray-300 mt-4"
          />
        ) : (
          <p className="text-gray-500">Carregando QR Code...</p>
        )}
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
};

export default WhatsAppLogin;
