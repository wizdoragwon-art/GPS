// 앱 셸을 캐시해 오프라인에서도 화면이 뜨도록 함.
// (좌표 변환 자체는 카카오 서버 통신이 필요하므로 네트워크가 있어야 동작)
const CACHE = "geocoder-shell-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // 카카오/외부 API 요청은 항상 네트워크로
  if (url.origin !== self.location.origin) return;
  // 같은 도메인 정적 파일은 캐시 우선
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request))
  );
});
