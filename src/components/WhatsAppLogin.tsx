import React, { useEffect, useState } from "react";
import axios from "axios";

const WhatsAppLogin = () => {
  const [qr, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Verificando conexão...");
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // Função para verificar o status da conexão
  const checkConnectionStatus = async () => {
    try {
      const response = await axios.get("http://localhost:3000/whatsapp/status");
      if (response.data.conectado) {
        setIsConnected(true);
        setQrCode(null);
        setStatus("WhatsApp já está conectado!");
      } else {
        setIsConnected(false);
        fetchQRCode();
      }
    } catch (error) {
      console.error("Erro ao verificar status do WhatsApp:", error);
      setStatus("Erro ao verificar conexão.");
    }
  };

  // Função para buscar o QR Code do backend
  const fetchQRCode = async () => {
    try {
      const response = await axios.get("http://localhost:3000/whatsapp/qr");
      setQrCode(response.data.qr);
      setStatus("Escaneie o código para se conectar!");
    } catch (error) {
      console.error("Erro ao carregar QR Code:", error);
      setStatus("Erro ao carregar QR Code.");
    }
  };

  // Função para capturar os status do Venom
  const getVenomStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/whatsapp/venom-status"
      );
      setStatus(response.data.status || "Aguardando status...");
    } catch (error) {
      console.error("Erro ao obter status do Venom:", error);
    }
  };

  useEffect(() => {
    checkConnectionStatus();
    const statusInterval = setInterval(getVenomStatus, 2000); // Atualiza a cada 5 segundos
    return () => clearInterval(statusInterval);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center bg-white p-8 shadow-xl rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {isConnected
            ? "WhatsApp Conectado"
            : "Escaneie o QR Code para se conectar"}
        </h2>
        {isConnected ? (
          <p className="text-green-600 font-semibold">
            ✅ Conectado ao WhatsApp
          </p>
        ) : qr ? (
          <img
            src={qr}
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
