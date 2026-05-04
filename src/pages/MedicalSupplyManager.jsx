import React, { useEffect, useState } from "react";
import {
  Table, Button, Card, Space, message, Modal, Form,
  Input, InputNumber, DatePicker, Popconfirm, Tag,
  Statistic, Row, Col, Typography, Badge
} from "antd";
import { 
  PlusOutlined, SearchOutlined, EditOutlined, 
  DeleteOutlined, BoxPlotOutlined, WarningOutlined, 
  DollarCircleOutlined 
} from "@ant-design/icons";
import dayjs from "dayjs";
import medicalSupplyApi from "../api/medicalSupplyApi";
import { useUser } from "../context/UserContext";
const { Title, Text } = Typography;

export default function MedicalSupplyManager() {
  const { user } = useUser();

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const isDoctor = user?.role === "doctor";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  
  // Summary States
  const [summary, setSummary] = useState({ totalValue: 0, lowStock: 0, expired: 0 });

  const formatMoney = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

  const fetchData = async (page = 1, pageSize = 10, searchKey = "") => {
    try {
      setLoading(true);
      const res = await medicalSupplyApi.getAll({ page, limit: pageSize, search: searchKey });
      const list = res.data.data || [];

      setData(list);
      setPagination({ current: page, pageSize, total: res.data.total });

      // Logic tính toán thống kê nhanh
      const totalVal = list.reduce((sum, item) => sum + (item.quantity * item.price), 0);
      const low = list.filter(i => i.quantity < 10).length;
      const exp = list.filter(i => i.expire_date && dayjs(i.expire_date).isBefore(dayjs())).length;
      
      setSummary({ totalValue: totalVal, lowStock: low, expired: exp });
    } catch {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.expire_date) values.expire_date = dayjs(values.expire_date).format("YYYY-MM-DD");

      if (editingId) {
        await medicalSupplyApi.update(editingId, values);
        message.success("Cập nhật thành công");
      } else {
        await medicalSupplyApi.create(values);
        message.success("Thêm vật tư mới thành công");
      }
      setOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchData(pagination.current, pagination.pageSize);
    } catch {
      message.error("Vui lòng kiểm tra lại thông tin");
    }
  };

