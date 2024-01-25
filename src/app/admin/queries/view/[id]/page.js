import { get_by_id } from "@/backend/models/queryModel";
import Button from "@/components/Button/Button";

import React from "react";

import Link from "next/link";

const QueryView = async ({ params }) => {
  const { id } = params;

  const response = await get_by_id(id);
  const data = response?.data;
  // Remove 'id' and 'is_agree' from the data
  const {
    id: _,
    is_agree: __,
    updated_at: ___,
    created_at: ____,
    company_size: _____,
    location: ______,
    ...filteredData
  } = data;

  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata", // Set the time zone to Indian Standard Time (IST)
    };
    const formattedDate = new Intl.DateTimeFormat("en-IN", options).format(
      date
    );
    return formattedDate;
  }

  return (
    <>
      <div className='section-body'>
        <div className='container-fluid'>
          <div className='tab-content'>
            <div className='d-flex justify-content-start mt-3'>
              <Button
                link='admin/queries'
                text='Back'
                icon='left'
              />
            </div>
            <div className='container mt-5'>
              <table className='table table-bordered'>
                <tbody>
                  {Object.keys(filteredData)
                    .filter((key) => filteredData[key])
                    .map((key) => (
                      <tr
                        key={key}
                        className='text-center'
                      >
                        <td>
                          {key
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </td>
                        <td>
                          {key === "document" && filteredData[key] ? (
                            <Link
                              href={
                                process.env.NEXT_PUBLIC_MAIN_URL +
                                `media/queries/${filteredData[key]}`
                              }
                              target='_blank'
                              style={{
                                textDecoration: "none",
                                color: "#fe4550",
                              }}
                            >
                              Download
                            </Link>
                          ) : key === "linkedin" && filteredData[key] ? (
                            <Link
                              href={filteredData[key]}
                              target='_blank'
                              style={{
                                textDecoration: "none",
                                color: "#fe4550",
                              }}
                            >
                              {filteredData[key]}
                            </Link>
                          ) : filteredData[key] !== null &&
                            filteredData[key] !== undefined ? (
                            filteredData[key].toString()
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    ))}
                  <tr className='text-center'>
                    <td>Date</td>
                    <td>{formatDate(data.created_at)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QueryView;
