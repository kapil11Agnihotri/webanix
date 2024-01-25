"use client";
import React, { useContext, useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import Link from "next/link";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import DataTable2 from "@/components/DataTable2";
import Button from "@/components/Button/Button";
import PermissionContext from "@/app/context/PermissionContext";

const EditPage = () => {
  const { authPermissions } = useContext(PermissionContext);
  const [pages, setPages] = useState([]);

  const headers = [
    { name: "S.No", field: "sr_no", sortable: true, classKey: "" },
    { name: "PAGE NAME", field: "name", sortable: true, classKey: "" },
    { name: "PAGE SLUG", field: "slug", sortable: true, classKey: "" },
    { name: "ACTION", field: "action", classKey: "" },
  ];

  const searchItems = ["name", "slug"];

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/pages");
      const res = await response.json();
      setPages(res?.data);
    } catch (error) {
      showErrorToast(error.message);
      setPages([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pagesData = pages
    ?.filter((res) => res?.template_type === "about")
    ?.map((value, index) => {
      let buttons = [];

      if(authPermissions?.includes("About-Template-Update")){
      buttons.push(
        <Link
          key="editButton##1"
          type="button"
          id="abouttemplate_edit_button"
          href={`/admin/about-template/edit/${value.id}`}
          className="btn btn-icon"
          style={{ backgroundColor: "white", margin: "2px" }}
          title="Edit"
        >
          <FaEdit color="green" />
        </Link>
      );
      }

      if(authPermissions?.includes("About-Template-Delete")){
      buttons.push(
        <button
          key="deleteButton##1"
          type="button"
          id="abouttemplate_delete_button"
          data-id={value.id}
          onClick={() => pageDeleteHandler(value.id)}
          className="btn btn-icon js-sweetalert"
          style={{ backgroundColor: "white", margin: "2px" }}
          title="Delete"
        >
          <FaTrash color="red" />
        </button>
      );
      }

      const aboutName =
        value.name.charAt(0).toUpperCase() + value.name.slice(1);
      value["name"] = aboutName;
      value["sr_no"] = index + 1;
      value["action"] = buttons.length > 0 ? buttons : "-";
      return value;
    });

  const pageDeleteHandler = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this page?"
    );
    if (isConfirmed) {
      try {
        const res = await fetch(`/api/admin/pages/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.code ==200) {
          showSuccessToast("Page deleted successfully!");
        } else {
          showErrorToast(
            data?.message?.issues[0]?.message || "Page creation error!"
          );
        }
        await fetchData();
      } catch (error) {
        showErrorToast("500 : failed!");
      }
    }
  };

  return (
    <div className="section-body">
      <div className="container-fluid">
        <div className="tab-content">
          <div
            className="tab-pane fade show active"
            id="user-list"
            role="tabpanel"
          >
            <div className="d-flex justify-content-end">
            {authPermissions.includes("About-Template-Create") &&  <Button
                link="admin/about-template/add"
                text="Add Page"
                icon="add"
              />}
            </div>
            <div className="card" style={{ marginTop: "1%" }}>
              <div className="card-header">
                <h6 className="card-title">PAGES</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  {
                    <DataTable2
                      lists={pagesData}
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
  );
};

export default EditPage;
