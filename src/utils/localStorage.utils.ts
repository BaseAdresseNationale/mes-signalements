export enum LocalStorageKeys {
  AUTHOR_CONTACT = 'authorContact',
  SOURCE_TOKEN = 'sourceToken',
}

export function getValueFromLocalStorage<T>(key: LocalStorageKeys): T | undefined {
  try {
    const item = window.localStorage.getItem(key)
    if (item) {
      return JSON.parse(item)
    }
  } catch (error) {
    console.error(error)
  }
}

export function setValueInLocalStorage<T>(key: LocalStorageKeys, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(error)
  }
}

export const removeValueFromLocalStorage = (key: LocalStorageKeys): void => {
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error(error)
  }
}
