import { Layout, Menu, Typography } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  FileProtectOutlined,
  BarChartOutlined,
  CreditCardOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
const { Sider } = Layout;
const { Text } = Typography;

const Sidebar = ({ collapsed }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(user);
  

 const role = user?.role;
 console.log(role
 );
 

const menuItems = [
  {
    key: "grp1",
    label: !collapsed ? "TỔNG QUAN" : "",
    type: "group",
    children: [
      {
        key: role === "doctor" ? "/doctor" : "/dashboard",
        icon: <DashboardOutlined />,
        label: "Bảng điều khiển",
      },
      // Hóa đơn chỉ admin + staff
      ...( ["admin", "staff"].includes(role)
        ? [
            {
              key: "/invoices",
              icon: <CreditCardOutlined />,
              label: "Hóa đơn",
            },
      { key: "/analytics", icon: <BarChartOutlined />, label: "Thống kê" },

          ]
        : []),
    ],
  },

  {
    key: "grp2",
    label: !collapsed ? "QUẢN LÝ CHUYÊN MÔN" : "",
    type: "group",
    children: [
      // Nhân sự chỉ admin
      ...(role === "admin"
        ? [{ key: "/doctors", icon: <UserOutlined />, label: "Nhân sự" }]
        : []),

      { key: "/patients", icon: <UserOutlined />, label: "Bệnh nhân" },
      { key: "/appointments", icon: <CalendarOutlined />, label: "Lịch hẹn" },

      // Hồ sơ bệnh án: admin + doctor
      ...( ["admin", "doctor"].includes(role)
        ? [
            {
              key: "/medical-records",
              icon: <FileProtectOutlined />,
              label: "Hồ sơ bệnh án",
            },
          ]
        : []),
    ],
  },

  {
    key: "grp3",
    label: !collapsed ? "KHO & TÀI CHÍNH" : "",
    type: "group",
    children: [
      { key: "/medicines", icon: <MedicineBoxOutlined />, label: "Kho dược phẩm" },
      { key: "/medical-supplies", icon: <MedicineBoxOutlined />, label: "Kho vật tư y tế" },

      // Lương chỉ admin
      ...(role === "admin"
        ? [
            {
              key: "/salary",
              icon: <DollarOutlined />,
              label: "Quản lý lương",
            },
          ]
        : []),
    ],
  },
];

  return (
    <Sider
      width={260}
      collapsedWidth={80}
      collapsed={collapsed} // Nhận trạng thái từ AdminLayout
      trigger={null} // Ẩn nút toggle mặc định của Sider (vì đã có nút ở Header)
      collapsible
      style={{
        overflow: "hidden",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1001,
        backgroundColor: "#001529",
        boxShadow: "2px 0 8px 0 rgba(29,35,41,.05)",
        transition: "all 0.2s",
      }}
    >
      {/* Logo Area */}
      <div style={{ 
        height: 64, 
        display: "flex", 
        alignItems: "center", 
        paddingLeft: collapsed ? 25 : 24, // Căn giữa icon khi thu gọn
        background: "#002140",
        transition: "all 0.2s",
        overflow: "hidden",
        whiteSpace: "nowrap"
      }}>
        <div style={{ 
          width: 30, 
          height: 30, 
          background: "#1890ff", 
          borderRadius: "6px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0
        }}>
          <MedicineBoxOutlined style={{ color: "#fff", fontSize: 18 }} />
        </div>
        
        {/* Chỉ hiện chữ khi không thu gọn */}
        {!collapsed && (
          <Text style={{ 
            color: "#fff", 
            fontWeight: 700, 
            fontSize: 16, 
            marginLeft: 10,
            letterSpacing: 1 
          }}>
            HOSPITAL MS
          </Text>
        )}
      </div>

      {/* Navigation Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={(item) => navigate(item.key)}
        items={menuItems}
        style={{ 
          padding: "16px 0", 
          backgroundColor: "transparent",
          borderRight: 0 
        }}
      />

      {/* Footer Sidebar */}
      {!collapsed && (
        <div style={{ 
          position: "absolute", 
          bottom: 20, 
          width: "100%", 
          textAlign: "center",
          padding: "0 20px",
          transition: "opacity 0.2s"
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
      )}
    </Sider>
  );
};

export default Sidebar;