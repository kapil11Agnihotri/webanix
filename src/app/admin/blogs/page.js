"use client";
import React, { useContext,useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import Link from "next/link";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import DataTable2 from "@/components/DataTable2";
import Button from "@/components/Button/Button";
import PermissionContext from "@/app/context/PermissionContext";

// Define the Blogs component
const Blogs = () => {
  const { authPermissions } = useContext(PermissionContext);
  // State to hold the blog data
  const [blog, setBlog] = useState([]);
  const headers = [
    // Define the table headers
    { name: "S.No.", field: "sr_no", sortable: true, classKey: "" },
    { name: "NAME", field: "title", sortable: true, classKey: "" },
    { name: "STATUS", field: "status", sortable: true, classKey: "" },
    { name: "BLOG TYPE", field: "blog_type_name", sortable: true, classKey: "" },
    { name: "ACTION", field: "action", classKey: "" },
  ];
  // Define the search items
  const searchItems = ["name"];
  // Fetch the blog data from the API
  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/blogs");
      const res = await response.json();
      setBlog(res?.data);
    } catch (error) {
      showErrorToast(error.message);
      setBlog([]);
    }
  };

  useEffect(() => {
    // Fetch the data on component mount
    fetchData();
  }, []);

  // Map over the blog data and format it
  const blogsData = blog?.map((value, index) => {
    let buttons = [];
    if(authPermissions?.includes("Blogs-Update")){
        buttons.push(
      <Link
        key="editButton##1"
        type="button"
        href={`/admin/blogs/edit/${value.id}`}
        style={{ border: "none", background: "none", marginRight: "10px" }}
        title="Edit"
      >
        <FaEdit color="green" size={13} />
      </Link>
    );
        }

    if(authPermissions?.includes("Blogs-Delete")){
    buttons.push(
      <button
        key="deleteButton##1"
        type="button"
        data-id={value.id}
        onClick={() => {
          blogDeleteHandler(value.id);
        }}
        title="Delete"
        style={{ border: "none", background: "none" }}
      >
        <FaTrash color="red" size={13} />
      </button>
    );
      }

    const nameArray = value.name?.split(" ");
    const capitalizedName = nameArray
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    value["sr_no"] = index + 1;
    value["action"] = buttons.length > 0 ? buttons : "-";
    value["name"] = capitalizedName;
    return value;
  });

  // Handle blog deletion
  const blogDeleteHandler = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this Blog?"
    );
    if (isConfirmed) {
      try {
        await fetch(`/api/admin/blogs/${id}`, {
          method: "DELETE",
        });
        showSuccessToast("Blog deleted successfully !");
        setBlog(blogsData.filter((blog) => blog.id !== id));
      } catch (error) {
        showErrorToast("Reqest Failed !");
      }
    }
  };

  return (
    <>
      {/* Section Body */}
      <div className="section-body">
        <div className="container-fluid">
          <div className="tab-content">
            {/* User List Tab */}
            <div
              className="tab-pane fade show active"
              id="user-list"
              role="tabpanel"
            >
              {/* Add New Button */}
              <div className="d-flex justify-content-end mt-4">
                {authPermissions.includes("Blogs-Create") && <Button text="Add New" link="admin/blogs/add" icon="add" />}
              </div>
              {/* Card */}
              <div className="card" style={{ marginTop: "2%" }}>
                <div className="card-header">
                  <h6 className="card-title">BLOGS</h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    {/* Data Table */}
                    {
                      <DataTable2
                        lists={blogsData}
                        headers={headers}
                        searchItems={searchItems}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Blogs;
