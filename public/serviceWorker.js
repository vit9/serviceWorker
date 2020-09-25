

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
  
  isTabActive().then((result) => {
    console.log(result)
    if(!result) {
      const promiseChain = self.registration.showNotification('Hello, World.');
      event.waitUntil(promiseChain);
    }
  })

    
});


function isTabActive() {
  const isActive = this.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  .then(function(windowClients) {
  
  var clientIsVisible = false;
  for (var i = 0; i < windowClients.length; i++) {
   const windowClient = windowClients[i];
  
   if (windowClient.visibilityState==="visible") {
       clientIsVisible = true;
  
     break;
   }
  }
  
  return clientIsVisible;
  });
  return isActive
}