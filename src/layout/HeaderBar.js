import { Layout, Dropdown, Avatar, Space, Typography, Button, Modal, List, Tag } from "antd";
import { 
  UserOutlined, 
  LogoutOutlined, 
  QuestionCircleOutlined, 
  SettingOutlined,
  CaretDownOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useState } from "react";

const { Header } = Layout;
const { Text, Title } = Typography;

const HeaderBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Nội dung hướng dẫn nhanh
  const guideData = [
    {
      title: "Quản lý Nhân sự & Bệnh nhân",
      desc: "Quản lý danh sách Bác sĩ và thông tin Bệnh nhân tại mục 'Bác sĩ' & 'Bệnh nhân'.",
      tag: "Cơ bản"
    },
    {
      title: "Vận hành Khám chữa bệnh",
      desc: "Đặt lịch tại 'Lịch hẹn' và lưu trữ quá trình điều trị tại 'Hồ sơ bệnh án'.",
      tag: "Nghiệp vụ"
    },
    {
      title: "Quản lý Kho & Thu phí",
      desc: "Kiểm soát thuốc tại 'Kho dược phẩm' và xác nhận thanh toán tại 'Hóa đơn & Thu phí'.",
      tag: "Tài chính"
    }
  ];

  const menuItems = [
    {
      key: "1",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "2",
      label: "Cài đặt hệ thống",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout,
    },
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
      {/* LEFT: Logo & Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ 
          backgroundColor: "#1890ff", 
          width: 32, 
          height: 32, 
          borderRadius: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          fontSize: 18,
          fontWeight: "bold"
        }}>
          H
        </div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#001529" }}>
          HOSPITAL <span style={{ color: "#1890ff" }}>PRO</span>
        </h3>
      </div>

      {/* RIGHT: Actions & Profile */}
      <Space size={20}>
        {/* Nút Hướng dẫn sử dụng */}
        <Button 
          type="text" 
          icon={<QuestionCircleOutlined style={{ fontSize: 18 }} />} 
          onClick={() => setIsGuideOpen(true)}
          style={{ display: 'flex', alignItems: 'center', color: '#595959' }}
        >
          Hướng dẫn
        </Button>

        <Dropdown 
          menu={{ items: menuItems }} 
          placement="bottomRight" 
          arrow={{ pointAtCenter: true }}
          trigger={['click']}
        >
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px", 
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "6px",
          }} 
          className="user-dropdown-hover"
          >
            <Avatar 
              src={user?.avatar} 
              icon={!user?.avatar && <UserOutlined />} 
              style={{ backgroundColor: "#1890ff" }}
            />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: "1.2" }}>
              <Text strong style={{ fontSize: "14px" }}>
                {user?.full_name || "Bác sĩ Guest"}
              </Text>
              <Text type="secondary" style={{ fontSize: "11px", textTransform: "uppercase" }}>
                {user?.role || "Nhân viên"}
              </Text>
            </div>
            <CaretDownOutlined style={{ fontSize: 12, color: "#bfbfbf" }} />
          </div>
        </Dropdown>
      </Space>

      {/* MODAL HƯỚNG DẪN */}
      <Modal
        title={
          <Space>
            <QuestionCircleOutlined style={{ color: '#1890ff' }} />
            <span>Hướng dẫn vận hành hệ thống Hospital Pro</span>
          </Space>
        }
        open={isGuideOpen}
        onCancel={() => setIsGuideOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsGuideOpen(false)}>
            Đã hiểu
          </Button>
        ]}
        width={500}
      >
        <List
          itemLayout="horizontal"
          dataSource={guideData}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Space>
                    <Text strong>{item.title}</Text>
                    <Tag color="blue">{item.tag}</Tag>
                  </Space>
                }
                description={
                  <div style={{ marginTop: 5 }}>
                    <Text type="secondary">{item.desc}</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text size="small" type="link" style={{ fontSize: 12 }}>
                        Xem chi tiết <ArrowRightOutlined style={{ fontSize: 10 }} />
                      </Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          background: '#f5f5f5', 
          borderRadius: 8,
          borderLeft: '4px solid #1890ff' 
        }}>
          <Text italic size="small">
            * Lưu ý: Các chức năng Tài chính yêu cầu quyền Admin để thực hiện xác nhận thanh toán cuối cùng.
          </Text>
        </div>
      </Modal>

      <style>{`
        .user-dropdown-hover:hover { background: #f5f5f5; }
      `}</style>
    </Header>
  );
};

export default HeaderBar;   