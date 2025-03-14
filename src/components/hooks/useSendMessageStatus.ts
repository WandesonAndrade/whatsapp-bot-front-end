// import { Send, Check, X, Loader2 } from "lucide-react";
// import { useState } from "react";

// export type SendingStatus = "idle" | "loading" | "success" | "error";

// export const getStatusIcon = (status: SendingStatus) => {

//      const [sendingStatus, setSendingStatus] = useState<
//         Record<string, "idle" | "loading" | "success" | "error">
//       >({});

//       const [messages, setMessages] = useState<Record<string, string>>({});
//     switch (status) {
//         case "loading":
//             return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
//         case "success":
//             return <Check className="h-5 w-5 text-green-500" />;
//         case "error":
//             return <X className="h-5 w-5 text-red-500" />;
//         default:
//             return <Send/>;
//     }
// };

// export const updateSendingStatus = (
//   prev: Record<string, SendingStatus>,
//   clientId: string,
//   status: SendingStatus
// ): Record<string, SendingStatus> => {
//   return { ...prev, [clientId]: status };
// };
