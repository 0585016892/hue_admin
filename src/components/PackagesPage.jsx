import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  Layout, Typography, Row, Col, Card, Button, List, Badge, 
  Divider, Space, Tag, ConfigProvider 
} from "antd";
import { 
  CheckOutlined, EnvironmentOutlined, PhoneOutlined, 
  ThunderboltFilled, SafetyCertificateFilled 
} from "@ant-design/icons";
import { Link,useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const PackagesPage = () => {
    const navigate = useNavigate();
  const navyColor = "#0F2C59";
  const medicalBlue = "#1677ff";

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const packages = [
    {
      name: "Gói Cơ Bản",
      price: "2.500.000đ",
      oldPrice: "3.200.000đ",
      desc: "Phù hợp cho kiểm tra định kỳ hàng năm cho người trẻ.",
      features: ["Khám tổng quát nội khoa", "Xét nghiệm máu 12 chỉ số", "Siêu âm ổ bụng 4D", "Chụp X-quang phổi kỹ thuật số"],
      recommended: false,
      color: "#87d068"
    },
    {
      name: "Gói Nâng Cao",
      price: "5.800.000đ",
      oldPrice: "7.500.000đ",
      desc: "Tầm soát chuyên sâu các rủi ro sức khỏe phổ biến.",
      features: ["Tất cả gói Cơ bản", "Siêu âm tim & mạch máu", "Tầm soát dấu ấn ung thư", "Khám chuyên khoa Răng/Mắt"],
      recommended: true,
      color: medicalBlue
    },
    {
      name: "Gói VIP Platinum",
      price: "12.000.000đ",
      oldPrice: "15.000.000đ",
      desc: "Đẳng cấp chăm sóc sức khỏe toàn diện và đặc quyền VIP.",
      features: ["Tất cả gói Nâng cao", "Chụp MRI/CT toàn thân", "Nội soi tiêu hoá không đau", "Dịch vụ đưa đón & ăn nhẹ tại BV"],
      recommended: false,
      color: "#722ed1"
    }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: medicalBlue,
          borderRadius: 16,
        },
      }}
    >
      <Layout style={{ background: "#fff" }}>
        {/* --- TOP BAR (Đồng bộ với Home) --- */}
        <div style={{ background: "#f8f9fa", padding: "8px 10%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Space size="large">
            <Text size="small"><EnvironmentOutlined style={{ color: medicalBlue }} />  Trường Đại học Mỏ Địa chất</Text>
            <Text size="small"><PhoneOutlined style={{ color: medicalBlue }} /> Cấp cứu: **1900 6789**</Text>
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

        {/* --- MAIN NAV (Đồng bộ với Home) --- */}
        <Header style={{
          position: "sticky", top: 0, zIndex: 1000, width: "100%",
          background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(15px)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 10%", height: "85px", borderBottom: "1px solid #f0f0f0"
        }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Title level={3} style={{ margin: 0, color: navyColor, fontWeight: 800 }}>
              HEATH<span style={{ color: medicalBlue }}>CARE</span>
            </Title>
          </Link>
          <Space size={32}>
            <Link to="/specialties"><Text strong style={{ color: '#000' }}>Chuyên khoa</Text></Link>
            <Link to="/packages"><Text strong style={{ color: medicalBlue }}>Gói khám</Text></Link>
          </Space>
        </Header>

        <Content>
          {/* --- HERO BANNER CHO GÓI KHÁM --- */}
          <div style={{ 
            background: `linear-gradient(135deg, ${navyColor} 0%, #1e56a0 100%)`, 
            padding: "80px 10%", 
            textAlign: "center",
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div data-aos="zoom-out" style={{ position: 'relative', zIndex: 2 }}>
              <Tag color="cyan" style={{ marginBottom: '16px' }}>ƯU ĐÃI ĐẾN 20% THÁNG NÀY</Tag>
              <Title level={1} style={{ color: "#fff", fontSize: '42px', fontWeight: 800 }}>
                Chủ Động Tầm Soát - Bảo Vệ Tương Lai
              </Title>
              <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: "18px", maxWidth: '700px', margin: '0 auto' }}>
                Các gói khám được thiết kế khoa học bởi đội ngũ bác sĩ hàng đầu, 
                giúp bạn nắm bắt chính xác tình trạng sức khỏe chỉ trong nửa ngày.
              </Paragraph>
            </div>
          </div>

          {/* --- DANH SÁCH GÓI KHÁM --- */}
          <div style={{ padding: "80px 10%", background: "#f0f5ff" }}>
            <Row gutter={[32, 32]} align="middle">
              {packages.map((pkg, index) => (
                <Col xs={24} lg={8} key={index} data-aos="fade-up" data-aos-delay={index * 200}>
                  <Badge.Ribbon 
                    text={pkg.recommended ? "LỰA CHỌN TỐT NHẤT" : ""} 
                    color="orange" 
                    style={{ display: pkg.recommended ? "block" : "none", fontSize: '14px', padding: '0 15px' }}
                  >
                    <Card 
                      hoverable 
                      className={pkg.recommended ? "package-card-recommended" : "package-card"}
                      style={{ 
                        borderRadius: "30px", 
                        border: pkg.recommended ? `2px solid ${medicalBlue}` : "none",
                        boxShadow: pkg.recommended ? "0 20px 40px rgba(22, 119, 255, 0.15)" : "0 10px 30px rgba(0,0,0,0.05)",
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{ textAlign: "center", padding: '10px 0' }}>
                        <div style={{ 
                          width: '60px', height: '60px', background: `${pkg.color}15`, 
                          borderRadius: '15px', display: 'flex', alignItems: 'center', 
                          justifyContent: 'center', margin: '0 auto 20px', color: pkg.color,
                          fontSize: '24px'
                        }}>
                          {index === 0 ? <SafetyCertificateFilled /> : index === 1 ? <ThunderboltFilled /> : <StarFilled />}
                        </div>
                        <Title level={3} style={{ marginBottom: 0 }}>{pkg.name}</Title>
                        <Paragraph type="secondary" style={{ marginTop: 10, height: '40px' }}>{pkg.desc}</Paragraph>
                        
                        <div style={{ margin: "25px 0" }}>
                          <Text delete style={{ color: "#999", fontSize: '16px' }}>{pkg.oldPrice}</Text>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Text style={{ fontSize: "36px", fontWeight: 800, color: navyColor }}>{pkg.price}</Text>
                          </div>
                        </div>
                      </div>

                      <Divider style={{ margin: '0 0 25px 0' }} />
                      
                      <List
                        dataSource={pkg.features}
                        renderItem={item => (
                          <List.Item style={{ border: "none", padding: "8px 0" }}>
                            <Space align="start">
                              <CheckOutlined style={{ color: "#52c41a", marginTop: '5px' }} />
                              <Text style={{ fontSize: '15px' }}>{item}</Text>
                            </Space>
                          </List.Item>
                        )}
                      />

                      <Button 
                        type={pkg.recommended ? "primary" : "default"} 
                        size="large" 
                        block 
                        style={{ 
                          marginTop: "35px", 
                          height: "55px", 
                          fontWeight: 700, 
                          borderRadius: '12px',
                          fontSize: '17px'
                        }}
                      >
                        Đăng ký gói này
                      </Button>
                    </Card>
                  </Badge.Ribbon>
                </Col>
              ))}
            </Row>

            <div style={{ marginTop: "80px" }}>
                <Card style={{ borderRadius: '24px', background: medicalBlue, color: '#fff', textAlign: 'center', padding: '20px' }} data-aos="flip-up">
                    <Row align="middle" justify="center" gutter={[24, 24]}>
                        <Col xs={24} md={18}>
                            <Title level={3} style={{ color: '#fff', margin: 0 }}>Bạn cần một gói khám thiết kế riêng cho doanh nghiệp?</Title>
                        </Col>
                        <Col xs={24} md={6}>
                            <Button size="large" ghost style={{ borderRadius: '10px', height: '50px', fontWeight: 600 }}>Liên hệ báo giá</Button>
                        </Col>
                    </Row>
                </Card>
            </div>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', padding: '40px', background: '#fff' }}>
          HEATHCARE ©2026 - Hệ thống Y tế Quốc tế tiêu chuẩn Singapore
        </Footer>

        <style dangerouslySetInnerHTML={{ __html: `
          .package-card-recommended { transform: scale(1.05); transition: all 0.3s ease; }
          .package-card:hover, .package-card-recommended:hover { transform: translateY(-10px) !important; }
        `}} />
      </Layout>
    </ConfigProvider>
  );
};

// Icon hỗ trợ cho phần Render
const StarFilled = () => (
  <svg viewBox="64 64 896 896" focusable="false" data-icon="star" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3-12.3 12.7-12.1 33.1.6 45.3l183.7 179.1-43.4 252.9c-1.2 6.9-.1 14.1 3.2 20.3 8.2 15.6 27.6 21.7 43.2 13.4L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.1-33.7-26.6-36.4z"></path></svg>
);

export default PackagesPage;