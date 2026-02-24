importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
// We must not use import.meta.env here since it is a pure JS file running in an isolated scope.
// However, Firebase requires it. We will leave it empty and pass it during register, or hardcode the basic identifiers.
// Since the project config is public, we would ideally inject it. For now, we will rely on getToken service worker registration passing the config implicitly.

// Firebase config. This needs to be populated with the actual config for background reception to work standalone.
// We can use self.addEventListener('push') as a fallback.

self.addEventListener('push', function (event) {
    if (event.data) {
        const payload = event.data.json();
        const notificationTitle = payload.notification?.title || 'New Notification';
        const notificationOptions = {
            body: payload.notification?.body,
            icon: '/vite.svg',
            data: payload.data
        };
        event.waitUntil(
            self.registration.showNotification(notificationTitle, notificationOptions)
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
