export const compareNestedTypes = <T = any, U = any>(a: T, b: U): boolean => {
  if (b === null) {
    return false
  }

  if (typeof a === 'function' && typeof b === 'function') {
    // console.log('comparing 2 fns')
    return a.name === b.name
  }

  if (a === Object(a) && b === Object(b)) {
    // console.log('comparing 2 objects', JSON.stringify(a), JSON.stringify(b))
    const results = []
    for (const i in a) {
      // @ts-ignore
      results.push(compareNestedTypes(a[i], b[i]))
    }
    if (results.filter(it => it === false).length) {
      // console.log('results dont match', results)
      return false
    }
  }

  if (!Array.isArray(a) && Array.isArray(b)) {
    // console.log('comparing object with array', JSON.stringify(a), JSON.stringify(b))
    const results = []
    for (const i in b) {
      results.push(compareNestedTypes(a, b[i]))
    }
    if (results.filter(it => it === false).length) {
      // console.log('results dont match', results)
      return false
    }
  }

  // console.log('comparing simple types', a, b)
  return typeof a === typeof b
}
