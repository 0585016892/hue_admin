import React, { useEffect, useState, useCallback } from "react";
import {
  Table, Tag, Button, Select, Input, Modal, Form, message, Space, 
  Card, Typography, Popconfirm, Row, Col, Avatar, Empty,Alert
} from "antd";
import { 
  UserOutlined, SearchOutlined, PlusOutlined, 
  MedicineBoxOutlined, DeleteOutlined, ReloadOutlined,
  FileTextOutlined, CheckCircleOutlined, ClockCircleOutlined,
  CloseCircleOutlined, PlayCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import appointmentApi from "../api/appointmentApi";
import patientApi from "../api/patientApi";
import doctorApi from "../api/doctorApi";
import { useUser } from "../context/UserContext";
const { Option } = Select;
const { Title, Text } = Typography;

const Appointments = () => {
  const {user} = useUser();
   // --- STATE MANAGEMENT ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [doctorId, setDoctorId] = useState("");

  // Modals & Forms
  const [isExamineOpen, setIsExamineOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  const [meta, setMeta] = useState({ patients: [], doctors: [] });
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  // --- API CALLS ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appointmentApi.getAll({ 
        page, 
        limit, 
        search: search || undefined, 
        status: status || undefined, 
        doctor_id: doctorId || undefined 
      });
      setData(res.data.data);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      message.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, doctorId]);

  const loadMetadata = async () => {
    try {
      const [p, d] = await Promise.all([
        patientApi.getAll({ limit: 1000 }),
        doctorApi.getAll({ limit: 1000 }),
      ]);
      setMeta({ patients: p.data.data, doctors: d.data.data });
    } catch (err) {
      console.error("Metadata load error");
    }
  };

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { loadMetadata(); }, []);

  // --- LOGIC NGHIỆP VỤ (STATE MACHINE) ---
  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: "orange", text: "Chờ khám", icon: <ClockCircleOutlined /> },
      in_progress: { color: "blue", text: "Đang khám", icon: <PlayCircleOutlined /> },
      completed: { color: "green", text: "Hoàn thành", icon: <CheckCircleOutlined /> },
      cancelled: { color: "red", text: "Đã hủy", icon: <CloseCircleOutlined /> },
    };
    return configs[status] || { color: "default", text: "N/A", icon: null };
  };

  const getNextAvailableStatuses = (current) => {
    if (current === "pending") return ["pending", "in_progress", "cancelled"];
    if (current === "in_progress") return ["in_progress", "completed", "cancelled"];
    return [current]; // "completed" và "cancelled" là trạng thái cuối
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await appointmentApi.updateStatus(id, newStatus);
      message.success(`Đã chuyển trạng thái sang: ${getStatusConfig(newStatus).text}`);
      fetchData();
    } catch (err) {
      message.error("Lỗi cập nhật trạng thái");
    }
  };

  const handleExamineSubmit = async (values) => {
    try {
      await appointmentApi.examine(selectedRecord.id, values);
      message.success("Hồ sơ bệnh án đã được cập nhật");
      setIsExamineOpen(false);
      fetchData();
    } catch (err) {
      message.error("Không thể lưu kết quả");
    }
  };

  // --- TABLE COLUMNS ---
  const columns = [
    {
      title: "Mã số",
      dataIndex: "id",
      width: 90,
      render: (id) => <Text code>#{id}</Text>,
    },
    {
      title: "Thông tin Bệnh nhân",
      key: "patient_info",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.patient_name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>ID: PAT-{record.patient_id}</Text>
        </Space>
      ),
    },
    {
      title: "Bác sĩ phụ trách",
      key: "doctor_info",
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />
          <Text>{record.doctor_name}</Text>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 180,
      render: (status, record) => {
        const config = getStatusConfig(status);
        const isFinal = ["completed", "cancelled"].includes(status);
        const options = getNextAvailableStatuses(status);

        return (
          <Select
            value={status}
            style={{ width: "100%" }}
            disabled={isFinal}
            onChange={(val) => handleUpdateStatus(record.id, val)}
            variant="borderless"
            className={`status-tag-${status}`}
            suffixIcon={isFinal ? null : <ClockCircleOutlined />}
          >
            {options.map(opt => (
              <Option key={opt} value={opt}>{getStatusConfig(opt).text}</Option>
            ))}
          </Select>
        );
      }
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "right",
      render: (_, record) => {
        const isFinal = ["completed", "cancelled"].includes(record.status);
        return (
          <Space>
            <Button 
              type={isFinal ? "default" : "primary"}
              icon={isFinal ? <FileTextOutlined /> : <MedicineBoxOutlined />}
              onClick={() => {
                setSelectedRecord(record);
                form.setFieldsValue({ diagnosis: record.diagnosis });
                setIsExamineOpen(true);
              }}
            >
              {isFinal ? "Hồ sơ" : "Vào khám"}
            </Button>
            {user?.role === "admin" && (
            <Popconfirm
              title="Xóa phiếu khám này?"
              onConfirm={() => appointmentApi.remove(record.id).then(() => fetchData())}
              disabled={isFinal}
            >
              <Button danger icon={<DeleteOutlined />} disabled={isFinal} type="text" />
            </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <div style={{ padding: "0px" }}>
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        {/* HEADER BAR */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>📋 Quản lý Phiếu khám</Title>
            <Text type="secondary">Quản lý luồng khám bệnh và lưu trữ chẩn đoán</Text>
          </Col>
          <Col>
            <Space size="middle">
              <Button icon={<ReloadOutlined />} onClick={fetchData}>Làm mới</Button>
          {user.role === "admin" && (
              <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsCreateOpen(true)}>
                Tạo lịch hẹn
              </Button>
          )}
            </Space>
          </Col>
        </Row>

        {/* FILTERS */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="Tên bệnh nhân hoặc mã số..."
              prefix={<SearchOutlined />}
              allowClear
              size="large"
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </Col>
          <Col span={5}>
            <Select
              placeholder="Tất cả trạng thái"
              style={{ width: '100%' }}
              size="large"
              allowClear
              onChange={(v) => { setStatus(v); setPage(1); }}
            >
              <Option value="pending">Chờ khám</Option>
              <Option value="in_progress">Đang khám</Option>
              <Option value="completed">Đã hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="Chọn bác sĩ phụ trách"
              style={{ width: '100%' }}
              size="large"
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={(v) => { setDoctorId(v); setPage(1); }}
            >
              {meta.doctors.map(d => (
                <Option key={d.id} value={d.id}>{d.full_name} ({d.department})</Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* MAIN TABLE */}
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total: total,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
            showTotal: (total) => `Tổng cộng ${total} phiếu khám`,
          }}
          locale={{ emptyText: <Empty description="Không tìm thấy lịch hẹn nào" /> }}
        />
      </Card>

      {/* MODAL KHÁM BỆNH (GHI CHẨN ĐOÁN) */}
      <Modal
        title={
          <Space>
            <MedicineBoxOutlined style={{ color: '#1890ff' }} />
            <Text strong>CHI TIẾT PHIẾU KHÁM #{selectedRecord?.id}</Text>
          </Space>
        }
        open={isExamineOpen}
        onCancel={() => setIsExamineOpen(false)}
        onOk={() => form.submit()}
        width={700}
        okText="Lưu kết quả"
        okButtonProps={{ 
          hidden: ["completed", "cancelled"].includes(selectedRecord?.status) 
        }}
        centered
      >
        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginBottom: 20 }}>
          <Row gutter={24}>
            <Col span={12}>
              <Text type="secondary">Bệnh nhân:</Text> <Text strong>{selectedRecord?.patient_name}</Text>
            </Col>
            <Col span={12}>
              <Text type="secondary">Trạng thái:</Text> <Tag color={getStatusConfig(selectedRecord?.status).color}>{getStatusConfig(selectedRecord?.status).text}</Tag>
            </Col>
          </Row>
        </div>

        <Form form={form} layout="vertical" onFinish={handleExamineSubmit}>
          <Form.Item label={<Text strong>Triệu chứng lâm sàng</Text>}>
            <Input.TextArea value={selectedRecord?.symptoms} disabled rows={3} />
          </Form.Item>
          
          <Form.Item 
            name="diagnosis" 
            label={<Text strong>Chẩn đoán của Bác sĩ</Text>}
            rules={[{ required: true, message: 'Vui lòng nhập kết quả chẩn đoán' }]}
          >
            <Input.TextArea 
              rows={6} 
              placeholder="Nhập chi tiết bệnh lý, hướng điều trị..."
              disabled={["completed", "cancelled"].includes(selectedRecord?.status)}
            />
          </Form.Item>
          
          {selectedRecord?.status === "in_progress" && (
            <Alert
              message="Lưu ý: Sau khi lưu chẩn đoán, bác sĩ cần chuyển trạng thái phiếu sang 'Hoàn thành' để đóng hồ sơ."
              type="info"
              showIcon
            />
          )}
        </Form>
      </Modal>

      {/* MODAL TẠO LỊCH HẸN MỚI */}
      <Modal
        title="➕ TẠO PHIẾU KHÁM MỚI"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={() => createForm.submit()}
        width={600}
      >
        <Form form={createForm} layout="vertical" onFinish={(v) => {
          appointmentApi.create(v).then(() => {
            message.success("Đã tạo lịch hẹn");
            setIsCreateOpen(false);
            createForm.resetFields();
            fetchData();
          });
        }}>
          <Form.Item name="patient_id" label="Bệnh nhân" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="children" placeholder="Tìm tên hoặc mã bệnh nhân">
              {meta.patients.map(p => <Option key={p.id} value={p.id}>{p.full_name} ({p.phone})</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="doctor_id" label="Bác sĩ phụ trách" rules={[{ required: true }]}>
            <Select showSearch optionFilterProp="children" placeholder="Chọn bác sĩ khám">
              {meta.doctors.map(d => <Option key={d.id} value={d.id}>{d.full_name} - Chuyên khoa: {d.department}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="symptoms" label="Lý do khám / Triệu chứng">
            <Input.TextArea rows={3} placeholder="Ví dụ: Đau bụng âm ỉ, sốt nhẹ..." />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .status-tag-pending { background: #fff7e6; color: #fa8c16; border-radius: 6px; }
        .status-tag-in_progress { background: #e6f7ff; color: #1890ff; border-radius: 6px; }
        .status-tag-completed { background: #f6ffed; color: #52c41a; border-radius: 6px; border: none; }
        .status-tag-cancelled { background: #fff1f0; color: #f5222d; border-radius: 6px; border: none; }
      `}</style>
    </div>
  );
};

export default Appointments;