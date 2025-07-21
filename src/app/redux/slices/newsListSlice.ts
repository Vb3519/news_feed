import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Utils:
import serverResponseDelayImitation from '../../../shared/utils/serverResponseDelayImitation';

// Types:
import { News_API_Response, Post } from '../../../shared/types/types';

interface NewsListState {
  newsList: Post[];
  isLoadingViaApi: boolean;
  errorMsg: string;
  pagination: number;
}

interface NewsListSlice {
  newsList: NewsListState;
}

export const loadNewsData = createAsyncThunk(
  'newsList/loadNewsData',
  async (url: string, thunkApi) => {
    await serverResponseDelayImitation(2000);

    try {
      const newsApiResponse: Response = await fetch(url);

      if (newsApiResponse.ok) {
        const newsData: News_API_Response = await newsApiResponse.json();
        const newsList: Post[] = newsData.posts;

        return newsList;
      } else {
        const errorMsg: string = `HTTP Error: ${newsApiResponse.statusText} ${newsApiResponse.status}`;

        return thunkApi.rejectWithValue(errorMsg);
      }
    } catch (error: unknown) {
      const errorMsg: string = (error as Error).message;

      return thunkApi.rejectWithValue(errorMsg);
    }
  }
);

const initialState: NewsListState = {
  newsList: [],
  isLoadingViaApi: false,
  errorMsg: '',
  pagination: 0,
};

const newsListSlice = createSlice({
  name: 'newsList',
  initialState: initialState,
  reducers: {
    increasePaginationVal: (state, action) => {
      return { ...state, pagination: state.pagination + action.payload };
    },
  },

  extraReducers: (builder) => {
    builder.addCase(loadNewsData.pending, (state) => {
      return { ...state, isLoadingViaApi: true };
    });
    builder.addCase(loadNewsData.fulfilled, (state, action) => {
      state.isLoadingViaApi = false;

      state.newsList.push(...action.payload);
    });
    builder.addCase(loadNewsData.rejected, (state, action) => {
      state.isLoadingViaApi = false;

      if (typeof action.payload === 'string') {
        state.errorMsg = action.payload;
      }
    });
  },
});

// Действия:
export const { increasePaginationVal } = newsListSlice.actions;

// Состояние:
export const selectNewsListSlice = (state: NewsListSlice) => state.newsList;
export const selectNewsList = (state: NewsListSlice) => state.newsList.newsList;
export const selectIsLoadingViaApi = (state: NewsListSlice) =>
  state.newsList.isLoadingViaApi;
export const selectPagination = (state: NewsListSlice) =>
  state.newsList.pagination;

export default newsListSlice.reducer;
