// 更新版本号以强制刷新缓存
const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `devin-blog-${CACHE_VERSION}`;

// 静态资源缓存列表（仅缓存必要的静态资源）
const STATIC_CACHE = [
  '/manifest.json',
  '/offline',
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_CACHE);
    }).then(() => {
      // 跳过等待，立即激活新的 Service Worker
      return self.skipWaiting();
    })
  );
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker', CACHE_VERSION);

  event.waitUntil(
    // 清理旧缓存
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 立即接管所有页面
      return self.clients.claim();
    })
  );
});

// 拦截请求 - 使用 Network First 策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过跨域请求
  if (url.origin !== location.origin) {
    return;
  }

  // 跳过 chrome-extension 和其他特殊协议
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    // Network First: 优先使用网络请求
    fetch(request)
      .then((response) => {
        // 检查是否收到有效响应
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // 只缓存 GET 请求
        if (request.method === 'GET') {
          // 对于 HTML 页面和 API 请求，使用短期缓存
          const shouldCache =
            request.destination === 'document' ||
            request.destination === 'script' ||
            request.destination === 'style' ||
            url.pathname.startsWith('/api/');

          if (shouldCache) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
        }

        return response;
      })
      .catch(() => {
        // 网络请求失败，尝试从缓存获取
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', request.url);
            return cachedResponse;
          }

          // 如果是页面请求且缓存中没有，返回离线页面
          if (request.destination === 'document') {
            return caches.match('/offline');
          }

          // 其他请求返回错误响应
          return new Response('Network error', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
});

// 推送通知
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '新文章已发布！',
    icon: '/icons/icon-192x192.svg',
    badge: '/icons/icon-72x72.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看文章',
      },
      {
        action: 'close',
        title: '关闭',
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Devin\'s Blog', options)
  );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/posts')
    );
  }
});

// 监听来自客户端的消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
