self.addEventListener('install', function(e){
  e.waitUntil(caches.open('pushNotification').then(function(cache){
      console.log("cahces "+JSON.stringify(cache));
      return cache.addAll([
                           '/'
                         ]);
  }));
});

self.addEventListener('fetch', function(event){
  event.respondWith(caches.match(event.request).then(function(response){
      return response || fetch(event.request);
  }));
}); 

self.addEventListener('push', function(event) {
  console.log(event.data.text())
  let message = event.data.text(); //
  event.waitUntil(
    self.registration.showNotification(message.title, {
      body: message.body,
    })
  );
});