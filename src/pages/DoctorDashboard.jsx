import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Typography,
  Tag,
  Avatar,
  Button,
  Spin,
  ConfigProvider
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  DollarOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import doctorApi from "../api/doctorApi";
import { useUser } from "../context/UserContext";
const { Title, Text } = Typography;

const DoctorDashboard = () => {
    const {user}=useUser();
    console.log(user);
    
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [todayAppointments, setTodayAppointments] = useState([]);

  const fetchDashboard = async () => {
    try {
      const res = await doctorApi.getDoctorDash();
      if (res.data.success) {
        setStats(res.data.stats);
        setTodayAppointments(res.data.todayAppointments);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const columns = [
    {
      title: "Bệnh nhân",
      dataIndex: "patient_name",
      key: "patient_name",
      render: (name) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar style={{ backgroundColor: '#1890ff' }}>{name?.charAt(0)}</Avatar>
          <Text strong>{name}</Text>
        </div>
      ),
    },
    {
      title: "Giờ khám",
      dataIndex: "appointment_time",
      key: "appointment_time",
      render: (time) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong>{dayjs(time).format("HH:mm")}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{dayjs(time).format("DD/MM/YYYY")}</Text>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const config = {
          completed: { color: "green", text: "Đã hoàn thành" },
          pending: { color: "orange", text: "Đang chờ" },
          cancelled: { color: "red", text: "Đã hủy" }
        };
        const { color, text } = config[status] || { color: "default", text: status };
        return <Tag color={color} style={{ borderRadius: '10px', padding: '0 10px' }}>{text}</Tag>;
      },
    },
  ];

  // CSS inline để tối ưu giao diện
  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: 'none'
  };

  const iconStyle = (color) => ({
    fontSize: '24px',
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: `${color}15`, // Độ trong suốt 15%
    color: color
  });

  if (loading) return <Spin fullscreen tip="Đang tải dữ liệu..." />;

  return (
    <div style={{ padding: '24px', background: '#f5f7f9', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 4 }}>Xin chào, Bác sĩ : {user?.full_name}! 👋</Title>
        <Text type="secondary">Chúc bạn có một ngày làm việc hiệu quả và nhiều năng lượng.</Text>
      </div>

      {/* Statistic Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title={<Text type="secondary">Lịch hẹn hôm nay</Text>}
              value={stats.todayAppointments || 0}
              prefix={<CalendarOutlined style={iconStyle('#1890ff')} />}
              valueStyle={{ fontWeight: 700, color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title={<Text type="secondary">Bệnh nhân phụ trách</Text>}
              value={stats.totalPatients || 0}
              prefix={<UserOutlined style={iconStyle('#52c41a')} />}
              valueStyle={{ fontWeight: 700, color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title={<Text type="secondary">Đơn thuốc đã kê</Text>}
              value={stats.totalPrescriptions || 0}
              prefix={<FileTextOutlined style={iconStyle('#722ed1')} />}
              valueStyle={{ fontWeight: 700, color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card style={cardStyle}>
            <Statistic
              title={<Text type="secondary">Doanh thu cá nhân</Text>}
              value={stats.totalRevenue || 0}
              formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
              prefix={<DollarOutlined style={iconStyle('#faad14')} />}
              valueStyle={{ fontWeight: 700, color: '#faad14', fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table Section */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Lịch khám hôm nay</span>
            <Tag color="blue">{todayAppointments.length} lịch hẹn</Tag>
          </div>
        }
        style={{ ...cardStyle, marginTop: 24 }}
      >
        <Table
          columns={columns}
          dataSource={todayAppointments}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          locale={{ emptyText: "Hôm nay bạn không có lịch hẹn nào" }}
        />
      </Card>
    </div>
  );
};

export default DoctorDashboard;