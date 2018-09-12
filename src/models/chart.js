import { fakeChartAmountTypeData } from '../services/api';

export default {
  namespace: 'chart',

  state: {
    visitData: [],
    visitData2: [],
    salesData: [],
    searchData: [],
    offlineData: [],
    offlineChartData: [],
    salesTypeData: [],
    salesTypeDataOnline: [],
    salesTypeDataOffline: [],
    radarData: [],
    amountTypeData: [],
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fakeChartAmountTypeData, payload);
      yield put({
        type: 'save',
        payload: {
          amountTypeData: response,
        },
      });
    },
    *fetchAmountTypeData({ payload }, { call, put }) {
      const response = yield call(fakeChartAmountTypeData, payload);
      yield put({
        type: 'save',
        payload: {
          amountTypeData: response,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
        amountTypeData: [],
      };
    },
  },
};
