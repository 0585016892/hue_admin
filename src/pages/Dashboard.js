import { Card, Row, Col, Table, Statistic, Typography, Space, Tag } from "antd";
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, ResponsiveContainer,
} from "recharts";
import { 
  UserOutlined, 
  CalendarOutlined, 
  FileTextOutlined, 
  DollarCircleOutlined, 
  WarningOutlined,
  ArrowUpOutlined
} from "@ant-design/icons";

import dashboardApi from "../api/dashboardApi";

const { Title, Text } = Typography;

const Dashboard = () => {
  const [overview, setOverview] = useState({});
  const [revenue, setRevenue] = useState([]);
  const [patients, setPatients] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [topMedicines, setTopMedicines] = useState([]);

  const fetchData = async () => {
    try {
      const [o, r, p, l, t] = await Promise.all([
        dashboardApi.getOverview(),
        dashboardApi.revenueByDay(),
        dashboardApi.patientsByDay(),
        dashboardApi.lowStock(),
        dashboardApi.topMedicines(),
      ]);

      setOverview(o.data.data);
      setRevenue(r.data.data.reverse());
      setPatients(p.data.data.reverse());
      setLowStock(l.data.data);
      setTopMedicines(t.data.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu dashboard:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format tiền tệ VNĐ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>📊 Bảng điều khiển tổng quát</Title>
        <Text type="secondary">Cập nhật tình hình bệnh viện trong 24h qua</Text>
      </div>

      {/* 🚀 STATISTIC CARDS */}
      <Row gutter={[16, 16]}>
        {[
          { title: "Bệnh nhân", value: overview.totalPatients, icon: <UserOutlined />, color: "#1890ff" },
          { title: "Lịch hẹn", value: overview.totalAppointments, icon: <CalendarOutlined />, color: "#722ed1" },
          { title: "Đơn thuốc", value: overview.totalPrescriptions, icon: <FileTextOutlined />, color: "#2f54eb" },
          { title: "Doanh thu", value: overview.totalRevenue, icon: <DollarCircleOutlined />, color: "#52c41a", isMoney: true },
          { title: "Sắp hết thuốc", value: overview.lowStockMedicines, icon: <WarningOutlined />, color: "#ff4d4f" },
        ].map((item, idx) => (
          <Col xs={24} sm={12} md={8} lg={4} xl={idx === 4 ? 4 : 5} key={idx}>
            <Card bordered={false} className="stat-card" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <Statistic
                title={<Text type="secondary" strong>{item.title.toUpperCase()}</Text>}
                value={item.value}
                formatter={(val) => item.isMoney ? formatCurrency(val) : val}
                valueStyle={{ color: item.color, fontWeight: 700 }}
                prefix={item.icon}
              />
              <div style={{ marginTop: 8 }}>
                <Tag color="green"><ArrowUpOutlined /> 12%</Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>so với tháng trước</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* 📈 REVENUE CHART */}
        <Col span={24} lg={12}>
          <Card title="💰 Xu hướng doanh thu (7 ngày)" bordered={false}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${value/1000000}M`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* 👨‍⚕️ PATIENTS CHART */}
        <Col span={24} lg={12}>
          <Card title="👨‍⚕️ Lượng bệnh nhân tiếp nhận" bordered={false}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={patients}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip cursor={{fill: '#f5f5f5'}} />
                  <Bar dataKey="total" fill="#52c41a" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {/* 💊 TOP MEDICINES */}
        <Col span={24} xl={12}>
          <Card title="💊 Thuốc sử dụng nhiều nhất" bordered={false}>
            <Table
              dataSource={topMedicines}
              rowKey="medicine_name"
              pagination={{ pageSize: 5 }}
              size="middle"
              columns={[
                { title: "Tên Thuốc", dataIndex: "medicine_name", render: (text) => <Text strong color="blue">{text}</Text> },
                { 
                  title: "Số lượng dùng", 
                  dataIndex: "total_used", 
                  sorter: (a, b) => a.total_used - b.total_used,
                  render: (val) => <Tag color="blue">{val} đơn vị</Tag> 
                },
              ]}
            />
          </Card>
        </Col>

        {/* ⚠️ LOW STOCK */}
        <Col span={24} xl={12}>
          <Card title="⚠️ Cảnh báo tồn kho thấp" bordered={false}>
            <Table
              dataSource={lowStock}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="middle"
              columns={[
                { title: "Dược phẩm", dataIndex: "medicine_name" },
                { 
                  title: "Tồn thực tế", 
                  dataIndex: "stock",
                  render: (val) => (
                    <Text type="danger" strong>{val}</Text>
                  )
                },
                {
                  title: "Trạng thái",
                  render: () => <Tag color="error">Cần nhập kho</Tag>
                }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;