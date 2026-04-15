import {
  Table, Button, Input, Modal, Form, InputNumber, message, Space, 
  Tag, Card, Typography, Popconfirm, Divider, Row, Col, Badge, Select
} from "antd";
import { 
  MedicineBoxOutlined, 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  AppstoreOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import medicineApi from "../api/medicineApi";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Medicines = () => {
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
      const res = await medicineApi.getAll({ page, limit, search });
      setData(res.data.data);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      message.error("Không thể tải danh mục thuốc");
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
        await medicineApi.update(editingId, values);
        message.success("Cập nhật thông tin thuốc thành công");
      } else {
        await medicineApi.create(values);
        message.success("Đã nhập thêm thuốc mới vào kho");
      }
      setOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi hệ thống");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await medicineApi.remove(id);
      message.success("Đã xoá thuốc khỏi danh mục");
      fetchData();
    } catch (err) {
      message.error("Không thể xoá dữ liệu này");
    }
  };

  const columns = [
    {
      title: "Thông tin thuốc",
      key: "medicine_info",
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: '15px', color: '#1677ff' }}>{record.medicine_name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>Mã: MED-{record.id}</Text>
        </Space>
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      render: (unit) => {
        let color = unit === 'Chai' ? 'magenta' : unit === 'Vỉ' ? 'cyan' : 'blue';
        return <Tag color={color} style={{ borderRadius: '4px' }}>{unit || 'Viên'}</Tag>;
      },
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      align: "right",
      render: (v) => <Text strong color="green">{new Intl.NumberFormat('vi-VN').format(v)} ₫</Text>,
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      align: "center",
      render: (stock) => (
        stock < 10 ? (
          <Badge count={<WarningOutlined style={{ color: '#f5222d' }} />} offset={[5, 0]}>
            <Tag color="error" style={{ minWidth: '60px', textAlign: 'center', borderRadius: '12px' }}>
              {stock}
            </Tag>
          </Badge>
        ) : (
          <Tag color="success" style={{ minWidth: '60px', textAlign: 'center', borderRadius: '12px' }}>
            {stock}
          </Tag>
        )
      ),
    },
    {
      title: "Mô tả / Ghi chú",
      dataIndex: "note",
      ellipsis: true,
      render: (text) => <Text type="secondary">{text || '---'}</Text>
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            style={{ color: "#1890ff" }}
            onClick={() => handleEdit(record)} 
          />
          <Popconfirm
            title="Xóa loại thuốc này?"
            description="Dữ liệu này sẽ không thể khôi phục."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, size: 'small' }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      <Card 
        bordered={false} 
        style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
      >
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space size="large">
              <div style={{ 
                background: '#e6f4ff', 
                padding: '12px', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <MedicineBoxOutlined style={{ fontSize: 24, color: "#1677ff" }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0 }}>Kho Dược Phẩm</Title>
                <Text type="secondary">Quản lý danh mục và số lượng thuốc tồn kho</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              style={{ borderRadius: '8px', height: '45px' }}
              onClick={() => {
                setOpen(true);
                setEditingId(null);
                form.resetFields();
              }}
            >
              Thêm thuốc mới
            </Button>
          </Col>
        </Row>

        <Row style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="Tìm theo tên thuốc hoặc mã..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              size="large"
              allowClear
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{ borderRadius: '8px' }}
            />
          </Col>
        </Row>

        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          rowKey="id"
          style={{ marginTop: '8px' }}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            onChange: (p) => setPage(p),
            showTotal: (total) => `Tổng số ${total} loại thuốc`,
          }}
        />
      </Card>

      {/* MODAL NGHIỆP VỤ */}
      <Modal
        title={
          <div style={{ paddingBottom: '10px' }}>
            <Title level={5} style={{ margin: 0 }}>
              {editingId ? "📝 Cập nhật thông tin thuốc" : "➕ Thêm thuốc mới vào danh mục"}
            </Title>
          </div>
        }
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu dữ liệu"
        cancelText="Đóng"
        width={600}
        centered
        bodyStyle={{ paddingTop: '10px' }}
      >
        <Divider style={{ margin: '0 0 24px 0' }} />
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleSubmit}
          initialValues={{ stock: 0, price: 1000, unit: 'Viên' }}
        >
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                label={<Text strong>Tên biệt dược</Text>}
                name="medicine_name"
                rules={[{ required: true, message: "Vui lòng nhập tên thuốc" }]}
              >
                <Input placeholder="VD: Augmentin 625mg" size="large" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label={<Text strong>Đơn vị tính</Text>}
                name="unit"
                rules={[{ required: true }]}
              >
                <Select size="large">
                  <Option value="Viên">Viên</Option>
                  <Option value="Vỉ">Vỉ</Option>
                  <Option value="Chai">Chai</Option>
                  <Option value="Ống">Ống</Option>
                  <Option value="Hộp">Hộp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label={<Text strong>Giá bán lẻ (VNĐ)</Text>}
                name="price"
                rules={[{ required: true, message: "Nhập giá" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  size="large"
                  addonAfter="₫"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<Text strong>Số lượng nhập kho</Text>}
                name="stock"
                rules={[{ required: true, message: "Nhập số lượng" }]}
              >
                <InputNumber 
                    style={{ width: "100%" }} 
                    min={0} 
                    size="large" 
                    placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            label={
              <Space>
                <Text strong>Hướng dẫn sử dụng / Mô tả</Text>
                <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
              </Space>
            } 
            name="description"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Ghi chú liều dùng hoặc thành phần chính..." 
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Medicines;