// public/sw.js

self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
  
    event.waitUntil(
      self.registration.showNotification(data.title || "Park-O", {
        body: data.body || "You have a new notification!",
        icon: "/favicon-32x32.png", // Put a logo in public/ if you want
      })
    );
  });
  