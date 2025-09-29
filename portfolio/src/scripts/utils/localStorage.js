export function saveLocalStorage(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj));
}

export function getLocalStorage(key) {
  const localObj = JSON.parse(localStorage.getItem(key));
  return localObj;
}

export function removeLocalStorage(key) {
  localStorage.removeItem(key);
}
