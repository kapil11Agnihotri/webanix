"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import DataTable2 from "@/components/DataTable2";
import React, { useContext, useEffect, useState } from "react";
import { FaTrash, FaEdit, FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import { showErrorToast, showSuccessToast } from "@/utils/toaster";
import Button from "@/components/Button/Button";
import PermissionContext from "@/app/context/PermissionContext";

const Services = () => {
  const {authPermissions } = useContext(PermissionContext)
  const[services, setServices] = useState([])
  const headers = [
    { name: "S.No", field: "sr_no", sortable: true, classKey: "" },
    { name: "NAME", field: "title", sortable: true, classKey: "" },
    { name: "SLUG", field: "slug", sortable: true, classKey: "" },
    { name: "CATEGORY", field: "category_name", sortable: true, classKey: "" },
    { name: "ACTION", field: "action", classKey: "" },
  ];

  const searchItems = ["title", "slug", "category"];
  const serviceData = services?.map((value, index) => {
    let buttons = [];
  if(authPermissions?.includes("Services-Update")){
    buttons.push(
      <Link
        key="editButton##1"
        id="service_edit_button"
        type="button"
        href={`/admin/services/edit/${value.id}`}
        className="btn btn-icon"
        style={{ backgroundColor: 'white', margin: '2px' }}
        title="Edit"
      >
        <FaEdit color="green" />
      </Link>
    );
    }
    if(authPermissions?.includes("Services-Delete")){
    buttons.push(
      <button
        key="deleteButton##1"
        id="service_delete_button"
        type="button"
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
    value["sr_no"] = index + 1;
    value["action"] = buttons.length > 0 ? buttons : "-";
    
    return value;
  });
  

  const pageDeleteHandler = async (id) => {

    const isConfirmed = window.confirm("Are you sure you want to delete this service?");
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/admin/services/${id}`, {
          method: "DELETE",
        });
        const res = await response.json();
        setServices(services?.filter((item) => item.id !== id));
        showSuccessToast(res.message);
      } catch (error) {
        showErrorToast('Service delete error!');
      }
    }

  };
  
  const fethData = async () => {
    const serviceResponse = await fetch('/api/admin/services');
    const serviceRes = await serviceResponse.json();
    setServices(serviceRes?.data);
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
                {authPermissions.includes("Services-Create") && <Button link='admin/services/add' text='Add Service' icon='add'/>}
              </div>
              <div className='card' style={{ marginTop: '1%' }}>
                <div className='card-header'>
                  <h6 className='card-title'>SERVICES</h6>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    {
                      <DataTable2
                        lists={serviceData}
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

export default Services;
