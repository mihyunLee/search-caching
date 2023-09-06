export async function setCachedData(cacheName, url, response) {
  const cacheStorage = await caches.open(cacheName);

  await cacheStorage.put(url, new Response(JSON.stringify(response)));
}

export async function getCachedData(cacheName, url) {
  try {
    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);

    if (!cachedResponse || !cachedResponse.ok) {
      return;
    }

    return await cachedResponse.json();
  } catch (error) {
    console.error("Error while getting data from cache:", error);
  }
}
