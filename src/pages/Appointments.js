import {
  Table, Tag, Button, Select, Input, Modal, Form, message, Space, 
  Card, Typography, Popconfirm, Divider, Row, Col, Badge
} from "antd";
import { 
  CalendarOutlined, 
  SearchOutlined, 
  PlusOutlined, 
  MedicineBoxOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import appointmentApi from "../api/appointmentApi";
import patientApi from "../api/patientApi";
import doctorApi from "../api/doctorApi";

const { Option } = Select;
const { Title, Text } = Typography;

const Appointments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [doctorId, setDoctorId] = useState("");

  const [open, setOpen] = useState(false); // Modal Khám
  const [createOpen, setCreateOpen] = useState(false); // Modal Tạo mới
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.getAll({ page, limit, search, status, doctor_id: doctorId });
      setData(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (err) {
      message.error("Không thể tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  const loadMeta = async () => {
    try {
      const [p, d] = await Promise.all([
        patientApi.getAll({ limit: 100 }),
        doctorApi.getAll({ limit: 100 }),
      ]);
      setPatients(p.data.data);
      setDoctors(d.data.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu metadata");
    }
  };

  useEffect(() => { fetchData(); }, [page, search, status, doctorId]);
  useEffect(() => { loadMeta(); }, []);

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending": return { color: "orange", text: "Chờ khám" };
      case "in_progress": return { color: "blue", text: "Đang khám" };
      case "completed": return { color: "green", text: "Đã hoàn thành" };
      case "cancelled": return { color: "red", text: "Đã hủy" };
      default: return { color: "default", text: "Không xác định" };
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await appointmentApi.updateStatus(id, newStatus);
      message.success("Đã cập nhật trạng thái lịch hẹn");
      fetchData();
    } catch (err) {
      message.error("Cập nhật thất bại");
    }
  };

  const openExamine = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({ diagnosis: record.diagnosis || "" });
    setOpen(true);
  };

  const handleExamine = async (values) => {
    try {
      await appointmentApi.examine(selectedRecord.id, values);
      message.success("Đã lưu chẩn đoán y khoa");
      setOpen(false);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error("Lỗi khi lưu kết quả khám");
    }
  };

  const handleDelete = async (id) => {
    try {
      await appointmentApi.remove(id);
      message.success("Đã xóa phiếu khám");
      fetchData();
    } catch (err) {
      message.error("Xóa thất bại");
    }
  };

  const columns = [
    {
      title: "Mã số",
      dataIndex: "id",
      width: 80,
      render: (id) => <Text code>#{id}</Text>,
    },
    {
      title: "Bệnh nhân",
      key: "patient",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.patient_name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>ID: {record.patient_id}</Text>
        </Space>
      ),
    },
    {
      title: "Bác sĩ phụ trách",
      key: "doctor",
      render: (_, record) => (
        <Space>
          <Badge status="processing" color="blue" />
          <Text>{record.doctor_name}</Text>
        </Space>
      ),
    },
    {
      title: "Triệu chứng & Chẩn đoán",
      key: "symptoms_diagnosis",
      width: 300,
      render: (_, record) => (
        <div style={{ maxWidth: 280 }}>
          <div><Text type="secondary">TC: </Text>{record.symptoms || "N/A"}</div>
          {record.diagnosis && (
            <div><Text type="secondary">CĐ: </Text><Text italic>{record.diagnosis}</Text></div>
          )}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const info = getStatusInfo(status);
        return <Tag color={info.color}>{info.text.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Cập nhật",
      key: "update_status",
      render: (_, record) => (
        <Select
          value={record.status}
          style={{ width: 140 }}
          bordered={false}
          onChange={(val) => handleUpdateStatus(record.id, val)}
        >
          <Option value="pending">Chờ khám</Option>
          <Option value="in_progress">Đang khám</Option>
          <Option value="completed">Hoàn thành</Option>
          <Option value="cancelled">Hủy lịch</Option>
        </Select>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            ghost 
            icon={<MedicineBoxOutlined />} 
            onClick={() => openExamine(record)}
            disabled={record.status === "completed" || record.status === "cancelled"}
          >
            Khám
          </Button>
          <Popconfirm
            title="Xóa phiếu khám?"
            description="Hành động này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} />
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
            <CalendarOutlined style={{ fontSize: 24, color: "#1890ff" }} />
            <Title level={4} style={{ margin: 0 }}>Quản lý Lịch hẹn & Phiếu khám</Title>
          </Space>
        </Col>
        <Col>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>Làm mới</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
              Tạo lịch hẹn mới
            </Button>
          </Space>
        </Col>
      </Row>

      {/* BỘ LỌC TÌM KIẾM */}
      <Card size="small" style={{ marginBottom: 16, background: "#f9f9f9" }}>
        <Space wrap>
          <Input
            placeholder="Tìm tên bệnh nhân..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 180 }}
            onChange={(v) => { setStatus(v); setPage(1); }}
          >
            <Option value="pending">Chờ khám</Option>
            <Option value="in_progress">Đang khám</Option>
            <Option value="completed">Đã hoàn thành</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
          <Select
            placeholder="Lọc theo bác sĩ"
            allowClear
            style={{ width: 200 }}
            onChange={(v) => { setDoctorId(v); setPage(1); }}
          >
            {doctors.map(d => (
              <Option key={d.id} value={d.id}>{d.full_name}</Option>
            ))}
          </Select>
        </Space>
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
          showTotal: (total) => `Tổng cộng ${total} phiếu khám`,
        }}
      />

      {/* MODAL GHI NHẬN KẾT QUẢ KHÁM */}
      <Modal
        title={
          <Space>
            <MedicineBoxOutlined style={{ color: "#1890ff" }} />
            <span>Ghi nhận kết quả khám: {selectedRecord?.patient_name}</span>
          </Space>
        }
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Lưu chẩn đoán"
        cancelText="Đóng"
        centered
      >
        <Divider style={{ margin: "12px 0" }} />
        <Form form={form} layout="vertical" onFinish={handleExamine}>
          <Form.Item label={<Text strong>Triệu chứng ban đầu</Text>}>
            <Input value={selectedRecord?.symptoms} disabled />
          </Form.Item>
          <Form.Item
            label={<Text strong>Chẩn đoán y khoa</Text>}
            name="diagnosis"
            rules={[{ required: true, message: "Vui lòng nhập chẩn đoán của bác sĩ" }]}
          >
            <Input.TextArea rows={6} placeholder="Nhập kết quả chẩn đoán, bệnh lý..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL TẠO LỊCH HẸN MỚI */}
      <Modal
        title={<Title level={4}>➕ Tạo phiếu khám mới</Title>}
        open={createOpen}
        onCancel={() => { setCreateOpen(false); createForm.resetFields(); }}
        onOk={() => createForm.submit()}
        okText="Tạo phiếu"
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={async (values) => {
            try {
              await appointmentApi.create(values);
              message.success("Đã tạo lịch hẹn thành công");
              setCreateOpen(false);
              createForm.resetFields();
              fetchData();
            } catch (err) {
              message.error(err.response?.data?.message || "Lỗi khi tạo");
            }
          }}
          style={{ marginTop: 20 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="patient_id" label={<Text strong>Chọn Bệnh nhân</Text>} rules={[{ required: true }]}>
                <Select placeholder="Tìm bệnh nhân..." showSearch optionFilterProp="children">
                  {patients.map(p => <Option key={p.id} value={p.id}>{p.full_name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="doctor_id" label={<Text strong>Chọn Bác sĩ</Text>} rules={[{ required: true }]}>
                <Select placeholder="Tìm bác sĩ..." showSearch optionFilterProp="children">
                  {doctors.map(d => <Option key={d.id} value={d.id}>{d.full_name} - {d.department}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="symptoms" label={<Text strong>Mô tả triệu chứng</Text>}>
            <Input.TextArea rows={3} placeholder="Mô tả sơ lược tình trạng bệnh..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Appointments;