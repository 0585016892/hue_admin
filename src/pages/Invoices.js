import {
  Table, Tag, Button, Input, Select, Modal, Form, message, Space,
  InputNumber, Descriptions, Card, Typography, Row, Col, Divider, Popconfirm,Segmented
} from "antd";
import {
  FileProtectOutlined,
  SearchOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  CreditCardOutlined,
  DollarOutlined,
  HistoryOutlined,
  PlusOutlined,
  MedicineBoxOutlined
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import invoiceApi from "../api/invoiceApi";
import { numberToVietnamese } from "../utils/numberToVietnamese";
const { Option } = Select;
const { Title, Text } = Typography;

const Invoices = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [payMethod, setPayMethod] = useState("cash"); // cash | qr
  const [qrOpen, setQrOpen] = useState(false);
  const [paying, setPaying] = useState(null);
  const itemTypeLabel = {
    bed: "Giường bệnh",
    medicine: "Thuốc",
    service: "Dịch vụ",
    test: "Xét nghiệm",
    surgery: "Phẫu thuật",
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await invoiceApi.getAll({ page, limit, search, status });
      setData(res.data.data);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      message.error("Không thể tải danh sách hóa đơn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, status]);

  const getStatusInfo = (status) => {
    switch (status) {
      case "paid": return { color: "green", text: "Đã thanh toán", icon: <CheckCircleOutlined /> };
      case "unpaid": return { color: "red", text: "Chưa thanh toán", icon: <DollarOutlined /> };
      case "pending": return { color: "orange", text: "Đang chờ", icon: <HistoryOutlined /> };
      default: return { color: "default", text: "Khác", icon: null };
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await invoiceApi.getById(id);
      setDetailData(res.data.data);
      setDetailOpen(true);
    } catch (err) {
      message.error("Lỗi khi tải chi tiết hóa đơn");
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingId) {
        await invoiceApi.updateStatus(editingId, values.status);
        message.success("Cập nhật trạng thái thành công");
      } else {
        await invoiceApi.create(values);
        message.success("Tạo hóa đơn mới thành công");
      }
      setOpen(false);
      setEditingId(null);
      form.resetFields();
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Thao tác thất bại");
    }
  };

const handleQuickPay = (record) => {
    setPaying(record);
    if (payMethod === "qr") {
      setQrOpen(true);
    } else {
      // Nếu là tiền mặt, hiện Modal xác nhận riêng hoặc dùng Popconfirm như cũ
      confirmCashPay(record.id);
    }
  };
const confirmCashPay = async (id) => {
  try {
    await invoiceApi.updateStatus(id, "paid");
    message.success("Đã thanh toán tiền mặt");
    fetchData();
  } catch (err) {
    message.error("Không thể cập nhật trạng thái");
  }
};
  const getQrCodeUrl = () => {
  if (!paying) return "";

  const amount = paying.total_amount || 0;
  const description = `THANH TOAN HOA DON INV${paying.id}`;

  return `https://img.vietqr.io/image/MB-200018076666-compact.png?amount=${amount}&addInfo=${encodeURIComponent(
    description
  )}`;
};
console.log("INVOICE:::",data);
console.log("INVOICEdetailData:::",detailData );

  const columns = [
    {
      title: "Mã HĐ",
      dataIndex: "id",
      width: 100,
      render: (id) => <Text code>INV-{id}</Text>,
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patient_name",
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      align: "right",
      render: (v) => <Text strong style={{ color: "#cf1322" }}>{v?.toLocaleString()} đ</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => {
        const info = getStatusInfo(s);
        return <Tag color={info.color} icon={info.icon}>{info.text.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Ngày lập",
      dataIndex: "created_at",
      render: (date) => <Text type="secondary">{date}</Text>,
    },
    {
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetail(record.id)}>Chi tiết</Button>
          {record.status !== "paid" && (
            <Popconfirm title="Xác nhận đã thu tiền?" onConfirm={() => handleQuickPay(record)}>
              <Button type="primary" ghost icon={<CreditCardOutlined />}>Thanh toán</Button>
            </Popconfirm>
          )}
          <Popconfirm title="Xóa hóa đơn này?" onConfirm={() => invoiceApi.remove(record.id).then(fetchData)} okButtonProps={{ danger: true }}>
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
            <DollarOutlined style={{ fontSize: 24, color: "#52c41a" }} />
            <Title level={4} style={{ margin: 0 }}>Quản lý Tài chính & Hóa đơn</Title>
          </Space>
        </Col>
        <Col>
          {/* <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setOpen(true)}>
            Tạo hóa đơn thủ công
          </Button> */}
        </Col>
      </Row>

      {/* 🔍 BỘ LỌC */}
      <Card size="small" style={{ marginBottom: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Space wrap>
              <Input
                placeholder="Tìm tên bệnh nhân..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
                allowClear
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
              <Select
                placeholder="Trạng thái"
                allowClear
                style={{ width: 150 }}
                onChange={(v) => { setStatus(v); setPage(1); }}
              >
                <Option value="paid">Đã thanh toán</Option>
                <Option value="unpaid">Chưa thanh toán</Option>
                <Option value="pending">Đang chờ</Option>
              </Select>
            </Space>
          </Col>
          
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space>
              <Text strong>Phương thức thu tiền:</Text>
              <Segmented
                options={[
                  { label: 'Tiền mặt', value: 'cash', icon: <DollarOutlined /> },
                  { label: 'Chuyển khoản QR', value: 'qr', icon: <CreditCardOutlined /> },
                ]}
                value={payMethod}
                onChange={setPayMethod}
              />
            </Space>
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
          showTotal: (total) => `Tổng số ${total} hóa đơn`,
        }}
      />
<Modal
        open={qrOpen}
        onCancel={() => setQrOpen(false)}
        footer={null}
        centered
        width={400}
        bodyStyle={{ padding: '24px' }}
      >
        {paying && (
          <div style={{ textAlign: "center" }}>
            <Typography.Title level={4}>Quét mã VietQR</Typography.Title>
            <Divider style={{ margin: '12px 0' }} />
            
            <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
              <img 
                src={getQrCodeUrl()} 
                alt="QR Code"
                style={{ width: '100%', borderRadius: '8px', border: '1px solid #eee' }} 
              />
            </div>

            <Row gutter={[8, 8]} style={{ marginBottom: 20, textAlign: 'left' }}>
              <Col span={10}><Text type="secondary">Số tiền:</Text></Col>
              <Col span={14} style={{ textAlign: 'right' }}>
                <Text strong style={{ color: '#cf1322', fontSize: 18 }}>
                  {Number(paying.total_amount).toLocaleString()} đ
                </Text>
              </Col>
              <Col span={10}><Text type="secondary">Nội dung:</Text></Col>
              <Col span={14} style={{ textAlign: 'right' }}>
                <Text code>INV{paying.id}</Text>
              </Col>
            </Row>

            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="large"
                block
                icon={<CheckCircleOutlined />}
                onClick={async () => {
                  await invoiceApi.updateStatus(paying.id, "paid");
                  message.success("Xác nhận thanh toán QR thành công");
                  setQrOpen(false);
                  fetchData();
                }}
              >
                Xác nhận đã nhận tiền
              </Button>
              <Button block type="text" onClick={() => setQrOpen(false)}>
                Hủy giao dịch
              </Button>
            </Space>
          </div>
        )}
      </Modal>
      {/* ➕ MODAL CẬP NHẬT/TẠO MỚI */}
      
      <Modal
        title={editingId ? "Cập nhật trạng thái hóa đơn" : "Tạo mới hóa đơn"}
        open={open}
        onCancel={() => { setOpen(false); setEditingId(null); form.resetFields(); }}
        onOk={() => form.submit()}
        okText="Lưu thông tin"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 15 }}>
          {!editingId && (
            <>
              <Form.Item label="ID Bệnh nhân" name="patient_id" rules={[{ required: true, message: 'Vui lòng nhập ID' }]}>
                <Input placeholder="VD: 101" />
              </Form.Item>
              <Form.Item label="Tổng số tiền (VNĐ)" name="total_amount" rules={[{ required: true, message: 'Vui lòng nhập số tiền' }]}>
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  addonAfter="₫"
                />
              </Form.Item>
            </>
          )}
          <Form.Item label="Trạng thái thanh toán" name="status" rules={[{ required: true }]}>
            <Select size="large">
              <Option value="pending">Chờ xử lý (Pending)</Option>
              <Option value="paid">Đã thanh toán (Paid)</Option>
              <Option value="unpaid">Chưa thanh toán (Unpaid)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 🔎 MODAL CHI TIẾT HÓA ĐƠN (PRINT VIEW) */}
      <Modal
        title={
          <Space>
            <FileProtectOutlined style={{ color: "#1890ff" }} />
            <span>CHI TIẾT HÓA ĐƠN THANH TOÁN</span>
          </Space>
        }
        open={detailOpen}
        footer={[
          <Button key="close" onClick={() => setDetailOpen(false)}>Đóng</Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
            In hóa đơn (PDF)
          </Button>
        ]}
        onCancel={() => setDetailOpen(false)}
        width={800}
        centered
      >
        {detailData && (
          <div id="invoice-print">
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={3} style={{ color: "#1890ff", margin: 0 }}>HOSPITAL RECEIPT</Title>
                <Text type="secondary">Mã hóa đơn: INV-{detailData.info.id}</Text>
              </Col>
              <Col style={{ textAlign: "right" }}>
                <Tag color={getStatusInfo(detailData.info.status).color} style={{ fontSize: 14, padding: "4px 12px" }}>
                  {getStatusInfo(detailData.info.status).text.toUpperCase()}
                </Tag>
                <br />
                <Text>Ngày lập: {detailData.info.created_at}</Text>
              </Col>
            </Row>

            <Divider />

            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Bệnh nhân" span={1}>{detailData.info.patient_name}</Descriptions.Item>
              <Descriptions.Item label="Bác sĩ chỉ định" span={1}>{detailData.info.doctor_name}</Descriptions.Item>
              <Descriptions.Item label="Triệu chứng" span={2}>{detailData.info.symptoms || "N/A"}</Descriptions.Item>
              <Descriptions.Item label="Chẩn đoán cuối" span={2}><Text strong>{detailData.info.diagnosis || "Chưa có chẩn đoán"}</Text></Descriptions.Item>
            </Descriptions>

            <h3 style={{ marginTop: 20 }}><MedicineBoxOutlined /> Chi tiết dịch vụ & Thuốc</h3>
            <Table
              dataSource={detailData.items}
              rowKey={(r, i) => i}
              pagination={false}
              size="small"
              columns={[
                { title: "Nội dung", dataIndex: "description" },
                { title: "Loại", dataIndex: "item_type" ,render: (value) => itemTypeLabel[value] || value,},
                { title: "SL", dataIndex: "quantity", align: "center" },
                { title: "Đơn giá", dataIndex: "unit_price", align: "right", render: (v) => Number(v).toLocaleString() + " đ" },
                { title: "Thành tiền", align: "right", render: (_, r) => (r.quantity * r.unit_price).toLocaleString() + " đ" },
              ]}
              footer={() => (
                <Row justify="end" gutter={16}>
                  <Col><Text>Phí khám bệnh:</Text></Col>
                  <Col><Text strong>{Number(detailData.info.examination_fee || 0).toLocaleString()} đ</Text></Col>
                </Row>
              )}
            />

            <div style={{ marginTop: 24, textAlign: "right", padding: "16px", background: "#fafafa", borderRadius: 8 }}>
              <Space direction="vertical" align="end" size={0}>
                <Text style={{ fontSize: 16 }}>TỔNG CỘNG THANH TOÁN:</Text>
                <Title level={2} style={{ color: "#cf1322", margin: 0 }}>
                  {Number(detailData.info.total_amount).toLocaleString()} VNĐ
                </Title>
                <Text italic type="secondary">  (Bằng chữ: {numberToVietnamese(Number(detailData.info.total_amount))})</Text>
              </Space>
            </div>
            
            <Row justify="space-around" style={{ marginTop: 40, textAlign: "center" }}>
              <Col span={8}>
                <Text strong>Người lập phiếu</Text>
                <div style={{ marginTop: 60 }}>(Ký và ghi rõ họ tên)</div>
              </Col>
              <Col span={8}>
                <Text strong>Khách hàng / Bệnh nhân</Text>
                <div style={{ marginTop: 60 }}>(Ký và ghi rõ họ tên)</div>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default Invoices;