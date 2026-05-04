import React, { useState, useEffect } from "react";
// Import thư viện AOS và file CSS của nó
import AOS from "aos";
import "aos/dist/aos.css";

import {
  Layout, Typography, Button, Row, Col, Card, Space, Avatar,
  Divider, ConfigProvider, Tag, Modal,
} from "antd";
import {
  PhoneOutlined, EnvironmentOutlined, ArrowRightOutlined,
  MedicineBoxOutlined, HeartOutlined, TeamOutlined,SolutionOutlined,
  WhatsAppOutlined, GlobalOutlined, SafetyOutlined, FacebookFilled,LinkedinFilled,TwitterCircleFilled
} from "@ant-design/icons";
import { useNavigate,Link } from "react-router-dom";
const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const HeathCareViet = () => {
  const navigate = useNavigate();
  const navyColor = "#0F2C59";
  const medicalBlue = "#1677ff";
  const softBg = "#f0f5ff";

  // State điều khiển Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Khởi tạo AOS khi component được mount
  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian animation (ms)
      once: true,     // Chỉ chạy animation một lần khi cuộn đến
      easing: "ease-out-cubic", // Kiểu hiệu ứng mượt mà
    });
  }, []);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: medicalBlue,
          borderRadius: 16, // Bo góc mềm mại hơn
          colorTextHeading: navyColor,
          fontFamily: "'Inter', sans-serif",
        },
      }}
    >
      <Layout style={{ background: "#fff" }}>
        
        {/* =========================================
           MODAL ĐẶT LỊCH HẸN (Đẹp & Có Animation)
           ========================================= */}
        <Modal
          title={null}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          centered
          width={480}
          bodyStyle={{ padding: '40px', textAlign: 'center' }}
          className="beauty-modal"
        >
          {/* Hiệu ứng rung nhẹ cho Icon */}
          <Avatar 
            size={90} 
            icon={<PhoneOutlined />} 
            className="pulse-icon"
            style={{ backgroundColor: '#e6f7ff', color: medicalBlue, marginBottom: '25px' }} 
          />
          <Title level={3} style={{ marginBottom: '10px', fontWeight: 700 }}>Kết nối ngay với Chuyên gia</Title>
          <Paragraph type="secondary" style={{ fontSize: '16px', marginBottom: '30px' }}>
            Đội ngũ y bác sĩ trình độ cao của chúng tôi luôn sẵn sàng lắng nghe và tư vấn sức khỏe cho bạn. Liên hệ hotline 24/7.
          </Paragraph>
          
          <div className="hotline-box" style={{ 
            background: '#f9f9f9', 
            padding: '25px', 
            borderRadius: '16px', 
            marginBottom: '30px',
            border: `1px solid ${medicalBlue}`,
            boxShadow: '0 4px 12px rgba(22, 119, 255, 0.1)'
          }}>
            <Text type="secondary" style={{ display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>HOTLINE CẤP CỨU & ĐẶT LỊCH</Text>
            <Title level={1} style={{ margin: 0, color: medicalBlue, fontWeight: 800, letterSpacing: '-1px' }}>1900 6789</Title>
          </div>

          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Button 
              type="primary" 
              block 
              size="large" 
              icon={<PhoneOutlined />}
              href="tel:19006789"
              className="btn-call-now"
              style={{ height: '55px', borderRadius: '12px', fontSize: '17px', fontWeight: 600 }}
            >
              Gọi Ngay Bây Giờ
            </Button>
            <Button 
              block 
              size="large" 
              icon={<WhatsAppOutlined />}
              style={{ height: '55px', borderRadius: '12px', fontSize: '17px', color: '#25D366', borderColor: '#25D366' }}
            >
              Chat qua Zalo/WhatsApp
            </Button>
            <Button type="link" onClick={handleCancel} style={{ color: '#888' }}>Để sau</Button>
          </Space>
        </Modal>

        {/* =========================================
           TOP BAR (Tối giản, Sang trọng)
           ========================================= */}
        <div style={{ background: "#f8f9fa", padding: "10px 10%", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee" }}>
          <Space size="large">
            <Text size="small"><EnvironmentOutlined style={{ color: medicalBlue }} /> Trường Đại học Mỏ Địa chất</Text>
            <Divider type="vertical" />
            <Text size="small"><PhoneOutlined style={{ color: medicalBlue }} /> Cấp cứu 24/7: **1900 6789**</Text>
          </Space>
          <Space>
                <Button 
                strong 
                onClick={() => navigate('/login')} // Bọc lại như thế này
                style={{ color: medicalBlue, cursor: 'pointer' }}
                >
                Đăng nhập cho bác sĩ
                </Button>
          </Space>
        </div>

        {/* =========================================
           MAIN NAV (Sticky, Blur Background)
           ========================================= */}
        <Header className="main-header" style={{
          position: "sticky", top: 0, zIndex: 1000, width: "100%",
          background: "rgba(255, 255, 255, 0.85)", backdropFilter: "blur(10px)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 10%", height: "90px", borderBottom: "1px solid #f0f0f0"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Title level={2} style={{ margin: 0, color: navyColor, fontWeight: 800, letterSpacing: '-1.5px' }}>
              HEATH<span style={{ color: medicalBlue }}>CARE</span>
            </Title>
          </div>
          <Space size={35} className="nav-links">
            <Text strong className="nav-item">Tìm bác sĩ</Text>
            <Link to="/specialties">
            <Text strong className="nav-item">Chuyên khoa</Text>
            </Link>
            <Link to="/packages">
            <Text strong className="nav-item">Gói khám</Text>
            </Link>
            <Button type="primary" size="large" shape="round" onClick={showModal} style={{ fontWeight: 600, px: '25px' }}>
              Đặt lịch hẹn
            </Button>
          </Space>
        </Header>

        <Content>
          {/* =========================================
             HERO SECTION (Animation "Fade Up")
             ========================================= */}
          <div style={{
            height: "85vh",
            backgroundImage: "linear-gradient(to right, rgba(15, 44, 89, 0.9), rgba(15, 44, 89, 0.2)), url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000')",
            backgroundSize: "cover", backgroundPosition: "center center", display: "flex", alignItems: "center"
          }}>
            <div style={{ padding: "0 10%", width: "100%" }} data-aos="fade-up">
              <div style={{ maxWidth: "720px" }}>
                <Tag color="blue" style={{ marginBottom: "20px", padding: '5px 15px', borderRadius: '6px', fontSize: '14px' }}>HỆ THỐNG Y TẾ QUỐC TẾ JCI</Tag>
                <Title style={{ fontSize: "62px", color: "#fff", marginBottom: "25px", fontWeight: 800, lineHeight: 1.15, letterSpacing: '-2px' }}>
                  Chăm sóc bằng chuyên môn, <br /><span style={{ color: "#40a9ff" }}>Phục vụ bằng trái tim.</span>
                </Title>
                <Paragraph style={{ fontSize: "20px", color: "rgba(255,255,255,0.85)", marginBottom: "45px", fontWeight: 400, lineHeight: 1.6 }}>
                  Bệnh viện HeathCare quy tụ đội ngũ chuyên gia hàng đầu, mang đến dịch vụ khám chữa bệnh tiêu chuẩn Singapore ngay tại Việt Nam.
                </Paragraph>
                <Space size="large">
                  <Button type="primary" size="large" onClick={showModal} className="btn-hero-primary" style={{ height: "60px", padding: "0 40px", fontSize: '17px', fontWeight: 600 }}>
                    Đặt lịch tư vấn ngay
                  </Button>
                  <Button ghost size="large" onClick={showModal} style={{ height: "60px", padding: "0 40px", fontSize: '17px', fontWeight: 600 }} icon={<PhoneOutlined />}>
                    Liên hệ khẩn cấp
                  </Button>
                </Space>
              </div>
            </div>
          </div>

          {/* =========================================
             DỊCH VỤ (Hiệu ứng cuộn xuất hiện lần lượt)
             ========================================= */}
          <div style={{ padding: "120px 10%", background: "#f8fbff" }}>
            <div style={{ textAlign: "center", marginBottom: "80px" }} data-aos="fade-up">
              <Text strong style={{ color: medicalBlue, textTransform: 'uppercase', letterSpacing: '2px' }}>Chuyên khoa mũi nhọn</Text>
              <Title level={1} style={{ fontWeight: 800, marginTop: '10px', letterSpacing: '-1px' }}>Dịch vụ Y tế Đẳng cấp Quốc tế</Title>
            </div>
            <Row gutter={[32, 32]}>
              {[
                { icon: <HeartOutlined />, title: "Chuyên khoa Tim mạch", desc: "Chẩn đoán và điều trị kỹ thuật cao các bệnh lý tim mạch." },
                { icon: <MedicineBoxOutlined />, title: "Khám Sức khỏe Tổng quát", desc: "Các gói tầm soát cá nhân hóa, phát hiện sớm rủi ro." },
                { icon: <TeamOutlined />, title: "Nhi khoa Quốc tế", desc: "Chăm sóc toàn diện cho trẻ với môi trường thân thiện." },
                { icon: <GlobalOutlined />, title: "Trung tâm Hỗ trợ sinh sản", desc: "Tỷ lệ thành công cao với công nghệ IVF tiên tiến." },
                { icon: <SolutionOutlined />, title: "Ngoại khoa & Phẫu thuật", desc: "Phẫu thuật nội soi ít xâm lấn, hồi phục nhanh." },
                { icon: <SafetyOutlined />, title: "Cấp cứu 24/7", desc: "Sẵn sàng phản ứng nhanh, an toàn tuyệt đối." },
              ].map((s, index) => (
                <Col xs={24} md={12} lg={8} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                  <Card hoverable className="service-card" style={{ textAlign: 'center', padding: '30px', height: '100%', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                    <div className="icon-wrapper" style={{ fontSize: "50px", color: medicalBlue, marginBottom: "25px", display: 'inline-block', padding: '20px', background: '#e6f7ff', borderRadius: '50%' }}>
                      {s.icon}
                    </div>
                    <Title level={3} style={{ fontWeight: 700, marginBottom: '15px' }}>{s.title}</Title>
                    <Paragraph type="secondary" style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '25px' }}>{s.desc}</Paragraph>
                    <Button type="link" onClick={showModal} style={{ fontWeight: 600, fontSize: '16px' }}>Đặt lịch khám <ArrowRightOutlined /></Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          
          {/* =========================================
             CTA SECTION (Animation "Zoom In")
             ========================================= */}
          <div style={{ padding: "100px 10%" }}>
            <div 
              className="cta-banner"
              style={{ 
                background: navyColor, 
                padding: "80px", 
                borderRadius: "30px", 
                textAlign: "center", 
                color: "#fff",
                backgroundImage: "url('https://www.transparenttextures.com/patterns/black-linen.png')" 
              }}
              data-aos="zoom-in"
            >
              <Title level={1} style={{ color: "#fff", fontWeight: 800, marginBottom: "20px", letterSpacing: '-1px' }}>Sức khỏe của bạn là ưu tiên hàng đầu</Title>
              <Paragraph style={{ fontSize: "19px", color: "rgba(255,255,255,0.8)", maxWidth: '650px', margin: '0 auto 50px', lineHeight: 1.7 }}>
                Đừng trì hoãn việc chăm sóc bản thân. Hãy để đội ngũ y bác sĩ quốc tế của HeathCare đồng hành cùng bạn trên hành trình bảo vệ sức khỏe.
              </Paragraph>
              <Button type="primary" size="large" onClick={showModal} className="btn-cta-pulse" style={{ height: '60px', padding: '0 50px', fontSize: '18px', fontWeight: 600, borderRadius: '12px' }}>
                Bắt đầu hành trình chăm sóc ngay
              </Button>
            </div>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', padding: '50px 10%', background: '#f8f9fa', borderTop: '1px solid #eee' }}>
          <Space direction="vertical" size="middle">
            <Title level={3} style={{ margin: 0, color: navyColor, fontWeight: 800 }}>
              HEATH<span style={{ color: medicalBlue }}>CARE</span>
            </Title>
            <Text type="secondary" style={{ fontSize: '15px' }}>©2026 - Hệ thống Y tế Đa khoa Quốc tế HeathCare. Tất cả quyền được bảo lưu.</Text>
            <Space size="large" style={{ fontSize: '20px', color: medicalBlue, marginTop: '10px' }}>
              <FacebookFilled style={{ cursor: 'pointer' }} />
              <LinkedinFilled style={{ cursor: 'pointer' }} />
              <TwitterCircleFilled style={{ cursor: 'pointer' }} />
            </Space>
          </Space>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default HeathCareViet;