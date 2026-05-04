import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Select,
  message,
  Space,
  Tag,
  Popconfirm,
  Card,
  Typography,
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  UserAddOutlined, 
  SearchOutlined,
  ManOutlined,
  WomanOutlined 
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import patientApi from "../api/patientApi";
import { useUser } from "../context/UserContext";
const { Title } = Typography;
const { Option } = Select;

const Patients = () => {
  const {user} = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Tăng limit lên 10 cho chuyên nghiệp
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await patientApi.getAll({ page, limit, search, gender });
      setData(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (err) {
      message.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, gender]);

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await patientApi.update(editingId, values);
        message.success("Cập nhật thông tin thành công");
      } else {
        await patientApi.create(values);
        message.success("Đã thêm bệnh nhân mới vào hệ thống");
      }
      setOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi thao tác");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await patientApi.remove(id);
      message.success("Đã xóa bệnh nhân");
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi khi xóa bệnh nhân");
    }
  };

  const columns = [
    {
      title: "Mã BN",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id) => <Tag color="blue">BN-{id}</Tag>,
    },
    {
      title: "Họ và Tên",
      dataIndex: "full_name",
      key: "full_name",
      render: (text) => <span style={{ fontWeight: 600, color: "#1890ff" }}>{text}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => {
        if (gender === "Nam") return <Tag icon={<ManOutlined />} color="cyan">Nam</Tag>;
        if (gender === "Nữ") return <Tag icon={<WomanOutlined />} color="magenta">Nữ</Tag>;
        return <Tag color="default">Khác</Tag>;
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true, // Tự động rút gọn nếu địa chỉ quá dài
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
          </Button>
          {user?.role === "admin" && (
          <Popconfirm
            title="Xóa bệnh nhân"
            description="Bạn có chắc chắn muốn xóa bệnh nhân này khỏi hệ thống?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
            </Button>
          </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card bordered={false}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>📋 Danh sách bệnh nhân</Title>
        {user.role === "admin" && (
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          onClick={() => {
            setOpen(true);
            setEditingId(null);
            form.resetFields();
          }}
        >
          Thêm bệnh nhân mới
        </Button>
        )}
      </div>

      {/* 🔍 BỘ LỌC */}
      <Card size="small" style={{ marginBottom: 16, backgroundColor: "#fafafa" }}>
        <Space wrap>
          <Input
            placeholder="Tìm theo tên hoặc SĐT..."
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ width: 300 }}
            allowClear
          />

          <Select
            placeholder="Lọc giới tính"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => {
              setGender(value);
              setPage(1);
            }}
          >
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
            <Option value="Khác">Khác</Option>
          </Select>
        </Space>
      </Card>

      {/* 📋 BẢNG DỮ LIỆU */}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="id"
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: false,
          onChange: (p) => setPage(p),
          position: ["bottomCenter"],
        }}
        style={{ marginTop: 10 }}
      />

      {/* 🧾 MODAL THÊM/SỬA */}
      <Modal
        title={
          <Title level={4} style={{ margin: 0 }}>
            {editingId ? "📝 Chỉnh sửa thông tin" : "➕ Đăng ký bệnh nhân mới"}
          </Title>
        }
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu thông tin"
        cancelText="Hủy bỏ"
        width={600}
        centered
      >
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Họ và tên bệnh nhân"
            name="full_name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input placeholder="VD: Nguyễn Văn A" size="large" />
          </Form.Item>

          <Space style={{ display: "flex" }} align="start">
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập SĐT" },
                { pattern: /^[0-9]+$/, message: "SĐT không hợp lệ" }
              ]}
            >
              <Input placeholder="09xxxxxxx" size="large" style={{ width: 270 }} />
            </Form.Item>

            <Form.Item 
              label="Giới tính" 
              name="gender" 
              rules={[{ required: true, message: "Chọn giới tính" }]}
            >
              <Select placeholder="Chọn" size="large" style={{ width: 270 }}>
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Khác">Khác</Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item label="Địa chỉ cư trú" name="address">
            <Input.TextArea rows={3} placeholder="Số nhà, đường, phường/xã..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Patients;