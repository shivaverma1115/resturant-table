/* eslint-disable no-undef */
self.addEventListener("push", (event) => {
  let data = { title: "Order update", body: "", url: "/" };
  try {
    if (event.data) {
      data = { ...data, ...event.data.json() };
    }
  } catch {
    /* use defaults */
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/favicon.ico",
      data: { url: data.url || "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const raw = event.notification.data?.url || "/";
  const href = raw.startsWith("http")
    ? raw
    : new URL(raw, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (c.url === href) return c.focus();
      }
      return self.clients.openWindow ? self.clients.openWindow(href) : undefined;
    }),
  );
});
