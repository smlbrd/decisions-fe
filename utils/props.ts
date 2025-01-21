export interface OptionProps {
  _id: string | null;
  name: string;
  description: string | null;
  customFields: string[];
  owner: string | null;
  createdAt: string | null;
  image_url?: string;
  __v: number | null;
}
export interface ListProps {
  _id: string | null;
  title: string | null;
  description: string | null;
  options: OptionProps[];
  owner: string | null;
  members: string[];
  createdAt: string | null;
  __v: number | null;
}
export interface GroupProps {
  _id: string | null;
  title: string | null;
  description: string | null;
  options: OptionProps[];
  owner: string[];
  members: string[];
}
export interface SaveDataThisOrThatProps {
  turnNumber: number;
  turnOrder: UserProps[];
  remainingOptions: OptionProps[];
  currentOptions: [OptionProps, OptionProps];
  voteHistory: OptionProps[];
}
export interface DecisionProps {
  _id: string | null;
  votingStatus: string | null;
  decisionsProcess_id: string;
  completedAt: string | null;
  outcome: OptionProps | null;
  __v: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  group: GroupProps | null;
  list: ListProps | null;
  saveData: SaveDataThisOrThatProps;
}
export interface UserProps {
  _id: string | null;
  username: string | null;
  name: string | null;
  email: string | null;
  savedLists: Array<string> | null;
  avatarImg?: string | null;
}
