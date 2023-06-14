import Address from "@Models/Users/Address";
import Phone from "@Models/Users/Phone";
import Role from "@Models/Users/Role";
import User from "@Models/Users/User";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define a type for the Loading state
interface LoadingState {
  token: string,
  userStoredInDB: boolean,
  user: {
    id: number,
    auth0Id: string;
    lastName: string;
    name: string;
    userEmail: string;
    addresses: Address[];
    phones: Phone[];
    role: Role;
  }
}

interface Auth0Data {
  auth0Id: string,
  lastName: string,
  name: string,
  email: string
}

// Define the initial state using that type
const initialState: LoadingState = {
  token: "",
  userStoredInDB: false,
  user: {
    id: 0,
    auth0Id: "",
    lastName: "",
    name: "",
    userEmail: "",
    addresses: null as any,
    phones: null as any,
    role: null as any
  }
};

export const UserSlice = createSlice({
  name: "User",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUserData: (state, action: PayloadAction<User>) => {
      const { id, name, lastName, userEmail, auth0Id } = action.payload;
      state.user.id = id as number;
      state.user.auth0Id = auth0Id as string;
      state.user.name = name as string;
      state.user.lastName = lastName as string;
      state.user.userEmail = userEmail as string;
    },
    resetUserData: (state) => {
      state.user = initialState.user;
      state.userStoredInDB = false;
    },
    setStoredInDB: (state, action: PayloadAction<boolean>) => {
      state.userStoredInDB = action.payload;
    },
    setUserId: (state, action: PayloadAction<number>) => {
      state.user.id = action.payload;
    },
    setUserRole: (state, action: PayloadAction<Role>) => {
      state.user.role = action.payload;
    }
  },
});

export const { setUserToken, resetUserData, setUserData, setStoredInDB, setUserId, setUserRole } = UserSlice.actions;

export default UserSlice.reducer;
