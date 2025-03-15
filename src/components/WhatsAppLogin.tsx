import React, { useEffect, useState } from "react";
import axios from "axios";

const WhatsAppLogin = () => {
  const [qr, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Verificando conexão...");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Aguarda conexão após ler o QR

  // Função para capturar os status do Venom
  const getVenomStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/whatsapp/bot-status"
      );

      const venomStatus = response.data.status;
      console.log("📌 Status do Venom:", venomStatus);

      if (venomStatus === "Conectado ao WhatsApp!") {
        setIsConnected(true);
        setQrCode(null);
        setStatus("WhatsApp conectado!");
        setIsLoading(false);
      } else if (venomStatus === "qrReadSuccess") {
        setIsLoading(true);
        setStatus("QR escaneado! Aguardando conexão...");
      } else if (["waitForLogin", "waitChat"].includes(venomStatus)) {
        setIsLoading(true);
        setStatus("Aguardando login...");
      } else if (venomStatus === "notLogged") {
        setIsConnected(false);
        setIsLoading(false);
        setStatus("Aguardando QR Code...");
        fetchQRCode();
      }
    } catch (error) {
      console.error("Erro ao obter status do Venom:", error);
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

  useEffect(() => {
    getVenomStatus();
    const statusInterval = setInterval(getVenomStatus, 3000); // Atualiza a cada 3 segundos
    return () => clearInterval(statusInterval);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center bg-white p-8 shadow-xl rounded-lg max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {isConnected
            ? "WhatsApp Conectado"
            : isLoading
            ? "Aguardando conexão..."
            : "Escaneie o QR Code para se conectar"}
        </h2>

        {isConnected ? (
          <p className="text-green-600 font-semibold">
            ✅ Conectado ao WhatsApp
          </p>
        ) : isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
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
