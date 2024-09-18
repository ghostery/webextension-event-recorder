// browser.execute is able to call only the current window
// webdriverio is unablet to tracker the currectly active window correctly
// which makes browser.execute to eval scripts in wrong contexts
export async function evaluate(browser, context, expression,) {
  const result = await browser.scriptEvaluate({
    expression,
    target: {
      context,
    },
    awaitPromise: false,
  });
  return parseScriptResult(result);
}

// source https://github.com/webdriverio/webdriverio/blob/d6c0af67c69e2ccf75bb539b067fafe18f681afc/packages/webdriverio/src/utils/bidi/index.ts
function parseScriptResult(result) {
  const type = result.type

  if (type === 'success') {
      return deserializeValue(result.result)
  }
  if (type === 'exception') {
      throw new Error(result)
  }

  throw new Error(`Unknown evaluate result type: ${type}`)
}

function deserializeValue(result) {
  const { type, value } = result
  if (type === 'regexp') {
      return new RegExp(value.pattern, value.flags)
  }
  if (type === 'array') {
      return value.map((element) => deserializeValue(element))
  }
  if (type === 'date') {
      return new Date(value)
  }
  if (type === 'map') {
      return new Map(value.map(([key, value]) => (
          [typeof key === 'string' ? key : deserializeValue(key), deserializeValue(value)]
      )))
  }
  if (type === 'set') {
      return new Set(value.map((element) => deserializeValue(element)))
  }
  if (type === 'number' && value === 'NaN') {
      return NaN
  }
  if (type === 'number' && value === 'Infinity') {
      return Infinity
  }
  if (type === 'number' && value === '-Infinity') {
      return -Infinity
  }
  if (type === 'number' && value === '-0') {
      return -0
  }
  if (type === 'bigint') {
      return BigInt(value)
  }
  if (type === 'null') {
      return null
  }
  if (type === 'object') {
      return Object.fromEntries((value || []).map(([key, value]) => {
          return [typeof key === 'string' ? key : deserializeValue(key), deserializeValue(value)]
      }))
  }
  if (type === 'node') {
      return { [ELEMENT_KEY]: (result).sharedId }
  }
  if (type === 'error') {
      return new Error('<unserializable error>')
  }
  return value
}
