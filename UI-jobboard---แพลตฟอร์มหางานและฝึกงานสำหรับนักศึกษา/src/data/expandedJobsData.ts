import { Job } from '../types';

export interface DemoEmployerAccount {
  id: string;
  email: string;
  password: string;
  authProvider: 'email';
  role: 'employer';
  name: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  website: string;
  address: string;
  bio: string;
  created_at: string;
}

/**
 * Fictional demo employer accounts across diverse industries in Thailand.
 * Clearly marked as fictional DEMO DATA — never overwriting existing accounts.
 */
export const ADDITIONAL_DEMO_EMPLOYERS: DemoEmployerAccount[] = [
  {
    id: 'emp-2',
    email: 'hr.demo@creativepixel.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'ณัฐธิดา ศิลป์สกุล (Creative HR)',
    companyName: 'CreativePixel Studio',
    contactPerson: 'ณัฐธิดา ศิลป์สกุล',
    phone: '02-000-1102',
    website: 'https://creativepixel-demo.example.com',
    address: 'เขตสาทร กรุงเทพมหานคร',
    bio: '[DEMO DATA] สตูดิโอออกแบบดิจิทัลและประสบการณ์ผู้ใช้งานจำลองสำหรับทดสอบระบบ JobBoard',
    created_at: '2026-10-02T08:00:00.000Z',
  },
  {
    id: 'emp-3',
    email: 'talent.demo@nordicgrowth.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'คณิศร วัฒนะ (Agency People Lead)',
    companyName: 'Nordic Growth Agency',
    contactPerson: 'คณิศร วัฒนะ',
    phone: '053-000-2103',
    website: 'https://nordicgrowth-demo.example.com',
    address: 'อ.เมืองเชียงใหม่ เชียงใหม่',
    bio: '[DEMO DATA] เอเจนซี่การตลาดดิจิทัลจำลองในจังหวัดเชียงใหม่สำหรับสาธิตระบบรับสมัครงาน',
    created_at: '2026-10-02T09:00:00.000Z',
  },
  {
    id: 'emp-4',
    email: 'careers.demo@easternhub.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'ธนพล บูรพา (HR Manager)',
    companyName: 'Eastern Innovation Hub',
    contactPerson: 'ธนพล บูรพา',
    phone: '038-000-3104',
    website: 'https://easternhub-demo.example.com',
    address: 'อ.ศรีราชา ชลบุรี',
    bio: '[DEMO DATA] ศูนย์นวัตกรรมและที่ปรึกษาธุรกิจเทคโนโลยีจำลองในพื้นที่ EEC',
    created_at: '2026-10-03T08:00:00.000Z',
  },
  {
    id: 'emp-5',
    email: 'hr.demo@precisiondynamics.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'สุรศักดิ์ วิศวกุล (Plant HR)',
    companyName: 'Precision Dynamics Corp',
    contactPerson: 'สุรศักดิ์ วิศวกุล',
    phone: '038-000-4105',
    website: 'https://precisiondynamics-demo.example.com',
    address: 'นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี',
    bio: '[DEMO DATA] บริษัทผู้ผลิตชิ้นส่วนเครื่องกลและระบบอัตโนมัติจำลองสำหรับทดสอบระบบ',
    created_at: '2026-10-03T09:00:00.000Z',
  },
  {
    id: 'emp-6',
    email: 'people.demo@aetheriscloud.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'Alisa Techawong (People Ops)',
    companyName: 'Aetheris Cloud Workspace',
    contactPerson: 'Alisa Techawong',
    phone: '02-000-5106',
    website: 'https://aetheriscloud-demo.example.com',
    address: 'เขตพญาไท กรุงเทพมหานคร',
    bio: '[DEMO DATA] Fictional cloud workplace & IT managed services provider for JobBoard demo.',
    created_at: '2026-10-04T08:00:00.000Z',
  },
  {
    id: 'emp-demo-7',
    email: 'careers.demo@cloudharbor.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'Narin Srisuk (Engineering Talent)',
    companyName: 'CloudHarbor Systems Thailand',
    contactPerson: 'Narin Srisuk',
    phone: '02-000-7007',
    website: 'https://cloudharbor-demo.example.com',
    address: 'อ.คลองหลวง ปทุมธานี',
    bio: '[DEMO DATA] Fictional cloud infrastructure & DevOps engineering company at Thailand Science Park.',
    created_at: '2026-10-05T08:00:00.000Z',
  },
  {
    id: 'emp-demo-8',
    email: 'hr.demo@mekongdigitallab.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'ปวีณา ศรีโคตร (HR Coordinator)',
    companyName: 'Mekong Digital Lab Co., Ltd.',
    contactPerson: 'ปวีณา ศรีโคตร',
    phone: '043-000-7008',
    website: 'https://mekonglab-demo.example.com',
    address: 'อ.เมืองขอนแก่น ขอนแก่น',
    bio: '[DEMO DATA] บริษัทพัฒนาโมบายแอปพลิเคชันจำลองในจังหวัดขอนแก่นสำหรับบ่มเพาะนักศึกษารุ่นใหม่',
    created_at: '2026-10-05T09:00:00.000Z',
  },
  {
    id: 'emp-demo-9',
    email: 'talent.demo@finshieldcyber.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'กานต์พิชชา ปลอดภัย (Talent Acquisition)',
    companyName: 'FinShield Cyber Defense Co., Ltd.',
    contactPerson: 'กานต์พิชชา ปลอดภัย',
    phone: '02-000-7009',
    website: 'https://finshield-demo.example.com',
    address: 'เขตสาทร กรุงเทพมหานคร',
    bio: '[DEMO DATA] บริษัทที่ปรึกษาและเฝ้าระวังความมั่นคงปลอดภัยไซเบอร์จำลอง',
    created_at: '2026-10-06T08:00:00.000Z',
  },
  {
    id: 'emp-demo-10',
    email: 'hr.demo@luminapulse.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'ลลิตา แสงทอง (HR Specialist)',
    companyName: 'Lumina Pulse Communications',
    contactPerson: 'ลลิตา แสงทอง',
    phone: '02-000-7010',
    website: 'https://luminapulse-demo.example.com',
    address: 'เขตพญาไท กรุงเทพมหานคร',
    bio: '[DEMO DATA] เอเจนซี่สื่อสารการตลาดและประชาสัมพันธ์แบรนด์จำลองย่านอารีย์',
    created_at: '2026-10-06T09:00:00.000Z',
  },
  {
    id: 'emp-demo-11',
    email: 'hello.demo@vervebrand.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'Clara Lindqvist (Studio Manager)',
    companyName: 'VerveBrand Digital Studio',
    contactPerson: 'Clara Lindqvist',
    phone: '076-000-7011',
    website: 'https://vervebrand-demo.example.com',
    address: 'อ.เมืองภูเก็ต ภูเก็ต',
    bio: '[DEMO DATA] Fictional hospitality & lifestyle digital marketing agency based in Phuket.',
    created_at: '2026-10-06T10:00:00.000Z',
  },
  {
    id: 'emp-demo-12',
    email: 'hr.demo@nakhonmedia.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'อานนท์ โคราชพัฒนา (Producer)',
    companyName: 'Nakhon Creative Media House',
    contactPerson: 'อานนท์ โคราชพัฒนา',
    phone: '044-000-7012',
    website: 'https://nakhonmedia-demo.example.com',
    address: 'อ.เมืองนครราชสีมา นครราชสีมา',
    bio: '[DEMO DATA] สตูดิโอผลิตคอนเทนต์และประชาสัมพันธ์ท้องถิ่นจำลองในจังหวัดนครราชสีมา',
    created_at: '2026-10-07T08:00:00.000Z',
  },
  {
    id: 'emp-demo-13',
    email: 'people.demo@siampeople.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'ชุติมา บริรักษ์ (People Partner)',
    companyName: 'Siam People & Organization Advisory',
    contactPerson: 'ชุติมา บริรักษ์',
    phone: '02-000-7013',
    website: 'https://siampeople-demo.example.com',
    address: 'เขตบางรัก กรุงเทพมหานคร',
    bio: '[DEMO DATA] บริษัทที่ปรึกษาด้านการบริหารทรัพยากรบุคคลและพัฒนาองค์กรจำลอง',
    created_at: '2026-10-07T09:00:00.000Z',
  },
  {
    id: 'emp-demo-14',
    email: 'hr.demo@easternindustrial.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'Pongsakorn Wattana (HR Admin Lead)',
    companyName: 'Eastern Industrial Group Co., Ltd.',
    contactPerson: 'Pongsakorn Wattana',
    phone: '038-000-7014',
    website: 'https://easternindustrial-demo.example.com',
    address: 'อ.ปลวกแดง ระยอง',
    bio: '[DEMO DATA] Fictional smart manufacturing & industrial park operator in Rayong.',
    created_at: '2026-10-07T10:00:00.000Z',
  },
  {
    id: 'emp-demo-15',
    email: 'coop.demo@isanconsulting.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'ธีรภัทร มิตรภาพ (Managing Associate)',
    companyName: 'Isan Enterprise Consulting',
    contactPerson: 'ธีรภัทร มิตรภาพ',
    phone: '043-000-7015',
    website: 'https://isanconsulting-demo.example.com',
    address: 'อ.เมืองขอนแก่น ขอนแก่น',
    bio: '[DEMO DATA] บริษัทที่ปรึกษากลยุทธ์และบริหารโครงการสำหรับธุรกิจ SME จำลองในภาคอีสาน',
    created_at: '2026-10-08T08:00:00.000Z',
  },
  {
    id: 'emp-demo-16',
    email: 'audit.demo@siamledger.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'ศิริพร บัญชีกิจ (Audit Partner)',
    companyName: 'Siam Ledger Advisory Co., Ltd.',
    contactPerson: 'ศิริพร บัญชีกิจ',
    phone: '053-000-7016',
    website: 'https://siamledger-demo.example.com',
    address: 'อ.เมืองเชียงใหม่ เชียงใหม่',
    bio: '[DEMO DATA] สำนักงานบัญชีและที่ปรึกษาภาษีอากรจำลองในจังหวัดเชียงใหม่',
    created_at: '2026-10-08T09:00:00.000Z',
  },
  {
    id: 'emp-demo-17',
    email: 'careers.demo@chaophrayacapital.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'nicholas.t@chaophrayacapital.example.com',
    companyName: 'Chao Phraya Capital Partners',
    contactPerson: 'Nicholas Tantipong',
    phone: '02-000-7017',
    website: 'https://chaophrayacapital-demo.example.com',
    address: 'เขตปทุมวัน กรุงเทพมหานคร',
    bio: '[DEMO DATA] Fictional corporate finance & advisory firm in Ploenchit, Bangkok.',
    created_at: '2026-10-08T10:00:00.000Z',
  },
  {
    id: 'emp-demo-18',
    email: 'finance.demo@rayongpetroservice.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'วรัญญา พลังงาน (Finance Controller)',
    companyName: 'Rayong Petrochem Services Co., Ltd.',
    contactPerson: 'วรัญญา พลังงาน',
    phone: '038-000-7018',
    website: 'https://rayongpetro-demo.example.com',
    address: 'อ.เมืองระยอง ระยอง',
    bio: '[DEMO DATA] บริษัทให้บริการสนับสนุนวิศวกรรมและงบประมาณอุตสาหกรรมจำลองในจังหวัดระยอง',
    created_at: '2026-10-09T08:00:00.000Z',
  },
  {
    id: 'emp-demo-19',
    email: 'studio.demo@velvetframe.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'แพรวา วาดฝัน (Art Director)',
    companyName: 'VelvetFrame Creative House',
    contactPerson: 'แพรวา วาดฝัน',
    phone: '02-000-7019',
    website: 'https://velvetframe-demo.example.com',
    address: 'เขตจตุจักร กรุงเทพมหานคร',
    bio: '[DEMO DATA] ครีเอทีฟเฮาส์ด้านออกแบบอัตลักษณ์แบรนด์และสื่อสิ่งพิมพ์ดิจิทัลจำลอง',
    created_at: '2026-10-09T09:00:00.000Z',
  },
  {
    id: 'emp-demo-20',
    email: 'talent.demo@siamtypemotion.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'Kavin Charoen (Creative Director)',
    companyName: 'SiamType & Motion Lab',
    contactPerson: 'Kavin Charoen',
    phone: '053-000-7020',
    website: 'https://siamtypemotion-demo.example.com',
    address: 'อ.เมืองเชียงใหม่ เชียงใหม่',
    bio: '[DEMO DATA] Fictional brand typography & motion design studio in Chiang Mai.',
    created_at: '2026-10-09T10:00:00.000Z',
  },
  {
    id: 'emp-demo-21',
    email: 'hr.demo@buraphacivil.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'เกรียงไกร โยธาการ (Engineering HR)',
    companyName: 'Burapha Civil & Infrastructure PCL',
    contactPerson: 'เกรียงไกร โยธาการ',
    phone: '044-000-7021',
    website: 'https://buraphacivil-demo.example.com',
    address: 'อ.ปากช่อง นครราชสีมา',
    bio: '[DEMO DATA] บริษัทรับเหมาก่อสร้างโครงสร้างพื้นฐานและอาคารเขียวจำลอง',
    created_at: '2026-10-10T08:00:00.000Z',
  },
  {
    id: 'emp-demo-22',
    email: 'careers.demo@metrostruct.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'Siripong Nanthawat (Chief Structural Eng.)',
    companyName: 'MetroStruct Engineering Consultants',
    contactPerson: 'Siripong Nanthawat',
    phone: '02-000-7022',
    website: 'https://metrostruct-demo.example.com',
    address: 'อ.บางพลี สมุทรปราการ',
    bio: '[DEMO DATA] Fictional structural & BIM civil engineering consultancy near Bang Phli.',
    created_at: '2026-10-10T09:00:00.000Z',
  },
  {
    id: 'emp-demo-23',
    email: 'hr.demo@thonburiwellness.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'พญ. มนัสนันท์ รักษ์สุข (Hospital Admin)',
    companyName: 'Thonburi Wellness & Medical Center',
    contactPerson: 'มนัสนันท์ รักษ์สุข',
    phone: '02-000-7023',
    website: 'https://thonburiwellness-demo.example.com',
    address: 'เขตธนบุรี กรุงเทพมหานคร',
    bio: '[DEMO DATA] ศูนย์การแพทย์และเวชศาสตร์ฟื้นฟูจำลองสำหรับการทดสอบระบบรับสมัครงานสายสุขภาพ',
    created_at: '2026-10-11T08:00:00.000Z',
  },
  {
    id: 'emp-demo-24',
    email: 'hr.demo@lannacarehospital.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'Thanyarat Chaiyo (International Services)',
    companyName: 'Lanna Care International Hospital',
    contactPerson: 'Thanyarat Chaiyo',
    phone: '053-000-7024',
    website: 'https://lannacare-demo.example.com',
    address: 'อ.เมืองเชียงราย เชียงราย',
    bio: '[DEMO DATA] Fictional international hospital & wellness facility in Chiang Rai.',
    created_at: '2026-10-11T09:00:00.000Z',
  },
  {
    id: 'emp-demo-25',
    email: 'talent.demo@andamanazure.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'Marisa Promma (Resort People & Culture)',
    companyName: 'Andaman Azure Resort & Spa Phuket',
    contactPerson: 'Marisa Promma',
    phone: '076-000-7025',
    website: 'https://andamanazure-demo.example.com',
    address: 'อ.ถลาง ภูเก็ต',
    bio: '[DEMO DATA] Fictional 5-star beachfront eco-resort & spa in Phuket for hospitality careers demo.',
    created_at: '2026-10-11T10:00:00.000Z',
  },
  {
    id: 'emp-demo-26',
    email: 'hr.demo@suvarnabhumifreight.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'Chatchai Cargo (Logistics HR)',
    companyName: 'Suvarnabhumi Global Freight & Logistics',
    contactPerson: 'Chatchai Phromphet',
    phone: '02-000-7026',
    website: 'https://suvarnabhumifreight-demo.example.com',
    address: 'อ.บางเสาธง สมุทรปราการ',
    bio: '[DEMO DATA] Fictional air & sea freight forwarding hub near Suvarnabhumi Airport.',
    created_at: '2026-10-12T08:00:00.000Z',
  },
  {
    id: 'emp-demo-27',
    email: 'academic.demo@futurebridge.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'Dr. Sutidauangrat (Academic Director)',
    companyName: 'FutureBridge Language & STEM Academy',
    contactPerson: 'Sutida Duangrat',
    phone: '053-000-7027',
    website: 'https://futurebridge-demo.example.com',
    address: 'อ.เมืองเชียงราย เชียงราย',
    bio: '[DEMO DATA] Fictional bilingual communication & STEM learning institute in Chiang Rai.',
    created_at: '2026-10-12T09:00:00.000Z',
  },
  {
    id: 'emp-demo-28',
    email: 'careers.demo@urbancraftretail.example.com',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'ปภาวินท์ การค้า (Commercial People Lead)',
    companyName: 'UrbanCraft Lifestyle Retail Co., Ltd.',
    contactPerson: 'ปภาวินท์ การค้า',
    phone: '02-000-7028',
    website: 'https://urbancraft-demo.example.com',
    address: 'เขตห้วยขวาง กรุงเทพมหานคร',
    bio: '[DEMO DATA] ธุรกิจค้าปลีกสินค้าไลฟ์สไตล์และอีคอมเมิร์ซครบวงจรจำลอง',
    created_at: '2026-10-12T10:00:00.000Z',
  },
];

