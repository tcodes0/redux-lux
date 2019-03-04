export const deepCompareTypes = <T = any, U = any>(a: T, b: U): boolean => {
  // null is an edge case of detecting an object, so we handle it here
  if (b === null) {
    return false
  }

  // handle functions here
  if (typeof a === 'function' && typeof b === 'function') {
    return a.name === b.name
  }

  // handle object stuff here, recursively
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

  // non objects and primitives go here
  return typeof a === typeof b
}

export function* unpackArray(packed: string | Array<string>) {
  if (Array.isArray(packed)) {
    for (const type of packed) {
      yield type
    }
    return
  }
  yield packed
}
