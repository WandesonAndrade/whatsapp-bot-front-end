import React, { useState } from "react";
import { Client, SendMessageResponse } from "../types";
import { Send, Check, X, Loader2 } from "lucide-react";
import axios from "axios";

interface ClientTableProps {
  clients: Client[];
}

const ClientTable: React.FC<ClientTableProps> = ({ clients }) => {
  const [sendingStatus, setSendingStatus] = useState<
    Record<string, "idle" | "loading" | "success" | "error">
  >({});

  const [messages, setMessages] = useState<Record<string, string>>({});

  const cleanPhoneNumber = (phoneNumber: string) => {
    return phoneNumber.replace(/[^0-9]/g, "");
  };

  const handleSendMessage = async (client: Client) => {
    const cleanedPhoneNumber = cleanPhoneNumber(client.phoneNumber);

    messages[client.id] =
      messages[client.id] ||
      `Olá, ${client.name}!

      Notamos que há um débito pendente em sua conta com a Paraíso Internet.

      Para regularizar sua situação, o pagamento pode ser feito via PIX na chave: financeiro@paraisointernet.com.br 

      ou acessando a Central do Assinante: 

      🔗 https://paraisointernet.sgp.tsmx.com.br/accounts/central/login. 
      
      Se já pagou, envie o comprovante para atualização.
      Caso precise de mais informações ou de um acordo, estamos à disposição.
      
      Atenciosamente, 
      Equipe Paraíso Internet.`;

    setSendingStatus((prev) => ({ ...prev, [client.id]: "loading" }));
    console.log("Enviando dados para o servidor:", messages[client.id]);

    try {
      const response = await axios.post<SendMessageResponse>(
        "http://localhost:3000/whatsapp/send-message",
        {
          number: cleanedPhoneNumber,
          message: messages[client.id],
        }
      );

      if (response.data.success) {
        setSendingStatus((prev) => ({ ...prev, [client.id]: "success" }));
      } else {
        console.error("Error sending message:", response.data.message);
        setSendingStatus((prev) => ({ ...prev, [client.id]: "error" }));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSendingStatus((prev) => ({ ...prev, [client.id]: "error" }));
    }
  };

  const handleSendAllMessages = async () => {
    for (let i = 0; i < clients.length; i++) {
      await handleSendMessage(clients[i]);
      if (i < clients.length - 1) {
        // Aguarda 3 segundos antes de enviar para o próximo cliente
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  };

  const handleMessageChange = (clientId: string, message: string) => {
    setMessages((prev) => ({ ...prev, [clientId]: message }));
  };

  const getStatusIcon = (status: "idle" | "loading" | "success" | "error") => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "success":
        return <Check className="h-5 w-5 text-green-500" />;
      case "error":
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Send className="h-5 w-5 text-gray-500" />;
    }
  };

  if (clients.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Cliente
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Telefone
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Vencimento
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Messagem
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Send</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {clients.map((client) => (
            <tr key={client.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {client.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {client.phoneNumber}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {client.dueDate}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                <textarea
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Digite a mensagem aqui"
                  value={messages[client.id] || ""}
                  onChange={(e) =>
                    handleMessageChange(client.id, e.target.value)
                  }
                />
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button
                  onClick={() => handleSendMessage(client)}
                  disabled={sendingStatus[client.id] === "loading"}
                  className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                    sendingStatus[client.id] === "loading"
                      ? "bg-gray-300 cursor-not-allowed"
                      : sendingStatus[client.id] === "success"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : sendingStatus[client.id] === "error"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  <span className="mr-2">
                    {getStatusIcon(sendingStatus[client.id] || "idle")}
                  </span>
                  {sendingStatus[client.id] === "loading"
                    ? "Sending..."
                    : sendingStatus[client.id] === "success"
                    ? "Sent"
                    : sendingStatus[client.id] === "error"
                    ? "Failed"
                    : "Send"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botão para enviar todas as mensagens */}
      <div className="mt-4">
        <button
          onClick={handleSendAllMessages}
          disabled={clients.some(
            (client) => sendingStatus[client.id] === "loading"
          )}
          className="inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500"
        >
          {clients.some((client) => sendingStatus[client.id] === "loading")
            ? "Sending All..."
            : "Send All Messages"}
        </button>
      </div>
    </div>
  );
};

export default ClientTable;
