import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  Layout, Typography, Row, Col, Card, Button, Tag, Space, Divider, ConfigProvider 
} from "antd";
import { 
  ArrowRightOutlined, CheckCircleFilled, EnvironmentOutlined, PhoneOutlined 
} from "@ant-design/icons";
import { Link ,useNavigate} from "react-router-dom"; // Nhớ cài react-router-dom
const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const SpecialtiesPage = () => {
  const navyColor = "#0F2C59";
  const medicalBlue = "#1677ff";
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const specialties = [
    {
      title: "Khoa Tim mạch",
      icon: "❤️",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
      features: ["Can thiệp tim mạch kỹ thuật cao", "Tầm soát đột quỵ & xơ vữa", "Điều trị cao huyết áp mãn tính"],
      color: "#f5222d"
    },
    {
      title: "Khoa Nhi",
      icon: "🧸",
      image: "https://images.unsplash.com/photo-1581594632702-52c4ca3df393?auto=format&fit=crop&w=800&q=80",
      features: ["Tiêm chủng trọn gói tiêu chuẩn JCI", "Tư vấn dinh dưỡng chuyên sâu", "Khám tổng quát nhi sơ sinh"],
      color: "#faad14"
    },
    {
      title: "Sản phụ khoa",
      icon: "🤱",
      image: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=800&q=80",
      features: ["Thai sản trọn gói nghỉ dưỡng", "Vô sinh hiếm muộn (IVF/IUI)", "Tầm soát ung thư phụ khoa"],
      color: "#eb2f96"
    }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: medicalBlue,
          borderRadius: 16,
          colorTextHeading: navyColor,
        },
      }}
    >
      <Layout style={{ background: "#fff" }}>
        {/* --- GIỮ NGUYÊN TOP BAR TỪ HOME --- */}
        <div style={{ background: "#f8f9fa", padding: "8px 10%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Space size="large">
            <Text size="small"><EnvironmentOutlined style={{ color: medicalBlue }} /> Trường Đại học Mỏ Địa chất</Text>
            <Text size="small"><PhoneOutlined style={{ color: medicalBlue }} /> Cấp cứu: **1900 6789**</Text>
          </Space>
          <Space>
            <Space>
                            <Button 
                            strong 
                            onClick={() => navigate('/login')} // Bọc lại như thế này
                            style={{ color: medicalBlue, cursor: 'pointer' }}
                            >
                            Đăng nhập cho bác sĩ
                            </Button>
                      </Space>
          </Space>
        </div>

        {/* --- GIỮ NGUYÊN HEADER TỪ HOME --- */}
        <Header style={{
          position: "sticky", top: 0, zIndex: 1000, width: "100%",
          background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(15px)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 10%", height: "85px", borderBottom: "1px solid #f0f0f0"
        }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: 'none' }}>
            <Title level={3} style={{ margin: 0, color: navyColor, fontWeight: 800 }}>
              HEATH<span style={{ color: medicalBlue }}>CARE</span>
            </Title>
          </Link>
          <Space size={32}>
            <Link to="/specialties"><Text strong style={{ color: medicalBlue }}>Chuyên khoa</Text></Link>
            <Link to="/packages"><Text strong style={{ color: '#000' }}>Gói khám</Text></Link>
          </Space>
        </Header>

        <Content>
          {/* --- MINI HERO SECTION CHO TRANG CON --- */}
          <div style={{ 
            background: `linear-gradient(rgba(15, 44, 89, 0.9), rgba(15, 44, 89, 0.8)), url('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1500&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '80px 10%',
            textAlign: 'center'
          }}>
            <Title level={1} style={{ color: '#fff', marginBottom: '10px' }} data-aos="zoom-in">Hệ Thống Chuyên Khoa</Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px' }} data-aos="zoom-in" data-aos-delay="200">
              Quy tụ đội ngũ chuyên gia đầu ngành cùng trang thiết bị tối tân nhất.
            </Paragraph>
          </div>

          {/* --- DANH SÁCH CHUYÊN KHOA --- */}
          <div style={{ padding: "100px 10%", background: "#fff" }}>
            <Row gutter={[40, 80]}>
              {specialties.map((item, index) => (
                <Col xs={24} key={index} data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}>
                  <Card 
                    hoverable
                    style={{ 
                      borderRadius: "30px", 
                      overflow: "hidden", 
                      boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                      border: 'none'
                    }}
                  >
                    <Row align="middle" gutter={[60, 40]}>
                      {/* Cột Ảnh - Luân phiên vị trí */}
                      <Col xs={24} lg={11} order={index % 2 === 0 ? 1 : 2}>
                        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            style={{ 
                              width: "100%", 
                              height: "450px", 
                              objectFit: "cover",
                              transition: 'transform 0.5s ease'
                            }} 
                            className="specialty-img"
                          />
                          <div style={{ 
                            position: 'absolute', top: 20, left: 20, 
                            background: '#fff', padding: '10px 20px', 
                            borderRadius: '50px', fontWeight: 'bold', fontSize: '20px' 
                          }}>
                            {item.icon}
                          </div>
                        </div>
                      </Col>

                      {/* Cột Nội dung */}
                      <Col xs={24} lg={13} order={index % 2 === 0 ? 2 : 1}>
                        <Space direction="vertical" size="middle">
                          <Tag color="blue" style={{ borderRadius: '4px' }}>CHUYÊN KHOA MŨI NHỌN</Tag>
                          <Title level={2} style={{ fontSize: '36px', marginBottom: 0 }}>{item.title}</Title>
                          <Paragraph style={{ fontSize: "17px", color: "#555", lineHeight: 1.8 }}>
                            Chúng tôi tự hào sở hữu hệ thống phòng khám và điều trị đạt tiêu chuẩn quốc tế JCI, 
                            giúp bệnh nhân tiếp cận với những phương pháp y học hiện đại nhất hiện nay.
                          </Paragraph>
                          
                          <div style={{ background: '#f8f9fa', padding: '25px', borderRadius: '20px', width: '100%' }}>
                            {item.features.map((feat, i) => (
                              <div key={i} style={{ marginBottom: "12px", display: 'flex', alignItems: 'center' }}>
                                <CheckCircleFilled style={{ color: item.color, marginRight: "12px", fontSize: '18px' }} />
                                <Text strong style={{ fontSize: '16px' }}>{feat}</Text>
                              </div>
                            ))}
                          </div>

                          <Button 
                            type="primary" 
                            size="large" 
                            icon={<ArrowRightOutlined />}
                            style={{ height: '54px', padding: '0 30px', borderRadius: '12px', marginTop: '10px' }}
                          >
                            Đăng ký khám với Chuyên gia
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa' }}>
          HEATHCARE ©2026 - Hệ thống Y tế Quốc tế tiêu chuẩn Singapore
        </Footer>
      </Layout>

      {/* Thêm chút CSS trực tiếp để xử lý hiệu ứng zoom ảnh */}
      <style dangerouslySetInnerHTML={{ __html: `
        .specialty-img:hover {
          transform: scale(1.05);
        }
        .ant-card:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }
      `}} />
    </ConfigProvider>
  );
};

export default SpecialtiesPage;