import React, { createContext, ReactNode, useEffect, useState } from "react";
import { UserInfoTypes } from "../types/Types";
import OrdersService from "../services/Services";

interface UserListContextProps {
  users: UserInfoTypes[];
}

// create userlist context
const UserListContext = createContext<UserListContextProps | undefined>(
  undefined
);

interface UserListProviderProps {
  children: ReactNode;
}
// create userlist provider
export const UserListProvider: React.FC<UserListProviderProps> = ({
  children,
}) => {
  const [users, setUsers] = useState<UserInfoTypes[]>([]);

  // fetch and store users
  const fetchUserListData = async () => {
    try {
      // TODO: Update default service file import ---
      const response = await OrdersService.fetchUserList();
      if (!response) {
        setUsers([]);
      } else {
        setUsers(response);
      }
    } catch (error) {
      console.error("Error: Could not fetch user list data");
      throw error;
    }
  };

  useEffect(() => {
    // fetch users from JSONplaceholder
    fetchUserListData();
  }, []);

  return (
    <UserListContext.Provider value={{ users }}>
      {children}
    </UserListContext.Provider>
  );
};

export const useUserListProvider = () => {
  const context = React.useContext(UserListContext);
  if (!context) {
    throw new Error( "UserListContext can only be used inside the UserListProvider!");
  }
  return context;
};
