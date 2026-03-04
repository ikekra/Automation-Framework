import { createContext, useContext } from "react";

const UserModalContext = createContext({
  openUserModal: () => {}
});

export const UserModalProvider = UserModalContext.Provider;

export const useUserModal = () => {
  return useContext(UserModalContext);
};
