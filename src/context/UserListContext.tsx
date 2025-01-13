import React, { createContext, ReactNode, useEffect, useState } from "react";
import { UserInfoTypes } from "../types/Types";
import OrdersService from "../services/Services";

interface UserListContextProps {
  users: UserInfoTypes[];
  openUserInfo: boolean;
  setOpenUserInfo: (state: boolean) => void;
  userDetail: UserInfoTypes | undefined;
  setUserID: (userId: string | number) => void;
  userID: number | string;
  loading: boolean;
  setLoading: (loadingState: boolean) => void;
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

  const [openUserInfo, setOpenUserInfo] = useState(false);
  const [userID, setUserID] = useState<number | string>("");
  const [userDetail, setUserDetail] = useState<UserInfoTypes | undefined>(
    undefined
  );

  const [loading, setLoading] = useState<boolean>(false);

  // fetch and store users
  const fetchUserListData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  // toggle user info drawer
  const toggleUserInfoDrawer = () => {
    setOpenUserInfo((prev) => !prev);
  };

  useEffect(() => {
    // fetch users from JSONplaceholder
    fetchUserListData();
  }, []);

  useEffect(() => {
    // Get user details
    if (userID) {
      console.log("CURRENT USER : +++++ ", userID);
      const user = users?.find((user) => user.id === userID);
      setUserDetail(user);
    }
  }, [userID, users]);

  return (
    <UserListContext.Provider
      value={{
        users,
        openUserInfo,
        userDetail,
        userID,
        setUserID,
        loading,
        setLoading,
        setOpenUserInfo: toggleUserInfoDrawer,
      }}
    >
      {children}
    </UserListContext.Provider>
  );
};

export const useUserListProvider = () => {
  const context = React.useContext(UserListContext);
  if (!context) {
    throw new Error(
      "UserListContext can only be used inside the UserListProvider!"
    );
  }
  return context;
};