/**
 * 30 Additional Realistic Demo Job & Internship Listings (IDs: job-12 through job-41).
 * Strictly ADDITION-ONLY — existing job-1..job-11 remain completely untouched.
 */
export const ADDITIONAL_DEMO_JOBS: Job[] = [
  // ============================================================================
  // 1. IT & SOFTWARE (3 Listings: job-12, job-13, job-14)
  // ============================================================================
  {
    id: 'job-12',
    title: 'Cloud & DevOps Engineering Co-op Student',
    description:
      'CloudHarbor Systems Thailand (fictional demo company) is seeking a motivated 4th-year Co-op student to join our Cloud Infrastructure team at Thailand Science Park, Pathum Thani. Gain hands-on experience automating CI/CD pipelines, Docker containers, and Linux cloud environments.',
    content_language: 'en',
    title_en: 'Cloud & DevOps Engineering Co-op Student',
    description_en:
      'CloudHarbor Systems Thailand (fictional demo company) is seeking a motivated 4th-year Co-op student to join our Cloud Infrastructure team at Thailand Science Park, Pathum Thani. Gain hands-on experience automating CI/CD pipelines, Docker containers, and Linux cloud environments.',
    responsibilities_en:
      '- Assist DevOps engineers in maintaining GitHub Actions CI/CD workflows and container registries\n- Monitor cloud server health, logs, and resource utilization using Grafana and Prometheus\n- Write Infrastructure-as-Code templates and bash/Python automation scripts for staging environments\n- Document deployment runbooks and participate in sprint retrospectives',
    qualifications_en:
      '- 4th-year undergraduate in Computer Engineering, Computer Science, or Information Technology eligible for a 16-week Cooperative Education (Co-op) semester\n- Foundational knowledge of Linux command line, Git, computer networking, and Docker containers\n- Eager to learn cloud platforms (AWS / GCP) and modern DevOps practices',
    required_skills_en: 'Linux, Docker, Git, GitHub Actions, Bash / Python, Cloud Fundamentals',
    benefits_en:
      '- Monthly Co-op allowance of 11,000 - 15,000 THB\n- Hybrid schedule (2 days at Thailand Science Park, 3 days remote)\n- Cloud certification study vouchers and dedicated senior engineer mentor',
    category: 'IT & Software',
    location: 'Khlong Luang District • Thailand Science Park (Hybrid)',
    province: 'ปทุมธานี',
    status: 'open',
    company_name: 'CloudHarbor Systems Thailand',
    company_logo: 'CH',
    employer_id: 'emp-demo-7',
    salary_range: '11,000 - 15,000 THB/month',
    work_type: 'Co-op',
    application_deadline: '2026-12-15T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-31T16:30:00.000Z',
    updated_at: '2026-10-31T16:30:00.000Z',
  },
  {
    id: 'job-13',
    title: 'นักพัฒนาแอปพลิเคชันมือถือฝึกงาน (Mobile App Developer Intern - Flutter)',
    description:
      'บริษัท เมโขง ดิจิทัล แล็บ จำกัด (ข้อมูลตัวอย่างสำหรับสาธิตระบบ) เปิดรับนักศึกษาฝึกงานสายพัฒนาแอปพลิเคชันบน iOS และ Android ด้วย Flutter ร่วมสร้างสรรค์แอปพลิเคชันบริการชุมชนและธุรกิจท้องถิ่นในภาคตะวันออกเฉียงเหนือ',
    content_language: 'th',
    title_th: 'นักพัฒนาแอปพลิเคชันมือถือฝึกงาน (Mobile App Developer Intern - Flutter)',
    description_th:
      'บริษัท เมโขง ดิจิทัล แล็บ จำกัด (ข้อมูลตัวอย่างสำหรับสาธิตระบบ) เปิดรับนักศึกษาฝึกงานสายพัฒนาแอปพลิเคชันบน iOS และ Android ด้วย Flutter ร่วมสร้างสรรค์แอปพลิเคชันบริการชุมชนและธุรกิจท้องถิ่นในภาคตะวันออกเฉียงเหนือ',
    responsibilities_th:
      '- พัฒนาหน้าจอและฟีเจอร์ของ Mobile Application ด้วยภาษา Dart และเฟรมเวิร์ก Flutter\n- เชื่อมต่อข้อมูลกับระบบหลังบ้านผ่าน REST API และทดสอบการทำงานบนอุปกรณ์จริง\n- ร่วมแก้ไขข้อผิดพลาดของแอปพลิเคชันและปรับปรุงความลื่นไหลของ UI ร่วมกับทีมออกแบบ\n- นำเสนอความคืบหน้าของโปรเจกต์ในการประชุมทีมรายสัปดาห์',
    qualifications_th:
      '- กำลังศึกษาชั้นปีที่ 3 หรือ 4 สาขาวิทยาการคอมพิวเตอร์ วิศวกรรมคอมพิวเตอร์ หรือเทคโนโลยีสารสนเทศ\n- มีพื้นฐานการเขียนโปรแกรมเชิงวัตถุ (OOP) และเคยทดลองสร้างโปรเจกต์ด้วย Flutter หรือ React Native เบื้องต้น\n- สามารถเข้าฝึกงานที่ออฟฟิศใกล้มหาวิทยาลัยขอนแก่นแบบ Hybrid ได้อย่างน้อย 2 เดือน',
    required_skills_th: 'Flutter, Dart, Mobile UI, REST API, Git, Firebase เบื้องต้น',
    benefits_th:
      '- เบี้ยเลี้ยงฝึกงาน 7,500 - 11,000 บาท/เดือน\n- รูปแบบทำงาน Hybrid ยืดหยุ่นตามตารางสอบของมหาวิทยาลัย\n- พี่เลี้ยงดูแลใกล้ชิดพร้อมหนังสือรับรองการฝึกงาน',
    category: 'IT & Software',
    location: 'อ.เมืองขอนแก่น (ย่านกังสดาล ใกล้ ม.ขอนแก่น • Hybrid)',
    province: 'ขอนแก่น',
    status: 'open',
    company_name: 'Mekong Digital Lab Co., Ltd.',
    company_logo: 'MD',
    employer_id: 'emp-demo-8',
    salary_range: '7,500 - 11,000 บาท/เดือน',
    work_type: 'Internship',
    application_deadline: '2026-12-10T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-28T09:20:00.000Z',
    updated_at: '2026-10-28T09:20:00.000Z',
  },
  {
    id: 'job-14',
    title: 'นักวิเคราะห์ความมั่นคงปลอดภัยไซเบอร์รุ่นใหม่ (Junior Cybersecurity Analyst)',
    description:
      'เฝ้าระวังเหตุการณ์ผิดปกติทางไซเบอร์ วิเคราะห์ Log จากระบบ SIEM และร่วมตรวจสอบช่องโหว่เบื้องต้นสำหรับลูกค้าองค์กร ยินดีรับบัณฑิตจบใหม่ที่มีพื้นฐานระบบเครือข่ายและความปลอดภัยสารสนเทศ',
    content_language: 'both',
    title_th: 'นักวิเคราะห์ความมั่นคงปลอดภัยไซเบอร์รุ่นใหม่ (Junior Cybersecurity Analyst)',
    description_th:
      'บริษัท ฟินชิลด์ ไซเบอร์ ดีเฟนส์ จำกัด (บริษัทตัวอย่าง) เปิดรับบัณฑิตจบใหม่ร่วมทีม Security Operations Center (SOC) เฝ้าระวังเหตุการณ์ผิดปกติทางไซเบอร์ วิเคราะห์ Log จากระบบ SIEM และร่วมประเมินช่องโหว่เบื้องต้น',
    responsibilities_th:
      '- ตรวจสอบและวิเคราะห์แจ้งเตือนด้านความปลอดภัย (Security Alerts) จากระบบ SIEM และ Endpoint Detection\n- จัดทำรายงานสรุปเหตุการณ์เบื้องต้นและประสานงานแจ้งเตือนทีมดูแลระบบของลูกค้า\n- ร่วมดำเนินการสแกนช่องโหว่ระบบเครือข่ายและเว็บแอปพลิเคชันตามรอบประจำเดือน\n- ติดตามข่าวสารภัยคุกคามทางไซเบอร์ใหม่ ๆ (Threat Intelligence)',
    qualifications_th:
      '- สำเร็จการศึกษาระดับปริญญาตรี สาขาความมั่นคงปลอดภัยไซเบอร์ วิทยาการคอมพิวเตอร์ วิศวกรรมคอมพิวเตอร์ หรือไอที (ยินดีรับเด็กจบใหม่)\n- เข้าใจพื้นฐาน TCP/IP, OSI Model, Linux, Windows Event Logs และ OWASP Top 10\n- หากมีใบรับรอง CompTIA Security+ หรือเคยแข่งขัน CTF จะได้รับการพิจารณาเป็นพิเศษ',
    required_skills_th: 'Cybersecurity, Network Security, SIEM, Linux, OWASP Top 10, Incident Response',
    benefits_th:
      '- เงินเดือนเริ่มต้น 25,000 - 34,000 บาท/เดือน พร้อมค่ากะ (กรณีเข้าเวรกลางวัน/เย็น)\n- สนับสนุนค่าสอบใบรับรองวิชาชีพ Security+ / CEH / Blue Team Level 1 เต็มจำนวน\n- ประกันสุขภาพกลุ่ม กองทุนสำรองเลี้ยงชีพ และวันลาพักร้อน 12 วัน',
    title_en: 'Junior Cybersecurity SOC Analyst (Entry-Level)',
    description_en:
      'FinShield Cyber Defense Co., Ltd. (fictional demo organization) is hiring an entry-level Junior Cybersecurity SOC Analyst to monitor security events, investigate SIEM alerts, and assist with vulnerability assessments for enterprise clients.',
    responsibilities_en:
      '- Monitor, triage, and investigate real-time security alerts across SIEM and EDR platforms\n- Escalate verified security incidents with clear technical documentation and remediation notes\n- Assist senior consultants with scheduled network and web application vulnerability scans\n- Research emerging CVEs and threat intelligence advisories',
    qualifications_en:
      '- Bachelor’s degree in Cybersecurity, Information Technology, Computer Science, or Computer Engineering (fresh graduates welcome)\n- Solid grasp of TCP/IP networking, DNS, HTTP, Linux basics, and OWASP Top 10 vulnerabilities\n- Prior university lab projects, CTF participation, or CompTIA Security+ study is a plus',
    required_skills_en: 'SIEM Triage, TCP/IP Networking, OWASP Top 10, Linux, Vulnerability Scanning, Incident Analysis',
    benefits_en:
      '- Salary 25,000 - 34,000 THB/month + shift allowance\n- 100% company-sponsored cybersecurity certifications (CompTIA Security+ / BTL1)\n- Group medical insurance, provident fund, and hybrid rotation in Sathorn',
    category: 'IT & Software',
    location: 'เขตสาทร (ใกล้ BTS เซนต์หลุยส์ • Hybrid)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'FinShield Cyber Defense Co., Ltd.',
    company_logo: 'FS',
    employer_id: 'emp-demo-9',
    salary_range: '25,000 - 34,000 บาท/เดือน',
    work_type: 'Full-time',
    application_deadline: '2026-12-20T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-11-01T07:45:00.000Z',
    updated_at: '2026-11-01T07:45:00.000Z',
  },

  // ============================================================================
  // 2. MARKETING & COMMUNICATIONS (3 Listings: job-15, job-16, job-17)
  // ============================================================================
  {
    id: 'job-15',
    title: 'เจ้าหน้าที่การตลาดดิจิทัล',
    description:
      'ลูมิน่า พัลส์ คอมมิวนิเคชั่นส์ (เอเจนซี่จำลองสำหรับสาธิตระบบ) เปิดรับสมัคร เจ้าหน้าที่การตลาดดิจิทัล รุ่นใหม่ไฟแรง ร่วมวางแผนแคมเปญสื่อสารการตลาดออนไลน์ บริหารสื่อโซเชียลมีเดีย และประสานงานอินฟลูเอนเซอร์ให้กับแบรนด์สินค้าอุปโภคบริโภค',
    content_language: 'th',
    title_th: 'เจ้าหน้าที่การตลาดดิจิทัล',
    description_th:
      'ลูมิน่า พัลส์ คอมมิวนิเคชั่นส์ (เอเจนซี่จำลองสำหรับสาธิตระบบ) เปิดรับสมัคร เจ้าหน้าที่การตลาดดิจิทัล รุ่นใหม่ไฟแรง ร่วมวางแผนแคมเปญสื่อสารการตลาดออนไลน์ บริหารสื่อโซเชียลมีเดีย และประสานงานอินฟลูเอนเซอร์ให้กับแบรนด์สินค้าอุปโภคบริโภค',
    responsibilities_th:
      '- วางแผนปฏิทินคอนเทนต์รายเดือน (Content Pillar & Calendar) บน Facebook, Instagram, TikTok และ LINE OA\n- ติดต่อประสานงาน KOLs / Micro-Influencers และตรวจรับชิ้นงานให้ตรงตามบรีฟของลูกค้า\n- ติดตามตัวเลข Engagement, Reach และ Conversion พร้อมจัดทำสรุปผลการดำเนินงานรายเดือน\n- ร่วมระดมสมองคิดแคมเปญเปิดตัวสินค้าใหม่ร่วมกับทีม Creative และ Copywriter',
    qualifications_th:
      '- ปริญญาตรีสาขาการตลาด นิเทศศาสตร์ วารสารศาสตร์ บริหารธุรกิจ หรือสาขาที่เกี่ยวข้อง (ยินดีรับนักศึกษาจบใหม่)\n- มีทักษะการเขียนสื่อสารภาษาไทยอย่างสร้างสรรค์ เข้าใจพฤติกรรมผู้บริโภคยุคดิจิทัล\n- สามารถใช้งาน Meta Business Suite, Google Sheets และ Canva ได้คล่องแคล่ว',
    required_skills_th: 'การตลาดดิจิทัล, Social Media Management, Influencer Marketing, Copywriting, Canva, Google Analytics',
    benefits_th:
      '- เงินเดือน 20,000 - 26,000 บาท/เดือน\n- ทำงานแบบ Hybrid เข้าออฟฟิศย่านอารีย์สัปดาห์ละ 3 วัน\n- ประกันสุขภาพกลุ่ม งบซื้อหนังสือ/คอร์สการตลาด และวันหยุดประจำปี',
    category: 'Marketing & Communications',
    location: 'เขตพญาไท (ซอยอารีย์ 4 • Hybrid)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'Lumina Pulse Communications',
    company_logo: 'LP',
    employer_id: 'emp-demo-10',
    salary_range: '20,000 - 26,000 บาท/เดือน',
    work_type: 'Full-time',
    application_deadline: '2026-12-05T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-11-01T07:10:00.000Z',
    updated_at: '2026-11-01T07:10:00.000Z',
  },
  {
    id: 'job-16',
    title: 'Digital Marketing Intern',
    description:
      'VerveBrand Digital Studio (fictional demo agency in Phuket) is looking for a creative Digital Marketing Intern to assist with social media storytelling, newsletter campaigns, and SEO content for boutique hospitality and lifestyle brands.',
    content_language: 'en',
    title_en: 'Digital Marketing Intern',
    description_en:
      'VerveBrand Digital Studio (fictional demo agency in Phuket) is looking for a creative Digital Marketing Intern to assist with social media storytelling, newsletter campaigns, and SEO content for boutique hospitality and lifestyle brands.',
    responsibilities_en:
      '- Draft engaging English social media captions, blog articles, and short-form video storyboards\n- Schedule multi-channel posts across Instagram, TikTok, and LinkedIn\n- Assist the account team in compiling monthly social listening and Google Analytics 4 performance decks\n- Support on-location lifestyle photo and reel shoots in Phuket when available',
    qualifications_en:
      '- 3rd or 4th year university student in Marketing, Mass Communication, International Business, or English\n- Good written and spoken English with a keen eye for visual aesthetics\n- Available for at least 10–16 weeks (Hybrid in Phuket Old Town or Remote within Thailand)',
    required_skills_en: 'Social Media Content, English Copywriting, Canva, CapCut, Basic SEO, GA4',
    benefits_en:
      '- Monthly internship allowance of 7,500 - 10,500 THB\n- Flexible hybrid/remote work arrangement\n- Hands-on portfolio pieces and official internship completion certificate',
    category: 'Marketing & Communications',
    location: 'Mueang Phuket District • Old Town (Hybrid / Remote)',
    province: 'ภูเก็ต',
    status: 'open',
    company_name: 'VerveBrand Digital Studio',
    company_logo: 'VB',
    employer_id: 'emp-demo-11',
    salary_range: '7,500 - 10,500 THB/month',
    work_type: 'Internship',
    application_deadline: '2026-12-18T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-29T10:15:00.000Z',
    updated_at: '2026-10-29T10:15:00.000Z',
  },
  {
    id: 'job-17',
    title: 'ผู้ช่วยประชาสัมพันธ์และสร้างสรรค์คอนเทนต์ (Part-time PR & Content Associate)',
    description:
      'งานพาร์ทไทม์สำหรับนิสิตนักศึกษาที่ต้องการหารายได้พิเศษระหว่างเรียน ร่วมเขียนข่าวประชาสัมพันธ์ ดูแลเพจอีเวนต์ระดับภูมิภาค และประสานงานสื่อมวลชนออนไลน์ในจังหวัดนครราชสีมา',
    content_language: 'both',
    title_th: 'ผู้ช่วยประชาสัมพันธ์และสร้างสรรค์คอนเทนต์ (Part-time PR & Content Associate)',
    description_th:
      'นคร ครีเอทีฟ มีเดีย เฮาส์ (ข้อมูลสาธิต) เปิดรับนักศึกษาพาร์ทไทม์ร่วมทีมประชาสัมพันธ์ เขียนบทความข่าวประชาสัมพันธ์ (Press Release) ดูแลคอนเทนต์เพจงานอีเวนต์ และประสานงานเพจพันธมิตรในจังหวัดนครราชสีมา',
    responsibilities_th:
      '- เรียบเรียงบทความประชาสัมพันธ์ ข่าวกิจกรรม และโพสต์สรุปไฮไลต์งานอีเวนต์ทั้งภาษาไทยและอังกฤษเบื้องต้น\n- ตอบข้อความผู้สนใจเข้าร่วมงานและประสานงานลงสื่อประชาสัมพันธ์ออนไลน์\n- เลือกตารางทำงานได้สัปดาห์ละ 18–24 ชั่วโมง ไม่กระทบเวลาเรียน',
    qualifications_th:
      '- กำลังศึกษาระดับปริญญาตรีทุกชั้นปี สาขานิเทศศาสตร์ การตลาด ภาษาอังกฤษ หรือสาขาที่เกี่ยวข้อง\n- มีความรับผิดชอบสูง เขียนสะกดคำภาษาไทยถูกต้องแม่นยำ และทำงานทางไกล (Remote) ผสมเข้ากองงานบางเสาร์-อาทิตย์ได้',
    required_skills_th: 'การเขียนข่าวประชาสัมพันธ์ (PR), การดูแลเพจ, การสื่อสารองค์กร, Canva, Microsoft Office',
    benefits_th:
      '- ค่าตอบแทนรายเดือนเฉลี่ย 8,500 - 13,000 บาท (ตามชั่วโมงปฏิบัติงานจริง)\n- ตารางงานยืดหยุ่น ทำงานจากที่พักได้ (Remote Friendly)\n- เบี้ยเลี้ยงเดินทางเพิ่มเติมในวันออกกองอีเวนต์',
    title_en: 'Part-time PR & Corporate Communications Associate',
    description_en:
      'Nakhon Creative Media House (fictional demo studio) is hiring a part-time student associate in Nakhon Ratchasima to draft event press releases, manage community updates, and support regional brand communications.',
    responsibilities_en:
      '- Draft clear press releases, event announcements, and recap stories for regional lifestyle and tech events\n- Coordinate media kits with local online publications and university clubs\n- Work 18–24 flexible hours per week around your university class schedule',
    qualifications_en:
      '- Current undergraduate student in Communications, Journalism, Marketing, or Liberal Arts\n- Strong Thai writing skills and intermediate English reading/writing\n- Reliable internet connection for remote collaboration plus occasional weekend event coverage in Khorat',
    required_skills_en: 'Public Relations, Copywriting, Event Communications, Social Media, Canva',
    benefits_en:
      '- Part-time compensation of 8,500 - 13,000 THB/month based on hours\n- Remote-first schedule tailored around exam weeks\n- On-site event meal & transport allowance',
    category: 'Marketing & Communications',
    location: 'อ.เมืองนครราชสีมา (Remote / Hybrid)',
    province: 'นครราชสีมา',
    status: 'open',
    company_name: 'Nakhon Creative Media House',
    company_logo: 'NC',
    employer_id: 'emp-demo-12',
    salary_range: '8,500 - 13,000 บาท/เดือน',
    work_type: 'Part-time',
    application_deadline: '2026-11-30T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-24T11:00:00.000Z',
    updated_at: '2026-10-24T11:00:00.000Z',
  },

  // ============================================================================
  // 3. BUSINESS & ADMINISTRATION (3 Listings: job-18, job-19, job-20)
  // ============================================================================
  {
    id: 'job-18',
    title: 'เจ้าหน้าที่ฝ่ายทรัพยากรบุคคล',
    description:
      'สยาม พีเพิล แอนด์ ออร์แกไนเซชัน แอดไวซอรี (บริษัทจำลอง) รับสมัคร เจ้าหน้าที่ฝ่ายทรัพยากรบุคคล (ยินดีรับบัณฑิตจบใหม่) ดูแลงานสรรหาบุคลากรเบื้องต้น ประสานงานปฐมนิเทศพนักงานใหม่ และจัดทำกิจกรรมพัฒนาศักยภาพบุคลากร',
    content_language: 'th',
    title_th: 'เจ้าหน้าที่ฝ่ายทรัพยากรบุคคล',
    description_th:
      'สยาม พีเพิล แอนด์ ออร์แกไนเซชัน แอดไวซอรี (บริษัทจำลอง) รับสมัคร เจ้าหน้าที่ฝ่ายทรัพยากรบุคคล (ยินดีรับบัณฑิตจบใหม่) ดูแลงานสรรหาบุคลากรเบื้องต้น ประสานงานปฐมนิเทศพนักงานใหม่ และจัดทำกิจกรรมพัฒนาศักยภาพบุคลากร',
    responsibilities_th:
      '- คัดกรองเรซูเม่ผู้สมัครงาน นัดหมายสัมภาษณ์ และดูแลประสบการณ์ผู้สมัคร (Candidate Experience) อย่างเป็นมืออาชีพ\n- จัดเตรียมเอกสารการจ้างงานและประสานงานกิจกรรมปฐมนิเทศพนักงานใหม่ (Onboarding)\n- บันทึกข้อมูลประวัติพนักงาน วันลา และสวัสดิการในระบบ HRIS ให้เป็นปัจจุบัน\n- ช่วยจัดกิจกรรมฝึกอบรมภายในและกิจกรรมสร้างความสัมพันธ์ในองค์กร',
    qualifications_th:
      '- ปริญญาตรีสาขาการจัดการทรัพยากรมนุษย์ บริหารธุรกิจ จิตวิทยาอุตสาหกรรม รัฐประศาสนศาสตร์ หรือสาขาที่เกี่ยวข้อง\n- มีมนุษยสัมพันธ์ดี สุภาพ รักงานบริการ และรักษาความลับของข้อมูลส่วนบุคคลอย่างเคร่งครัด\n- สามารถใช้งาน Microsoft Excel, Word และระบบประชุมออนไลน์ได้ดี',
    required_skills_th: 'การสรรหาบุคลากร (Recruitment), งานทะเบียนประวัติ (HRIS), ประสานงานฝึกอบรม, Microsoft Excel, การสื่อสารมนุษยสัมพันธ์',
    benefits_th:
      '- เงินเดือน 19,000 - 25,000 บาท/เดือน\n- ประกันสังคม ประกันสุขภาพกลุ่ม และตรวจสุขภาพประจำปี\n- สถานที่ทำงานเดินทางสะดวกใกล้ BTS ศาลาแดง / MRT สีลม หยุดเสาร์-อาทิตย์',
    category: 'Business & Administration',
    location: 'เขตบางรัก • ถนนสีลม (ใกล้ BTS ศาลาแดง)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'Siam People & Organization Advisory',
    company_logo: 'SP',
    employer_id: 'emp-demo-13',
    salary_range: '19,000 - 25,000 บาท/เดือน',
    work_type: 'Full-time',
    application_deadline: '2026-12-12T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-30T08:30:00.000Z',
    updated_at: '2026-10-30T08:30:00.000Z',
  },
  {
    id: 'job-19',
    title: 'Human Resources Assistant',
    description:
      'Eastern Industrial Group Co., Ltd. (fictional demo employer in Rayong) invites university interns to join our People & Administration department as a Human Resources Assistant supporting campus recruitment, training coordination, and employee engagement.',
    content_language: 'en',
    title_en: 'Human Resources Assistant',
    description_en:
      'Eastern Industrial Group Co., Ltd. (fictional demo employer in Rayong) invites university interns to join our People & Administration department as a Human Resources Assistant supporting campus recruitment, training coordination, and employee engagement.',
    responsibilities_en:
      '- Coordinate interview schedules, campus job fair materials, and applicant tracking spreadsheets\n- Assist with preparing employee onboarding welcome kits and safety orientation sessions\n- Maintain accurate digital filing of training attendance records and administrative requests\n- Support internal employee wellness and CSR events across the Rayong facility',
    qualifications_en:
      '- 3rd or 4th year student in Human Resource Management, Business Administration, Public Administration, or English\n- Organized, approachable, and comfortable communicating in both Thai and basic/intermediate English\n- Available for a 2 to 4 month internship in Pluak Daeng, Rayong',
    required_skills_en: 'HR Administration, Interview Scheduling, Microsoft Excel, Document Control, Interpersonal Communication',
    benefits_en:
      '- Internship allowance of 8,000 - 11,000 THB/month\n- Free air-conditioned shuttle bus (Rayong City / Sri Racha routes) and complimentary lunch canteen\n- Structured HR mentorship and internship certificate',
    category: 'Business & Administration',
    location: 'Pluak Daeng District • Eastern Seaboard Industrial Estate',
    province: 'ระยอง',
    status: 'open',
    company_name: 'Eastern Industrial Group Co., Ltd.',
    company_logo: 'EI',
    employer_id: 'emp-demo-14',
    salary_range: '8,000 - 11,000 THB/month',
    work_type: 'Internship',
    application_deadline: '2026-12-08T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-27T09:40:00.000Z',
    updated_at: '2026-10-27T09:40:00.000Z',
  },
  {
    id: 'job-20',
    title: 'นักศึกษาสหกิจศึกษาประสานงานโครงการธุรกิจ (Business Project Coordinator Co-op)',
    description:
      'ฝึกปฏิบัติงานสหกิจศึกษา 1 ภาคการศึกษา ร่วมเก็บข้อมูลวิจัยตลาด จัดทำสไลด์นำเสนอแผนพัฒนาธุรกิจ และประสานงานโครงการให้คำปรึกษาผู้ประกอบการในภูมิภาคตะวันออกเฉียงเหนือ',
    content_language: 'both',
    title_th: 'นักศึกษาสหกิจศึกษาประสานงานโครงการธุรกิจ (Business Project Coordinator Co-op)',
    description_th:
      'อีสาน เอ็นเตอร์ไพรส์ คอนซัลติ้ง (บริษัทที่ปรึกษาจำลอง) เปิดรับนักศึกษาสหกิจศึกษา ร่วมวิเคราะห์ข้อมูลธุรกิจ จัดทำเอกสารนำเสนอโครงการ และประสานงานเวิร์กชอปยกระดับผู้ประกอบการท้องถิ่นในจังหวัดขอนแก่น',
    responsibilities_th:
      '- รวบรวมข้อมูลคู่แข่งและแนวโน้มอุตสาหกรรมเพื่อประกอบการจัดทำแผนธุรกิจให้ลูกค้าองค์กร\n- จัดทำสไลด์นำเสนอ (Presentation Deck) และรายงานสรุปผลการประชุมโครงการ\n- ประสานงานนัดหมายทีมที่ปรึกษาและลูกค้า รวมถึงดูแลการจัดงานสัมมนาเชิงปฏิบัติการ',
    qualifications_th:
      '- นักศึกษาชั้นปีที่ 4 สาขาบริหารธุรกิจ การจัดการ เศรษฐศาสตร์ หรือการจัดการนวัตกรรม ที่ออกปฏิบัติสหกิจศึกษา 4 เดือน\n- มีทักษะการคิดวิเคราะห์ การสรุปประเด็น และใช้ PowerPoint / Excel / Canva ได้ดี',
    required_skills_th: 'การประสานงานโครงการ, วิเคราะห์ธุรกิจเบื้องต้น, PowerPoint, Excel, การสื่อสารนำเสนอ',
    benefits_th:
      '- เบี้ยเลี้ยงสหกิจศึกษา 9,000 - 12,000 บาท/เดือน\n- เรียนรู้กระบวนการให้คำปรึกษาธุรกิจจริงจากทีมผู้เชี่ยวชาญ\n- สนับสนุนหัวข้อโครงงานสหกิจศึกษาจนจบหลักสูตร',
    title_en: 'Business Operations & Project Coordinator Co-op Student',
    description_en:
      'Isan Enterprise Consulting (fictional demo firm in Khon Kaen) welcomes 4th-year Co-op students to work alongside management consultants on market research, project tracking, and client workshop facilitation.',
    responsibilities_en:
      '- Conduct secondary market and industry research to support SME transformation projects\n- Prepare structured slide decks, meeting minutes, and project milestone trackers\n- Assist consultants in coordinating client workshops and stakeholder interviews in Khon Kaen',
    qualifications_en:
      '- 4th-year undergraduate in Business Administration, Management, Economics, or Entrepreneurship enrolled in a Co-op program\n- Strong analytical thinking, clear writing, and proficiency in Excel and PowerPoint',
    required_skills_en: 'Project Coordination, Market Research, Microsoft Excel, PowerPoint, Business Communication',
    benefits_en:
      '- Co-op stipend of 9,000 - 12,000 THB/month\n- Direct supervision for your university Co-op capstone report\n- Modern office on Mittraphap Road near Central Khon Kaen',
    category: 'Business & Administration',
    location: 'อ.เมืองขอนแก่น • ถนนมิตรภาพ',
    province: 'ขอนแก่น',
    status: 'open',
    company_name: 'Isan Enterprise Consulting',
    company_logo: 'IE',
    employer_id: 'emp-demo-15',
    salary_range: '9,000 - 12,000 บาท/เดือน',
    work_type: 'Co-op',
    application_deadline: '2026-12-22T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-25T13:15:00.000Z',
    updated_at: '2026-10-25T13:15:00.000Z',
  },

  // ============================================================================
  // 4. FINANCE & ACCOUNTING (3 Listings: job-21, job-22, job-23)
  // ============================================================================
  {
    id: 'job-21',
    title: 'นักบัญชีฝึกหัด',
    description:
      'บริษัท สยาม เลดเจอร์ แอดไวซอรี จำกัด (สำนักงานบัญชีจำลองในจังหวัดเชียงใหม่) เปิดรับสมัคร นักบัญชีฝึกหัด ร่วมเรียนรู้การบันทึกบัญชีรายวัน การจัดทำเอกสารภาษีหัก ณ ที่จ่าย และการใช้ซอฟต์แวร์บัญชีคลาวด์ภายใต้การดูแลของผู้สอบบัญชีรับอนุญาต',
    content_language: 'th',
    title_th: 'นักบัญชีฝึกหัด',
    description_th:
      'บริษัท สยาม เลดเจอร์ แอดไวซอรี จำกัด (สำนักงานบัญชีจำลองในจังหวัดเชียงใหม่) เปิดรับสมัคร นักบัญชีฝึกหัด ร่วมเรียนรู้การบันทึกบัญชีรายวัน การจัดทำเอกสารภาษีหัก ณ ที่จ่าย และการใช้ซอฟต์แวร์บัญชีคลาวด์ภายใต้การดูแลของผู้สอบบัญชีรับอนุญาต',
    responsibilities_th:
      '- ตรวจสอบความถูกต้องของเอกสารประกอบการลงบัญชี เช่น ใบกำกับภาษี ใบเสร็จรับเงิน และใบสำคัญจ่าย\n- บันทึกรายการค้าเบื้องต้นในโปรแกรมบัญชีออนไลน์ (PEAK / FlowAccount / Express)\n- ช่วยจัดเตรียมแบบยื่นภาษีมูลค่าเพิ่ม (ภ.พ.30) และภาษีหัก ณ ที่จ่าย (ภ.ง.ด.3, 53)\n- กระทบยอดเงินฝากธนาคาร (Bank Reconciliation) ประจำเดือน',
    qualifications_th:
      '- กำลังศึกษาชั้นปีที่ 3–4 หรือระดับ ปวส. สาขาการบัญชี หรือการเงิน\n- มีความละเอียดรอบคอบ ซื่อสัตย์ และมีความเข้าใจหลักการบัญชีคู่ (Debit / Credit)\n- สามารถใช้งาน Microsoft Excel (VLOOKUP / PivotTable เบื้องต้น) ได้ดี',
    required_skills_th: 'การบันทึกบัญชี, ภาษีมูลค่าเพิ่ม (ภ.พ.30), ภาษีหัก ณ ที่จ่าย, Microsoft Excel, FlowAccount / Express',
    benefits_th:
      '- เบี้ยเลี้ยงฝึกงาน 6,500 - 9,500 บาท/เดือน\n- อบรมการใช้งานโปรแกรมบัญชีคลาวด์และเตรียมความพร้อมสู่สายงานผู้ทำบัญชี (CPD)\n- หยุดวันเสาร์-อาทิตย์ ปฏิบัติงานย่านช้างเผือก อ.เมืองเชียงใหม่',
    category: 'Finance & Accounting',
    location: 'อ.เมืองเชียงใหม่ • ย่านช้างเผือก',
    province: 'เชียงใหม่',
    status: 'open',
    company_name: 'Siam Ledger Advisory Co., Ltd.',
    company_logo: 'SL',
    employer_id: 'emp-demo-16',
    salary_range: '6,500 - 9,500 บาท/เดือน',
    work_type: 'Internship',
    application_deadline: '2026-12-10T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-11-01T06:50:00.000Z',
    updated_at: '2026-11-01T06:50:00.000Z',
  },
  {
    id: 'job-22',
    title: 'Junior Accountant',
    description:
      'Chao Phraya Capital Partners (fictional demo advisory firm) is recruiting a detail-oriented Junior Accountant in Bangkok. Ideal for recent Accounting graduates looking to build a strong foundation in AP/AR, month-end closing, and corporate tax compliance.',
    content_language: 'en',
    title_en: 'Junior Accountant',
    description_en:
      'Chao Phraya Capital Partners (fictional demo advisory firm) is recruiting a detail-oriented Junior Accountant in Bangkok. Ideal for recent Accounting graduates looking to build a strong foundation in AP/AR, month-end closing, and corporate tax compliance.',
    responsibilities_en:
      '- Process accounts payable (AP) and accounts receivable (AR) invoices accurately in ERP software\n- Perform monthly bank reconciliations and assist senior accountants with month-end journal entries\n- Prepare monthly withholding tax (PND 3, 53) and VAT (PP 30) filings\n- Support annual external audit preparation and fixed-asset register verification',
    qualifications_en:
      '- Bachelor’s degree in Accounting (eligible to register as a Thai Bookkeeper / CPD is an advantage); fresh graduates welcome\n- Solid knowledge of Thai Financial Reporting Standards (TFRS) and basic Thai Revenue Code\n- Proficiency in Microsoft Excel and good reading/writing skills in English and Thai',
    required_skills_en: 'AP/AR Accounting, Month-End Closing, Thai Tax (PP30 / PND53), ERP / SAP Business One, Microsoft Excel',
    benefits_en:
      '- Starting salary 22,000 - 29,000 THB/month + annual bonus\n- CPA exam study leave & accounting continuing education allowance\n- Health & dental insurance, provident fund, and office directly connected to BTS Ploenchit',
    category: 'Finance & Accounting',
    location: 'Pathum Wan District • Ploenchit Road (Near BTS Ploenchit)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'Chao Phraya Capital Partners',
    company_logo: 'CP',
    employer_id: 'emp-demo-17',
    salary_range: '22,000 - 29,000 THB/month',
    work_type: 'Full-time',
    application_deadline: '2026-12-25T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-31T15:10:00.000Z',
    updated_at: '2026-10-31T15:10:00.000Z',
  },
  {
    id: 'job-23',
    title: 'นักวิเคราะห์การเงินและงบประมาณโครงการ (สัญญาจ้าง 12 เดือน)',
    description:
      'วิเคราะห์ต้นทุนโครงการ จัดทำรายงานเปรียบเทียบงบประมาณจริงกับแผนงาน (Budget vs Actual) และสนับสนุนข้อมูลทางการเงินให้ทีมวิศวกรรมในเขตอุตสาหกรรมมาบตาพุด',
    content_language: 'both',
    title_th: 'นักวิเคราะห์การเงินและงบประมาณโครงการ (สัญญาจ้าง 12 เดือน)',
    description_th:
      'บริษัท ระยอง ปิโตรเคม เซอร์วิสเซส จำกัด (บริษัทจำลอง) เปิดรับนักวิเคราะห์การเงินรุ่นใหม่ (สัญญาจ้าง 1 ปี มีโอกาสต่อสัญญาหรือบรรจุประจำ) ร่วมติดตามงบประมาณโครงการและวิเคราะห์ต้นทุนการดำเนินงาน',
    responsibilities_th:
      '- จัดทำรายงานติดตามงบประมาณโครงการรายเดือน (Budget vs Actual Variance Analysis)\n- ตรวจสอบใบขอซื้อและประมาณการกระแสเงินสดรับ-จ่ายของโครงการย่อย\n- สร้างตารางจำลองทางการเงินเบื้องต้นบน Excel เพื่อสนับสนุนฝ่ายบริหารโครงการ',
    qualifications_th:
      '- ปริญญาตรีสาขาการเงิน การบัญชี เศรษฐศาสตร์ หรือวิศวกรรมอุตสาหการ (ยินดีรับบัณฑิตจบใหม่)\n- มีทักษะการใช้ Microsoft Excel ขั้นกลาง-สูง (PivotTable, XLOOKUP, Financial Formulas)\n- สามารถปฏิบัติงานประจำสำนักงานในเขตเมืองระยองได้',
    required_skills_th: 'วิเคราะห์งบประมาณ (FP&A), Cost Control, Financial Modeling เบื้องต้น, Excel ขั้นสูง, Power BI',
    benefits_th:
      '- ค่าตอบแทน 24,000 - 31,000 บาท/เดือน พร้อมโบนัสจบสัญญาจ้าง\n- ค่าช่วยเหลือนที่พักต่างจังหวัด 3,000 บาท/เดือน และประกันสุขภาพกลุ่ม\n- โอกาสปรับเป็นพนักงานประจำตามผลการปฏิบัติงาน',
    title_en: 'Junior Financial Planning & Cost Analyst (12-Month Contract)',
    description_en:
      'Rayong Petrochem Services Co., Ltd. (fictional demo company) is hiring a Junior Financial Planning & Cost Analyst on a 12-month renewable contract to track project budgets, cash-flow forecasts, and cost variances in Rayong.',
    responsibilities_en:
      '- Prepare monthly project cost tracking and Budget vs. Actual variance reports\n- Assist project managers in reviewing procurement cost estimates and billing milestones\n- Build clean Excel spreadsheets and Power BI cost summaries for management review',
    qualifications_en:
      '- Bachelor’s degree in Finance, Accounting, Economics, or related quantitative discipline\n- Strong proficiency in Microsoft Excel (XLOOKUP, PivotTables, basic financial modeling)\n- Willing to relocate or commute to Mueang Rayong (housing allowance provided)',
    required_skills_en: 'Budgeting & Forecasting, Cost Analysis, Advanced Excel, Power BI, Financial Reporting',
    benefits_en:
      '- Contract salary 24,000 - 31,000 THB/month + contract completion bonus\n- 3,000 THB/month housing allowance in Rayong & medical coverage\n- Strong pathway to permanent conversion',
    category: 'Finance & Accounting',
    location: 'อ.เมืองระยอง • โซนมาบตาพุด',
    province: 'ระยอง',
    status: 'open',
    company_name: 'Rayong Petrochem Services Co., Ltd.',
    company_logo: 'RP',
    employer_id: 'emp-demo-18',
    salary_range: '24,000 - 31,000 บาท/เดือน',
    work_type: 'Contract',
    application_deadline: '2026-12-15T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-26T15:30:00.000Z',
    updated_at: '2026-10-26T15:30:00.000Z',
  },

  // ============================================================================
  // 5. GRAPHIC DESIGN & CREATIVE MEDIA (3 Listings: job-24, job-25, job-26)
  // ============================================================================
  {
    id: 'job-24',
    title: 'นักออกแบบกราฟิก',
    description:
      'เวลเวทเฟรม ครีเอทีฟ เฮาส์ (สตูดิโอออกแบบจำลอง) เปิดรับสมัคร นักออกแบบกราฟิก (ยินดีรับนักศึกษาจบใหม่) ร่วมสร้างสรรค์งานออกแบบ Key Visual, สื่อโซเชียลมีเดีย, บรรจุภัณฑ์ และอัตลักษณ์แบรนด์ให้กับลูกค้ากลุ่มแฟชั่นและคาเฟ่ไลฟ์สไตล์',
    content_language: 'th',
    title_th: 'นักออกแบบกราฟิก',
    description_th:
      'เวลเวทเฟรม ครีเอทีฟ เฮาส์ (สตูดิโอออกแบบจำลอง) เปิดรับสมัคร นักออกแบบกราฟิก (ยินดีรับนักศึกษาจบใหม่) ร่วมสร้างสรรค์งานออกแบบ Key Visual, สื่อโซเชียลมีเดีย, บรรจุภัณฑ์ และอัตลักษณ์แบรนด์ให้กับลูกค้ากลุ่มแฟชั่นและคาเฟ่ไลฟ์สไตล์',
    responsibilities_th:
      '- ออกแบบสื่อกราฟิกสำหรับแคมเปญออนไลน์ (Social Media Banner, Rich Menu, Digital Ads) ตามอัตลักษณ์ของแต่ละแบรนด์\n- ร่วมพัฒนาแนวคิด Key Visual, โลโก้ และงานออกแบบสิ่งพิมพ์/แพ็กเกจจิ้งร่วมกับ Art Director\n- จัดเตรียมไฟล์อาร์ตเวิร์กสำหรับส่งโรงพิมพ์และสื่อดิจิทัลอย่างถูกต้องตามมาตรฐานสี',
    qualifications_th:
      '- ปริญญาตรีสาขาออกแบบนิเทศศิลป์ ศิลปกรรมศาสตร์ มัลติมีเดียดีไซน์ หรือสาขาที่เกี่ยวข้อง\n- เชี่ยวชาญโปรแกรม Adobe Illustrator, Photoshop และสามารถใช้ Figma หรือ After Effects เบื้องต้นได้\n- มี Portfolio รวบรวมผลงานออกแบบช่วงเรียนหรือฟรีแลนซ์แนบมาพร้อมใบสมัคร',
    required_skills_th: 'Adobe Illustrator, Adobe Photoshop, Brand Identity, Key Visual, Packaging Design, Typography',
    benefits_th:
      '- เงินเดือน 19,000 - 26,000 บาท/เดือน\n- เครื่อง iMac / MacBook พร้อมลิขสิทธิ์ Adobe Creative Cloud แท้ครบชุด\n- ทำงานแบบ Hybrid ย่านลาดพร้าว-จตุจักร บรรยากาศสตูดิโอเป็นกันเองแต่งกายอิสระ',
    category: 'Graphic Design & Creative Media',
    location: 'เขตจตุจักร • ห้าแยกลาดพร้าว (ใกล้ BTS ห้าแยกลาดพร้าว • Hybrid)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'VelvetFrame Creative House',
    company_logo: 'VF',
    employer_id: 'emp-demo-19',
    salary_range: '19,000 - 26,000 บาท/เดือน',
    work_type: 'Full-time',
    application_deadline: '2026-12-14T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-31T13:20:00.000Z',
    updated_at: '2026-10-31T13:20:00.000Z',
  },
  {
    id: 'job-25',
    title: 'Graphic Designer (Internship)',
    description:
      'SiamType & Motion Lab (fictional demo design studio in Chiang Mai) is offering a paid Graphic Designer internship for creative undergraduates passionate about visual identity, editorial layout, and motion graphics.',
    content_language: 'en',
    title_en: 'Graphic Designer (Internship)',
    description_en:
      'SiamType & Motion Lab (fictional demo design studio in Chiang Mai) is offering a paid Graphic Designer internship for creative undergraduates passionate about visual identity, editorial layout, and motion graphics.',
    responsibilities_en:
      '- Collaborate with senior designers to create brand identity moodboards, social visual kits, and poster layouts\n- Assist with typography refinement and vector illustration assets in Adobe Illustrator and Figma\n- Animate simple 2D logo reveals and social loops in After Effects',
    qualifications_en:
      '- 3rd or 4th year student in Communication Design, Graphic Design, Visual Arts, or Digital Media\n- Online portfolio (Behance, Notion, PDF, or website) showcasing strong composition and color sense\n- Proficient in Adobe Illustrator & Photoshop; basic Figma or After Effects is a plus',
    required_skills_en: 'Graphic Design, Adobe Illustrator, Photoshop, Figma, Typography, Motion Basics',
    benefits_en:
      '- Monthly stipend of 7,000 - 10,000 THB\n- Weekly portfolio critique & 1-on-1 creative mentorship\n- Hybrid studio in Suthep (near Chiang Mai University) with specialty coffee bar',
    category: 'Graphic Design & Creative Media',
    location: 'Mueang Chiang Mai • Suthep Subdistrict (Hybrid)',
    province: 'เชียงใหม่',
    status: 'open',
    company_name: 'SiamType & Motion Lab',
    company_logo: 'SM',
    employer_id: 'emp-demo-20',
    salary_range: '7,000 - 10,000 THB/month',
    work_type: 'Internship',
    application_deadline: '2026-12-09T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-28T14:45:00.000Z',
    updated_at: '2026-10-28T14:45:00.000Z',
  },
  {
    id: 'job-26',
    title: 'นักตัดต่อวิดีโอและโมชันกราฟิก (Video Editor & Motion Creator - Contract)',
    description:
      'ตัดต่อวิดีโอสั้นแนวตั้ง (Reels / TikTok / Shorts) และใส่โมชันกราฟิกประกอบรายการท่องเที่ยวและรีวิวโรงแรมในพื้นที่ชลบุรี-พัทยา สัญญาจ้างโปรเจกต์ 6 เดือน',
    content_language: 'both',
    title_th: 'นักตัดต่อวิดีโอและโมชันกราฟิก (Video Editor & Motion Creator - Contract)',
    description_th:
      'ไทด์เวฟ มีเดีย โปรดักชัน (สตูดิโอจำลอง) เปิดรับนักตัดต่อวิดีโอและโมชันกราฟิก (สัญญาจ้าง 6 เดือน) ร่วมผลิตคอนเทนต์วิดีโอท่องเที่ยวและไลฟ์สไตล์ชายทะเลในจังหวัดชลบุรี',
    responsibilities_th:
      '- ตัดต่อวิดีโอสั้นและคลิปสารคดีเชิงท่องเที่ยวด้วย Premiere Pro / DaVinci Resolve\n- ออกแบบ Lower Thirds, ซับไตเติล และ Motion Graphics ประกอบด้วย After Effects\n- เกลี่ยสี (Color Grading) และปรับแต่งเสียงประกอบให้มีคุณภาพน่าติดตาม',
    qualifications_th:
      '- ปริญญาตรีหรืออนุปริญญาสาขาภาพยนตร์และสื่อดิจิทัล นิเทศศาสตร์ หรือผู้มีผลงานตัดต่อชัดเจน\n- มีความคิดสร้างสรรค์ในการเล่าเรื่อง (Storytelling) ให้กระชับทันสมัย',
    required_skills_th: 'Premiere Pro, After Effects, DaVinci Resolve, Video Editing, Color Grading',
    benefits_th:
      '- ค่าตอบแทนสัญญาจ้าง 20,000 - 27,000 บาท/เดือน\n- อุปกรณ์กล้องและสตูดิโอตัดต่อครบครัน',
    title_en: 'Video Editor & Motion Graphics Creator (6-Month Contract)',
    description_en:
      'TideWave Media Production (fictional demo studio in Chonburi) sought a Video Editor & Motion Graphics Creator for a 6-month coastal hospitality media campaign.',
    responsibilities_en:
      '- Edit engaging short-form reels and brand documentaries using Adobe Premiere Pro or DaVinci Resolve\n- Create clean title animations and motion overlays in After Effects\n- Perform audio mixing and color grading for web delivery',
    qualifications_en:
      '- Degree or strong showreel in Film, Digital Media, Animation, or Visual Communication\n- Demonstrated storytelling rhythm for social and YouTube formats',
    required_skills_en: 'Adobe Premiere Pro, After Effects, DaVinci Resolve, Motion Graphics, Video Storytelling',
    benefits_en:
      '- Contract compensation 20,000 - 27,000 THB/month\n- Flexible hybrid editing schedule in Bang Lamung, Chonburi',
    category: 'Graphic Design & Creative Media',
    location: 'อ.บางละมุง • พัทยาเหนือ (Hybrid)',
    province: 'ชลบุรี',
    status: 'closed',
    company_name: 'TideWave Media Production',
    company_logo: 'TM',
    employer_id: 'emp-2',
    salary_range: '20,000 - 27,000 บาท/เดือน',
    work_type: 'Contract',
    application_deadline: '2026-10-28T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-18T10:00:00.000Z',
    updated_at: '2026-10-29T09:00:00.000Z',
  },

  // ============================================================================
  // 6. ENGINEERING (3 Listings: job-27, job-28, job-29)
  // ============================================================================
  {
    id: 'job-27',
    title: 'วิศวกรโยธา',
    description:
      'บริษัท บูรพา ซีวิล แอนด์ อินฟราสตรัคเจอร์ จำกัด (มหาชน) (บริษัทก่อสร้างจำลอง) เปิดรับสมัคร วิศวกรโยธา ประจำโครงการก่อสร้างอาคารอนุรักษ์พลังงานในอำเภอปากช่อง จังหวัดนครราชสีมา ยินดีรับบัณฑิตจบใหม่ที่มีใบอนุญาต กว. หรือกำลังยื่นขอ',
    content_language: 'th',
    title_th: 'วิศวกรโยธา',
    description_th:
      'บริษัท บูรพา ซีวิล แอนด์ อินฟราสตรัคเจอร์ จำกัด (มหาชน) (บริษัทก่อสร้างจำลอง) เปิดรับสมัคร วิศวกรโยธา ประจำโครงการก่อสร้างอาคารอนุรักษ์พลังงานในอำเภอปากช่อง จังหวัดนครราชสีมา ยินดีรับบัณฑิตจบใหม่ที่มีใบอนุญาต กว. หรือกำลังยื่นขอ',
    responsibilities_th:
      '- ควบคุมดูแลงานก่อสร้างโครงสร้างและสถาปัตยกรรมหน้างานให้เป็นไปตามแบบวิศวกรรมและมาตรฐานความปลอดภัย\n- ถอดแบบประมาณราคาวัสดุก่อสร้าง (BOQ) และตรวจสอบความก้าวหน้าของผู้รับเหมาช่วงรายสัปดาห์\n- จัดทำรายงานประจำวัน (Daily Site Report) และประสานงานแก้ไขปัญหาหน้างานร่วมกับวิศวกรอาวุโส',
    qualifications_th:
      '- สำเร็จการศึกษาระดับปริญญาตรี สาขาวิศวกรรมโยธา (ยินดีรับนักศึกษาจบใหม่)\n- สามารถใช้โปรแกรม AutoCAD, SketchUp หรือ Revit เบื้องต้น และอ่านแบบก่อสร้างได้แม่นยำ\n- มีใบประกอบวิชาชีพวิศวกรรมควบคุม (ภาคีวิศวกรโยธา - กว.) หรืออยู่ระหว่างดำเนินการสอบ',
    required_skills_th: 'วิศวกรรมโยธา, AutoCAD, ถอดแบบประมาณราคา (BOQ), ควบคุมงานก่อสร้าง, มาตรฐานความปลอดภัย',
    benefits_th:
      '- เงินเดือน 23,000 - 30,000 บาท/เดือน + ค่าวิชาชีพ กว. + เบี้ยเลี้ยงประจำไซด์งาน\n- ที่พักสวัสดิการฟรีใกล้โครงการปากช่อง ประกันอุบัติเหตุ และกองทุนสำรองเลี้ยงชีพ\n- การฝึกอบรมเทคโนโลยี BIM จากทีมวิศวกรโครงการ',
    category: 'Engineering',
    location: 'อ.ปากช่อง • โครงการเขาใหญ่ กรีนพาร์ค',
    province: 'นครราชสีมา',
    status: 'open',
    company_name: 'Burapha Civil & Infrastructure PCL',
    company_logo: 'BC',
    employer_id: 'emp-demo-21',
    salary_range: '23,000 - 30,000 บาท/เดือน',
    work_type: 'Full-time',
    application_deadline: '2026-12-20T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-11-01T06:20:00.000Z',
    updated_at: '2026-11-01T06:20:00.000Z',
  },
  {
    id: 'job-28',
    title: 'Civil Engineering Intern',
    description:
      'MetroStruct Engineering Consultants (fictional demo consultancy in Samut Prakan) welcomes 3rd- and 4th-year engineering students as a Civil Engineering Intern to gain practical experience in BIM 3D structural modeling, quantity takeoffs, and site inspection.',
    content_language: 'en',
    title_en: 'Civil Engineering Intern',
    description_en:
      'MetroStruct Engineering Consultants (fictional demo consultancy in Samut Prakan) welcomes 3rd- and 4th-year engineering students as a Civil Engineering Intern to gain practical experience in BIM 3D structural modeling, quantity takeoffs, and site inspection.',
    responsibilities_en:
      '- Assist structural engineers in drafting reinforcement drawings and 3D BIM models using AutoCAD and Autodesk Revit\n- Perform preliminary quantity takeoffs (BOQ) and material specification checks\n- Accompany senior project engineers on weekly quality inspections at commercial building sites in Bang Phli',
    qualifications_en:
      '- 3rd or 4th year undergraduate pursuing a B.Eng. in Civil or Structural Engineering\n- Working knowledge of AutoCAD, structural mechanics, and Microsoft Excel; Revit familiarity is a plus\n- Safety-conscious, eager to learn both office design calculation and field inspection',
    required_skills_en: 'AutoCAD, Autodesk Revit (BIM), Structural Drawing, Quantity Takeoff (BOQ), Site Inspection',
    benefits_en:
      '- Monthly internship stipend of 8,500 - 12,000 THB\n- Personal protective equipment (PPE) provided & site transport covered\n- Mentorship by licensed senior professional engineers (PE)',
    category: 'Engineering',
    location: 'Bang Phli District • Bang Na-Trad Km.12',
    province: 'สมุทรปราการ',
    status: 'open',
    company_name: 'MetroStruct Engineering Consultants',
    company_logo: 'MS',
    employer_id: 'emp-demo-22',
    salary_range: '8,500 - 12,000 THB/month',
    work_type: 'Internship',
    application_deadline: '2026-12-12T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-29T08:15:00.000Z',
    updated_at: '2026-10-29T08:15:00.000Z',
  },
  {
    id: 'job-29',
    title: 'นักศึกษาสหกิจศึกษาวิศวกรรมไฟฟ้าและระบบอัตโนมัติ (Automation & PLC Co-op)',
    description:
      'ร่วมฝึกสหกิจศึกษาในสายงานระบบควบคุมอัตโนมัติในโรงงาน (PLC / SCADA / Industrial IoT) ทดสอบตู้ควบคุมไฟฟ้า และเก็บข้อมูลเพิ่มประสิทธิภาพเครื่องจักร ณ อ.ศรีราชา จ.ชลบุรี',
    content_language: 'both',
    title_th: 'นักศึกษาสหกิจศึกษาวิศวกรรมไฟฟ้าและระบบอัตโนมัติ (Automation & PLC Co-op)',
    description_th:
      'อีสเทิร์น ซีบอร์ด ออโตเมชัน (บริษัทวิศวกรรมจำลอง) เปิดรับนักศึกษาสหกิจศึกษาสายวิศวกรรมไฟฟ้า วัดคุม หรือเมคคาทรอนิกส์ ร่วมพัฒนาโปรแกรม PLC/HMI และระบบ Industrial IoT ในเขตแหลมฉบัง-ศรีราชา',
    responsibilities_th:
      '- ช่วยทีมวิศวกรเขียนและจำลองการทำงานของโปรแกรม PLC (Siemens / Mitsubishi) และหน้าจอ HMI\n- ตรวจสอบแบบวงจรไฟฟ้าตู้คอนโทรลด้วย AutoCAD Electrical และร่วมทดสอบหน้างาน (FAT)\n- บันทึกข้อมูลการใช้พลังงานและจัดทำโครงงานปรับปรุงประสิทธิภาพสายการผลิต',
    qualifications_th:
      '- นักศึกษาชั้นปีที่ 4 สาขาวิศวกรรมไฟฟ้า วิศวกรรมระบบควบคุม วิศวกรรมเมคคาทรอนิกส์ หรือสาขาที่เกี่ยวข้อง\n- สามารถปฏิบัติงานสหกิจศึกษาต่อเนื่อง 16 สัปดาห์ มีพื้นฐาน Ladder Diagram หรือไมโครคอนโทรลเลอร์',
    required_skills_th: 'PLC Programming, SCADA / HMI, AutoCAD Electrical, Industrial IoT, วงจรไฟฟ้ากำลังและควบคุม',
    benefits_th:
      '- เบี้ยเลี้ยงสหกิจศึกษา 10,000 - 14,000 บาท/เดือน\n- รถรับส่งสายศรีราชา-อ่าวอุดม และอาหารกลางวันฟรี\n- วิศวกรที่ปรึกษาดูแลโครงงานสหกิจศึกษาอย่างใกล้ชิด',
    title_en: 'Electrical & Industrial Automation Co-op Student (PLC / IIoT)',
    description_en:
      'Eastern Seaboard Automation Co., Ltd. (fictional demo integrator in Si Racha, Chonburi) is looking for a 4th-year Co-op student to work on PLC/SCADA programming, control panel testing, and smart factory IIoT dashboards.',
    responsibilities_en:
      '- Support automation engineers in configuring PLC logic (Mitsubishi / Siemens) and HMI screens\n- Assist with electrical schematic updates in AutoCAD Electrical and Factory Acceptance Testing (FAT)\n- Complete a practical Co-op improvement project on machine OEE monitoring',
    qualifications_en:
      '- 4th-year undergraduate in Electrical, Control, Instrumentation, or Mechatronics Engineering\n- Basic understanding of PLC Ladder Logic, sensors, and industrial safety standards',
    required_skills_en: 'PLC Ladder Logic, HMI / SCADA, AutoCAD Electrical, Sensors & Actuators, Industrial IoT',
    benefits_en:
      '- Co-op allowance 10,000 - 14,000 THB/month\n- Shuttle bus from Si Racha / Kasetsart Si Racha campus + free lunch\n- Priority consideration for full-time Automation Engineer roles',
    category: 'Engineering',
    location: 'อ.ศรีราชา • โซนแหลมฉบัง',
    province: 'ชลบุรี',
    status: 'open',
    company_name: 'Eastern Seaboard Automation Co., Ltd.',
    company_logo: 'EA',
    employer_id: 'emp-5',
    salary_range: '10,000 - 14,000 บาท/เดือน',
    work_type: 'Co-op',
    application_deadline: '2026-12-18T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-27T11:20:00.000Z',
    updated_at: '2026-10-27T11:20:00.000Z',
  },

  // ============================================================================
  // 7. HEALTHCARE & MEDICAL ADMINISTRATION (3 Listings: job-30, job-31, job-32)
  // ============================================================================
  {
    id: 'job-30',
    title: 'เจ้าหน้าที่บริหารงานโรงพยาบาลและประสานงานสิทธิ์ผู้ป่วย',
    description:
      'ศูนย์การแพทย์ธนบุรี เวลเนส (สถานพยาบาลจำลองสำหรับสาธิตระบบ) เปิดรับสมัครบัณฑิตจบใหม่ตำแหน่ง เจ้าหน้าที่บริหารงานโรงพยาบาลและประสานงานสิทธิ์ผู้ป่วย ดูแลการต้อนรับ นัดหมายแพทย์ และประสานงานสิทธิ์ประกันสุขภาพอย่างอบอุ่นและแม่นยำ',
    content_language: 'th',
    title_th: 'เจ้าหน้าที่บริหารงานโรงพยาบาลและประสานงานสิทธิ์ผู้ป่วย',
    description_th:
      'ศูนย์การแพทย์ธนบุรี เวลเนส (สถานพยาบาลจำลองสำหรับสาธิตระบบ) เปิดรับสมัครบัณฑิตจบใหม่ตำแหน่ง เจ้าหน้าที่บริหารงานโรงพยาบาลและประสานงานสิทธิ์ผู้ป่วย ดูแลการต้อนรับ นัดหมายแพทย์ และประสานงานสิทธิ์ประกันสุขภาพอย่างอบอุ่นและแม่นยำ',
    responsibilities_th:
      '- ลงทะเบียนประวัติผู้รับบริการ นัดหมายตารางตรวจแพทย์เฉพาะทางผ่านระบบสารสนเทศโรงพยาบาล (HIS)\n- ตรวจสอบความคุ้มครองและประสานงานเคลมประกันสุขภาพ (Fax Claim) กับบริษัทประกันภัยชั้นนำ\n- ให้คำแนะนำขั้นตอนการรับบริการด้วยความสุภาพ รวดเร็ว และคำนึงถึงจริยธรรมข้อมูลผู้ป่วย',
    qualifications_th:
      '- ปริญญาตรีสาขาบริหารงานโรงพยาบาล สาธารณสุขศาสตร์ บริหารธุรกิจ หรือการจัดการงานบริการ (ยินดีรับเด็กจบใหม่)\n- มีใจรักงานบริการ มีความละเอียดรอบคอบ และสื่อสารประสานงานกับทีมแพทย์-พยาบาลได้ดี\n- สามารถปฏิบัติงานเป็นกะตามตารางเวลาทำการของศูนย์การแพทย์ได้ (5 วัน/สัปดาห์)',
    required_skills_th: 'ระบบสารสนเทศโรงพยาบาล (HIS), ประสานงานประกันสุขภาพ, บริหารจัดการนัดหมาย, จิตบริการ (Service Mind), Microsoft Office',
    benefits_th:
      '- เงินเดือน 18,500 - 24,000 บาท/เดือน + ค่าภาษา/ค่ากะ\n- สวัสดิการรักษาพยาบาลสำหรับพนักงานและส่วนลดสำหรับครอบครัวสายตรง\n- ชุดยูนิฟอร์ม ประกันสังคม กองทุนสำรองเลี้ยงชีพ และใกล้ BTS วงเวียนใหญ่',
    category: 'Healthcare & Medical Administration',
    location: 'เขตธนบุรี (ใกล้ BTS วงเวียนใหญ่)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'Thonburi Wellness & Medical Center',
    company_logo: 'TW',
    employer_id: 'emp-demo-23',
    salary_range: '18,500 - 24,000 บาท/เดือน',
    work_type: 'Full-time',
    application_deadline: '2026-12-16T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-11-01T05:45:00.000Z',
    updated_at: '2026-11-01T05:45:00.000Z',
  },
  {
    id: 'job-31',
    title: 'International Patient Services Coordinator',
    description:
      'Lanna Care International Hospital (fictional demo healthcare center in Chiang Rai) is hiring an empathetic International Patient Services Coordinator to assist expatriate and international visitors with medical appointments, English interpretation, and insurance documentation.',
    content_language: 'en',
    title_en: 'International Patient Services Coordinator',
    description_en:
      'Lanna Care International Hospital (fictional demo healthcare center in Chiang Rai) is hiring an empathetic International Patient Services Coordinator to assist expatriate and international visitors with medical appointments, English interpretation, and insurance documentation.',
    responsibilities_en:
      '- Welcome international patients, facilitate outpatient registration, and schedule specialist consultations\n- Provide clear English–Thai communication support between patients, physicians, and pharmacy staff\n- Coordinate medical certificates and direct-billing pre-authorizations with international health insurers',
    qualifications_en:
      '- Bachelor’s degree in Public Health, Healthcare Management, English, Nursing Science, or Hospitality (fresh graduates encouraged to apply)\n- Fluent spoken and written English and Thai; additional Chinese or Burmese language skill is an advantage\n- Calm, compassionate demeanor with strict respect for patient confidentiality (PDPA)',
    required_skills_en: 'English-Thai Interpretation, Patient Coordination, Medical Terminology Basics, Insurance Pre-Auth, Service Excellence',
    benefits_en:
      '- Salary 21,000 - 28,000 THB/month + language proficiency allowance\n- Comprehensive medical & wellness checkup benefits\n- Structured medical terminology training in Mueang Chiang Rai',
    category: 'Healthcare & Medical Administration',
    location: 'Mueang Chiang Rai District • Phahonyothin Road',
    province: 'เชียงราย',
    status: 'open',
    company_name: 'Lanna Care International Hospital',
    company_logo: 'LC',
    employer_id: 'emp-demo-24',
    salary_range: '21,000 - 28,000 THB/month',
    work_type: 'Full-time',
    application_deadline: '2026-12-22T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-30T10:10:00.000Z',
    updated_at: '2026-10-30T10:10:00.000Z',
  },
  {
    id: 'job-32',
    title: 'นักศึกษาฝึกงานเวชระเบียนและข้อมูลสุขภาพดิจิทัล (Health Data Admin Intern)',
    description:
      'ร่วมฝึกงานด้านการจัดระบบเวชระเบียนอิเล็กทรอนิกส์ (EMR) ตรวจสอบความครบถ้วนของข้อมูลสุขภาพตามมาตรฐาน PDPA และจัดทำสถิติผู้รับบริการรายเดือน ณ จ.ปทุมธานี',
    content_language: 'both',
    title_th: 'นักศึกษาฝึกงานเวชระเบียนและข้อมูลสุขภาพดิจิทัล (Health Data Admin Intern)',
    description_th:
      'ศูนย์ตรวจวิเคราะห์ทางการแพทย์ปทุม (องค์กรจำลอง) เปิดรับนักศึกษาฝึกงานดูแลความถูกต้องของฐานข้อมูลเวชระเบียนอิเล็กทรอนิกส์ (EMR) และสนับสนุนงานธุรการคลินิกตรวจสุขภาพประจำปี',
    responsibilities_th:
      '- ตรวจสอบความถูกต้องของการบันทึกข้อมูลประวัติการตรวจสุขภาพในระบบอิเล็กทรอนิกส์\n- จัดเตรียมรายงานสรุปสถิติการให้บริการรายสัปดาห์ด้วย Microsoft Excel\n- ประสานงานจัดส่งเล่มรายงานผลตรวจสุขภาพให้ลูกค้าองค์กรภายใต้มาตรฐานคุ้มครองข้อมูลส่วนบุคคล (PDPA)',
    qualifications_th:
      '- กำลังศึกษาชั้นปีที่ 3–4 สาขาสาธารณสุขศาสตร์ เวชระเบียน สารสนเทศสุขภาพ หรือบริหารธุรกิจ\n- มีความรอบคอบสูง พิมพ์สัมผัสและใช้งาน Excel ได้คล่องแคล่ว',
    required_skills_th: 'เวชระเบียนอิเล็กทรอนิกส์ (EMR), PDPA ข้อมูลสุขภาพ, Microsoft Excel, งานธุรการทางการแพทย์',
    benefits_th:
      '- เบี้ยเลี้ยงฝึกงาน 6,000 - 8,500 บาท/เดือน\n- อาหารกลางวันสวัสดิการ และหนังสือรับรองผ่านการฝึกงานด้านบริหารข้อมูลสุขภาพ',
    title_en: 'Medical Records & Health Data Administration Intern',
    description_en:
      'Pathum Medical Diagnostics Center (fictional demo healthcare facility in Pathum Thani) invites undergraduates to intern with our Health Information team managing electronic medical records (EMR) and corporate checkup coordination.',
    responsibilities_en:
      '- Verify accuracy and completeness of digital checkup records in the Electronic Medical Record (EMR) system\n- Compile anonymized weekly service volume summaries in Excel\n- Assist the corporate wellness team in preparing confidential health checkup packages compliant with PDPA',
    qualifications_en:
      '- 3rd or 4th year student in Public Health, Health Informatics, Medical Records, or Business Administration\n- High attention to data accuracy and strong Microsoft Excel fundamentals',
    required_skills_en: 'Electronic Medical Records (EMR), Health Data Accuracy, PDPA Compliance, Microsoft Excel',
    benefits_en:
      '- Internship stipend 6,000 - 8,500 THB/month\n- Complimentary staff lunch near Rangsit campus zone & official certificate',
    category: 'Healthcare & Medical Administration',
    location: 'อ.คลองหลวง • โซนรังสิต',
    province: 'ปทุมธานี',
    status: 'open',
    company_name: 'Pathum Medical Diagnostics Center',
    company_logo: 'PM',
    employer_id: 'emp-demo-23',
    salary_range: '6,000 - 8,500 บาท/เดือน',
    work_type: 'Internship',
    application_deadline: '2026-12-05T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-23T09:00:00.000Z',
    updated_at: '2026-10-23T09:00:00.000Z',
  },

  // ============================================================================
  // 8. HOSPITALITY & TOURISM (3 Listings: job-33, job-34, job-35)
  // ============================================================================
  {
    id: 'job-33',
    title: 'เจ้าหน้าที่ประสานงานโรงแรม',
    description:
      'โรงแรมแม่กก เฮอริเทจ บูทีค (โรงแรมจำลองในจังหวัดเชียงราย) เปิดรับสมัคร เจ้าหน้าที่ประสานงานโรงแรม (ยินดีรับบัณฑิตจบใหม่) ดูแลการต้อนรับผู้เข้าพัก ประสานงานห้องพักและกิจกรรมท่องเที่ยวเชิงวัฒนธรรมล้านนา',
    content_language: 'th',
    title_th: 'เจ้าหน้าที่ประสานงานโรงแรม',
    description_th:
      'โรงแรมแม่กก เฮอริเทจ บูทีค (โรงแรมจำลองในจังหวัดเชียงราย) เปิดรับสมัคร เจ้าหน้าที่ประสานงานโรงแรม (ยินดีรับบัณฑิตจบใหม่) ดูแลการต้อนรับผู้เข้าพัก ประสานงานห้องพักและกิจกรรมท่องเที่ยวเชิงวัฒนธรรมล้านนา',
    responsibilities_th:
      '- ดูแลขั้นตอนการเช็กอิน-เช็กเอาต์ และตรวจสอบคำขอพิเศษของผู้เข้าพักผ่านระบบบริหารจัดการโรงแรม (PMS)\n- ประสานงานระหว่างแผนกต้อนรับ แผนกแม่บ้าน และห้องอาหาร เพื่อมอบประสบการณ์การพักผ่อนที่ราบรื่น\n- แนะนำเส้นทางท่องเที่ยว คาเฟ่ และกิจกรรมเชิงวัฒนธรรมในจังหวัดเชียงรายแก่ผู้เข้าพักทั้งชาวไทยและต่างชาติ',
    qualifications_th:
      '- ปริญญาตรีหรืออนุปริญญาสาขาการจัดการโรงแรม การท่องเที่ยว ภาษาอังกฤษ หรือสาขาที่เกี่ยวข้อง\n- บุคลิกภาพยิ้มแย้ม มีใจรักงานบริการ และสามารถสื่อสารภาษาอังกฤษในชีวิตประจำวันได้\n- สามารถทำงานเป็นกะตามตารางโรงแรมได้ (หยุด 6 วัน/เดือน พร้อมวันหยุดนักขัตฤกษ์ชดเชย)',
    required_skills_th: 'การบริการส่วนหน้า (Front Office), ระบบ PMS โรงแรม, การสื่อสารภาษาอังกฤษ, การประสานงานบริการ, การแก้ไขปัญหาเฉพาะหน้า',
    benefits_th:
      '- เงินเดือนฐาน 16,500 - 21,000 บาท + Service Charge เฉลี่ยต่อเดือน\n- อาหารฟรี 2 มื้อต่อวันทำงาน ชุดยูนิฟอร์มซักรีดฟรี และประกันกลุ่ม\n- โอกาสเติบโตสู่ตำแหน่ง Front Office Supervisor',
    category: 'Hospitality & Tourism',
    location: 'อ.เมืองเชียงราย • ริมแม่น้ำกก',
    province: 'เชียงราย',
    status: 'open',
    company_name: 'Mae Kok Heritage Boutique Hotel',
    company_logo: 'MK',
    employer_id: 'emp-demo-24',
    salary_range: '16,500 - 21,000 บาท/เดือน + Service Charge',
    work_type: 'Full-time',
    application_deadline: '2026-12-18T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-31T08:10:00.000Z',
    updated_at: '2026-10-31T08:10:00.000Z',
  },
  {
    id: 'job-34',
    title: 'Guest Relations Officer',
    description:
      'Andaman Azure Resort & Spa Phuket (fictional demo 5-star beachfront resort) is seeking a warm, articulate Guest Relations Officer to curate memorable stays, handle VIP arrivals, and personalize resort experiences in Phuket.',
    content_language: 'en',
    title_en: 'Guest Relations Officer',
    description_en:
      'Andaman Azure Resort & Spa Phuket (fictional demo 5-star beachfront resort) is seeking a warm, articulate Guest Relations Officer to curate memorable stays, handle VIP arrivals, and personalize resort experiences in Phuket.',
    responsibilities_en:
      '- Greet arriving guests, conduct personalized villa check-ins, and share resort wellness & dining highlights\n- Anticipate guest preferences for anniversaries, family vacations, and island excursions\n- Resolve guest inquiries promptly in collaboration with Housekeeping, Concierge, and F&B teams',
    qualifications_en:
      '- Bachelor’s degree in Hospitality & Tourism Management, International Relations, Liberal Arts, or related field (entry-level graduates welcome)\n- Fluent English communication; conversational Mandarin, Russian, German, or French is a bonus\n- Positive energy, cultural sensitivity, and willingness to work in Thalang, Phuket',
    required_skills_en: 'Luxury Guest Relations, Opera PMS, Cross-Cultural Communication, Concierge Services, Problem Resolution',
    benefits_en:
      '- Base salary 19,000 - 26,000 THB/month + guaranteed minimum Service Charge\n- Complimentary staff accommodation in Thalang, 3 daily duty meals, and uniform laundry\n- Group health insurance and global hospitality training pathways',
    category: 'Hospitality & Tourism',
    location: 'Thalang District • Bang Tao Beach',
    province: 'ภูเก็ต',
    status: 'open',
    company_name: 'Andaman Azure Resort & Spa Phuket',
    company_logo: 'AA',
    employer_id: 'emp-demo-25',
    salary_range: '19,000 - 26,000 THB/month + Service Charge',
    work_type: 'Full-time',
    application_deadline: '2026-12-28T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-11-01T05:15:00.000Z',
    updated_at: '2026-11-01T05:15:00.000Z',
  },
  {
    id: 'job-35',
    title: 'นักศึกษาฝึกงานวางแผนทัวร์เชิงอนุรักษ์และอีเวนต์ (Eco-Tourism & MICE Intern)',
    description:
      'ร่วมออกสำรวจเส้นทางท่องเที่ยวชุมชนภาคเหนือ จัดทำโปรแกรมทัวร์รักษ์โลกสองภาษา และช่วยประสานงานกรุ๊ปสัมมนาองค์กร (MICE) ในจังหวัดเชียงใหม่',
    content_language: 'both',
    title_th: 'นักศึกษาฝึกงานวางแผนทัวร์เชิงอนุรักษ์และอีเวนต์ (Eco-Tourism & MICE Intern)',
    description_th:
      'ล้านนา อีโค-เทรลส์ แอนด์ ไมซ์ (บริษัทท่องเที่ยวจำลอง) เปิดรับนักศึกษาฝึกงานที่รักธรรมชาติและงานอีเวนต์ ร่วมออกแบบโปรแกรมท่องเที่ยวคาร์บอนต่ำและดูแลกรุ๊ปดูงานในจังหวัดเชียงใหม่',
    responsibilities_th:
      '- ช่วยจัดทำเอกสารแนะนำโปรแกรมทัวร์เชิงอนุรักษ์ (Itinerary) ทั้งภาษาไทยและภาษาอังกฤษ\n- ประสานงานจองที่พักชุมชน ร้านอาหารท้องถิ่น และยานพาหนะสำหรับคณะเดินทาง\n- ร่วมลงพื้นที่ดูแลความเรียบร้อยของกิจกรรมเวิร์กชอปงานคราฟต์และเดินป่าศึกษาธรรมชาติ',
    qualifications_th:
      '- นักศึกษาชั้นปีที่ 3–4 สาขาการท่องเที่ยวและการโรงแรม การจัดการอีเวนต์ (MICE) หรือมนุษยศาสตร์\n- สื่อสารภาษาอังกฤษระดับดี ชอบทำงานภาคสนามและใส่ใจสิ่งแวดล้อม',
    required_skills_th: 'การจัดทำโปรแกรมทัวร์, งานประสานงาน MICE, การท่องเที่ยวอย่างยั่งยืน, ภาษาอังกฤษเพื่อการท่องเที่ยว',
    benefits_th:
      '- เบี้ยเลี้ยงฝึกงาน 6,500 - 9,000 บาท/เดือน พร้อมเบี้ยเลี้ยงออกทริป\n- ประกันอุบัติเหตุตลอดระยะเวลาฝึกงาน',
    title_en: 'Sustainable Tourism & MICE Operations Intern',
    description_en:
      'Lanna Eco-Trails & MICE Co., Ltd. (fictional demo tour operator in Chiang Mai) offered a hands-on internship designing low-carbon community travel itineraries and supporting corporate retreat logistics.',
    responsibilities_en:
      '- Draft bilingual travel itineraries and sustainability briefing sheets for small-group eco-tours\n- Coordinate bookings with local homestays, artisan workshops, and transport partners\n- Assist tour leaders during corporate MICE retreats in Mae Rim and Chiang Mai',
    qualifications_en:
      '- Undergraduate student in Tourism, Hospitality, Event Management, or Environmental Studies\n- Enthusiastic communicator in Thai and English',
    required_skills_en: 'Itinerary Planning, MICE Coordination, Sustainable Tourism, English Communication',
    benefits_en:
      '- Stipend 6,500 - 9,000 THB/month + field trip per diem & travel insurance',
    category: 'Hospitality & Tourism',
    location: 'อ.แม่ริม / อ.เมืองเชียงใหม่',
    province: 'เชียงใหม่',
    status: 'closed',
    company_name: 'Lanna Eco-Trails & MICE Co., Ltd.',
    company_logo: 'LE',
    employer_id: 'emp-3',
    salary_range: '6,500 - 9,000 บาท/เดือน',
    work_type: 'Internship',
    application_deadline: '2026-10-25T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-16T09:30:00.000Z',
    updated_at: '2026-10-26T12:00:00.000Z',
  },

  // ============================================================================
  // 9. LOGISTICS & SUPPLY CHAIN (2 Listings: job-36, job-37)
  // ============================================================================
  {
    id: 'job-36',
    title: 'Supply Chain & Air Freight Operations Co-op Student',
    description:
      'Suvarnabhumi Global Freight & Logistics (fictional demo logistics provider) invites 4th-year Logistics, Supply Chain, or International Business students to complete a 16-week Co-op placement near Suvarnabhumi Airport, Samut Prakan.',
    content_language: 'en',
    title_en: 'Supply Chain & Air Freight Operations Co-op Student',
    description_en:
      'Suvarnabhumi Global Freight & Logistics (fictional demo logistics provider) invites 4th-year Logistics, Supply Chain, or International Business students to complete a 16-week Co-op placement near Suvarnabhumi Airport, Samut Prakan.',
    responsibilities_en:
      '- Assist air & sea freight coordinators in preparing Air Waybills (AWB), Bill of Lading (B/L), and commercial invoices\n- Track international shipment milestones and update client status dashboards\n- Analyze warehouse order fulfillment lead times as part of your university Co-op project',
    qualifications_en:
      '- 4th-year student in Logistics & Supply Chain Management, International Business, or Industrial Management\n- Basic knowledge of Incoterms 2020, import-export documentation, and Microsoft Excel\n- Good command of English for reading international shipping correspondence',
    required_skills_en: 'Import-Export Documentation, Incoterms 2020, Air & Sea Freight, Supply Chain Analytics, Microsoft Excel',
    benefits_en:
      '- Monthly Co-op stipend of 9,500 - 13,000 THB\n- Free shuttle van from Airport Rail Link Lat Krabang & Bang Na\n- Practical customs & freight forwarding training',
    category: 'Logistics & Supply Chain',
    location: 'Bang Sao Thong • Suvarnabhumi Logistics Park',
    province: 'สมุทรปราการ',
    status: 'open',
    company_name: 'Suvarnabhumi Global Freight & Logistics',
    company_logo: 'SG',
    employer_id: 'emp-demo-26',
    salary_range: '9,500 - 13,000 THB/month',
    work_type: 'Co-op',
    application_deadline: '2026-12-19T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-30T14:00:00.000Z',
    updated_at: '2026-10-30T14:00:00.000Z',
  },
  {
    id: 'job-37',
    title: 'เจ้าหน้าที่ประสานงานโลจิสติกส์และนำเข้า-ส่งออก (Import-Export & Warehouse Officer)',
    description:
      'ประสานงานจองระวางเรือ ตรวจสอบเอกสารศุลกากรขาเข้า-ขาออก และบริหารจัดการสต็อกสินค้าคงคลังด้วยระบบ WMS ณ โซนท่าเรือแหลมฉบัง จ.ชลบุรี ยินดีรับนักศึกษาจบใหม่',
    content_language: 'both',
    title_th: 'เจ้าหน้าที่ประสานงานโลจิสติกส์และนำเข้า-ส่งออก (Import-Export & Warehouse Officer)',
    description_th:
      'แหลมฉบัง พอร์ต ซัพพลาย โซลูชันส์ (บริษัทโลจิสติกส์จำลอง) เปิดรับบัณฑิตจบใหม่สายโลจิสติกส์หรือธุรกิจระหว่างประเทศ ร่วมดูแลเอกสารนำเข้า-ส่งออกและประสานงานคลังสินค้าใกล้ท่าเรือแหลมฉบัง',
    responsibilities_th:
      '- จัดเตรียมและตรวจสอบเอกสาร Shipping (Invoice, Packing List, B/L, Certificate of Origin)\n- ประสานงานสายเรือ ตัวแทนออกของ (Customs Broker) และทีมรถขนส่งเพื่อให้ส่งมอบสินค้าตรงเวลา\n- ตรวจสอบยอดสินค้าคงคลังในระบบ WMS และสรุปรายงานการหมุนเวียนสินค้าประจำสัปดาห์',
    qualifications_th:
      '- ปริญญาตรีสาขาการจัดการโลจิสติกส์และซัพพลายเชน ธุรกิจระหว่างประเทศ หรือบริหารธุรกิจ (ยินดีรับเด็กจบใหม่)\n- เข้าใจเงื่อนไขการค้าระหว่างประเทศ (Incoterms) เบื้องต้น และใช้ Excel ได้คล่องแคล่ว\n- มีความคล่องตัวในการแก้ไขปัญหาและสื่อสารอีเมลภาษาอังกฤษเบื้องต้นได้',
    required_skills_th: 'เอกสารนำเข้า-ส่งออก (Import-Export), Incoterms, ระบบคลังสินค้า (WMS), ประสานงานขนส่ง, Microsoft Excel',
    benefits_th:
      '- เงินเดือน 20,000 - 27,000 บาท/เดือน + ค่าล่วงเวลา (OT)\n- โบนัสประจำปี ประกันสุขภาพกลุ่ม และชุดยูนิฟอร์ม\n- รถรับส่งพนักงานสายชลบุรี-ศรีราชา-แหลมฉบัง',
    title_en: 'Logistics & Import-Export Operations Coordinator (Entry-Level)',
    description_en:
      'Laem Chabang Port Supply Solutions (fictional demo supply chain company) is hiring an entry-level Logistics & Import-Export Coordinator in Si Racha, Chonburi to manage shipping documentation, carrier bookings, and WMS inventory coordination.',
    responsibilities_en:
      '- Prepare and verify import/export shipping documents (Commercial Invoice, Packing List, B/L, Form D/E)\n- Coordinate container booking schedules with ocean carriers, customs brokers, and trucking fleets\n- Reconcile inbound/outbound stock movements in the Warehouse Management System (WMS)',
    qualifications_en:
      '- Bachelor’s degree in Logistics & Supply Chain, International Trade, Maritime Studies, or Business Administration\n- Familiarity with Incoterms, port logistics workflows, and Excel spreadsheets\n- Clear communication in Thai and working written English',
    required_skills_en: 'Import-Export Operations, Ocean Freight, WMS Inventory, Incoterms, Excel',
    benefits_en:
      '- Salary 20,000 - 27,000 THB/month + overtime pay\n- Annual bonus, health & accident insurance, and company shuttle bus in Chonburi',
    category: 'Logistics & Supply Chain',
    location: 'อ.ศรีราชา • โซนท่าเรือแหลมฉบัง',
    province: 'ชลบุรี',
    status: 'open',
    company_name: 'Laem Chabang Port Supply Solutions',
    company_logo: 'LS',
    employer_id: 'emp-demo-26',
    salary_range: '20,000 - 27,000 บาท/เดือน',
    work_type: 'Full-time',
    application_deadline: '2026-12-24T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-29T13:50:00.000Z',
    updated_at: '2026-10-29T13:50:00.000Z',
  },

  // ============================================================================
  // 10. EDUCATION (2 Listings: job-38, job-39)
  // ============================================================================
  {
    id: 'job-38',
    title: 'Academic Program Coordinator & English Tutor (Part-time)',
    description:
      'FutureBridge Language & STEM Academy (fictional demo education center in Chiang Rai) is looking for university seniors or recent graduates to work part-time facilitating small-group English communication workshops and coordinating student learning schedules.',
    content_language: 'en',
    title_en: 'Academic Program Coordinator & English Tutor (Part-time)',
    description_en:
      'FutureBridge Language & STEM Academy (fictional demo education center in Chiang Rai) is looking for university seniors or recent graduates to work part-time facilitating small-group English communication workshops and coordinating student learning schedules.',
    responsibilities_en:
      '- Lead interactive small-group English speaking and academic reading sessions for secondary school learners\n- Assist the Academic Director in organizing weekend STEM & language camp activities\n- Track student attendance, learning progress notes, and parent feedback reports',
    qualifications_en:
      '- 3rd–4th year university student or fresh graduate in Education, English, Applied Linguistics, or International Studies\n- Strong English proficiency (TOEIC 750+ / IELTS 6.5+ or equivalent fluency, certificate optional)\n- Available 15–20 hours per week (weekday evenings and/or Saturdays) in Mueang Chiang Rai',
    required_skills_en: 'English Teaching, Workshop Facilitation, Lesson Planning, Student Mentoring, Classroom Communication',
    benefits_en:
      '- Competitive part-time pay of 9,500 - 15,000 THB/month (250 - 350 THB/hour)\n- Curriculum materials and teaching methodology training provided\n- Ideal campus-adjacent schedule near Nang Lae / Mueang Chiang Rai',
    category: 'Education',
    location: 'Mueang Chiang Rai • Nang Lae (Near University Zone)',
    province: 'เชียงราย',
    status: 'open',
    company_name: 'FutureBridge Language & STEM Academy',
    company_logo: 'FB',
    employer_id: 'emp-demo-27',
    salary_range: '9,500 - 15,000 THB/month',
    work_type: 'Part-time',
    application_deadline: '2026-12-15T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-11-01T07:30:00.000Z',
    updated_at: '2026-11-01T07:30:00.000Z',
  },
  {
    id: 'job-39',
    title: 'เจ้าหน้าที่พัฒนาสื่อการเรียนรู้และประสานงานหลักสูตรออนไลน์ (EdTech Associate)',
    description:
      'ปทุม เอ็ดเทค เลิร์นนิง แล็บ (องค์กรการศึกษาจำลอง) เปิดรับสมัครบัณฑิตจบใหม่ (สัญญาจ้าง 1 ปี ทำงาน Hybrid/Remote) ร่วมออกแบบโครงสร้างบทเรียนออนไลน์ ตรวจสอบแบบฝึกหัดบนระบบ LMS และดูแลผู้เรียนคอร์สทักษะดิจิทัล',
    content_language: 'th',
    title_th: 'เจ้าหน้าที่พัฒนาสื่อการเรียนรู้และประสานงานหลักสูตรออนไลน์ (EdTech Associate)',
    description_th:
      'ปทุม เอ็ดเทค เลิร์นนิง แล็บ (องค์กรการศึกษาจำลอง) เปิดรับสมัครบัณฑิตจบใหม่ (สัญญาจ้าง 1 ปี ทำงาน Hybrid/Remote) ร่วมออกแบบโครงสร้างบทเรียนออนไลน์ ตรวจสอบแบบฝึกหัดบนระบบ LMS และดูแลผู้เรียนคอร์สทักษะดิจิทัล',
    responsibilities_th:
      '- ร่วมกับวิทยากรในการจัดทำโครงร่างเนื้อหา (Course Outline), สไลด์ประกอบการสอน และแบบทดสอบวัดผลบนระบบ LMS\n- ตรวจสอบความถูกต้องของวิดีโอบทเรียน ซับไตเติล และเอกสารดาวน์โหลดก่อนเผยแพร่\n- ประสานงานตารางไลฟ์สอนสดผ่าน Zoom และรวบรวมข้อเสนอแนะจากผู้เรียนเพื่อปรับปรุงหลักสูตร',
    qualifications_th:
      '- ปริญญาตรีสาขาเทคโนโลยีการศึกษา ครุศาสตร์/ศึกษาศาสตร์ ศิลปศาสตร์ หรือนวัตกรรมการเรียนรู้\n- สนใจธุรกิจ EdTech การเรียนรู้ตลอดชีวิต (Lifelong Learning) และใช้งาน Canva / Notion / Google Workspace ได้คล่อง\n- ทำงานแบบ Hybrid เข้าประชุมที่ อ.ธัญบุรี เดือนละ 4 ครั้ง นอกนั้นทำงานทางไกล (Remote) ได้',
    required_skills_th: 'Instructional Design เบื้องต้น, ระบบ LMS, พัฒนาสื่อการสอน, Canva, Notion, การประสานงานวิทยากร',
    benefits_th:
      '- ค่าตอบแทน 18,500 - 24,000 บาท/เดือน\n- สิทธิ์เรียนคอร์สออนไลน์ของสถาบันฟรีทุกหลักสูตร\n- รูปแบบการทำงานยืดหยุ่นเน้นผลลัพธ์ (Remote-First Hybrid)',
    category: 'Education',
    location: 'อ.ธัญบุรี (คลองหก • Remote / Hybrid)',
    province: 'ปทุมธานี',
    status: 'open',
    company_name: 'Pathum EdTech Learning Lab',
    company_logo: 'PE',
    employer_id: 'emp-demo-27',
    salary_range: '18,500 - 24,000 บาท/เดือน',
    work_type: 'Contract',
    application_deadline: '2026-12-14T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-26T09:10:00.000Z',
    updated_at: '2026-10-26T09:10:00.000Z',
  },

  // ============================================================================
  // 11. SALES & CUSTOMER SERVICE (2 Listings: job-40, job-41)
  // ============================================================================
  {
    id: 'job-40',
    title: 'เจ้าหน้าที่ดูแลลูกค้าองค์กรและที่ปรึกษาการขาย (Customer Success & Account Associate)',
    description:
      'ดูแลลูกค้าองค์กรหลังการขาย แนะนำการใช้งานแพลตฟอร์มอีคอมเมิร์ซ และนำเสนอแพ็กเกจต่ออายุบริการ ยินดีรับบัณฑิตจบใหม่ที่พูดจาฉะฉานและมีใจรักการแก้ปัญหาให้ลูกค้า',
    content_language: 'both',
    title_th: 'เจ้าหน้าที่ดูแลลูกค้าองค์กรและที่ปรึกษาการขาย (Customer Success & Account Associate)',
    description_th:
      'เออร์เบินคราฟท์ ไลฟ์สไตล์ รีเทล (บริษัทจำลอง) เปิดรับบัณฑิตจบใหม่ร่วมทีม Customer Success & B2B Sales ดูแลพาร์ตเนอร์ร้านค้า แนะนำฟีเจอร์ส่งเสริมการขาย และสร้างความสัมพันธ์ระยะยาวกับลูกค้า',
    responsibilities_th:
      '- แนะนำขั้นตอนการเปิดร้านค้าและใช้งานระบบจัดการคำสั่งซื้อให้กับลูกค้าใหม่ (Client Onboarding)\n- ติดตามผลการใช้งาน ตอบข้อซักถาม และแก้ไขปัญหาเบื้องต้นอย่างรวดเร็วผ่านโทรศัพท์และอีเมล\n- นำเสนอแคมเปญส่งเสริมการขายและการต่ออายุแพ็กเกจรายปี บันทึกข้อมูลลูกค้าในระบบ CRM',
    qualifications_th:
      '- ปริญญาตรีทุกสาขา (บริหารธุรกิจ การตลาด เศรษฐศาสตร์ หรือมนุษยศาสตร์ พิจารณาเป็นพิเศษ) ยินดีรับเด็กจบใหม่\n- มีทักษะการฟัง การสื่อสารโน้มน้าวใจอย่างสร้างสรรค์ และทัศนคติเชิงบวก\n- สามารถใช้งานระบบ CRM (เช่น HubSpot) และตารางข้อมูลเบื้องต้นได้',
    required_skills_th: 'Customer Success, B2B Account Management, การเจรจาและนำเสนอ, ระบบ CRM (HubSpot), แก้ไขปัญหาให้ลูกค้า',
    benefits_th:
      '- เงินเดือนฐาน 20,000 - 27,000 บาท/เดือน + ค่าคอมมิชชันตามเป้าการดูแลลูกค้า\n- ทำงานแบบ Hybrid ใกล้ MRT พระราม 9 พร้อมประกันสุขภาพกลุ่มและส่วนลดสินค้าในเครือ',
    title_en: 'Customer Success & B2B Account Associate (Entry-Level)',
    description_en:
      'UrbanCraft Lifestyle Retail Co., Ltd. (fictional demo omnichannel commerce company) is hiring an energetic Customer Success & B2B Account Associate in Bangkok to onboard brand partners, drive merchant retention, and support account growth.',
    responsibilities_en:
      '- Conduct smooth onboarding walkthroughs for new retail brand partners joining our omnichannel platform\n- Act as the primary point of contact for merchant inquiries, campaign enrollment, and quarterly health checks\n- Track account renewals and upsell opportunities accurately in HubSpot CRM',
    qualifications_en:
      '- Bachelor’s degree in Business, Marketing, Communications, or any related discipline (fresh graduates welcome)\n- Empathetic listener with clear verbal and written communication in Thai and working English\n- Comfortable working with SaaS tools, spreadsheets, and CRM pipelines',
    required_skills_en: 'Customer Success, Account Management, HubSpot CRM, Client Onboarding, Consultative Sales',
    benefits_en:
      '- Base salary 20,000 - 27,000 THB/month + quarterly retention & sales incentive\n- Hybrid work schedule near MRT Phra Ram 9, group medical insurance, and annual leave',
    category: 'Sales & Customer Service',
    location: 'เขตห้วยขวาง • พระราม 9 (ใกล้ MRT พระราม 9 • Hybrid)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'UrbanCraft Lifestyle Retail Co., Ltd.',
    company_logo: 'UC',
    employer_id: 'emp-demo-28',
    salary_range: '20,000 - 27,000 บาท/เดือน + Incentive',
    work_type: 'Full-time',
    application_deadline: '2026-12-20T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-31T17:05:00.000Z',
    updated_at: '2026-10-31T17:05:00.000Z',
  },
  {
    id: 'job-41',
    title: 'เจ้าหน้าที่ดูแลลูกค้าออนไลน์พาร์ทไทม์ (E-Commerce Customer Care - Remote)',
    description:
      'เมโขง คอมเมิร์ซ ฮับ (บริษัทอีคอมเมิร์ซจำลอง) เปิดรับนักศึกษาพาร์ทไทม์ทำงานจากที่บ้าน (Remote 100%) ตอบแชตแนะนำสินค้า ตรวจสอบสถานะพัสดุ และดูแลความพึงพอใจของลูกค้าบนช่องทางออนไลน์',
    content_language: 'th',
    title_th: 'เจ้าหน้าที่ดูแลลูกค้าออนไลน์พาร์ทไทม์ (E-Commerce Customer Care - Remote)',
    description_th:
      'เมโขง คอมเมิร์ซ ฮับ (บริษัทอีคอมเมิร์ซจำลอง) เปิดรับนักศึกษาพาร์ทไทม์ทำงานจากที่บ้าน (Remote 100%) ตอบแชตแนะนำสินค้า ตรวจสอบสถานะพัสดุ และดูแลความพึงพอใจของลูกค้าบนช่องทางออนไลน์',
    responsibilities_th:
      '- ตอบข้อความให้ข้อมูลสินค้า โปรโมชัน และวิธีสั่งซื้อผ่านระบบรวมแชต (Shopee / Lazada / LINE OA)\n- ประสานงานติดตามสถานะการจัดส่งพัสดุและรับเรื่องเคลมสินค้าตามขั้นตอนมาตรฐานบริษัท\n- เลือกกะทำงานช่วงเย็นหรือวันเสาร์-อาทิตย์ได้เหมาะสมกับตารางเรียนของนักศึกษา',
    qualifications_th:
      '- กำลังศึกษาระดับ ปวส. หรือปริญญาตรีทุกสาขา มีคอมพิวเตอร์โน้ตบุ๊กและอินเทอร์เน็ตที่เสถียร\n- พิมพ์ภาษาไทยรวดเร็ว ถูกต้อง สุภาพ และใจเย็นในการให้บริการลูกค้า',
    required_skills_th: 'บริการลูกค้าออนไลน์ (Chat Support), Shopee / Lazada Seller Center, LINE OA, การพิมพ์สัมผัส, Service Mind',
    benefits_th:
      '- รายได้เฉลี่ย 8,500 - 13,000 บาท/เดือน (ค่าชั่วโมง + เบี้ยขยันตอบแชตไว)\n- ทำงานทางไกล (Remote 100%) จากหอพักหรือที่บ้านได้ทั่วประเทศ',
    category: 'Sales & Customer Service',
    location: 'อ.เมืองขอนแก่น (ทำงานทางไกล Remote 100%)',
    province: 'ขอนแก่น',
    status: 'closed',
    company_name: 'Mekong Commerce Hub',
    company_logo: 'MC',
    employer_id: 'emp-demo-28',
    salary_range: '8,500 - 13,000 บาท/เดือน',
    work_type: 'Part-time',
    application_deadline: '2026-10-27T23:59:59.000Z',
    is_demo: true,
    created_at: '2026-10-19T11:30:00.000Z',
    updated_at: '2026-10-28T10:00:00.000Z',
  },
];
