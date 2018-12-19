export default function createAction(type) {
  return function actionCreator(payload) {
    if (!payload) {
      payload = {};
    }
    const result = {
      type,
      payload
    };
    return result;
  };
}
