import { create } from 'zustand';
import { HttpClient } from '@/lib/axios';
import { groupBy } from 'lodash';

const initialState = {
  categories: [],
  categoryTypes: [],
  selectedPaint: null,
  selectedCategory: null,
  isFetchingPaint: false,
  isFetchingPaints: false,
  isFetchingCategories: false,
  paintCollection: {},
};

export const usePaintStore = create((set, get) => ({
  ...initialState,
  setPaint: (selectedPaint) => set(() => ({ selectedPaint })),
  getCategories: async () => {
    set(() => ({ isFetchingCategories: true }));
    const data = await HttpClient.get('/category');
    const cats = groupBy(data, 'type_name');
    set(() => ({
      isFetchingCategories: false,
      categories: data,
      categoryTypes: Object.keys(cats),
    }));
  },
  getPaint: async (uuid) => {
    set(() => ({ isFetchingPaint: true }));
    const data = await HttpClient.get(`/paint/${uuid}`);
    if (data) {
      set(() => ({
        isFetchingPaint: false,
        selectedPaint: data,
      }));
    }
  },
  selectCategory: async (newCategory) => {
    const { paintCollection } = get();
    if (paintCollection[newCategory.defindex]) {
      set(() => ({ selectedCategory: newCategory }));
      return;
    }

    set(() => ({ isFetchingPaints: true }));
    const data = await HttpClient.get(`/paint/defindex/${newCategory.defindex}`);
    setTimeout(() => {
      set(() => ({
        selectedCategory: newCategory,
        paintCollection: { ...paintCollection, [newCategory.defindex]: data },
        isFetchingPaints: false,
      }));
    }, 700);
  },
}));
