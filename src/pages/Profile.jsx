import {
  Card, Descriptions, Button, message, Input, Form, Modal, 
  Avatar, Tag, Typography, Space, Divider, Row, Col, Badge
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  ApartmentOutlined, 
  KeyOutlined, 
  LogoutOutlined,
  EditOutlined,
  SaveOutlined,
  RollbackOutlined
} from "@ant-design/icons";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import userApi from "../api/userApi";

const { Title, Text } = Typography;

const Profile = () => {
  const { user, setUser, logout } = useUser();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openPass, setOpenPass] = useState(false);

  const [form] = Form.useForm();
  const [passForm] = Form.useForm();

  if (!user) return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <Text type="secondary">Vui lòng đăng nhập để xem thông tin</Text>
    </div>
  );

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      await userApi.updateProfile(user.id, values);
      const updatedUser = { ...user, ...values };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      message.success("Cập nhật thông tin thành công");
      setEditMode(false);
    } catch (err) {
        console.log("Full Error:", err);
      message.error(err.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      await userApi.changePassword(user.id, values);
      message.success("Đổi mật khẩu thành công");
      setOpenPass(false);
      passForm.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '80vh' }}>
      <Card
        style={{ maxWidth: 800, margin: "0 auto", borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        bordered={false}
      >
        <Row gutter={[32, 32]} align="middle">
          {/* CỘT TRÁI: AVATAR & NHÃN */}
          <Col xs={24} md={8} style={{ textAlign: 'center', borderRight: '1px solid #f0f0f0' }}>
            <Badge dot color="green" offset={[-20, 100]} size="large">
              <Avatar 
                size={120} 
                icon={<UserOutlined />} 
                src={user.avatar}
                style={{ backgroundColor: '#1677ff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
              />
            </Badge>
            <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{user.full_name}</Title>
            <Tag color="blue" style={{ borderRadius: 10, padding: '0 12px' }}>
              {user.role_id === 1 ? 'Quản trị viên' : 'Nhân viên y tế'}
            </Tag>
            
            <Divider />
            
            <Button 
              danger 
              type="text" 
              icon={<LogoutOutlined />} 
              onClick={logout}
              block
            >
              Đăng xuất hệ thống
            </Button>
          </Col>

          {/* CỘT PHẢI: CHI TIẾT / FORM */}
          <Col xs={24} md={16}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Title level={5} style={{ margin: 0 }}>Hồ sơ người dùng</Title>
              {!editMode && (
                <Button 
                  type="primary" 
                  ghost 
                  icon={<EditOutlined />} 
                  onClick={() => {
                    form.setFieldsValue(user);
                    setEditMode(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
              )}
            </div>

            {!editMode ? (
              <Descriptions column={1} labelStyle={{ fontWeight: 'bold', color: '#555' }}>
                <Descriptions.Item label={<Space><MailOutlined /> Email</Space>}>
                  {user.email}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><PhoneOutlined /> Số điện thoại</Space>}>
                  {user.phone || <Text type="secondary" italic>Chưa cập nhật</Text>}
                </Descriptions.Item>
                <Descriptions.Item label={<Space><ApartmentOutlined /> Phòng ban</Space>}>
                  <Tag color="cyan">{user.department || "Chưa xác định"}</Tag>
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Form form={form} layout="vertical" onFinish={handleUpdate} requiredMark={false}>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true }]}>
                      <Input prefix={<UserOutlined />} size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phone" label="Số điện thoại">
                      <Input prefix={<PhoneOutlined />} size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="department" label="Phòng ban">
                      <Input prefix={<ApartmentOutlined />} size="large" />
                    </Form.Item>
                  </Col>
                </Row>
                <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 10 }}>
                  <Button icon={<RollbackOutlined />} onClick={() => setEditMode(false)}>Huỷ</Button>
                  <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>Lưu thay đổi</Button>
                </Space>
              </Form>
            )}

            {!editMode && (
              <>
                <Divider dashed />
                <Button 
                  type="dashed" 
                  icon={<KeyOutlined />} 
                  onClick={() => setOpenPass(true)}
                  block
                >
                  Yêu cầu đổi mật khẩu bảo mật
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Card>

      {/* MODAL ĐỔI MẬT KHẨU */}
      <Modal
        title={
          <Space>
            <KeyOutlined style={{ color: '#faad14' }} />
            <span>Thiết lập mật khẩu mới</span>
          </Space>
        }
        open={openPass}
        onCancel={() => setOpenPass(false)}
        footer={null}
        centered
        width={400}
      >
        <Form form={passForm} layout="vertical" onFinish={handleChangePassword} style={{ marginTop: 20 }}>
          <Form.Item
            name="oldpassword"
            label="Mật khẩu hiện tại"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Form.Item
            name="newpassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải từ 6 ký tự' }
            ]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ marginTop: 10 }}>
            Xác nhận đổi mật khẩu
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;