import { all } from 'redux-saga/effects'

import { saga as assistantsSaga } from './assistants'
import { saga as datasetSaga } from './dataset'
import { saga as searchSaga } from './search'

export default function* rootSaga() {
  yield all([assistantsSaga(), datasetSaga(), searchSaga()])
}
