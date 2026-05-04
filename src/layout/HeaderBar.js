import { Layout, Dropdown, Avatar, Space, Typography, Button, Modal, List, Tag } from "antd";
import { 
  UserOutlined, 
  LogoutOutlined, 
  QuestionCircleOutlined, 
  SettingOutlined,
  CaretDownOutlined,
  ArrowRightOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState } from "react";

const { Header } = Layout;
const { Text } = Typography;

// Nhận props collapsed và setCollapsed từ AdminLayout
const HeaderBar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const guideData = [
    { title: "Quản lý Nhân sự & Bệnh nhân", desc: "Quản lý danh sách Bác sĩ và thông tin Bệnh nhân.", tag: "Cơ bản" },
    { title: "Vận hành Khám chữa bệnh", desc: "Đặt lịch tại 'Lịch hẹn' và lưu trữ hồ sơ bệnh án.", tag: "Nghiệp vụ" },
    { title: "Quản lý Kho & Thu phí", desc: "Kiểm soát thuốc và xác nhận thanh toán hóa đơn.", tag: "Tài chính" }
  ];

  const menuItems = [
    { key: "1", label: "Thông tin cá nhân", icon: <UserOutlined />, onClick: () => navigate("/profile") },
    { key: "2", label: "Cài đặt hệ thống", icon: <SettingOutlined /> },
    { type: "divider" },
    { key: "logout", label: "Đăng xuất", icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
  ];

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 1px 4px rgba(0, 21, 41, 0.08)",
        height: "64px"
      }}
    >
      {/* LEFT: Nút thu gọn Sidebar */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "18px",
            width: 40,
            height: 40,
            marginRight: 16
          }}
        />
        {/* Breadcrumb hoặc Tên trang có thể đặt ở đây nếu cần */}
        <Text type="secondary" style={{ fontSize: 13 }}>Chào buổi làm việc, hệ thống đã sẵn sàng!</Text>
      </div>

      {/* RIGHT: Actions & Profile */}
      <Space size={12}>
        <Button 
          type="text" 
          icon={<QuestionCircleOutlined style={{ fontSize: 18 }} />} 
          onClick={() => setIsGuideOpen(true)}
          style={{ color: '#595959' }}
        >
          Hướng dẫn
        </Button>

        <Dropdown 
          menu={{ items: menuItems }} 
          placement="bottomRight" 
          trigger={['click']}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px", 
            cursor: "pointer",
            padding: "4px 12px",
            borderRadius: "6px",
            transition: "all 0.3s"
          }} 
          className="user-dropdown-hover"
          >
            <Avatar 
              src={user?.avatar} 
              icon={!user?.avatar && <UserOutlined />} 
              style={{ backgroundColor: "#1890ff", boxShadow: "0 2px 4px rgba(24,144,255,0.2)" }}
            />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
              <Text strong style={{ fontSize: "14px" }}>
                {user?.full_name || "Bác sĩ Guest"}
              </Text>
              <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase" }}>
                {user?.role_name || "Nhân viên"}
              </Text>
            </div>
            <CaretDownOutlined style={{ fontSize: 10, color: "#bfbfbf" }} />
          </div>
        </Dropdown>
      </Space>

      {/* MODAL HƯỚNG DẪN (Giữ nguyên logic của bạn) */}
      <Modal
        title={
          <Space>
            <QuestionCircleOutlined style={{ color: '#1890ff' }} />
            <span>Hướng dẫn vận hành hệ thống</span>
          </Space>
        }
        open={isGuideOpen}
        onCancel={() => setIsGuideOpen(false)}
        footer={[<Button key="ok" type="primary" onClick={() => setIsGuideOpen(false)}>Đã hiểu</Button>]}
        width={500}
      >
        <List
          itemLayout="horizontal"
          dataSource={guideData}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Space><Text strong>{item.title}</Text><Tag color="blue">{item.tag}</Tag></Space>}
                description={<Text type="secondary">{item.desc}</Text>}
              />
            </List.Item>
          )}
        />
      </Modal>

      <style>{`
        .user-dropdown-hover:hover { background: #f5f5f5; }
      `}</style>
    </Header>
  );
};

export default HeaderBar;