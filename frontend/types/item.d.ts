export interface Item {
  _id: string;
  title: string;
  description: string;
}

export interface ItemData {
  data: Item[];
  count: number;
}

export interface CreateItemData {
  title: string;
  description: string;
}
