'use client'
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchUsers  } from "@/lib/api";
import type { User } from "@/lib/definitions";
const UsersContext = createContext<{
  users: User[] | null;
  refreshUsers: () => void;
}>({ users: null, refreshUsers: () => {} });

export const useUsers = () => useContext(UsersContext)

type UsersProviderProps = {
  children: React.ReactNode;
};

export const UsersProvider: React.FC<UsersProviderProps> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [users, setUsers] = useState<User[] | null>(null);

  const loadUsers = useCallback(async () => {
    const fetchedUsers = await fetchUsers();
    setUsers(fetchedUsers)
  }, [])

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <UsersContext.Provider value={{users, refreshUsers: loadUsers}}>
      {children}
    </UsersContext.Provider>
  );
};