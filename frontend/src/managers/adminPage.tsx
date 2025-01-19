import { Link, Outlet, Route, Routes } from "react-router-dom"
import { HomePage } from "../components/homePage"
import { DashBoard } from "../adminComponents/dashBoard"
import { AdminHeader } from "../adminComponents/adminheader"

export const AdminPage = ()=>{
    return (
        <div>
            <AdminHeader></AdminHeader>
        <Outlet /> {/* Render the nested route's component here */}
      </div>
    )
}