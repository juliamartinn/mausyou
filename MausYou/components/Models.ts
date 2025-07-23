export type ExpoPushMessage = {
  title?: string;           // optional, der Titel der Notification
  body?: string;            // optional, der Text der Notification
  data?: Record<string, any>; // optional, zusätzliche Daten (beliebige key-value Paare)
};