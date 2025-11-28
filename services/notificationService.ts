export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notification");
    return false;
  }
  
  if (Notification.permission === "granted") {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const sendNotification = (title: string, body: string) => {
  if (!("Notification" in window)) return;
  
  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2983/2983705.png', // Laundry basket icon
        silent: false,
      });
    } catch (e) {
      console.error("Notification failed", e);
    }
  }
};
