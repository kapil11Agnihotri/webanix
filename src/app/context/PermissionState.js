"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import PermissionContext from "./PermissionContext";

const PermissionState = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUserData = Cookies.get("userData");
    return storedUserData ? JSON.parse(storedUserData) : {};
  });
  const [authPermissions, setAuthPermissions] = useState([]);

  useEffect(() => {
    const fetchUserPermissions = async () => {
      try {
        if (user && user.userId !== undefined) {
          const fetchedUserPermissions = await fetch(
            `/api/admin/user-has-permissions/user/${user.userId}`
          );
         const fetchedData= await fetchedUserPermissions.json();
          if (fetchedData?.data?.length) {
            const permissionsArray = fetchedData?.data?.map(
              (permission) => `${permission.name}-${permission.action}`
            );
            
            setAuthPermissions(permissionsArray);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserPermissions();
  }, [user]);

  

  return (
    <PermissionContext.Provider
      value={{
        authPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionState;
