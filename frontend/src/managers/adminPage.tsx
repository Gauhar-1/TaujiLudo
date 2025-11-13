import {  Outlet } from "react-router-dom"
import { AdminHeader } from "../adminComponents/adminheader"

export const AdminPage = ()=>{
    return (
        <div>
            <AdminHeader></AdminHeader>
        <Outlet /> 
      </div>
    )
}