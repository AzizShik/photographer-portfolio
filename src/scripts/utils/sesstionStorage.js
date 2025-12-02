export function saveSessionStorage(key, obj) {
  sessionStorage.setItem(key, JSON.stringify(obj));
}

export function getSessionStorage(key) {
  const localObj = JSON.parse(sessionStorage.getItem(key));
  return localObj;
}

export function removeSessionStorage(key) {
  sessionStorage.removeItem(key);
}
