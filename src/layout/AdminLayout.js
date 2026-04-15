import { Layout, ConfigProvider } from "antd";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  return (
    // ConfigProvider giúp tùy chỉnh màu sắc chủ đạo toàn hệ thống (Brand Color)
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff", // Màu xanh y tế đặc trưng
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        {/* Thanh điều hướng bên trái */}
        <Sidebar />

        {/* Khối nội dung bên phải - Cần dịch sang phải một khoảng bằng độ rộng Sidebar */}
        <Layout style={{ marginLeft: 260, transition: "all 0.2s" }}>
          <HeaderBar />

          <Content
            style={{
              margin: "24px 24px",
              padding: 24,
              minHeight: 280,
              background: "#fff", // Nội dung chính nằm trên nền trắng
              borderRadius: "12px", // Bo góc nhẹ cho hiện đại
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
              overflow: "initial",
            }}
          >
            {children}
          </Content>

          {/* Footer nhỏ phía dưới cùng */}
          <footer style={{ textAlign: "center", paddingBottom: 20, color: "#bfbfbf" }}>
            Hệ thống Quản lý Bệnh viện ©2026 - Phát triển bởi Đội ngũ IT Medical
          </footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;