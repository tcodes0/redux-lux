export const deepCompareTypes = <T = any, U = any>(a: T, b: U): boolean => {
  if (b === null) {
    return false
  }

  if (typeof a === 'function' && typeof b === 'function') {
    return a.name === b.name
  }

  if (a === Object(a) && b === Object(b)) {
    const results = []
    for (const i in a) {
      // @ts-ignore
      results.push(deepCompareTypes(a[i], b[i]))
    }
    if (results.filter(it => it === false).length) {
      return false
    }
  }

  if (!Array.isArray(a) && Array.isArray(b)) {
    const results = []
    for (const i in b) {
      results.push(deepCompareTypes(a, b[i]))
    }
    if (results.filter(it => it === false).length) {
      return false
    }
  }

  return typeof a === typeof b
}
