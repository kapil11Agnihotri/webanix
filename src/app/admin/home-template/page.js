'use client'
import DataTable2 from '@/components/DataTable2';
import { showErrorToast, showSuccessToast } from '@/utils/toaster';
import React, { useContext, useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaUserAlt } from 'react-icons/fa';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import PermissionContext from '@/app/context/PermissionContext';

function HomeTemplate() {
  const { authPermissions } = useContext(PermissionContext);
  const [pages, setPages] = useState([]);
 
  const headers = [
    { name: 'S.No', field: 'sr_no', sortable: true, classKey: '' },
    { name: 'PAGE NAME', field: 'name', sortable: true, classKey: '' },
    { name: 'PAGE SLUG', field: 'slug', sortable: true, classKey: '' },
    { name: 'ACTION', field: 'action', classKey: '' },
  ];

  const searchItems = ['name', 'slug'];
  const fetchData = async () => {
    try {
        const response = await fetch('/api/admin/pages');
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
    ?.filter((res) => res?.template_type === 'home')
    .map((value, index) => {
        let buttons = [];

        if(authPermissions?.includes("Home-Template-Update"))
        {
           buttons.push(
             <Link
               key='editButton##1'
               type='button'
               id='hometemplate_edit_button'
               href={`/admin/home-template/edit/${value.id}`}
               className='btn btn-icon'
               style={{ backgroundColor: 'white', margin: '2px' }}
               title='Edit'
             >
               <FaEdit color='green' />
             </Link>
           );
         }

         if(authPermissions?.includes("Home-Template-Delete"))
        {
           buttons.push(
             <button
               key='deleteButton##1'
               type='button'
               id='hometemplate_delete_button'
               data-id={value.id}
               onClick={() => pageDeleteHandler(value.id)}
               className='btn btn-icon js-sweetalert'
               style={{ backgroundColor: 'white', margin: '2px' }}
               title='Delete'
             >
               <FaTrash color='red' />
             </button>
           );
         }

         const homeName =
           value.name.charAt(0).toUpperCase() + value.name.slice(1);
         value['name'] = homeName;
         value['sr_no'] = index + 1;
         value['action'] = buttons.length > 0 ? buttons : '-';
         return value;
       });

     const pageDeleteHandler = async (id) => {
      
       const isConfirmed = window.confirm(
         'Are you sure you want to delete this page?'
       );
       if (isConfirmed) {
         try {
           const response = await fetch(`/api/admin/pages/${id}`, {
             method: 'DELETE',
           });
           const res = await response.json();

           setPages(pages.filter((page) => page.id !== id));
           showSuccessToast(res.message);
         } catch (error) {
           showErrorToast(error);
         } 
       } 
     };


  return (
    <div className='section-body mt-3'>
      <div className='container-fluid'>
        <div className='tab-content'>
          <div
            className='tab-pane fade show active'
            id='user-list'
            role='tabpanel'
          >
            <div className='d-flex justify-content-end'>
            {authPermissions.includes("Home-Template-Create") &&  <Button link='admin/home-template/add' text='Add Page' icon='add' />}
            </div>
            <div className='card mt-2'>
              <div className='card-header'>
                <strong className='card-title' style={{ fontSize: '20px' }}>
                  PAGES
                </strong>
              </div>
              <div className='card-body'>
                <div className='table-responsive'>
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
}

export default HomeTemplate;
