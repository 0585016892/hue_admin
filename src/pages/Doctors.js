import {
  Table, Button, Input, Modal, Form, Select, message, Space, 
  Tag, Card, Typography, Avatar, Row, Col, Popconfirm, Divider
} from "antd";
import { 
  UserOutlined, SearchOutlined, PlusOutlined, 
  EditOutlined, DeleteOutlined, MailOutlined, 
  PhoneOutlined, TeamOutlined, FilterOutlined
} from "@ant-design/icons";
import { useEffect, useState, useCallback } from "react";
import doctorApi from "../api/doctorApi";

const { Title, Text } = Typography;
const { Option } = Select;

// Danh sách Role để dùng chung cho Filter và Form
const ROLE_LIST = [
  { id: 1, name: "Quản trị viên", color: "red" },
  { id: 2, name: "Bác sĩ", color: "blue" },
  { id: 3, name: "Nhân sự", color: "green" },
  { id: 4, name: "Bảo vệ", color: "default" },
  { id: 5, name: "Y tá", color: "purple" },
];

const DEPARTMENTS = ["Nội tổng quát", "Tim mạch", "Da liễu", "Nhi", "Sản - Phụ khoa"];

const Doctors = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  
  // States cho Bộ lọc
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState(null); // Mặc định là null (Tất cả)
  const [filterDept, setFilterDept] = useState(null);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

 const fetchData = useCallback(async () => {
  setLoading(true);
  try {
    // Kiểm tra xem các giá trị này có bị undefined không
    console.log("Params gửi đi:", { 
      page, 
      search, 
      role_id: filterRole, 
      department: filterDept 
    });

    const res = await doctorApi.getAll({
      page,
      limit,
      search: search || undefined, // Tránh gửi chuỗi rỗng nếu backend không xử lý
      role_id: filterRole || undefined, // Nếu là null thì không gửi hoặc backend hiểu là "Tất cả"
      department: filterDept || undefined,
    });
    
    setData(res.data.data);
    setTotal(res.data.pagination?.total || 0);
  } catch (err) {
    message.error("Không thể tải danh sách");
  } finally {
    setLoading(false);
  }
}, [page, limit, search, filterRole, filterDept]); // Rất quan trọng: Phải có đủ dependency ở đây
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await doctorApi.update(editingId, values);
        message.success("Cập nhật thông tin thành công");
      } else {
        await doctorApi.create(values); // role_id giờ lấy từ form
        message.success("Đã thêm nhân sự vào hệ thống");
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
      title: "Nhân sự",
      key: "user_info",
      render: (_, record) => (
        <Space size="middle">
          <Avatar src={record.avatar} icon={<UserOutlined />} size={40} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Text strong>{record.full_name}</Text>
            <Tag color={ROLE_LIST.find(r => r.id === record.role_id)?.color} style={{ fontSize: 10, width: 'fit-content', lineHeight: '16px' }}>
              {ROLE_LIST.find(r => r.id === record.role_id)?.name || "N/A"}
            </Tag>
          </div>
        </Space>
      ),
    },
    {
      title: "Chuyên khoa",
      dataIndex: "department",
      key: "department",
      render: (dept) => dept ? <Tag color="cyan">{dept}</Tag> : <Text type="secondary">-</Text>,
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
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Xóa nhân sự này?" onConfirm={() => handleDelete(record.id)} okButtonProps={{ danger: true }}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space>
            <TeamOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>Quản lý Nhân sự & Bác sĩ</Title>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => { setEditingId(null); form.resetFields(); setOpen(true); }}>
            Thêm nhân sự mới
          </Button>
        </Col>
      </Row>

      {/* Filter Area */}
      <Card size="small" style={{ marginBottom: 16, background: "#f9f9f9", border: "1px solid #eee" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Tìm kiếm tên, email, SĐT..."
              prefix={<SearchOutlined />}
              size="large"
              allowClear
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </Col>
          <Col xs={12} md={5}>
            <Select
              placeholder="Lọc theo Chức vụ"
              size="large"
              style={{ width: '100%' }}
              allowClear
              onChange={(val) => { setFilterRole(val); setPage(1); }}
            >
              {ROLE_LIST.map(role => (
                <Option key={role.id} value={role.id}>{role.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={5}>
            <Select
              placeholder="Lọc Chuyên khoa"
              size="large"
              style={{ width: '100%' }}
              allowClear
              onChange={(val) => { setFilterDept(val); setPage(1); }}
            >
              {DEPARTMENTS.map(dept => (
                <Option key={dept} value={dept}>{dept}</Option>
              ))}
            </Select>
          </Col>
          <Col>
             <Text type="secondary"><FilterOutlined /> Tìm thấy {total} kết quả</Text>
          </Col>
        </Row>
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
          showSizeChanger: false
        }}
      />

      {/* Modal Form */}
      <Modal
        title={editingId ? "📝 Chỉnh sửa thông tin" : "👤 Thêm nhân sự mới"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        width={650}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 15 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="full_name" label="Họ và tên" rules={[{ required: true }]}>
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role_id" label="Chức vụ/Vai trò" rules={[{ required: true }]}>
                <Select size="large">
                  {ROLE_LIST.map(role => (
                    <Option key={role.id} value={role.id}>{role.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="department" label="Chuyên khoa (Nếu có)">
                <Select size="large" allowClear>
                  {DEPARTMENTS.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại">
                <Input size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" />
          </Form.Item>

          {!editingId && (
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6 }]}>
              <Input.Password size="large" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Card>
  );
};

export default Doctors;