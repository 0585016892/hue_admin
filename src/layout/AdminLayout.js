import React, { useState } from "react";
import { Layout, ConfigProvider } from "antd";
import { Outlet } from "react-router-dom";   // 👈 thêm dòng này
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

const { Content } = Layout;

const AdminLayout = () => {   // ❌ bỏ children
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 260,
            transition: "all 0.2s ease-in-out",
          }}
        >
          <HeaderBar collapsed={collapsed} setCollapsed={setCollapsed} />

          <Content
            style={{
              margin: "24px 24px",
              padding: 24,
              minHeight: 280,
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
            }}
          >
            <Outlet />   {/* 👈 QUAN TRỌNG */}
          </Content>

          <footer
            style={{
              textAlign: "center",
              paddingBottom: 20,
              color: "#bfbfbf",
            }}
          >
            Hệ thống Quản lý Bệnh viện ©2026 - Phát triển bởi Đội ngũ IT Medical
          </footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;