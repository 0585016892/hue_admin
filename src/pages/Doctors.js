import {
  Table, Button, Input, Modal, Form, Select, message, Space, 
  Tag, Card, Typography, Avatar, Row, Col, Popconfirm, Divider
} from "antd";
import { 
  UserOutlined, SearchOutlined, PlusOutlined, 
  EditOutlined, DeleteOutlined, MailOutlined, 
  PhoneOutlined, TeamOutlined 
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import doctorApi from "../api/doctorApi";

const { Title, Text } = Typography;
const { Option } = Select;

const Doctors = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await doctorApi.getAll({
        page,
        limit,
        search,
        role_id: 2,
      });
      setData(res.data.data);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      message.error("Không thể tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await doctorApi.update(editingId, values);
        message.success("Cập nhật thông tin thành công");
      } else {
        await doctorApi.create({ ...values, role_id: 2 });
        message.success("Đã thêm bác sĩ vào hệ thống");
      }
      setOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Thao tác thất bại");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await doctorApi.remove(id);
      message.success("Đã xóa nhân sự");
      fetchData();
    } catch {
      message.error("Lỗi khi xóa dữ liệu");
    }
  };

  const columns = [
    {
      title: "Bác sĩ",
      key: "doctor_info",
      render: (_, record) => (
        <Space size="middle">
          <Avatar 
            src={record.avatar} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: "#1890ff" }} 
            size={40}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text strong style={{ color: "#1890ff" }}>{record.full_name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>ID: {record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <div style={{ fontSize: 13 }}>
          <div><MailOutlined /> {record.email}</div>
          <div><PhoneOutlined /> {record.phone || "N/A"}</div>
        </div>
      ),
    },
    {
      title: "Chuyên khoa",
      dataIndex: "department",
      key: "department",
      render: (dept) => {
        let color = "blue";
        if (dept === "Nhi") color = "orange";
        if (dept === "Tim mạch") color = "volcano";
        if (dept === "Da liễu") color = "magenta";
        return <Tag color={color} style={{ borderRadius: 10, padding: "0 10px" }}>{dept}</Tag>;
      },
    },
    {
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Xóa bác sĩ?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <TeamOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>Quản lý Đội ngũ Bác sĩ</Title>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => {
              setEditingId(null);
              form.resetFields();
              setOpen(true);
            }}
          >
            Thêm bác sĩ mới
          </Button>
        </Col>
      </Row>

      <Card size="small" style={{ marginBottom: 16, background: "#f9f9f9" }}>
        <Input
          placeholder="Tìm bác sĩ theo tên, email hoặc SĐT..."
          prefix={<SearchOutlined />}
          size="large"
          allowClear
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ maxWidth: 450 }}
        />
      </Card>

      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: limit,
          total,
          onChange: (p) => setPage(p),
        }}
      />

      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            {editingId ? "📝 Chỉnh sửa thông tin bác sĩ" : "👨‍⚕️ Khai báo hồ sơ bác sĩ"}
          </Title>
        }
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        width={650}
        centered
      >
        <Divider style={{ margin: "12px 0" }} />
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 10 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="full_name"
                label={<Text strong>Họ tên bác sĩ</Text>}
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input placeholder="BS. Nguyễn Văn A" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label={<Text strong>Chuyên khoa</Text>}
                rules={[{ required: true, message: "Chọn chuyên khoa" }]}
              >
                <Select size="large" placeholder="Chọn chuyên khoa">
                  <Option value="Nội tổng quát">Nội tổng quát</Option>
                  <Option value="Tim mạch">Tim mạch</Option>
                  <Option value="Da liễu">Da liễu</Option>
                  <Option value="Nhi">Nhi</Option>
                  <Option value="Sản - Phụ khoa">Sản - Phụ khoa</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label={<Text strong>Email liên hệ</Text>}
                rules={[
                  { required: true, message: "Nhập email" },
                  { type: "email", message: "Email không hợp lệ" }
                ]}
              >
                <Input prefix={<MailOutlined />} size="large" placeholder="doctor@hospital.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={<Text strong>Số điện thoại</Text>}
                rules={[{ pattern: /^[0-9]+$/, message: "SĐT chỉ được chứa số" }]}
              >
                <Input prefix={<PhoneOutlined />} size="large" placeholder="09xxxxxxxx" />
              </Form.Item>
            </Col>
          </Row>

          {!editingId && (
            <Form.Item
              name="password"
              label={<Text strong>Mật khẩu hệ thống</Text>}
              rules={[{ required: true, min: 6, message: "Mật khẩu ít nhất 6 ký tự" }]}
            >
              <Input.Password size="large" placeholder="Thiết lập mật khẩu đăng nhập" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Card>
  );
};

export default Doctors;