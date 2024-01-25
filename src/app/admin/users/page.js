'use client';
import React, { useContext, useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaUserAlt } from 'react-icons/fa';
import Link from 'next/link';
import { showErrorToast, showSuccessToast } from '@/utils/toaster';
import DataTable2 from '@/components/DataTable2';
import Button from '@/components/Button/Button';
import PermissionContext from '@/app/context/PermissionContext';

const Users = () => {
 const {authPermissions}=useContext(PermissionContext)
  const [users, setUsers] = useState([]);


  const fethUsers = async () => {
    const response = await fetch('/api/admin/users');
    const res = await response.json();
    setUsers(res.data);
  };

  useEffect(() => {
    fethUsers();
  }, []);

  const headers = [
    { name: 'S.No.', field: 'sr_no', classKey: '' },
    { name: 'NAME', field: 'name', sortable: true, classKey: '' },
    { name: 'EMAIL', field: 'email', sortable: true, classKey: '' },
    { name: 'ROLE', field: 'role_name', sortable: true, classKey: '' },
    { name: 'ACTION', field: 'action', classKey: '' },
  ];

  const searchItems = ['name', 'role_name', 'email'];

  const userDeleteHandler = async (id) => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this user?'
    );
    if (isConfirmed) {
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
        });
        const res = await response.json();
        
        setUsers(users.filter((user) => user.id !== id));
        showSuccessToast(res.message);
      } catch (error) {
        showErrorToast('User delete error!');
      }
    }
  };

  const usersData = users?.map((value, index) => {
    let buttons = [];
     if (authPermissions?.includes('User-Update')){
    buttons.push(
      <Link
        key='editButton##1'
        type='button'
        href={`/admin/users/edit/${value.id}`}
        // href={`/admin/user/permissions?id=${value.id}`} as={`/admin/user/permissions/${value.id}`}
        style={{ border: 'none', background: 'none', marginRight: '10px' }}
        title='Edit'
      >
        <FaEdit color='green' size={13} />
      </Link>
    );
     }
    buttons.push(
      <Link
        key='userButton##1'
        type='button'
        href={`/admin/users/permissions/${value.id}`}
        style={{ border: 'none', background: 'none', marginRight: '10px' }}
        title='Permission'
      >
        <FaUserAlt color='#232323' size={13} />
      </Link>
    );
    if(authPermissions?.includes("User-Delete")){
    buttons.push(
      <button
        key='deleteButton##1'
        type='button'
        data-id={value.id}
        onClick={() => userDeleteHandler(value.id)}
        title='Delete'
        style={{ border: 'none', background: 'none' }}
      >
        <FaTrash color='red' size={13} />
      </button>
    );
    }
    const nameArray = value.name.split(' ');
    const capitalizedName = nameArray
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const roleName =
      value.role_name.charAt(0).toUpperCase() + value.role_name.slice(1);
    value['sr_no'] = index + 1;
    value['action'] = buttons.length > 0 ? buttons : '-';
    value['name'] = capitalizedName;
    value['role_name'] = roleName;


    return value;
  });


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
                {authPermissions.includes('User-Create') && <Button link='admin/users/add' text='Add User' icon='add' />}
              </div>
              <div className='card' style={{ marginTop: '1%' }}>
                <div className='card-header'>
                  <h6 className='card-title'>USERS</h6>
                </div>
                <div className='card-body'>
                  <div className='table-responsive'>
                    {
                      <DataTable2
                        lists={usersData}
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

export default Users;
