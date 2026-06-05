const isPlainObject = (value: unknown): value is Record<string, any> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Merge récursivement `options` dans `baseLayer`.
 * Une clé d'`options` n'est appliquée que si elle est déjà définie dans `baseLayer`.
 * Pour les objets imbriqués (ex. `layout`, `paint`), la règle est appliquée à chaque niveau.
 */
export const mergeLayerOptions = (
  baseLayer: Record<string, any>,
  options: Partial<Record<string, any>> = {},
): Record<string, any> => {
  const merged: Record<string, any> = { ...baseLayer }

  for (const key in options) {
    if (!Object.prototype.hasOwnProperty.call(baseLayer, key)) {
      continue
    }

    const baseValue = baseLayer[key]
    const optionValue = options[key]

    if (isPlainObject(baseValue) && isPlainObject(optionValue)) {
      merged[key] = mergeLayerOptions(baseValue, optionValue)
    } else {
      merged[key] = optionValue
    }
  }

  return merged
}
