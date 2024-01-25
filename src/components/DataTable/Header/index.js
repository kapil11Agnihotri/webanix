"use client"
import React, { useState } from "react";

const Header = ({ headers, onSorting }) => {
    const [sortingField, setSortingField] = useState("");
    const [sortingOrder, setSortingOrder] = useState("asc");

    const onSortingChange = (field) => {
        const order =
            field === sortingField && sortingOrder === "asc" ? "desc" : "asc";

        setSortingField(field);
        setSortingOrder(order);
        onSorting(field, order);
    };

    return (
        <thead>
            <tr>
                {headers.map(({ name, field, sortable,classKey }) => (
                    <th
                       style={{fontWeight:'unset',fontSize:'0.9rem', paddingLeft:'0'}}
                        className="text-start"
                     
                        key={name}
                        onClick={() =>
                            sortable ? onSortingChange(field) : null
                        }
                    >
                        {name}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default Header;
