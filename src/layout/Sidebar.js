import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileProtectOutlined,
  BarChartOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Để lấy đường dẫn hiện tại và làm sáng Menu tương ứng

  const menuItems = [
    { 
      key: "grp1", 
      label: "TỔNG QUAN", 
      type: "group", 
      children: [
        { key: "/", icon: <DashboardOutlined />, label: "Bảng điều khiển" },
        { key: "/analytics", icon: <BarChartOutlined />, label: "Thống kê" },
      ]
    },
    { 
      key: "grp2", 
      label: "QUẢN LÝ CHUYÊN MÔN", 
      type: "group", 
      children: [
        { key: "/doctors", icon: <UserOutlined />, label: "Bác sĩ" },
        { key: "/patients", icon: <UserOutlined />, label: "Bệnh nhân" },
        { key: "/appointments", icon: <CalendarOutlined />, label: "Lịch hẹn" },
        { key: "/medical-records", icon: <FileProtectOutlined />, label: "Hồ sơ bệnh án" },
      ]
    },
    { 
      key: "grp3", 
      label: "KHO & TÀI CHÍNH", 
      type: "group", 
      children: [
        { key: "/medicines", icon: <MedicineBoxOutlined />, label: "Kho dược phẩm" },
        { key: "/invoices", icon: <CreditCardOutlined />, label: "Hóa đơn & Thu phí" },
      ]
    },
  ];

  return (
    <Sider
      width={260}
      breakpoint="lg"
      collapsedWidth="80"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "#001529", // Màu Navy chuyên nghiệp
        boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
      }}
    >
      {/* Logo Area */}
      <div style={{ 
        height: 64, 
        display: "flex", 
        alignItems: "center", 
        paddingLeft: 24, 
        background: "#002140" // Đậm hơn một chút để tách biệt
      }}>
        <div style={{ 
          width: 30, 
          height: 30, 
          background: "#1890ff", 
          borderRadius: "6px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 10
        }}>
          <MedicineBoxOutlined style={{ color: "#fff", fontSize: 18 }} />
        </div>
        <Text style={{ color: "#fff", fontWeight: 700, fontSize: 16, letterSpacing: 1 }}>
          HOSPITAL MS
        </Text>
      </div>

      {/* Navigation Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]} // Tự động highlight menu theo URL
        onClick={(item) => navigate(item.key)}
        items={menuItems}
        style={{ padding: "16px 0", backgroundColor: "transparent" }}
      />

      {/* Footer Sidebar (Tùy chọn) */}
      <div style={{ 
        position: "absolute", 
        bottom: 20, 
        width: "100%", 
        textAlign: "center",
        padding: "0 20px" 
      }}>
        <div style={{ 
          background: "rgba(255,255,255,0.05)", 
          padding: "10px", 
          borderRadius: 8,
          fontSize: 12,
          color: "rgba(255,255,255,0.4)"
        }}>
          Phiên bản v2.0.4
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;