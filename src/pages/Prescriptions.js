import {
  Table, Button, Modal, Form, Select, InputNumber, Space, 
  message, Card, Popconfirm, Tag, Typography, Row, Col, Divider, Empty
} from "antd";
import { 
  FileTextOutlined, PlusOutlined, EyeOutlined, 
  DeleteOutlined, CheckCircleOutlined, PrinterOutlined,
  ShoppingCartOutlined, UserOutlined, MedicineBoxOutlined,CalendarOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";

import prescriptionApi from "../api/prescriptionApi";
import appointmentApi from "../api/appointmentApi";
import medicineApi from "../api/medicineApi";
import doctorApi from "../api/doctorApi";
import invoiceApi from "../api/invoiceApi";

const { Option } = Select;
const { Title, Text } = Typography;

const Prescriptions = () => {
  const [data, setData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  // Danh sách thuốc đang kê trong Modal
  const [items, setItems] = useState([{ medicine_id: null, quantity: 1, price: 0 }]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await prescriptionApi.getAll({ page: 1, limit: 100 });
      setData(res.data.data || []);
    } catch {
      message.error("Lỗi khi tải danh sách đơn thuốc");
    } finally { setLoading(false); }
  };

  const loadMeta = async () => {
    try {
      const [app, med, doc] = await Promise.all([
        appointmentApi.getAll({ limit: 100 }),
        medicineApi.getAll({ limit: 100 }),
        doctorApi.getAll({ limit: 100 }),
      ]);
      setAppointments(app.data.data || []);
      setMedicines(med.data.data || []);
      setDoctors(doc.data.data || []);
    } catch { message.error("Lỗi tải dữ liệu danh mục"); }
  };

  useEffect(() => {
    fetchData();
    loadMeta();
  }, []);

  // Nghiệp vụ thêm/xóa dòng thuốc
  const addItem = () => setItems([...items, { medicine_id: null, quantity: 1, price: 0 }]);
  const removeItem = (index) => {
    if (items.length === 1) return message.warning("Đơn thuốc phải có ít nhất 1 loại thuốc");
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (values) => {
    if (items.some(i => !i.medicine_id)) return message.error("Vui lòng chọn thuốc cho tất cả các dòng");
    try {
      await prescriptionApi.create({ ...values, items });
      message.success("Đã kê đơn thuốc thành công");
      setOpen(false);
      form.resetFields();
      setItems([{ medicine_id: null, quantity: 1, price: 0 }]);
      fetchData();
    } catch (err) { message.error(err.response?.data?.message || "Lỗi xử lý"); }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await prescriptionApi.getById(id);
      setDetail(res.data.data);
      setOpenDetail(true);
    } catch { message.error("Không thể xem chi tiết"); }
  };

  const convertInvoice = async (id) => {
    try {
      await invoiceApi.createFromPrescription(id);
      message.success("Đã chuyển đơn thuốc sang hóa đơn thanh toán");
      setOpenDetail(false);
      fetchData();
    } catch (err) { message.error(err.response?.data?.message || "Lỗi chuyển đổi"); }
  };
console.log(data);

  const columns = [
    { title: "Mã đơn", dataIndex: "prescription_id", render: (id) => <Text code>RX-{id}</Text> },
    { title: "Bệnh nhân", dataIndex: "patient_name", render: (n) => <Text strong>{n}</Text> },
    { title: "Bác sĩ kê đơn", dataIndex: "doctor_name" },
    { 
      title: "Trạng thái", 
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "approved" ? "green" : "orange"} icon={s === "approved" ? <CheckCircleOutlined /> : null}>
          {s === "approved" ? "ĐÃ DUYỆT" : "CHỜ THANH TOÁN"}
        </Tag>
      )
    },
    {
      title: "Hành động",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetail(record.prescription_id)}>Chi tiết</Button>
          <Popconfirm title="Xác nhận xóa đơn thuốc?" onConfirm={() => prescriptionApi.remove(record.prescription_id).then(fetchData)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <Card bordered={false}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col><Title level={4}><FileTextOutlined /> Quản lý đơn thuốc</Title></Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setOpen(true)}>Kê đơn mới</Button>
        </Col>
      </Row>

      <Table dataSource={data} columns={columns} rowKey="prescription_id" loading={loading} />

      {/* MODAL KÊ ĐƠN */}
      <Modal
        title={<Title level={4}>📝 Lập đơn thuốc mới</Title>}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        width={850}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="appointment_id" label={<Text strong>Phiếu khám liên quan</Text>} rules={[{ required: true }]}>
                <Select placeholder="Chọn phiếu khám" showSearch optionFilterProp="children">
                  {appointments.map(a => <Option key={a.id} value={a.id}>#{a.id} - {a.patient_name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="doctor_id" label={<Text strong>Bác sĩ điều trị</Text>} rules={[{ required: true }]}>
                <Select placeholder="Chọn bác sĩ">
                  {doctors.map(d => <Option key={d.id} value={d.id}>BS. {d.full_name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Danh mục thuốc chỉ định</Divider>
          
          <div style={{ maxHeight: 300, overflowY: "auto", paddingRight: 10 }}>
            {items.map((item, index) => (
              <Row gutter={8} key={index} align="middle" style={{ marginBottom: 12 }}>
                <Col span={12}>
                  <Select
                    placeholder="Tìm thuốc..."
                    style={{ width: "100%" }}
                    showSearch
                    optionFilterProp="children"
                    value={item.medicine_id}
                    onChange={(val) => {
                      const med = medicines.find(m => m.id === val);
                      const newItems = [...items];
                      newItems[index] = { ...newItems[index], medicine_id: val, price: med?.price || 0 };
                      setItems(newItems);
                    }}
                  >
                    {medicines.map(m => (
                      <Option key={m.id} value={m.id} disabled={m.stock <= 0}>
                        {m.medicine_name} (Kho: {m.stock}) - {m.price.toLocaleString()}đ
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={5}>
                  <InputNumber
                    min={1}
                    value={item.quantity}
                    style={{ width: "100%" }}
                    placeholder="SL"
                    onChange={(v) => {
                      const newItems = [...items];
                      newItems[index].quantity = v;
                      setItems(newItems);
                    }}
                  />
                </Col>
                <Col span={5}>
                  <Text type="secondary">{(item.price * item.quantity).toLocaleString()}đ</Text>
                </Col>
                <Col span={2}>
                  <Button danger type="text" icon={<DeleteOutlined />} onClick={() => removeItem(index)} />
                </Col>
              </Row>
            ))}
          </div>
          <Button type="dashed" block icon={<PlusOutlined />} onClick={addItem} style={{ marginTop: 10 }}>Thêm thuốc vào danh sách</Button>

          <div style={{ textAlign: "right", marginTop: 20 }}>
            <Title level={4}>Tổng tiền: <Text type="danger">{items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString()}đ</Text></Title>
          </div>
        </Form>
      </Modal>

      {/* MODAL CHI TIẾT & IN ẤN */}
      <Modal
        title={<Title level={4}><FileTextOutlined /> Chi tiết đơn thuốc y khoa</Title>}
        open={openDetail}
        onCancel={() => setOpenDetail(false)}
        width={700}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>In đơn thuốc</Button>,
          detail?.info?.status !== "approved" && (
            <Button key="inv" type="primary" icon={<ShoppingCartOutlined />} onClick={() => convertInvoice(detail?.info?.prescription_id)}>
              Duyệt & Chuyển Hóa Đơn
            </Button>
          )
        ]}
      >
        {detail ? (
          <div id="print-area">
            <Row>
              <Col span={12}>
                <p><UserOutlined /> <Text strong>Bệnh nhân:</Text> {detail.info.patient_name}</p>
                <p><CalendarOutlined /> <Text strong>Ngày kê:</Text> {new Date().toLocaleDateString('vi-VN')}</p>
              </Col>
              <Col span={12}>
                <p><MedicineBoxOutlined /> <Text strong>Bác sĩ kê đơn:</Text> {detail.info.doctor_name}</p>
                <p><Text strong>Trạng thái:</Text> <Tag color={detail.info.status === 'approved' ? 'green' : 'orange'}>{detail.info.status}</Tag></p>
              </Col>
            </Row>
            <Divider />
            <Table
              dataSource={detail.items}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                { title: "Tên thuốc", dataIndex: "medicine_name", render: (t) => <Text strong>{t}</Text> },
                { title: "SL", dataIndex: "quantity", align: "center" },
                { title: "Đơn giá", dataIndex: "price", render: (p) => p.toLocaleString() + "đ" },
                { title: "Thành tiền", align: "right", render: (_, r) => (r.price * r.quantity).toLocaleString() + "đ" },
              ]}
            />
            <div style={{ textAlign: "right", marginTop: 20 }}>
              <Title level={4}>Thành tiền: {detail.items?.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString()}đ</Title>
            </div>
          </div>
        ) : <Empty />}
      </Modal>
    </Card>
  );
};

export default Prescriptions;   