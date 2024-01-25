import { get_queries } from '@/backend/models/queryModel'
import React from 'react'
import Queries from './Queries';

const page = async() => {
    const Data=await get_queries();
    const queries = Data.data;
  return (
    <Queries queries={queries}/>
  )
}

export default page