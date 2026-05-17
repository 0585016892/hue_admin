import React, { useEffect, useState } from "react";
import {
  Card,
  Tag,
  Modal,
  Button,
  Select,
  message,
  Spin,
  Row,
  Col,
  Statistic,
  Badge,
  Empty,
  Divider,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  BuildOutlined,
  UserAddOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import { getBeds, assignBed, releaseBed, getBedStats } from "../api/bedApi";
import patientApi from "../api/patientApi";

// Định nghĩa cấu hình trạng thái để tái sử dụng
const STATUS_CONFIG = {
  empty: { color: "green", label: "Trống", icon: <CheckCircleOutlined />, bg: "#f6ffed" },
  occupied: { color: "red", label: "Đang dùng", icon: <CloseCircleOutlined />, bg: "#fff1f0" },
  maintenance: { color: "orange", label: "Bảo trì", icon: <BuildOutlined />, bg: "#fff7e6" },
};

export default function BedPage() {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bedsData, statsData, patientsData] = await Promise.all([
        getBeds(),
        getBedStats(),
        patientApi.getAll(),
      ]);
      setBeds(bedsData);
      setStats(statsData);
      setPatients(patientsData.data.data);
    } catch (err) {
      message.error("Không thể tải dữ liệu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!patientId) return message.warning("Vui lòng chọn bệnh nhân");
    try {
      await assignBed(selectedBed.id, patientId);
      message.success("Gán giường thành công");
      setOpen(false);
      setPatientId(null);
      fetchData();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi khi gán giường");
    }
  };

  const handleRelease = async () => {
    Modal.confirm({
      title: "Xác nhận trả giường",
      content: `Bạn có chắc chắn muốn giải phóng giường ${selectedBed?.bed_code}?`,
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await releaseBed(selectedBed.id);
          message.success("Trả giường thành công");
          setOpen(false);
          fetchData();
        } catch (err) {
          message.error("Lỗi khi trả giường");
        }
      },
    });
  };
console.log("selectedBed:::",selectedBed);
console.log("beds:::",beds);

  if (loading && beds.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Spin size="large" tip="Đang tải dữ liệu giường bệnh..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>🏥 Quản lý Hệ thống Giường bệnh</h2>
        <Button type="primary" onClick={fetchData}>Làm mới</Button>
      </div>

      {/* ================= THỐNG KÊ ================= */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card bordered={false} hoverable>
            <Statistic title="Tổng giường" value={stats?.total_beds} prefix={<HomeOutlined />} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} hoverable>
            <Statistic 
                title="Đang trống" 
                value={stats?.empty_beds} 
                valueStyle={{ color: '#3f8600' }} 
                prefix={<CheckCircleOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} hoverable>
            <Statistic 
                title="Đang sử dụng" 
                value={stats?.occupied_beds} 
                valueStyle={{ color: '#cf1322' }} 
                prefix={<UserAddOutlined />} 
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card bordered={false} hoverable>
            <Statistic 
                title="Bảo trì" 
                value={stats?.maintenance_beds} 
                valueStyle={{ color: '#d48806' }} 
                prefix={<BuildOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      {/* ================= DANH SÁCH GIƯỜNG ================= */}
      <Card title="Sơ đồ giường bệnh" bordered={false}>
        {beds.length === 0 ? (
          <Empty description="Không có dữ liệu giường" />
        ) : (
          <Row gutter={[12, 12]}>
            {beds.map((bed) => {
              const config = STATUS_CONFIG[bed.status] || STATUS_CONFIG.empty;
              return (
                <Col key={bed.id} xs={12} sm={8} md={6} lg={4} xl={3}>
                  <Badge.Ribbon text={config.label} color={config.color}>
                    <Card
                      hoverable
                      size="small"
                      onClick={() => {
                        setSelectedBed(bed);
                        setOpen(true);
                      }}
                      style={{
                        textAlign: "center",
                        borderRadius: "8px",
                        border: `1px solid ${config.color}`,
                        background: config.bg,
                        transition: "all 0.3s"
                      }}
                    >
                      <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: 4 }}>
                        {bed.bed_code}
                      </div>
                      <div style={{ fontSize: "11px", color: "#666" }}>{bed.room_name}</div>
                      <div style={{ fontSize: "10px", color: "#999", textTransform: "uppercase" }}>
                        {bed.ward_name}
                      </div>
                    </Card>
                  </Badge.Ribbon>
                </Col>
              );
            })}
          </Row>
        )}
      </Card>

      {/* ================= MODAL CHI TIẾT ================= */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={<span><HomeOutlined /> Chi tiết giường {selectedBed?.bed_code}</span>}
        centered
      >
        {selectedBed && (
          <div style={{ padding: "10px 0" }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <p><b>Khoa:</b> {selectedBed.ward_name}</p>
                <p><b>Phòng:</b> {selectedBed.room_name}</p>
              </Col>
              <Col span={12}>
                <p><b>Trạng thái:</b></p>
                <Tag icon={STATUS_CONFIG[selectedBed.status].icon} color={STATUS_CONFIG[selectedBed.status].color}>
                  {STATUS_CONFIG[selectedBed.status].label}
                </Tag>
              </Col>
            </Row>

            <Divider style={{ margin: "16px 0" }} />

            {/* Form Gán bệnh nhân */}
            {selectedBed.status === "empty" && (
              <Space direction="vertical" style={{ width: "100%" }}>
                <span style={{ fontWeight: 500 }}>Chọn bệnh nhân tiếp nhận:</span>
                <Select
                  style={{ width: "100%" }}
                  placeholder="Tìm theo tên hoặc số điện thoại..."
                  value={patientId}
                  onChange={setPatientId}
                  showSearch
                  optionFilterProp="children"
                  size="large"
                >
                  {patients.map((p) => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.full_name} - {p.phone}
                    </Select.Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  block
                  size="large"
                  onClick={handleAssign}
                  style={{ marginTop: 8 }}
                >
                  Xác nhận gán giường
                </Button>
              </Space>
            )}

            {/* Form Trả giường */}
            {selectedBed.status === "occupied" && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "#666", marginBottom: 16 }}>Giường hiện đang có bệnh nhân điều trị.</p>
                <Button
                  danger
                  type="primary"
                  icon={<LogoutOutlined />}
                  size="large"
                  block
                  onClick={handleRelease}
                >
                 Trả giường
                </Button>
              </div>
            )}
            
            {selectedBed.status === "maintenance" && (
                <div style={{ textAlign: "center", padding: "20px 0", color: "orange" }}>
                    <BuildOutlined style={{ fontSize: 40 }} />
                    <p>Giường đang trong quá trình bảo trì, không thể gán bệnh nhân.</p>
                </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}