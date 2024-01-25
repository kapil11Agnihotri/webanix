"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable2 from "@/components/DataTable2";
import React, { useContext, useState, useEffect } from "react";
import { FaTrash, FaEdit, FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import Button from "@/components/Button/Button";
import PermissionContext from "@/app/context/PermissionContext";

const Category= () => {
  const { authPermissions } = useContext(PermissionContext);
  const [categories, setCategories] = useState([]);
  const headers = [
    { name: "S.No", field: "sr_no", sortable: true, classKey: "" },
    { name: "CATEGORY NAME", field: "title", sortable: true, classKey: "" },
    { name: "SLUG", field: "slug", sortable: true, classKey: "" },
    { name: "CATEGORY HEADING", field: "heading", sortable: true, classKey: "" },
    { name: "ACTION", field: "action", classKey: "" },
  ];

  const searchItems = ["title", "slug", "heading"];

  const categoryData = categories?.map((value, index) => {
    let buttons = [];
    if(authPermissions?.includes("Service-Category-Update")){
    buttons.push(
      <Link
        key="editButton##1"
        id="service_category_edit_button"
        type="button"
        href={`/admin/service-categories/edit/${value.id}`}
        className="btn btn-icon"
        style={{ backgroundColor: 'white', margin: '2px' }}
        title="Edit"
      >
        <FaEdit color="green" />
      </Link>
    );
    }
    if(authPermissions?.includes("Service-Category-Delete")){
    buttons.push(
      <button
        key="deleteButton##1"
        type="button"
        id="service_category_delete_button"
        data-id={value.id}
        onClick={() => pageDeleteHandler(value.id)}
        className="btn btn-icon js-sweetalert"
        style={{ backgroundColor: 'white', margin: '2px' }}
        title="Delete"
      >
        <FaTrash color="red" />
      </button>
    );
    }
    // const name = value.title.charAt(0).toUpperCase() + value.name.slice(1)
    value["sr_no"] = index + 1;
    value["action"] = buttons.length > 0 ? buttons : "-";
    return value;
  });

  const pageDeleteHandler = async (id) => {

    const isConfirmed = window.confirm("Are you sure you want to delete this category?");
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
        });
        const res = await response.json();
        setCategories(categories.filter((category) => category.id !== id));
        showSuccessToast(res.message);
      } catch (error) {
        showErrorToast('Category delete error!');
      }
    }

  };

  
  const fethData = async () => {
    const response = await fetch('/api/admin/categories');
    const res = await response.json();
    setCategories(res.data);
  };

  useEffect(() => {
    fethData();
  }, []);

  return (

    <>
      <div className='section-body'>
        <div className='container-fluid'>
          <div className='tab-content'>
            <div
              className='tab-pane fade show active d-flex flex-column mt-3'
              id='user-list'
              role='tabpanel'
            >
              <div className='d-flex justify-content-end'>
              {authPermissions.includes("Service-Category-Create") && <Button link='admin/service-categories/add' text='Add Category' icon='add'/>}
              </div>
              <div className='card' style={{ marginTop: '1%' }}>
                <div className='card-header'>
                  <h6 className='card-title'>SERVICE CATEGORIES</h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    {
                      <DataTable2
                        lists={categoryData}
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

export default  Category;
