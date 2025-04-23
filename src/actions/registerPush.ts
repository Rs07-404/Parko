const registerPush = async (userId: string) => {
    const registration = await navigator.serviceWorker.register('/sw.js');
  
    const existingSubscription = await registration.pushManager.getSubscription();
  
    if (!existingSubscription) {
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
  
      // Send to backend to store in DB
      await fetch('/api/save-subscription', {
        method: 'POST',
        body: JSON.stringify({ subscription: newSubscription, userId: userId }),
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      console.log("Already subscribed to push");
    }
  };

  export default registerPush;