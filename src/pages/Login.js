import { useState } from "react";
import { Card, Input, Button, message, Typography, Row, Col } from "antd";
import { UserOutlined, LockOutlined, MedicineBoxFilled } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const { Title, Text } = Typography;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      return message.warning("Vui lòng nhập đầy đủ thông tin!");
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:14001/api/auth/login", {
        email,
        password,
      });

      login(res.data);
      message.success("Chào mừng bác sĩ/nhân viên quay trở lại!");
      navigate("/");
    } catch (err) {
      message.error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#f0f2f5" }}>
      <Row style={{ width: "100%", margin: 0 }}>
        {/* Bên trái: Hình ảnh/Banner (Ẩn trên mobile) */}
        <Col xs={0} sm={0} md={12} lg={14} style={{ 
          background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white"
        }}>
          <MedicineBoxFilled style={{ fontSize: 80, marginBottom: 20 }} />
          <Title level={1} style={{ color: "white", margin: 0 }}>HOSPITAL SYSTEM</Title>
          <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
            Hệ thống quản lý thông tin bệnh viện thông minh
          </Text>
        </Col>

        {/* Bên phải: Form đăng nhập */}
        <Col xs={24} sm={24} md={12} lg={10} style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          background: "#fff" 
        }}>
          <div style={{ width: "100%", maxWidth: 400, padding: "0 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <Title level={2}>Đăng nhập</Title>
              <Text type="secondary">Vui lòng nhập tài khoản để tiếp tục</Text>
            </div>

            <Card bordered={false} bodyStyle={{ padding: 0 }}>
              <Text strong>Email</Text>
              <Input
                prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="doctor@hospital.com"
                size="large"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginTop: 8, marginBottom: 20, borderRadius: 6 }}
              />

              <Text strong>Mật khẩu</Text>
              <Input.Password
                prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                placeholder="••••••••"
                size="large"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ marginTop: 8, marginBottom: 10, borderRadius: 6 }}
              />

              <div style={{ textAlign: "right", marginBottom: 20 }}>
                <a href="#forgot" style={{ fontSize: 13 }}>Quên mật khẩu?</a>
              </div>

              <Button
                type="primary"
                size="large"
                block
                loading={loading}
                onClick={handleLogin}
                style={{ 
                  height: 45, 
                  borderRadius: 6, 
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)"
                }}
              >
                ĐĂNG NHẬP
              </Button>
            </Card>

            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                ©2026 Hospital Management System. All Rights Reserved.
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;