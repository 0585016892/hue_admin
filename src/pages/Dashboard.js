import {
  Card, Row, Col, Table, Statistic, Typography, Spin, Tag, Badge, Avatar,Space
} from "antd";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, ResponsiveContainer, Cell
} from "recharts";
import {
  UserOutlined, CalendarOutlined, FileTextOutlined,
  DollarCircleOutlined, WarningOutlined, MedicineBoxOutlined,
  TeamOutlined, RiseOutlined
} from "@ant-design/icons";

import dashboardApi from "../api/dashboardApi";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({});
  const [revenue, setRevenue] = useState([]);
  const [patients, setPatients] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [topMedicines, setTopMedicines] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [o, r, p, l, t] = await Promise.all([
        dashboardApi.getOverview(),
        dashboardApi.revenueLast7Days(),
        dashboardApi.patientsLast7Days(),
        dashboardApi.lowStockMedicines(),
        dashboardApi.topMedicines(),
      ]);

      const overviewData = o.data?.data || {};
      overviewData.totalRevenue = Number(overviewData.totalRevenue || 0);

      setOverview(overviewData);
      setRevenue(r.data?.data || []);
      setPatients(p.data?.data || []);
      setLowStock(l.data?.data || []);
      setTopMedicines(t.data?.data || []);
    } catch (err) {
      console.error("Lỗi dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  // Phân nhóm chỉ số để hiển thị đẹp hơn
  const mainStats = [
    { title: "Doanh thu", value: overview.totalRevenue, icon: <DollarCircleOutlined />, color: "#52c41a", isMoney: true, desc: "Tổng thu hiện tại" },
    { title: "Bệnh nhân", value: overview.totalPatients, icon: <UserOutlined />, color: "#1890ff", desc: "Hồ sơ đã đăng ký" },
    { title: "Lịch hẹn", value: overview.totalAppointments, icon: <CalendarOutlined />, color: "#722ed1", desc: "Đã lên lịch khám" },
    { title: "Sắp hết thuốc", value: overview.lowStockMedicines, icon: <WarningOutlined />, color: "#ff4d4f", desc: "Cần nhập thêm kho" },
  ];

  const secondaryStats = [
    { title: "Bác sĩ", value: overview.totalDoctors, icon: <TeamOutlined />, color: "#13c2c2" },
    { title: "Tổng thuốc", value: overview.totalMedicines, icon: <MedicineBoxOutlined />, color: "#fa8c16" },
    { title: "Đơn thuốc", value: overview.totalPrescriptions, icon: <FileTextOutlined />, color: "#2f54eb" },
    { title: "Hóa đơn", value: overview.totalInvoices, icon: <RiseOutlined />, color: "#eb2f96" },
  ];

  return (
    <div style={{ padding: "0px" }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>🏥 Trung tâm Điều hành</Title>
        <Text type="secondary">Cập nhật dữ liệu thời gian thực của bệnh viện</Text>
      </div>

      {/* ====== HIGHLIGHT STATS ====== */}
      <Row gutter={[16, 16]}>
        {mainStats.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card bordered={false} hoverable style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Avatar 
                    size={54} 
                    icon={item.icon} 
                    style={{ backgroundColor: `${item.color}15`, color: item.color, borderRadius: 12 }} 
                />
                <Statistic
                  title={<Text type="secondary" strong>{item.title.toUpperCase()}</Text>}
                  value={item.value || 0}
                  formatter={(val) => item.isMoney ? formatCurrency(val) : val}
                  valueStyle={{ color: '#1f1f1f', fontWeight: 800, fontSize: 22 }}
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <Badge color={item.color} text={item.desc} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ====== SECONDARY STATS (Mini Cards) ====== */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {secondaryStats.map((item, index) => (
          <Col xs={12} sm={6} key={index}>
            <Card bordered={false} bodyStyle={{ padding: '16px 24px' }} style={{ borderRadius: 12, background: '#fafafa' }}>
              <Statistic
                title={<span style={{ fontSize: 13 }}>{item.title}</span>}
                value={item.value || 0}
                valueStyle={{ fontSize: 18, fontWeight: 700 }}
                prefix={<span style={{ color: item.color, marginRight: 8 }}>{item.icon}</span>}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* ====== CHARTS SECTION ====== */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24} lg={15}>
          <Card title={<Space><DollarCircleOutlined /> Biểu đồ doanh thu 7 ngày gần nhất</Space>} bordered={false} style={{ borderRadius: 16 }}>
            <div style={{ height: 350, width: '100%' }}>
              <ResponsiveContainer>
                <AreaChart data={revenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#8c8c8c'}} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v/1000000}M`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    formatter={(v) => [formatCurrency(v), "Doanh thu"]} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col span={24} lg={9}>
          <Card title={<Space><UserOutlined /> Lượng bệnh nhân mới</Space>} bordered={false} style={{ borderRadius: 16 }}>
            <div style={{ height: 350, width: '100%' }}>
              <ResponsiveContainer>
                <BarChart data={patients}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f5f5f5'}} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {patients.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === patients.length - 1 ? '#52c41a' : '#d9f7be'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* ====== TABLES SECTION ====== */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24} lg={12}>
          <Card title="🏆 Top dược phẩm tin dùng" bordered={false} style={{ borderRadius: 16 }} bodyStyle={{ padding: 0 }}>
            <Table
              dataSource={topMedicines}
              rowKey="medicine_name"
              pagination={false}
              columns={[
                { title: "Dược phẩm", dataIndex: "medicine_name", render: (text) => <Text strong>{text}</Text> },
                { title: "Mức sử dụng", dataIndex: "total_used", align: 'right', render: (val) => <Tag color="blue" style={{ borderRadius: 10 }}>{val} đơn</Tag> },
              ]}
            />
          </Card>
        </Col>

        <Col span={24} lg={12}>
          <Card title="🚨 Cảnh báo tồn kho thấp" bordered={false} style={{ borderRadius: 16 }} bodyStyle={{ padding: 0 }}>
            <Table
              dataSource={lowStock}
              rowKey="id"
              pagination={false}
              columns={[
                { title: "Dược phẩm", dataIndex: "medicine_name", render: (text) => <Text type="danger" strong>{text}</Text> },
                { title: "Tồn thực tế", dataIndex: "stock", align: 'right', render: (val) => <Badge status="error" text={`${val} đơn vị`} /> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;