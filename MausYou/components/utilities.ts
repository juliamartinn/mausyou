import { ExpoPushMessage } from "./Models";

export default async function sendPushNotification(expoPushToken: string, message: ExpoPushMessage) {
  const messageBody = {
    to: expoPushToken,
    sound: 'default',
    title: message.title || 'Hello!',
    body: message.body || 'This is a test notification.',
    data: message.data || {},
  };

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(messageBody),
  });

  const data = await response.json();
  if (response.ok) {
    console.log('Notification sent successfully:', data);
  } else {
    console.error('Failed to send notification:', data);
  }
}
