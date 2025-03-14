import { useState } from "react";
import axios from "axios";
import { Client, SendMessageResponse } from "../../types";

const useSendMessage = () => {
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
        setSendingStatus((prev) => ({ ...prev, [client.id]: "error" }));
      }
    } catch {
      setSendingStatus((prev) => ({ ...prev, [client.id]: "error" }));
    }
  };

  const handleSendAllMessages = async (clients: Client[]) => {
    for (let i = 0; i < clients.length; i++) {
      await handleSendMessage(clients[i]);
      if (i < clients.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  };

  return {
    sendingStatus,
    messages,
    setMessages,
    handleSendMessage,
    handleSendAllMessages,
  };
};

export default useSendMessage;
