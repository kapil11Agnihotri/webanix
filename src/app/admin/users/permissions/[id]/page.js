"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import PermissionTableTd from "../../PermissionTableTd";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";

const UserPermission = ({ params }) => {
  const { id } = params;
  const router = useRouter();

  const [permissions, setPermissions] = useState([]);
  const [permissionDistinctName, setPermissionDistinctName] = useState([]);
  const [userPermissionsId, setUserPermissionsId] = useState([]);
  const [isPermission, setIsPermission] = useState([]);
  const userDataCookie = Cookies.get("userData");

  let userData;
  let roleId;
  if (userDataCookie) {
    try {
      userData = JSON.parse(userDataCookie);
      roleId = userData.role_id;
      // Other operations using roleId or userData
    } catch (error) {
     
    }
  } else {
    console.error("userDataCookie is undefined or doesn't exist.");
  }

  const permissionsDinstict = async () => {
    try {
      const response = await fetch("/api/admin/permissions");
      const permissions = await response.json();
      setPermissions(permissions?.data);
    } catch (error) {
      showErrorToast("Permission fetch error!");
    }

    try {
      const response = await fetch("/api/admin/permissions/distinct");
      const distinctName = await response.json();
      setPermissionDistinctName(distinctName.data);
    } catch (error) {
      // Handle login error
      showErrorToast("Permission distinct fetch error!");
    }
  };
  useEffect(() => {
    permissionsDinstict();
  }, []);

  const hasPermissions = async () => {
    try {
      const response = await fetch(
        `/api/admin/user-has-permissions/user/${id}`
      );
      const permissions = await response.json();
      if (permissions?.data?.length) {
        const userPermissionsArray = permissions?.data?.map((item) => item.id);
        setUserPermissionsId(userPermissionsArray);
        setIsPermission(permissions.data);
      }

      if (permissions.code === 404) {
        showErrorToast("No user permissions found! Kindly Add permissions");
      }
    } catch (error) {
      // Handle login error
      showErrorToast("User has permissions error!");
    }
  };
  useEffect(() => {
    hasPermissions();
  }, [id]);

  const modifyPermissionIdArray = async (permission_id, action) => {
    setUserPermissionsId((prevIds) => {
      if (action === false) {
        return prevIds.filter((id) => id !== permission_id);
      } else {
        return [...prevIds, permission_id];
      }
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    let values = {
      user_id: id,
      role_id: roleId,
      permission_ids: userPermissionsId,
    };

    try {
      await fetch("/api/admin/user-has-permissions", {
        method: "POST",
        body: JSON.stringify(values),
      });

      showSuccessToast("User Permission added successfully!");
      router.push("/admin/users");
    } catch (error) {
      // Handle login error
      showErrorToast("Permission add error!");
    }
  };

  const title = ["CREATE", "LIST", "UPDATE", "DELETE"];

  const rows = permissionDistinctName?.map((distinct, index) => {
    return (
      <tr key={index}>
        <td>{distinct?.name}</td>

        {permissions.map((permission, index1) => {
          if (permission.name === distinct.name) {
            if (permission.action === "Create") {
              let checked = isPermission.some(
                (value) =>
                  value.name === distinct.name && value.action === "Create"
              );
              return (
                <PermissionTableTd
                  tdKey={index1}
                  key={index1}
                  id={permission.id}
                  checked={checked}
                  modifyPermissionIdArray={modifyPermissionIdArray}
                />
              );
            }
            if (permission.action === "List") {
              let checked = isPermission.some(
                (value) =>
                  value.name === distinct.name && value.action === "List"
              );
              return (
                <PermissionTableTd
                  tdKey={index1}
                  key={index1}
                  id={permission.id}
                  checked={checked}
                  modifyPermissionIdArray={modifyPermissionIdArray}
                />
              );
            }
            if (permission.action === "Update") {
              let checked = isPermission.some(
                (value) =>
                  value.name === distinct.name && value.action === "Update"
              );
              return (
                <PermissionTableTd
                  tdKey={index1}
                  key={index1}
                  id={permission.id}
                  checked={checked}
                  modifyPermissionIdArray={modifyPermissionIdArray}
                />
              );
            }
            if (permission.action === "Delete") {
              let checked = isPermission.some(
                (value) =>
                  value.name === distinct.name && value.action === "Delete"
              );
              return (
                <PermissionTableTd
                  tdKey={index1}
                  key={index1}
                  id={permission.id}
                  checked={checked}
                  modifyPermissionIdArray={modifyPermissionIdArray}
                />
              );
            }
          }
        })}
      </tr>
    );
  });

  return (
    <>
      <div className="section-body mt-3">
        <div className="container-fluid">
          <div className="tab-content mt-3">
            <form onSubmit={submitHandler}>
              <div
                className="tab-pane fade show active"
                id="user-permissions"
                role="tabpanel"
              >
                <div className="card">
                  <div className="card-header">
                    <h6>USER PERMISSIONS</h6>
                  </div>
                  <div className="card-body">
                    <div className="row clearfix">
                      <div className="col-12">
                        <div className="table-responsive">
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th />
                                {title.map((name, key) => (
                                  <th key={key}>{name}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                          </table>
                        </div>
                        <div className="text-end">
                          <button
                            type="button"
                            id="user_permissions_close_button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                            onClick={() => {
                              router.push("/admin/users");
                            }}
                            style={{ margin: 5 }}
                          >
                            CLOSE
                          </button>
                          {/* {
                             authPermissions.includes('Users-UPDATE') ?  */}

                          <button
                            type="submit"
                            id="user_permissions_update_button"
                            className="btn btn-primary float-right"
                          >
                            UPDATE
                          </button>

                          {/* :

                          null
                          } */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPermission;
