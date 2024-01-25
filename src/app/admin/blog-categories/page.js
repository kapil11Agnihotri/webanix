"use client";
import React, { useContext,useState ,useEffect} from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import Link from "next/link";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import DataTable2 from "@/components/DataTable2";
import Button from "@/components/Button/Button";
import PermissionContext from "@/app/context/PermissionContext";
const BlogCategories = () => {
  const {authPermissions}=useContext(PermissionContext);
  const [blogCategory,setBlogCategory] = useState([]);
    // Define the table headers
    const headers = [
      { name: "S.No.", field: "sr_no", sortable: true, classKey: "" },
      { name: "NAME", field: "name", sortable: true, classKey: "" },
      { name: "ACTION", field: "action", classKey: "" },
    ];

    const searchItems = ['name', 'slug'];
    const blogCategoryDeleteHandler = async (id) => {
      const isConfirmed = window.confirm("Are you sure you want to delete this Blog Category?");
      if(isConfirmed){
        try {
          await fetch(`/api/admin/blog-types/${id}`, {
            method: "DELETE",
          });
          showSuccessToast("Blog Category Deleted successfully !");
          setBlogCategory(blogCategory.filter((blog) => blog.id !== id));
          
        } catch (error) {
          showErrorToast("Reqest Failed !");
        }
      }
    };
    const fetchData = async () => {
      try {
          const response = await fetch('/api/admin/blog-types');
          const res = await response.json();
          setBlogCategory(res?.data);
      } catch (error) {
        showErrorToast(error.message);
        setBlogCategory([]);
      } 
    };
  
    useEffect(() => {
      fetchData();
    }, []);

    const blogsCategoryData = blogCategory?.map((value, index) => {
      let buttons = [];
      if(authPermissions?.includes("Blog-Category-Update")){
      buttons.push(
        // Edit button
       <Link
         key="editButton##1"
         type="button"
         href={`/admin/blog-categories/edit/${value.id}`}
         style={{ border: "none", background: "none", marginRight: "10px" }}
         title="Edit"
       >
         <FaEdit color="green" size={13} />
       </Link>
     );
      }
      if(authPermissions?.includes("Blog-Category-Delete")){
     buttons.push(
           // Delete button
       <button
         key="deleteButton##1"
         type="button"
         data-id={value.id}
         onClick={() => blogCategoryDeleteHandler(value.id)}
         title="Delete"
         style={{ border: "none", background: "none" }}
       >
         <FaTrash color="red" size={13} />
       </button>
     );
      }
  // Capitalize the name of the blog category
     const nameArray = value.name.split(" ");
     const capitalizedName = nameArray
       .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
       .join(" ");
 // Add additional properties to the blog category object
     value["sr_no"] = index + 1;
     value["action"] = buttons.length > 0 ? buttons : "-";
     value["name"] = capitalizedName;
     return value;
   });

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
              {authPermissions.includes('Blog-Category-Create') && <Button
                  text="Add New"
                  link="admin/blog-categories/add"
                  icon="add"
                />}
              </div>
                      {/* Blog Category Card */}
              <div className="card" style={{ marginTop: "2%" }}>
                <div className="card-header">
                  <h6 className="card-title">BLOG CATEGORY</h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    {/* Data Table */}
                    {
                      <DataTable2
                        lists={blogsCategoryData}
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
export default BlogCategories;