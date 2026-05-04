import React, { useEffect, useState } from "react";
import {
  Table, Button, Card, Space, message, Modal, Form,
  InputNumber, Select, DatePicker, Popconfirm, Row, Col, Statistic, Tag, Typography
} from "antd";
import { 
  PlusOutlined, FileExcelOutlined, EditOutlined, 
  DeleteOutlined, DollarOutlined, TeamOutlined, CalendarOutlined 
} from "@ant-design/icons";
import dayjs from "dayjs";
import salaryApi from "../api/salaryApi";

const { Title, Text } = Typography;

export default function SalaryManager() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ total_base_salary: 0, total_bonus: 0, grand_total: 0 });
  const [month, setMonth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  // FORMAT MONEY
  const formatMoney = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value || 0);

  // FETCH DATA
  const fetchData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const params = { page, limit: pageSize };
      if (month) params.month = month.format("YYYY-MM");

      const res = await salaryApi.getAll(params);
      const rawData = res?.data?.data || [];
      const total = res?.data?.total || 0;
      
      setData(rawData);
      setPagination({ current: page, pageSize, total });

      // Cập nhật summary từ API riêng hoặc gộp chung tùy backend
      const sum = await salaryApi.getSummary(params);
      setSummary(sum?.data || { total_base_salary: 0, total_bonus: 0, grand_total: 0 });
    } catch (err) {
      message.error("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await salaryApi.getDoctors();
      setDoctors(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      message.error("Không tải được danh sách bác sĩ");
    }
  };

  useEffect(() => { fetchDoctors(); }, []);
  useEffect(() => { fetchData(1, pagination.pageSize); }, [month]);

  const handleTableChange = (pager) => fetchData(pager.current, pager.pageSize);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!editingId) values.month = dayjs(values.month).format("YYYY-MM");

      if (editingId) {
        await salaryApi.update(editingId, { base_salary: values.base_salary, bonus: values.bonus });
        message.success("Cập nhật thành công");
      } else {
        await salaryApi.create(values);
        message.success("Thêm thành công");
      }

      setOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchData(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error(err?.response?.data?.message || "Lỗi thao tác");
    }
  };

  const handleDelete = async (id) => {
    try {
      await salaryApi.remove(id);
      message.success("Xoá thành công");
      fetchData(pagination.current, pagination.pageSize);
    } catch (err) {
      message.error("Xoá thất bại");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setOpen(true);
    form.setFieldsValue({
      base_salary: record.base_salary,
      bonus: record.bonus,
    });
  };

  const handleExport = async () => {
    try {
      const params = month ? { month: month.format("YYYY-MM") } : {};
      const res = await salaryApi.exportExcel(params);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bang_luong_${dayjs().format('MM_YYYY')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      message.success("Xuất Excel thành công");
    } catch (err) {
      message.error("Xuất Excel thất bại");
    }
  };

  const columns = [
    { 
      title: "Bác sĩ", 
      dataIndex: "full_name",
      render: (text) => <Text strong color="blue">{text}</Text>
    },
    { 
      title: "Tháng", 
      dataIndex: "month",
      render: (m) => <Tag icon={<CalendarOutlined />} color="processing">{m}</Tag>
    },
    {
      title: "Lương cơ bản",
      dataIndex: "base_salary",
      align: "right",
      render: (value) => formatMoney(value),
    },
    {
      title: "Thưởng",
      dataIndex: "bonus",
      align: "right",
      render: (value) => <Text type="success">+{formatMoney(value)}</Text>,
    },
    {
      title: "Tổng",
      dataIndex: "total",
      align: "right",
      render: (value) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatMoney(value)}
        </Text>
      ),
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Popconfirm title="Xoá bản ghi này?" onConfirm={() => handleDelete(record.id)} okText="Xoá" cancelText="Hủy">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Row gutter={[16, 16]} align="bottom" style={{ marginBottom: 24 }}>
        <Col flex="auto">
          <Title level={3} style={{ margin: 0 }}>Quản lý lương bác sĩ</Title>
          <Text type="secondary">Theo dõi và điều chỉnh thu nhập hàng tháng</Text>
        </Col>
        <Col>
          <Space>
            <DatePicker 
              picker="month" 
              placeholder="Lọc theo tháng" 
              value={month} 
              onChange={setMonth} 
              style={{ width: 200 }}
            />
            <Button icon={<FileExcelOutlined />} onClick={handleExport}>Xuất file</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Thêm mới</Button>
          </Space>
        </Col>
      </Row>

      {/* SUMMARY STATS */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false} className="stat-card">
            <Statistic
              title="Tổng lương cơ bản"
              value={summary.total_base_salary}
              formatter={formatMoney}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Tổng tiền thưởng"
              value={summary.total_bonus}
              formatter={formatMoney}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} style={{ background: '#1890ff' }}>
            <Statistic
              title={<span style={{ color: '#fff' }}>Tổng chi trả thực tế</span>}
              value={summary.grand_total}
              formatter={formatMoney}
              valueStyle={{ color: '#fff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng cộng ${total} dòng`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingId ? "Cập nhật thông tin lương" : "Tạo bảng lương mới"}
        open={open}
        onCancel={() => { setOpen(false); setEditingId(null); form.resetFields(); }}
        onOk={handleSubmit}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ base_salary: 0, bonus: 0 }}>
          {!editingId && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="doctor_id" label="Bác sĩ" rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}>
                  <Select showSearch placeholder="Tìm bác sĩ..." optionFilterProp="children">
                    {doctors.map((doc) => (
                      <Select.Option key={doc.id} value={doc.id}>{doc.full_name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="month" label="Tháng áp dụng" rules={[{ required: true }]}>
                  <DatePicker picker="month" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          )}

          <Form.Item name="base_salary" label="Lương cơ bản (VND)" rules={[{ required: true }]}>
            <InputNumber 
              style={{ width: "100%" }} 
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item name="bonus" label="Tiền thưởng thêm (VND)" rules={[{ required: true }]}>
            <InputNumber 
              style={{ width: "100%" }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}