const columns = [
  {
    title: "Thông tin vật tư",
    key: "info",
    width: 250,
    render: (_, record) => (
      <Space direction="vertical" size={0}>
        <Text strong>{record.name}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {record.category || "Chưa phân loại"}
        </Text>
      </Space>
    ),
  },

  {
    title: "Tồn kho",
    dataIndex: "quantity",
    align: "center",
    render: (q, record) => (
      <Space direction="vertical" size={0} align="center">
        <Text strong>
          {q} {record.unit}
        </Text>

        {q === 0 ? (
          <Badge status="error" text="Hết hàng" />
        ) : q < 10 ? (
          <Badge status="warning" text="Sắp hết" />
        ) : (
          <Badge status="success" text="Sẵn sàng" />
        )}
      </Space>
    ),
  },

  {
    title: "Đơn giá",
    dataIndex: "price",
    align: "right",
    render: (p) => formatMoney(p),
  },

  {
    title: "Thành tiền",
    key: "total_price",
    align: "right",
    render: (_, record) => (
      <Text strong style={{ color: "#1890ff" }}>
        {formatMoney(record.quantity * record.price)}
      </Text>
    ),
  },

  {
    title: "Hạn sử dụng",
    dataIndex: "expire_date",
    render: (date) => {
      if (!date) return "-";

      const expiryDate = dayjs(date);
      const today = dayjs();

      const isExp = expiryDate.isBefore(today, "day");
      const isNear =
        expiryDate.diff(today, "day") <= 30 && !isExp;

      return (
        <Space direction="vertical" size={0}>
          <Text strong={isExp || isNear}>
            {expiryDate.format("DD/MM/YYYY")}
          </Text>

          {isExp ? (
            <Tag color="error" style={{ margin: 0 }}>
              Hết hạn
            </Tag>
          ) : isNear ? (
            <Tag color="warning" style={{ margin: 0 }}>
              Sắp hết hạn
            </Tag>
          ) : (
            <Tag color="success" style={{ margin: 0 }}>
              Còn hạn
            </Tag>
          )}
        </Space>
      );
    },
  },

  {
    title: "Nhà cung cấp",
    dataIndex: "supplier",
    ellipsis: true,
  },

  // 👇 Chỉ thêm cột Thao tác nếu không phải doctor
  ...(isAdmin || isStaff
    ? [
        {
          title: "Thao tác",
          align: "center",
          render: (_, record) => (
            <Space>
              {/* admin + staff được sửa */}
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingId(record.id);
                  setOpen(true);
                  form.setFieldsValue({
                    ...record,
                    expire_date: record.expire_date
                      ? dayjs(record.expire_date)
                      : null,
                  });
                }}
              />

              {/* chỉ admin được xoá */}
              {isAdmin && (
                <Popconfirm
                  title="Xoá vật tư này?"
                  onConfirm={() => {
                    medicalSupplyApi
                      .remove(record.id)
                      .then(() => {
                        message.success("Đã xoá");
                        fetchData();
                      });
                  }}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              )}
            </Space>
          ),
        },
      ]
    : []),
];

  return (
    <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100vh" }}>
      <Row gutter={[16, 16]} justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>📦 Quản lý Vật tư Y tế</Title>
          <Text type="secondary">Theo dõi số lượng, hạn sử dụng và giá trị kho hàng</Text>
        </Col>
        <Col>
          {(isAdmin || isStaff) && (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setOpen(true)}
            >
              Nhập vật tư mới
            </Button>
          )}
        </Col>
      </Row>
      {/* STATISTICS CARDS */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
{user.role === "admin" && (
<>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic 
              title="Tổng giá trị kho" 
              value={summary.totalValue} 
              prefix={<DollarCircleOutlined />} 
              formatter={formatMoney} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic 
              title="Vật tư sắp hết hàng" 
              value={summary.lowStock} 
              prefix={<BoxPlotOutlined />} 
              valueStyle={{ color: summary.lowStock > 0 ? '#faad14' : '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic 
              title="Vật tư hết hạn" 
              value={summary.expired} 
              prefix={<WarningOutlined />} 
              valueStyle={{ color: summary.expired > 0 ? '#cf1322' : '#3f8600' }}
            />
          </Card>
        </Col>
        </>
)}
      </Row>
      <Card bordered={false}>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm theo tên vật tư hoặc nhà cung cấp..."
            prefix={<SearchOutlined />}
            size="large"
            allowClear
            style={{ width: 400 }}
            onChange={(e) => fetchData(1, pagination.pageSize, e.target.value)}
          />
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{ ...pagination, showSizeChanger: true }}
          onChange={(pager) => fetchData(pager.current, pager.pageSize)}
        />
      </Card>

      <Modal
        title={editingId ? "Cập nhật vật tư" : "Thêm vật tư mới"}
        open={open}
        onCancel={() => { setOpen(false); setEditingId(null); form.resetFields(); }}
        onOk={() => form.submit()}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item name="name" label="Tên vật tư" rules={[{ required: true }]}>
                <Input placeholder="Ví dụ: Kim tiêm G25" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="category" label="Danh mục">
                <Input placeholder="Dụng cụ tiêu hao" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="unit" label="Đơn vị">
                <Input placeholder="Cái, Hộp,..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="price" label="Đơn giá (VNĐ)" rules={[{ required: true }]}>
                <InputNumber 
                  style={{ width: "100%" }} 
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="supplier" label="Nhà cung cấp">
            <Input placeholder="Công ty thiết bị y tế ABC" />
          </Form.Item>

          <Form.Item name="expire_date" label="Hạn sử dụng">
            <DatePicker style={{ width: "100%" }} placeholder="Chọn ngày hết hạn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}