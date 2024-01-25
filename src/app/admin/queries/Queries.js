"use client";
import DataTable2 from "@/components/DataTable2";
import Link from "next/link";
import React from "react";
import { GrView } from "react-icons/gr";

const Queries = ({ queries }) => {
  const headers = [
    { name: "S.No.", field: "sr_no", classKey: "" },
    { name: "NAME", field: "name", sortable: true, classKey: "" },
    { name: "EMAIL", field: "email", sortable: true, classKey: "" },
    { name: "MOBILE", field: "mobile", sortable: true, classKey: "" },
    { name: "Query Type", field: "query_type", sortable: true, classKey: "" },
    { name: "ACTION", field: "action", classKey: "" },
  ];

  const searchItems = ["name", "email"];

  const queriesData = queries?.map((value, index) => {
    let buttons = [];

    buttons.push(
      <Link
        key="viewButton##"
        type="button"
        id="enquiries_view_button"
        href={`/admin/queries/view/${value.id}`}
        title="View"
      >
        <GrView style={{ marginLeft: "1rem", color: "red" }} size={15} />
      </Link>
    );
    const nameArray = value?.name?.split(" ");
    const capitalizedName = nameArray
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      ?.join(" ");
    value["action"] = buttons.length > 0 ? buttons : "-";
    value["sr_no"] = index + 1;
    value["name"] = capitalizedName;
    return value;
  });

  return (
    <div className="section-body">
      <div className="container-fluid">
        <div className="tab-content">
          <div
            className="tab-pane fade show active d-flex flex-column mt-3"
            id="user-list"
            role="tabpanel"
          >
            <div className="card" style={{ marginTop: "1%" }}>
              <div className="card-header">
                <h6 className="card-title">QUERIES</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  {
                    <DataTable2
                      lists={queriesData}
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

export default Queries;
