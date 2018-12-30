let _luxSaga
export function makeLuxSaga(inputObject) {
  if (_luxSaga) {
    return _luxSaga
  }
  const {
    preferPayload,
    models,
    luxSagaImplementation,
    takeEvery,
    all,
  } = inputObject

  if (!takeEvery || !all) {
    throw new Error(
      'Lux: To use makeLuxSaga or init you need to provide "takeEvery" and "all" in the argument object. Both are exported from redux-saga/effects.',
    )
  }

  let sagas = []
  for (const model of models) {
    const finalModel = preferPayload ? { ...model, preferPayload } : model
    const { saga, take = takeEvery, type, preferPayload } = finalModel
    if (!saga) {
      continue
    }
    const sagaWithPayload = action => saga(action.payload)
    const sagaWithTake = take(type, preferPayload ? sagaWithPayload : saga)
    sagas.push(sagaWithTake)
  }

  function* defaultLuxSaga() {
    yield all(sagas)
  }

  _luxSaga = luxSagaImplementation
    ? luxSagaImplementation(sagas)
    : defaultLuxSaga
  return _luxSaga
}

export function init(inputObject) {
  // const luxReducer = makeLuxReducer(inputObject)
  const luxSaga = makeLuxSaga(inputObject)
  return {
    // luxReducer,
    luxSaga,
  }
}
