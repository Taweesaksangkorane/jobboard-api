import 'dotenv/config';
import crypto from 'crypto';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient, User as SupabaseUser } from '@supabase/supabase-js';
import { ADDITIONAL_DEMO_EMPLOYERS, ADDITIONAL_DEMO_JOBS } from './src/data/expandedJobsData';
import { THAI_PROVINCES } from './src/constants/provinces';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Ephemeral/configured HMAC secret for signing JobBoard API session tokens
const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

const SUPABASE_URL = (
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ''
).trim();
const SUPABASE_ANON_KEY = (
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  ''
).trim();

const isSupabaseServerConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith('http') &&
    !SUPABASE_URL.includes('YOUR_') &&
    SUPABASE_ANON_KEY.length > 15
);

const supabaseServer = isSupabaseServerConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

app.use(express.json());

// --- TYPES ---

export type JobContentLanguage = 'th' | 'en' | 'both';

export interface Job {
  id: string;
  title: string;
  description: string;
  title_th?: string;
  title_en?: string;
  description_th?: string;
  description_en?: string;
  responsibilities_th?: string;
  responsibilities_en?: string;
  qualifications_th?: string;
  qualifications_en?: string;
  required_skills_th?: string;
  required_skills_en?: string;
  benefits_th?: string;
  benefits_en?: string;
  content_language?: JobContentLanguage;
  category:
    | 'IT & Software'
    | 'Marketing & Communications'
    | 'Business & Administration'
    | 'Finance & Accounting'
    | 'Graphic Design & Creative Media'
    | 'Engineering'
    | 'Healthcare & Medical Administration'
    | 'Hospitality & Tourism'
    | 'Logistics & Supply Chain'
    | 'Education'
    | 'Sales & Customer Service'
    | 'Marketing'
    | 'Business'
    | 'Design'
    | 'Other';
  location: string;
  province: string;
  status: 'open' | 'closed';
  company_name: string;
  company_logo?: string;
  employer_id: string;
  salary_range?: string;
  work_type?: 'Full-time' | 'Internship' | 'Part-time' | 'Contract' | 'Co-op';
  application_deadline?: string;
  is_demo?: boolean;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatusType =
  | 'submitted'
  | 'reviewing'
  | 'shortlisted'
  | 'interview'
  | 'rejected'
  | 'accepted';

export interface Application {
  id: string;
  job_id: string;
  student_id: string;
  student_code?: string;
  student_name?: string;
  student_email?: string;
  student_phone?: string;
  avatar_url?: string;
  university?: string;
  faculty?: string;
  major?: string;
  year_of_study?: string;
  notes?: string;
  resume_url?: string;
  portfolio_url?: string;
  employer_feedback?: string;
  status: ApplicationStatusType;
  created_at: string;
  updated_at: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  authProvider?: 'email' | 'google' | 'both';
  role: 'student' | 'employer';
  name: string;
  studentId?: string;
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  website?: string;
  address?: string;
  university?: string;
  faculty?: string;
  major?: string;
  yearOfStudy?: string;
  portfolioUrl?: string;
  bio?: string;
  avatarUrl?: string;
  supabaseId?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  recipient_id: string;
  title: string;
  message: string;
  type: 'status_change' | 'new_application' | 'system';
  related_application_id?: string;
  read: boolean;
  created_at: string;
}

interface AuthenticatedRequest extends Request {
  authUser?: UserAccount;
}

// --- TOKEN SIGNING & VERIFICATION ---

function signSessionToken(userId: string): string {
  const issuedAt = Date.now().toString();
  const payload = `${userId}.${issuedAt}`;
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `jb_${Buffer.from(payload).toString('base64url')}.${sig}`;
}

function verifySessionToken(token: string): string | null {
  if (!token.startsWith('jb_')) return null;
  const raw = token.slice(3);
  const dotIdx = raw.lastIndexOf('.');
  if (dotIdx === -1) return null;

  const encodedPayload = raw.slice(0, dotIdx);
  const providedSig = raw.slice(dotIdx + 1);

  try {
    const payload = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payload)
      .digest('base64url');

    const a = Buffer.from(providedSig);
    const b = Buffer.from(expectedSig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return null;
    }

    const sep = payload.lastIndexOf('.');
    if (sep === -1) return null;
    return payload.slice(0, sep);
  } catch {
    return null;
  }
}

function sanitizeUser(user: UserAccount) {
  const { password: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Verifies a Supabase JWT access token directly against Supabase Auth.
 */
async function verifySupabaseJwt(accessToken: string): Promise<SupabaseUser | null> {
  if (!supabaseServer || !accessToken) return null;
  const { data, error } = await supabaseServer.auth.getUser(accessToken);
  if (error || !data?.user) {
    return null;
  }
  return data.user;
}

/**
 * Attempts to restore a previously registered user profile from Supabase `public.profiles` (with RLS)
 * or verified `user_metadata` if the Node process restarted.
 */
async function findOrRestoreFromSupabase(
  sbUser: SupabaseUser,
  accessToken: string
): Promise<UserAccount | null> {
  const normalizedEmail = (sbUser.email || '').toLowerCase().trim();
  if (!normalizedEmail) return null;

  // 1. Check in-memory database first (prevents duplicates across email & Google methods)
  const existing = users.find(
    (u) =>
      (sbUser.id && u.supabaseId === sbUser.id) ||
      u.email.toLowerCase() === normalizedEmail
  );

  if (existing) {
    const meta = sbUser.user_metadata || {};
    const googleAvatar = meta.avatar_url || meta.picture;
    if (googleAvatar && !existing.avatarUrl) {
      existing.avatarUrl = googleAvatar;
    }
    if (!existing.supabaseId) {
      existing.supabaseId = sbUser.id;
    }
    if (existing.authProvider === 'email') {
      existing.authProvider = 'both';
    }
    return existing;
  }

  // 2. Check Supabase `public.profiles` table using user-scoped JWT (respects RLS)
  if (isSupabaseServerConfigured) {
    try {
      const scopedClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
        global: {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      });
      const { data: profileRow } = await scopedClient
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .maybeSingle();

      if (
        profileRow &&
        (profileRow.role === 'student' || profileRow.role === 'employer')
      ) {
        const restored: UserAccount = {
          id: profileRow.id,
          email: normalizedEmail,
          authProvider: 'google',
          role: profileRow.role,
          name: profileRow.name || normalizedEmail,
          studentId: profileRow.student_id || undefined,
          companyName: profileRow.company_name || undefined,
          contactPerson: profileRow.contact_person || undefined,
          phone: profileRow.phone || undefined,
          bio:
            profileRow.company_info ||
            (profileRow.role === 'student' ? 'นิสิตนักศึกษา' : 'บริษัทผู้รับสมัครงาน'),
          avatarUrl: profileRow.avatar_url || undefined,
          supabaseId: sbUser.id,
          created_at: profileRow.created_at || new Date().toISOString(),
        };
        users.push(restored);
        return restored;
      }
    } catch {
      // profiles table may not be created yet; fall through to metadata check
    }
  }

  // 3. Check verified Supabase user_metadata if previously completed registration
  const meta = sbUser.user_metadata || {};
  if (meta.jobboard_role === 'student' || meta.jobboard_role === 'employer') {
    const restored: UserAccount = {
      id: `${meta.jobboard_role === 'student' ? 'std' : 'emp'}-g-${sbUser.id.slice(0, 8)}`,
      email: normalizedEmail,
      authProvider: 'google',
      role: meta.jobboard_role,
      name:
        meta.jobboard_name ||
        meta.full_name ||
        meta.name ||
        normalizedEmail,
      studentId: meta.student_id || undefined,
      companyName: meta.company_name || undefined,
      contactPerson: meta.contact_person || undefined,
      phone: meta.phone || undefined,
      bio:
        meta.company_info ||
        (meta.jobboard_role === 'student' ? 'นิสิตนักศึกษา' : 'บริษัทผู้รับสมัครงาน'),
      avatarUrl: meta.avatar_url || meta.picture || undefined,
      supabaseId: sbUser.id,
      created_at: sbUser.created_at || new Date().toISOString(),
    };
    users.push(restored);
    return restored;
  }

  return null;
}

// --- IN-MEMORY SEED DATA ---

let users: UserAccount[] = [
  {
    id: 'std-demo-1',
    email: 'somchai.rak@university.ac.th',
    password: 'password123',
    authProvider: 'email',
    role: 'student',
    name: 'สมชาย รักเรียน',
    studentId: '65010042',
    phone: '089-123-4567',
    university: 'จุฬาลงกรณ์มหาวิทยาลัย',
    faculty: 'คณะวิศวกรรมศาสตร์',
    major: 'วิศวกรรมคอมพิวเตอร์',
    yearOfStudy: 'ชั้นปีที่ 4 (Year 4)',
    portfolioUrl: 'https://github.com/somchai-dev-portfolio',
    bio: 'นิสิตปี 4 มีความสนใจด้าน Frontend Development, Cloud และ Data Analytics กำลังมองหาโอกาสฝึกงานและงานประจำ',
    created_at: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'std-demo-2',
    email: 'pimchanok.w@mahidol.edu',
    password: 'password123',
    authProvider: 'email',
    role: 'student',
    name: 'พิมพ์ชนก วงศ์สวัสดิ์',
    studentId: '65880194',
    phone: '081-456-7890',
    university: 'มหาวิทยาลัยมหิดล',
    faculty: 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร (ICT)',
    major: 'วิทยาการคอมพิวเตอร์',
    yearOfStudy: 'ชั้นปีที่ 4 (Year 4)',
    portfolioUrl: 'https://pimchanok-qa-portfolio.example.com',
    bio: 'นักศึกษาชั้นปีที่ 4 สนใจด้าน Software Testing, Automated E2E Testing (Cypress / Playwright) และระบบคุณภาพซอฟต์แวร์',
    created_at: '2026-10-05T00:00:00.000Z',
  },
  {
    id: 'std-demo-3',
    email: 'alex.kittipong@kmutt.ac.th',
    password: 'password123',
    authProvider: 'email',
    role: 'student',
    name: 'กิตติพงศ์ วัฒนากุล (Alex)',
    university: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (KMUTT)',
    faculty: 'คณะวิศวกรรมศาสตร์',
    major: 'วิศวกรรมซอฟต์แวร์',
    yearOfStudy: 'บัณฑิตจบใหม่ (Fresh Graduate)',
    bio: 'บัณฑิตจบใหม่สาย Backend Engineering ถนัด Node.js, TypeScript และ PostgreSQL',
    created_at: '2026-10-10T00:00:00.000Z',
  },
  {
    id: 'emp-1',
    email: 'recruitment@techforward.co.th',
    password: 'password123',
    authProvider: 'email',
    role: 'employer',
    name: 'วิภาดา มั่นคง (HR Lead)',
    companyName: 'TechForward Solutions Co., Ltd.',
    contactPerson: 'วิภาดา มั่นคง',
    phone: '02-765-4321',
    website: 'https://www.company.co.th',
    address: 'กรุงเทพมหานคร',
    bio: 'ผู้พัฒนาโซลูชันซอฟต์แวร์และคลาวด์ชั้นนำสำหรับองค์กร มุ่งเน้นการบ่มเพาะคนรุ่นใหม่',
    created_at: '2026-10-01T00:00:00.000Z',
  },
];

let jobs: Job[] = [
  {
    id: 'job-1',
    title: 'Frontend Developer (React / TypeScript) - นิสิตฝึกงาน',
    description: 'รับสมัครนิสิต/นักศึกษาฝึกงานตำแหน่ง Frontend Developer ร่วมพัฒนาเว็บแอปพลิเคชันด้วย React, TypeScript และ Tailwind CSS เรียนรู้การทำงานร่วมกับทีมระดับมืออาชีพ พร้อมมีพี่เลี้ยงคอยดูแลตลอดการฝึกงาน',
    content_language: 'both',
    title_th: 'Frontend Developer (React / TypeScript) - นิสิตฝึกงาน',
    description_th: 'รับสมัครนิสิต/นักศึกษาฝึกงานตำแหน่ง Frontend Developer ร่วมพัฒนาเว็บแอปพลิเคชันด้วย React, TypeScript และ Tailwind CSS เรียนรู้การทำงานร่วมกับทีมระดับมืออาชีพ พร้อมมีพี่เลี้ยงคอยดูแลตลอดการฝึกงาน',
    responsibilities_th: '- พัฒนาและปรับปรุงหน้าเว็บไซต์ให้รองรับทุกขนาดหน้าจอด้วย React 19 และ TypeScript\n- เชื่อมต่อ RESTful API ร่วมกับทีม Backend Engineer และทดสอบความถูกต้องของข้อมูล\n- ร่วมทบทวนโค้ด (Code Review) และทำงานแบบ Agile Sprint ร่วมกับทีมพัฒนาผลิตภัณฑ์\n- แปลงงานออกแบบจาก Figma ให้เป็น UI Component ที่ใช้งานได้จริงและมีประสิทธิภาพ',
    qualifications_th: '- กำลังศึกษาชั้นปีที่ 3 หรือ 4 สาขาวิศวกรรมคอมพิวเตอร์ วิทยาการคอมพิวเตอร์ เทคโนโลยีสารสนเทศ หรือสาขาที่เกี่ยวข้อง\n- สามารถฝึกงานได้อย่างน้อย 3–4 เดือน (รูปแบบ Hybrid สัปดาห์ละ 3 วันเข้าออฟฟิศ)\n- มีพื้นฐาน HTML5, CSS3, JavaScript / TypeScript และเคยทำโปรเจกต์ด้วย React',
    required_skills_th: 'React, TypeScript, Tailwind CSS, HTML5/CSS3, Git, REST API, Figma',
    benefits_th: '- เบี้ยเลี้ยงรายเดือน 12,000 - 18,000 บาท\n- พี่เลี้ยง Senior Engineer ดูแลแบบ 1-on-1 ตลอดระยะเวลาฝึกงาน\n- อุปกรณ์ทำงาน MacBook สำหรับใช้ระหว่างฝึกงาน\n- โอกาสพิจารณาบรรจุเป็นพนักงานประจำหลังสำเร็จการศึกษา',
    title_en: 'Frontend Web Developer Intern (React / TypeScript)',
    description_en: 'Join TechForward Solutions (fictional sample company) as a Frontend Web Developer Intern. You will collaborate with product designers and senior software engineers to build responsive, accessible web applications using React, TypeScript, and Tailwind CSS while receiving hands-on mentorship.',
    responsibilities_en: '- Build and maintain modular, responsive user interfaces using React and TypeScript\n- Integrate frontend components with RESTful APIs and handle asynchronous data states cleanly\n- Translate high-fidelity Figma wireframes and design tokens into production UI components\n- Participate in Agile sprint planning, daily stand-ups, and peer code reviews',
    qualifications_en: '- Currently pursuing a Bachelor’s degree (3rd or 4th year) in Computer Engineering, Computer Science, IT, or a related discipline\n- Available for a minimum 3–4 month internship (Hybrid work arrangement in Bangkok)\n- Solid foundation in modern JavaScript (ES6+), TypeScript fundamentals, and CSS layout systems',
    required_skills_en: 'React, TypeScript, Tailwind CSS, JavaScript (ES6+), Git, RESTful APIs, Responsive Web Design',
    benefits_en: '- Monthly internship stipend (12,000 - 18,000 THB)\n- Dedicated 1-on-1 mentorship from Senior Frontend Engineers\n- Company-provided laptop and modern collaborative workspace near BTS Asok\n- Fast-track consideration for full-time Junior Engineer roles upon graduation',
    category: 'IT & Software',
    location: 'สุขุมวิท 21 (ใกล้ BTS อโศก / MRT สุขุมวิท)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'TechForward Solutions Co., Ltd.',
    employer_id: 'emp-1',
    salary_range: '12,000 - 18,000 บาท/เดือน (เบี้ยเลี้ยง)',
    work_type: 'Internship',
    created_at: '2026-10-25T09:00:00.000Z',
    updated_at: '2026-10-25T09:00:00.000Z',
  },
  {
    id: 'job-2',
    title: 'Junior UX/UI Designer (ยินดีรับนักศึกษาจบใหม่)',
    description: 'ออกแบบ User Experience & User Interface สำหรับ Web และ Mobile Application ร่วมวิจัยพฤติกรรมผู้ใช้งาน สร้าง Wireframe, Prototype และ Design System ด้วย Figma',
    content_language: 'both',
    title_th: 'Junior UX/UI Designer (ยินดีรับนักศึกษาจบใหม่)',
    description_th: 'ออกแบบ User Experience & User Interface สำหรับ Web และ Mobile Application ร่วมวิจัยพฤติกรรมผู้ใช้งาน สร้าง Wireframe, Prototype และ Design System ด้วย Figma',
    responsibilities_th: '- ออกแบบ User Flow, Wireframe และ Interactive Prototype สำหรับแอปพลิเคชันบนเว็บและมือถือ\n- ร่วมเก็บข้อมูลสัมภาษณ์ผู้ใช้งาน (User Research) และทำ Usability Testing เพื่อพัฒนาประสบการณ์ใช้งาน\n- ดูแลและต่อยอด Design System บน Figma ให้มีความสอดคล้องกันในทุกแพลตฟอร์ม\n- ประสานงานใกล้ชิดกับ Product Manager และทีม Frontend Developer เพื่อส่งมอบงานออกแบบ',
    qualifications_th: '- สำเร็จการศึกษาระดับปริญญาตรีในสาขาการออกแบบดิจิทัล มัลติมีเดีย วิทยาการคอมพิวเตอร์ หรือสาขาที่เกี่ยวข้อง (ยินดีรับนักศึกษาจบใหม่)\n- มีพอร์ตโฟลิโอ (Portfolio) แสดงกระบวนการคิดด้าน UX และผลงานออกแบบ UI อย่างน้อย 2 โปรเจกต์\n- สามารถใช้งาน Figma (Auto Layout, Components, Prototyping) ได้อย่างคล่องแคล่ว',
    required_skills_th: 'Figma, UX Research, Wireframing, Prototyping, Design Systems, Usability Testing',
    benefits_th: '- ประกันสุขภาพกลุ่มและประกันอุบัติเหตุ\n- งบประมาณสนับสนุนคอร์สเรียนออนไลน์และงานสัมมนาด้านการออกแบบ\n- เวลาทำงานยืดหยุ่น (Flexible Hours) และทำงานแบบ Hybrid\n- โบนัสประจำปีตามผลประกอบการ',
    title_en: 'Junior UX/UI Product Designer (Fresh Graduates Welcome)',
    description_en: 'CreativePixel Studio (fictional digital studio) is seeking a creative Junior UX/UI Product Designer to craft intuitive web and mobile experiences. You will take part in end-to-end product design—from user discovery and wireframing to interactive Figma prototypes and design system governance.',
    responsibilities_en: '- Design end-to-end user journeys, wireframes, and high-fidelity UI screens for web and mobile platforms\n- Plan and conduct usability testing sessions to validate design hypotheses with real users\n- Maintain and expand our component library and design tokens in Figma\n- Partner closely with engineers during design handoff and UI quality reviews',
    qualifications_en: '- Bachelor’s degree in Interaction Design, Digital Media, Human-Computer Interaction, Computer Science, or related field (fresh graduates encouraged to apply)\n- Portfolio demonstrating clear UX problem-solving, user flows, and visual craft\n- Proficiency in Figma including Auto Layout, Variants, and interactive prototyping',
    required_skills_en: 'Figma, User Research, Wireframing, Interactive Prototyping, Design Systems, Accessibility (WCAG)',
    benefits_en: '- Group health & dental insurance from day one\n- Annual learning stipend for design books, courses, and conferences\n- Hybrid work schedule (3 days in Sathorn studio, 2 days remote)\n- MacBook Pro & high-resolution external display',
    category: 'Design',
    location: 'สาทร (ใกล้ BTS ช่องนนทรี)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'CreativePixel Studio',
    employer_id: 'emp-2',
    salary_range: '25,000 - 35,000 บาท/เดือน',
    work_type: 'Full-time',
    created_at: '2026-10-26T10:30:00.000Z',
    updated_at: '2026-10-26T10:30:00.000Z',
  },
  {
    id: 'job-3',
    title: 'Digital Marketing Intern (นิสิตฝึกงานการตลาดออนไลน์)',
    description: 'ดูแลและสร้างสรรค์คอนเทนต์ลงบนแพลตฟอร์ม Social Media (TikTok, Facebook, Lemon8) วางแผนแคมเปญโฆษณา และวิเคราะห์ประสิทธิภาพด้วย Google Analytics',
    content_language: 'th',
    title_th: 'Digital Marketing Intern (นิสิตฝึกงานการตลาดออนไลน์)',
    description_th: 'ดูแลและสร้างสรรค์คอนเทนต์ลงบนแพลตฟอร์ม Social Media (TikTok, Facebook, Lemon8) วางแผนแคมเปญโฆษณา และวิเคราะห์ประสิทธิภาพด้วย Google Analytics',
    responsibilities_th: '- ร่วมคิดหัวข้อคอนเทนต์ เขียนแคปชัน และจัดทำตารางเผยแพร่สื่อบน Facebook, TikTok และ Instagram\n- ช่วยทีมวางแผนแคมเปญโฆษณาออนไลน์และติดตามผลลัพธ์เบื้องต้น\n- สรุปรายงานยอดการเข้าถึง (Reach / Engagement) รายสัปดาห์ด้วย Google Analytics และ Meta Business Suite',
    qualifications_th: '- กำลังศึกษาชั้นปีที่ 3–4 สาขาการตลาด นิเทศศาสตร์ บริหารธุรกิจ หรือสาขาที่เกี่ยวข้อง\n- ชื่นชอบเทรนด์โซเชียลมีเดีย มีความคิดสร้างสรรค์ และสื่อสารภาษาไทยได้ดีเยี่ยม\n- หากสามารถใช้ Canva หรือตัดต่อวิดีโอสั้นเบื้องต้น (CapCut) จะพิจารณาเป็นพิเศษ',
    required_skills_th: 'Content Marketing, Social Media, Canva, CapCut, Google Analytics, Copywriting',
    benefits_th: '- เบี้ยเลี้ยงฝึกงาน 8,000 - 12,000 บาท/เดือน\n- บรรยากาศออฟฟิศทันสมัยย่านนิมมานเหมินท์ พร้อมเครื่องดื่มและของว่างฟรี\n- หนังสือรับรองการฝึกงานและเวิร์กชอปด้าน Performance Marketing',
    category: 'Marketing',
    location: 'นิมมานเหมินท์',
    province: 'เชียงใหม่',
    status: 'open',
    company_name: 'Nordic Growth Agency',
    employer_id: 'emp-3',
    salary_range: '8,000 - 12,000 บาท/เดือน (เบี้ยเลี้ยง)',
    work_type: 'Internship',
    created_at: '2026-10-27T14:15:00.000Z',
    updated_at: '2026-10-27T14:15:00.000Z',
  },
  {
    id: 'job-4',
    title: 'Junior Data Analyst',
    description: 'รวบรวมข้อมูล จัดทำ Dashboard ด้วย Power BI / Tableau และเขียน SQL Query เพื่อสนับสนุนการตัดสินใจทางธุรกิจของฝ่ายบริหาร',
    content_language: 'both',
    title_th: 'นักวิเคราะห์ข้อมูลรุ่นใหม่ (Junior Data Analyst)',
    description_th: 'รวบรวมข้อมูล จัดทำ Dashboard ด้วย Power BI / Tableau และเขียน SQL Query เพื่อสนับสนุนการตัดสินใจทางธุรกิจของฝ่ายบริหาร',
    responsibilities_th: '- ดึงข้อมูลและตรวจสอบความถูกต้องของข้อมูลจากฐานข้อมูลองค์กรด้วยภาษา SQL\n- ออกแบบและพัฒนา Interactive Dashboard บน Power BI และ Tableau เพื่อติดตามตัวชี้วัดหลัก (KPIs)\n- วิเคราะห์พฤติกรรมลูกค้าและแนวโน้มยอดขายเพื่อนำเสนอข้อเสนอแนะเชิงกลยุทธ์แก่ทีมบริหาร\n- ร่วมมือกับทีม Data Engineering ในการปรับปรุงโครงสร้างข้อมูลสำหรับการทำรายงานอัตโนมัติ',
    qualifications_th: '- ปริญญาตรีสาขาสถิติ วิทยาการข้อมูล เศรษฐศาสตร์ วิศวกรรมศาสตร์ หรือสาขาที่เกี่ยวข้อง (ยินดีรับบัณฑิตจบใหม่)\n- มีทักษะการเขียนคำสั่ง SQL (JOINs, Aggregations, Window Functions) ในระดับดี\n- สามารถสื่อสารผลการวิเคราะห์ข้อมูลที่ซับซ้อนให้เข้าใจง่าย',
    required_skills_th: 'SQL, Power BI, Tableau, Python (Pandas), Excel ขั้นสูง, Data Storytelling',
    benefits_th: '- เงินเดือน 28,000 - 38,000 บาท ตามทักษะและประสบการณ์\n- กองทุนสำรองเลี้ยงชีพ และประกันสุขภาพครอบคลุมผู้ป่วยนอก/ผู้ป่วยใน\n- คอร์สฝึกอบรมด้าน Cloud Data Warehouse & Analytics ฟรีตลอดปี',
    title_en: 'Junior Data Analyst (Business Intelligence)',
    description_en: 'Siam Retail Group (fictional enterprise analytics division) is hiring a Junior Data Analyst to turn operational and omnichannel retail data into clear business insights. You will write SQL queries, build automated Power BI / Tableau dashboards, and present actionable findings to business stakeholders.',
    responsibilities_en: '- Extract, clean, and validate structured datasets across relational databases using SQL\n- Design and maintain interactive KPI dashboards in Power BI and Tableau for commercial teams\n- Conduct cohort, retention, and promotional uplift analyses using Python or Excel\n- Present data-backed recommendations clearly to product and merchandising leaders',
    qualifications_en: '- Bachelor’s degree in Data Science, Statistics, Computer Science, Economics, Engineering, or a quantitative field\n- Strong working knowledge of SQL queries and data visualization best practices\n- Analytical mindset with attention to data accuracy and clear communication in Thai or English',
    required_skills_en: 'SQL, Power BI, Tableau, Python (Pandas), Advanced Excel, Data Visualization',
    benefits_en: '- Competitive starting salary (28,000 - 38,000 THB/month) plus performance bonus\n- Comprehensive medical insurance & provident fund\n- Sponsored certification exams (Microsoft PL-300 / Cloud Data Analytics)',
    category: 'IT & Software',
    location: 'บางนา-ตราด กม.4',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'Siam Retail Group',
    employer_id: 'emp-1',
    salary_range: '28,000 - 38,000 บาท/เดือน',
    work_type: 'Full-time',
    created_at: '2026-10-28T11:00:00.000Z',
    updated_at: '2026-10-28T11:00:00.000Z',
  },
  {
    id: 'job-5',
    title: 'Business Development Executive (นักศึกษาจบใหม่)',
    description: 'ติดต่อประสานงานคู่ค้าทางธุรกิจ นำเสนอผลิตภัณฑ์เทคโนโลยี และประสานงานทีมพัฒนาเพื่อจัดทำข้อเสนอโครงการ (Proposal)',
    content_language: 'th',
    title_th: 'Business Development Executive (นักศึกษาจบใหม่)',
    description_th: 'ติดต่อประสานงานคู่ค้าทางธุรกิจ นำเสนอผลิตภัณฑ์เทคโนโลยี และประสานงานทีมพัฒนาเพื่อจัดทำข้อเสนอโครงการ (Proposal)',
    responsibilities_th: '- ค้นหาโอกาสทางธุรกิจใหม่ ๆ และติดต่อประสานงานลูกค้าองค์กรในเขตพื้นที่ภาคตะวันออก (EEC)\n- นำเสนอโซลูชันดิจิทัลของบริษัทและร่วมจัดทำใบเสนอราคา / Proposal ร่วมกับทีมเทคนิค\n- ดูแลความสัมพันธ์ลูกค้าหลังการขายเพื่อให้เกิดความพึงพอใจสูงสุด',
    qualifications_th: '- ปริญญาตรีสาขาบริหารธุรกิจ เศรษฐศาสตร์ การจัดการ หรือสาขาที่เกี่ยวข้อง\n- มีทักษะการสื่อสาร การเจรจาต่อรอง และบุคลิกภาพมั่นใจ\n- ยินดีรับนักศึกษาจบใหม่ที่มีความสนใจในธุรกิจเทคโนโลยี B2B',
    required_skills_th: 'Business Development, B2B Sales, Presentation, Proposal Writing, CRM',
    benefits_th: '- เงินเดือนประจำพร้อมค่าคอมมิชชันและค่าเดินทาง\n- ประกันสุขภาพกลุ่ม และวันลาพักร้อนเริ่มต้น 10 วัน/ปี',
    category: 'Business',
    location: 'ศรีราชา (ใกล้ ม.เกษตรศาสตร์ ศรีราชา)',
    province: 'ชลบุรี',
    status: 'open',
    company_name: 'Eastern Innovation Hub',
    employer_id: 'emp-4',
    salary_range: '24,000 - 32,000 บาท/เดือน',
    work_type: 'Full-time',
    created_at: '2026-10-29T16:00:00.000Z',
    updated_at: '2026-10-29T16:00:00.000Z',
  },
  {
    id: 'job-6',
    title: 'Mechanical Design Engineer - นิสิตฝึกงานวิศวกรรม',
    description: 'ร่วมออกแบบชิ้นส่วนเครื่องกล และระบบอัตโนมัติด้วยโปรแกรม SolidWorks / AutoCAD วิเคราะห์ความเค้นและตรวจสอบความถูกต้องของแบบงานผลิต',
    content_language: 'th',
    title_th: 'Mechanical Design Engineer - นิสิตฝึกงานวิศวกรรม',
    description_th: 'ร่วมออกแบบชิ้นส่วนเครื่องกล และระบบอัตโนมัติด้วยโปรแกรม SolidWorks / AutoCAD วิเคราะห์ความเค้นและตรวจสอบความถูกต้องของแบบงานผลิต',
    responsibilities_th: '- เขียนแบบชิ้นส่วนเครื่องกล 3 มิติ และจัดทำ Drawing สำหรับการผลิตด้วยโปรแกรม SolidWorks / AutoCAD\n- ร่วมทดสอบประกอบชิ้นงานต้นแบบ (Prototype) ร่วมกับทีมวิศวกรโรงงาน',
    qualifications_th: '- กำลังศึกษาชั้นปีที่ 3–4 สาขาวิศวกรรมเครื่องกล วิศวกรรมเมคคาทรอนิกส์ หรือวิศวกรรมการผลิต\n- สามารถอ่านแบบทางวิศวกรรม (GD&T) และใช้งาน SolidWorks เบื้องต้นได้',
    required_skills_th: 'SolidWorks, AutoCAD, Mechanical Drawing, GD&T',
    benefits_th: '- เบี้ยเลี้ยงรายเดือน รถรับส่งพนักงาน และอาหารกลางวันฟรีที่โรงงาน',
    category: 'Engineering',
    location: 'นิคมอุตสาหกรรมอมตะซิตี้',
    province: 'ชลบุรี',
    status: 'closed',
    company_name: 'Precision Dynamics Corp',
    employer_id: 'emp-5',
    salary_range: '10,000 - 15,000 บาท/เดือน (เบี้ยเลี้ยง)',
    work_type: 'Internship',
    created_at: '2026-10-20T08:00:00.000Z',
    updated_at: '2026-10-29T12:00:00.000Z',
  },
  {
    id: 'job-7',
    title: 'Software Quality Assurance (QA) Intern',
    description: 'ร่วมทดสอบระบบทั้ง Manual Testing และ Automated Testing (Robot Framework / Cypress) จัดทำ Test Case และ Test Scenario รายงานบั๊กแก่ทีม Dev',
    content_language: 'both',
    title_th: 'นิสิตฝึกงานทดสอบคุณภาพซอฟต์แวร์ (Software QA Intern)',
    description_th: 'ร่วมทดสอบระบบทั้ง Manual Testing และ Automated Testing (Robot Framework / Cypress) จัดทำ Test Case และ Test Scenario รายงานบั๊กแก่ทีม Dev',
    responsibilities_th: '- วิเคราะห์ Requirement และออกแบบ Test Scenario / Test Case ให้ครอบคลุมการทำงานของระบบ\n- ดำเนินการทดสอบระบบ Web Application ทั้งแบบ Manual Testing และ API Testing (Postman)\n- ร่วมพัฒนาสคริปต์ Automated Testing เบื้องต้นด้วย Cypress หรือ Playwright\n- บันทึกและติดตามการแก้ไขข้อผิดพลาด (Bug Tracking) บน Jira ร่วมกับทีมนักพัฒนา',
    qualifications_th: '- กำลังศึกษาชั้นปีที่ 3–4 สาขาวิทยาการคอมพิวเตอร์ วิศวกรรมซอฟต์แวร์ หรือเทคโนโลยีสารสนเทศ\n- มีความละเอียดรอบคอบ ช่างสังเกต และเข้าใจกระบวนการพัฒนาซอฟต์แวร์เบื้องต้น\n- สามารถฝึกงานต่อเนื่องได้อย่างน้อย 3 เดือน',
    required_skills_th: 'Manual Testing, Test Case Design, Postman, Cypress / Robot Framework, Jira, SQL เบื้องต้น',
    benefits_th: '- เบี้ยเลี้ยง 12,000 - 16,000 บาท/เดือน\n- เรียนรู้ระบบ CI/CD และ Automated QA Pipeline จากทีมงานจริง\n- ชั่วโมงทำงานยืดหยุ่นและกิจกรรมสังสรรค์ประจำเดือน',
    title_en: 'Software Quality Assurance (QA) Engineer Intern',
    description_en: 'Join TechForward Solutions (fictional sample company) as a Software Quality Assurance (QA) Intern. You will work embedded within an Agile product squad to design test plans, execute manual and API tests, and build automated end-to-end test suites using Cypress and Playwright.',
    responsibilities_en: '- Review product user stories and write structured test cases covering functional and edge-case scenarios\n- Perform manual web UI testing and REST API verification using Postman\n- Assist QA Engineers in writing maintainable automated regression scripts with Cypress\n- Log clear, reproducible defect reports in Jira and verify bug fixes prior to release',
    qualifications_en: '- 3rd or 4th year undergraduate student in Software Engineering, Computer Science, Information Technology, or related field\n- Detail-oriented mindset with strong logical reasoning and curiosity about how software works\n- Basic familiarity with HTTP status codes, JSON, and web browser developer tools',
    required_skills_en: 'Test Case Design, Manual & Regression Testing, Postman, Cypress, Jira, Basic SQL',
    benefits_en: '- Monthly stipend of 12,000 - 16,000 THB\n- Hands-on training in modern test automation and CI/CD pipelines\n- Hybrid work policy near MRT Rama 9 & internship certificate upon completion',
    category: 'IT & Software',
    location: 'พระราม 9 (ใกล้ MRT พระราม 9)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'TechForward Solutions Co., Ltd.',
    employer_id: 'emp-1',
    salary_range: '12,000 - 16,000 บาท/เดือน (เบี้ยเลี้ยง)',
    work_type: 'Internship',
    created_at: '2026-10-30T13:45:00.000Z',
    updated_at: '2026-10-30T13:45:00.000Z',
  },
  {
    id: 'job-8',
    title: 'Junior Software Engineer (Backend & Cloud Platform)',
    description: 'TechForward Solutions Co., Ltd. (fictional sample employer) is looking for an enthusiastic Junior Software Engineer to help design, build, and scale resilient Node.js/TypeScript backend services and cloud-native APIs for enterprise web platforms.',
    content_language: 'en',
    title_en: 'Junior Software Engineer (Backend & Cloud Platform)',
    description_en: 'TechForward Solutions Co., Ltd. (fictional sample employer) is looking for an enthusiastic Junior Software Engineer to help design, build, and scale resilient Node.js/TypeScript backend services and cloud-native APIs for enterprise web platforms.',
    responsibilities_en: '- Design, develop, and maintain RESTful microservices using Node.js, TypeScript, and PostgreSQL\n- Write unit and integration tests to ensure high service reliability and clean API contracts\n- Collaborate with DevOps and senior engineers on Docker containerization and CI/CD workflows\n- Optimize database queries, caching strategies, and API response performance',
    qualifications_en: '- Recent graduate (0–2 years of experience) with a Bachelor’s degree in Computer Engineering, Computer Science, or Software Engineering\n- Solid understanding of data structures, REST API architecture, and relational databases\n- Comfortable communicating technical ideas in English within an international engineering team',
    required_skills_en: 'Node.js, TypeScript, PostgreSQL, REST APIs, Docker, Git, Automated Testing',
    benefits_en: '- Competitive salary (32,000 - 45,000 THB/month) + annual performance bonus\n- Hybrid work model (2 days in Asok office, 3 days work-from-anywhere)\n- Annual cloud certification budget (AWS / GCP) and health insurance package',
    category: 'IT & Software',
    location: 'Sukhumvit 21 (Asok)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'TechForward Solutions Co., Ltd.',
    employer_id: 'emp-1',
    salary_range: '32,000 - 45,000 THB/month',
    work_type: 'Full-time',
    created_at: '2026-10-31T09:15:00.000Z',
    updated_at: '2026-10-31T09:15:00.000Z',
  },
  {
    id: 'job-9',
    title: 'IT Support & Workplace Systems Specialist (Entry-Level)',
    description: 'Aetheris Cloud Workspace (fictional mock company) is hiring a service-minded Entry-Level IT Support & Workplace Systems Specialist to support employees with hardware, networking, SaaS identity access, and daily IT operations.',
    content_language: 'en',
    title_en: 'IT Support & Workplace Systems Specialist (Entry-Level)',
    description_en: 'Aetheris Cloud Workspace (fictional mock company) is hiring a service-minded Entry-Level IT Support & Workplace Systems Specialist to support employees with hardware, networking, SaaS identity access, and daily IT operations.',
    responsibilities_en: '- Provide friendly Tier-1 and Tier-2 technical support for macOS and Windows laptops, peripherals, and office Wi-Fi networks\n- Manage user onboarding/offboarding accounts across Google Workspace, Microsoft 365, and Slack\n- Document troubleshooting guides and maintain accurate IT asset inventory records\n- Escalate infrastructure incidents and coordinate vendor warranty repairs efficiently',
    qualifications_en: '- Bachelor’s degree or Higher Vocational Diploma in Information Technology, Computer Technology, Network Administration, or related field\n- Fundamental knowledge of Windows 11, macOS, TCP/IP networking, DNS, and cloud productivity suites\n- Patient, solution-focused attitude with good spoken and written English communication',
    required_skills_en: 'IT Helpdesk, Windows & macOS, TCP/IP & Wi-Fi Networking, Google Workspace Admin, Hardware Troubleshooting',
    benefits_en: '- Starting salary 23,000 - 30,000 THB/month\n- CompTIA A+ / Network+ exam sponsorship\n- Outpatient & inpatient health coverage, 12 days annual leave, and transit allowance',
    category: 'IT & Software',
    location: 'Phaya Thai Innovation District (near BTS Ari)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'Aetheris Cloud Workspace',
    employer_id: 'emp-6',
    salary_range: '23,000 - 30,000 THB/month',
    work_type: 'Full-time',
    created_at: '2026-10-31T10:40:00.000Z',
    updated_at: '2026-10-31T10:40:00.000Z',
  },
  {
    id: 'job-10',
    title: 'Digital & Performance Marketing Associate (Fresh Grad)',
    description: 'Nordic Growth Agency (fictional sample agency) is expanding our international client team in Chiang Mai. We are looking for an analytical Digital & Performance Marketing Associate to manage paid search/social campaigns, SEO content experiments, and conversion analytics.',
    content_language: 'en',
    title_en: 'Digital & Performance Marketing Associate (Fresh Grad)',
    description_en: 'Nordic Growth Agency (fictional sample agency) is expanding our international client team in Chiang Mai. We are looking for an analytical Digital & Performance Marketing Associate to manage paid search/social campaigns, SEO content experiments, and conversion analytics.',
    responsibilities_en: '- Plan, launch, and optimize paid acquisition campaigns across Google Ads, Meta Ads, and LinkedIn\n- Conduct keyword research and on-page SEO audits to grow organic search traffic\n- Monitor campaign ROAS, CTR, and conversion funnels using Google Analytics 4 (GA4) and Looker Studio\n- Collaborate with copywriters and designers to run structured A/B ad creative experiments',
    qualifications_en: '- Bachelor’s degree in Marketing, Digital Media, Business Administration, Communications, or a related field\n- Strong command of written English for ad copywriting and campaign reporting\n- Familiarity with digital marketing metrics (CPC, CPA, CTR, ROAS) and spreadsheet analysis',
    required_skills_en: 'Google Ads, Meta Ads Manager, Google Analytics 4 (GA4), SEO, Copywriting, Looker Studio',
    benefits_en: '- Salary 24,000 - 33,000 THB/month\n- Flexible hybrid work in Nimmanhaemin, Chiang Mai\n- Google Skillshop & Meta Blueprint certification mentorship, plus wellness allowance',
    category: 'Marketing',
    location: 'Nimmanhaemin Road, Mueang Chiang Mai',
    province: 'เชียงใหม่',
    status: 'open',
    company_name: 'Nordic Growth Agency',
    employer_id: 'emp-3',
    salary_range: '24,000 - 33,000 THB/month',
    work_type: 'Full-time',
    created_at: '2026-10-31T12:00:00.000Z',
    updated_at: '2026-10-31T12:00:00.000Z',
  },
  {
    id: 'job-11',
    title: 'นักพัฒนาเว็บไซต์ Full-Stack รุ่นใหม่ (Web Developer)',
    description: 'ร่วมทีมพัฒนาแพลตฟอร์มเว็บแอปพลิเคชันสำหรับองค์กรด้วย React, Node.js และฐานข้อมูลเชิงสัมพันธ์ เหมาะสำหรับบัณฑิตจบใหม่ที่ต้องการต่อยอดทักษะการพัฒนาเว็บไซต์แบบครบวงจร',
    content_language: 'th',
    title_th: 'นักพัฒนาเว็บไซต์ Full-Stack รุ่นใหม่ (Web Developer)',
    description_th: 'ร่วมทีมพัฒนาแพลตฟอร์มเว็บแอปพลิเคชันสำหรับองค์กรด้วย React, Node.js และฐานข้อมูลเชิงสัมพันธ์ เหมาะสำหรับบัณฑิตจบใหม่ที่ต้องการต่อยอดทักษะการพัฒนาเว็บไซต์แบบครบวงจร',
    responsibilities_th: '- พัฒนาฟีเจอร์ทั้งฝั่ง Frontend (React / Tailwind CSS) และ Backend API (Node.js / Express)\n- ออกแบบโครงสร้างตารางฐานข้อมูลและปรับปรุงประสิทธิภาพการดึงข้อมูล\n- ร่วมวางแผนสถาปัตยกรรมระบบและทดสอบระบบก่อนขึ้นใช้งานจริง',
    qualifications_th: '- สำเร็จการศึกษาปริญญาตรีสาขาวิทยาการคอมพิวเตอร์ วิศวกรรมคอมพิวเตอร์ หรือวิศวกรรมซอฟต์แวร์\n- มีพื้นฐาน JavaScript / TypeScript, HTML, CSS และ SQL ในระดับดี\n- มีผลงานโปรเจกต์จบหรือ GitHub Repository ที่สามารถนำเสนอได้',
    required_skills_th: 'React, Node.js, TypeScript, Express, SQL, Git, Tailwind CSS',
    benefits_th: '- เงินเดือนเริ่มต้น 28,000 - 36,000 บาท/เดือน\n- ทำงานรูปแบบ Hybrid (เข้าออฟฟิศสัปดาห์ละ 2 วัน)\n- ประกันสุขภาพกลุ่ม กองทุนสำรองเลี้ยงชีพ และงบพัฒนาตนเองรายปี',
    category: 'IT & Software',
    location: 'สุขุมวิท 21 (ใกล้ BTS อโศก)',
    province: 'กรุงเทพมหานคร',
    status: 'open',
    company_name: 'TechForward Solutions Co., Ltd.',
    employer_id: 'emp-1',
    salary_range: '28,000 - 36,000 บาท/เดือน',
    work_type: 'Full-time',
    created_at: '2026-10-31T14:20:00.000Z',
    updated_at: '2026-10-31T14:20:00.000Z',
  },
];

let applications: Application[] = [
  {
    id: 'app-101',
    job_id: 'job-1',
    student_id: 'std-demo-1',
    student_code: '65010042',
    student_name: 'สมชาย รักเรียน',
    student_email: 'somchai.rak@university.ac.th',
    student_phone: '089-123-4567',
    university: 'จุฬาลงกรณ์มหาวิทยาลัย',
    faculty: 'คณะวิศวกรรมศาสตร์',
    major: 'วิศวกรรมคอมพิวเตอร์',
    year_of_study: 'ชั้นปีที่ 4 (Year 4)',
    notes:
      'สวัสดีครับ ผมสมชาย รักเรียน นิสิตชั้นปีที่ 4 สาขาวิศวกรรมคอมพิวเตอร์ มีความสนใจและฝึกพัฒนาโปรเจกต์เว็บแอปพลิเคชันด้วย React 19, TypeScript และ Tailwind CSS มาอย่างต่อเนื่องกว่า 1 ปี สามารถเข้าฝึกงานแบบ Hybrid ได้ตลอดภาคการศึกษา และตั้งใจเรียนรู้กระบวนการทำงานจริงร่วมกับทีมวิศวกรของ TechForward Solutions ครับ',
    resume_url: 'Somchai_Rakrian_Frontend_Resume_2026.pdf',
    portfolio_url: 'https://github.com/somchai-dev-portfolio',
    status: 'reviewing',
    created_at: '2026-10-26T14:30:00.000Z',
    updated_at: '2026-10-27T10:00:00.000Z',
  },
  {
    id: 'app-102',
    job_id: 'job-4',
    student_id: 'std-demo-1',
    student_code: '65010042',
    student_name: 'สมชาย รักเรียน',
    student_email: 'somchai.rak@university.ac.th',
    student_phone: '089-123-4567',
    university: 'จุฬาลงกรณ์มหาวิทยาลัย',
    faculty: 'คณะวิศวกรรมศาสตร์',
    major: 'วิศวกรรมคอมพิวเตอร์',
    year_of_study: 'ชั้นปีที่ 4 (Year 4)',
    notes:
      'เชี่ยวชาญการเขียน SQL Query (Window Functions, CTEs) และเคยทำโครงงานวิเคราะห์ข้อมูลพฤติกรรมผู้บริโภคด้วย Power BI และ Python (Pandas) ครับ',
    resume_url: 'Somchai_Rakrian_DataAnalyst_CV.pdf',
    status: 'submitted',
    created_at: '2026-10-29T11:20:00.000Z',
    updated_at: '2026-10-29T11:20:00.000Z',
  },
  {
    id: 'app-103',
    job_id: 'job-7',
    student_id: 'std-demo-2',
    student_code: '65880194',
    student_name: 'พิมพ์ชนก วงศ์สวัสดิ์',
    student_email: 'pimchanok.w@mahidol.edu',
    student_phone: '081-456-7890',
    university: 'มหาวิทยาลัยมหิดล',
    faculty: 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร (ICT)',
    major: 'วิทยาการคอมพิวเตอร์',
    year_of_study: 'ชั้นปีที่ 4 (Year 4)',
    notes:
      'ดิฉันมีความสนใจในสายงาน Software Quality Assurance เป็นอย่างมาก เคยรับผิดชอบการออกแบบ Test Case, ทดสอบ REST API ด้วย Postman และเขียน Automated Test เบื้องต้นด้วย Cypress ในวิชา Software Engineering Project พร้อมเริ่มฝึกงานได้ทันทีค่ะ',
    resume_url: 'Pimchanok_Wongsawat_QA_Intern_CV.pdf',
    portfolio_url: 'https://pimchanok-qa-portfolio.example.com',
    employer_feedback: 'ผลการคัดกรองเรซูเม่ผ่านเกณฑ์เบื้องต้น โครงงานด้าน Cypress น่าสนใจมาก',
    status: 'shortlisted',
    created_at: '2026-10-30T16:10:00.000Z',
    updated_at: '2026-10-31T09:00:00.000Z',
  },
  {
    id: 'app-104',
    job_id: 'job-8',
    student_id: 'std-demo-3',
    student_name: 'กิตติพงศ์ วัฒนากุล (Alex)',
    student_email: 'alex.kittipong@kmutt.ac.th',
    university: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี (KMUTT)',
    faculty: 'คณะวิศวกรรมศาสตร์',
    major: 'วิศวกรรมซอฟต์แวร์',
    year_of_study: 'บัณฑิตจบใหม่ (Fresh Graduate)',
    status: 'submitted',
    created_at: '2026-10-31T15:05:00.000Z',
    updated_at: '2026-10-31T15:05:00.000Z',
  },
];

let notifications: NotificationItem[] = [
  {
    id: 'notif-1',
    recipient_id: 'std-demo-1',
    title: 'ใบสมัครของคุณกำลังอยู่ระหว่างการตรวจสอบ',
    message: 'บริษัท TechForward Solutions Co., Ltd. ได้เริ่มตรวจสอบใบสมัครตำแหน่ง Frontend Developer ของคุณแล้ว',
    type: 'status_change',
    related_application_id: 'app-101',
    read: false,
    created_at: '2026-10-27T10:00:00.000Z',
  },
];

// Non-destructively append expanded demo employers and 30 multi-industry job listings
const existingSeedUserIds = new Set(users.map((u) => u.id));
for (const demoEmployer of ADDITIONAL_DEMO_EMPLOYERS) {
  if (!existingSeedUserIds.has(demoEmployer.id)) {
    users.push(demoEmployer);
    existingSeedUserIds.add(demoEmployer.id);
  }
}

const existingSeedJobIds = new Set(jobs.map((j) => j.id));
for (const demoJob of ADDITIONAL_DEMO_JOBS) {
  if (!existingSeedJobIds.has(demoJob.id)) {
    jobs.push(demoJob);
    existingSeedJobIds.add(demoJob.id);
  }
}

// --- BACKEND AUTH & ROLE VALIDATION MIDDLEWARE ---

async function resolveAuthenticatedUser(req: Request): Promise<UserAccount | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const rawToken = authHeader.slice('Bearer '.length).trim();
  if (!rawToken) return null;

  // 1. Verify signed JobBoard API session token
  const verifiedUserId = verifySessionToken(rawToken);
  if (verifiedUserId) {
    const found = users.find((u) => u.id === verifiedUserId);
    if (found) return found;
  }

  // 2. Fallback: verify Supabase JWT directly if provided
  const sbUser = await verifySupabaseJwt(rawToken);
  if (sbUser) {
    const restored = await findOrRestoreFromSupabase(sbUser, rawToken);
    if (restored) return restored;
  }

  return null;
}

async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const user = await resolveAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน (Unauthorized)',
    });
  }
  req.authUser = user;
  next();
}

function requireRole(expectedRole: 'student' | 'employer') {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = await resolveAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน (Unauthorized)',
      });
    }
    if (user.role !== expectedRole) {
      return res.status(403).json({
        success: false,
        message:
          expectedRole === 'employer'
            ? 'ไม่มีสิทธิ์เข้าถึงฟีเจอร์สำหรับนายจ้าง (Forbidden: Employer role required)'
            : 'ไม่มีสิทธิ์เข้าถึงฟีเจอร์สำหรับนักศึกษา (Forbidden: Student role required)',
      });
    }
    req.authUser = user;
    next();
  };
}

// --- 0. AUTHENTICATION ENDPOINTS ---

// POST /api/auth/register (Email & Password)
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const {
      role,
      email,
      password,
      name,
      studentId,
      companyName,
      contactPerson,
      phone,
      companyInfo,
    } = req.body;

    if (!role || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' });
    }

    if (role !== 'student' && role !== 'employer') {
      return res
        .status(400)
        .json({ success: false, message: 'ประเภทบัญชีไม่ถูกต้อง' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'อีเมลนี้ได้รับการลงทะเบียนในระบบแล้ว กรุณาเข้าสู่ระบบ',
      });
    }

    if (role === 'student' && (!name || !name.trim())) {
      return res
        .status(400)
        .json({ success: false, message: 'กรุณากรอกชื่อ-นามสกุล' });
    }

    if (role === 'employer' && (!companyName || !contactPerson)) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อบริษัทและชื่อผู้ติดต่อ',
      });
    }

    const newUser: UserAccount = {
      id: `${role === 'student' ? 'std' : 'emp'}-${Date.now()}`,
      email: normalizedEmail,
      password,
      authProvider: 'email',
      role,
      name: role === 'student' ? name.trim() : contactPerson.trim(),
      studentId: studentId?.trim(),
      companyName: companyName?.trim(),
      contactPerson: contactPerson?.trim(),
      phone: phone?.trim(),
      bio:
        role === 'student'
          ? 'นิสิตนักศึกษา'
          : companyInfo?.trim() || 'บริษัทผู้รับสมัครงาน',
      created_at: new Date().toISOString(),
    };

    users.push(newUser);

    return res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ',
      user: sanitizeUser(newUser),
      token: signSessionToken(newUser.id),
    });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
});

// POST /api/auth/login (Email & Password)
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'กรุณากรอกอีเมลและรหัสผ่าน' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message:
          'บัญชีนี้ลงทะเบียนผ่าน Google กรุณาเลือก "เข้าสู่ระบบด้วย Google"',
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง',
      });
    }

    return res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: sanitizeUser(user),
      token: signSessionToken(user.id),
    });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
  }
});

// GET /api/auth/me - Validate current token & return authoritative server role
app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  return res.json({
    success: true,
    user: sanitizeUser(user),
  });
});

// PATCH /api/auth/profile - Update authenticated user's own profile (cannot change role)
app.patch('/api/auth/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const {
    name,
    studentId,
    companyName,
    contactPerson,
    phone,
    website,
    address,
    university,
    faculty,
    major,
    bio,
  } = req.body;

  if (user.role === 'employer') {
    if (typeof companyName === 'string' && !companyName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุชื่อบริษัท',
      });
    }
    if (typeof contactPerson === 'string' && !contactPerson.trim()) {
      return res.status(400).json({
        success: false,
        message: 'กรุณาระบุชื่อผู้ติดต่อ / ตำแหน่งงาน',
      });
    }
  }

  if (typeof name === 'string' && name.trim()) user.name = name.trim();
  if (typeof studentId === 'string') user.studentId = studentId.trim() || undefined;
  if (typeof companyName === 'string' && user.role === 'employer') {
    user.companyName = companyName.trim();
  }
  if (typeof contactPerson === 'string' && user.role === 'employer') {
    user.contactPerson = contactPerson.trim();
  }
  if (typeof phone === 'string') user.phone = phone.trim() || undefined;
  if (typeof website === 'string' && user.role === 'employer') {
    user.website = website.trim() || undefined;
  }
  if (typeof address === 'string' && user.role === 'employer') {
    user.address = address.trim() || undefined;
  }
  if (typeof university === 'string') user.university = university.trim() || undefined;
  if (typeof faculty === 'string') user.faculty = faculty.trim() || undefined;
  if (typeof major === 'string') user.major = major.trim() || undefined;
  if (typeof bio === 'string') user.bio = bio.trim() || undefined;

  return res.json({
    success: true,
    user: sanitizeUser(user),
  });
});

// POST /api/auth/google/sync - Verify Supabase JWT & check if JobBoard profile/role exists
app.post('/api/auth/google/sync', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const supabaseAccessToken =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length).trim()
        : '';

    if (!isSupabaseServerConfigured || !supabaseServer) {
      return res.status(503).json({
        success: false,
        message:
          'ระบบยังไม่ได้ตั้งค่า VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY บนเซิร์ฟเวอร์',
      });
    }

    if (!supabaseAccessToken) {
      return res.status(401).json({
        success: false,
        message: 'ไม่พบโทเค็นยืนยันตัวตนจาก Supabase กรุณาเข้าสู่ระบบใหม่',
      });
    }

    const sbUser = await verifySupabaseJwt(supabaseAccessToken);
    if (!sbUser || !sbUser.email) {
      return res.status(401).json({
        success: false,
        message: 'เซสชัน Google ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
      });
    }

    const existing = await findOrRestoreFromSupabase(sbUser, supabaseAccessToken);

    if (existing) {
      return res.json({
        success: true,
        isNew: false,
        user: sanitizeUser(existing),
        token: signSessionToken(existing.id),
      });
    }

    const meta = sbUser.user_metadata || {};
    return res.json({
      success: true,
      isNew: true,
      googleUser: {
        email: sbUser.email.toLowerCase().trim(),
        name: (meta.full_name || meta.name || '').trim(),
        avatarUrl: (meta.avatar_url || meta.picture || '').trim(),
        supabaseId: sbUser.id,
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบเซสชัน Google',
    });
  }
});

// POST /api/auth/google/complete-registration - Verify Supabase JWT & save chosen role + profile
app.post(
  '/api/auth/google/complete-registration',
  async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const supabaseAccessToken =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.slice('Bearer '.length).trim()
          : '';

      if (!isSupabaseServerConfigured || !supabaseServer) {
        return res.status(503).json({
          success: false,
          message:
            'ระบบยังไม่ได้ตั้งค่า VITE_SUPABASE_URL และ VITE_SUPABASE_ANON_KEY บนเซิร์ฟเวอร์',
        });
      }

      if (!supabaseAccessToken) {
        return res.status(401).json({
          success: false,
          message: 'ไม่พบโทเค็นยืนยันตัวตนจาก Supabase กรุณาเข้าสู่ระบบใหม่',
        });
      }

      const sbUser = await verifySupabaseJwt(supabaseAccessToken);
      if (!sbUser || !sbUser.email) {
        return res.status(401).json({
          success: false,
          message: 'เซสชัน Google ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
        });
      }

      const {
        role,
        name,
        studentId,
        companyName,
        contactPerson,
        phone,
        companyInfo,
      } = req.body;

      if (!role || (role !== 'student' && role !== 'employer')) {
        return res.status(400).json({
          success: false,
          message: 'กรุณาเลือกประเภทบัญชี (นักศึกษา หรือ บริษัท/ผู้ประกอบการ)',
        });
      }

      const normalizedEmail = sbUser.email.toLowerCase().trim();
      const meta = sbUser.user_metadata || {};
      const verifiedAvatar = (meta.avatar_url || meta.picture || '').trim();

      // Prevent duplicate profiles if already registered
      const existing = await findOrRestoreFromSupabase(sbUser, supabaseAccessToken);
      if (existing) {
        return res.json({
          success: true,
          message: 'เข้าสู่ระบบสำเร็จ',
          user: sanitizeUser(existing),
          token: signSessionToken(existing.id),
        });
      }

      if (role === 'student') {
        if (!name || !name.trim()) {
          return res.status(400).json({
            success: false,
            message: 'กรุณากรอกชื่อ-นามสกุล',
          });
        }
      } else {
        if (!companyName || !companyName.trim()) {
          return res.status(400).json({
            success: false,
            message: 'กรุณากรอกชื่อบริษัท / องค์กร',
          });
        }
        if (!contactPerson || !contactPerson.trim()) {
          return res.status(400).json({
            success: false,
            message: 'กรุณากรอกชื่อผู้ติดต่อ',
          });
        }
        if (!companyInfo || companyInfo.trim().length < 10) {
          return res.status(400).json({
            success: false,
            message: 'กรุณากรอกข้อมูลบริษัทโดยสังเขปอย่างน้อย 10 ตัวอักษร',
          });
        }
      }

      const newUser: UserAccount = {
        id: `${role === 'student' ? 'std' : 'emp'}-g-${Date.now()}`,
        email: normalizedEmail,
        authProvider: 'google',
        role,
        name: role === 'student' ? name.trim() : contactPerson.trim(),
        studentId: role === 'student' ? studentId?.trim() || undefined : undefined,
        companyName: role === 'employer' ? companyName.trim() : undefined,
        contactPerson: role === 'employer' ? contactPerson.trim() : undefined,
        phone: phone?.trim() || undefined,
        bio:
          role === 'student'
            ? 'นิสิตนักศึกษา'
            : companyInfo.trim(),
        avatarUrl: verifiedAvatar || undefined,
        supabaseId: sbUser.id,
        created_at: new Date().toISOString(),
      };

      users.push(newUser);

      return res.status(201).json({
        success: true,
        message: 'สมัครสมาชิกสำเร็จ',
        user: sanitizeUser(newUser),
        token: signSessionToken(newUser.id),
      });
    } catch {
      return res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการลงทะเบียน',
      });
    }
  }
);

// --- 1. JOBS ENDPOINTS ---

// Helper to determine effective posting language for filtering & integrity
function resolveJobEffectiveLanguage(j: Job): JobContentLanguage {
  const hasTh = Boolean((j.title_th && j.title_th.trim()) || (j.description_th && j.description_th.trim()));
  const hasEn = Boolean((j.title_en && j.title_en.trim()) || (j.description_en && j.description_en.trim()));
  if (j.content_language === 'both' || (hasTh && hasEn)) {
    return hasTh && hasEn ? 'both' : hasEn ? 'en' : 'th';
  }
  if (j.content_language === 'en' || (!hasTh && hasEn)) {
    return 'en';
  }
  return 'th';
}

function matchesCategoryFilter(jobCategory: string, filterCategory: string): boolean {
  if (jobCategory === filterCategory) return true;
  const a = jobCategory.trim().toLowerCase();
  const b = filterCategory.trim().toLowerCase();
  if (a === b) return true;

  const groups: string[][] = [
    ['marketing', 'marketing & communications'],
    ['business', 'business & administration'],
    ['design', 'graphic design & creative media'],
  ];
  return groups.some((grp) => grp.includes(a) && grp.includes(b));
}

function normalizeProvinceToken(val: string): string {
  return val.trim().toLowerCase().replace(/[\s\-_]+/g, '');
}

function matchesProvinceFilter(jobProvince: string, filterProvince: string): boolean {
  if (jobProvince === filterProvince) return true;
  const normJob = normalizeProvinceToken(jobProvince);
  const normFilter = normalizeProvinceToken(filterProvince);
  if (normJob === normFilter) return true;

  const matchedProv = THAI_PROVINCES.find(
    (p) =>
      normalizeProvinceToken(p.id) === normFilter ||
      normalizeProvinceToken(p.nameTh) === normFilter ||
      normalizeProvinceToken(p.nameEn) === normFilter
  );
  if (!matchedProv) return false;

  return (
    normJob === normalizeProvinceToken(matchedProv.id) ||
    normJob === normalizeProvinceToken(matchedProv.nameTh) ||
    normJob === normalizeProvinceToken(matchedProv.nameEn)
  );
}

function extractSalaryBounds(salaryRange?: string): { min: number; max: number } | null {
  if (!salaryRange) return null;
  const matches = salaryRange.match(/\d[\d,]*/g);
  if (!matches || matches.length === 0) return null;
  const nums = matches
    .map((m) => Number(m.replace(/,/g, '')))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (nums.length === 0) return null;

  const lowerText = salaryRange.toLowerCase();
  let multiplier = 1;
  if (lowerText.includes('/hour') || lowerText.includes('ชม.') || lowerText.includes('ชั่วโมง')) {
    multiplier = 80; // Normalize part-time hourly rate to approximate monthly compensation
  } else if (lowerText.includes('/day') || lowerText.includes('/วัน') || lowerText.includes('ต่อวัน')) {
    multiplier = 20; // Normalize daily stipend/wage to approximate monthly compensation
  }

  const scaled = nums.map((n) => n * multiplier);
  return {
    min: Math.min(...scaled),
    max: Math.max(...scaled),
  };
}

// GET /api/jobs (Public)
app.get('/api/jobs', (req: Request, res: Response) => {
  try {
    let result = [...jobs];
    const { province, category, work_type, status, lang, q, sort } = req.query;

    if (province && typeof province === 'string' && province !== 'all') {
      result = result.filter((j) => matchesProvinceFilter(j.province, province));
    }
    if (category && typeof category === 'string' && category !== 'all') {
      result = result.filter((j) => matchesCategoryFilter(j.category, category));
    }
    if (work_type && typeof work_type === 'string' && work_type !== 'all') {
      const targetType = work_type.trim().toLowerCase();
      result = result.filter(
        (j) => (j.work_type || 'Full-time').trim().toLowerCase() === targetType
      );
    }
    if (status && typeof status === 'string' && status !== 'all') {
      result = result.filter((j) => j.status === status);
    }
    if (lang && typeof lang === 'string' && lang !== 'all') {
      result = result.filter((j) => resolveJobEffectiveLanguage(j) === lang);
    }
    if (q && typeof q === 'string' && q.trim()) {
      const query = q.trim().toLowerCase();
      result = result.filter((j) => {
        const provInfo = THAI_PROVINCES.find(
          (p) => p.nameTh === j.province || p.nameEn.toLowerCase() === j.province.toLowerCase()
        );
        const searchableFields = [
          j.title,
          j.title_th,
          j.title_en,
          j.description,
          j.description_th,
          j.description_en,
          j.responsibilities_th,
          j.responsibilities_en,
          j.qualifications_th,
          j.qualifications_en,
          j.required_skills_th,
          j.required_skills_en,
          j.benefits_th,
          j.benefits_en,
          j.company_name,
          j.location,
          j.province,
          provInfo?.nameEn,
          provInfo?.nameTh,
          j.category,
          j.work_type,
          j.salary_range,
        ];
        return searchableFields.some(
          (field) => typeof field === 'string' && field.toLowerCase().includes(query)
        );
      });
    }

    if (sort === 'salary_desc') {
      result.sort((a, b) => {
        const sa = extractSalaryBounds(a.salary_range);
        const sb = extractSalaryBounds(b.salary_range);
        if (sa && sb && sb.max !== sa.max) return sb.max - sa.max;
        if (sa && !sb) return -1;
        if (!sa && sb) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    } else if (sort === 'salary_asc') {
      result.sort((a, b) => {
        const sa = extractSalaryBounds(a.salary_range);
        const sb = extractSalaryBounds(b.salary_range);
        if (sa && sb && sa.min !== sb.min) return sa.min - sb.min;
        if (sa && !sb) return -1;
        if (!sa && sb) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    res.json({
      success: true,
      data: result,
      total: result.length,
    });
  } catch {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลประกาศงาน' });
  }
});

// GET /api/jobs/:id (Public)
app.get('/api/jobs/:id', (req: Request, res: Response) => {
  const job = jobs.find((j) => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'ไม่พบประกาศงานที่ระบุ' });
  }
  res.json({ success: true, data: job });
});

// POST /api/jobs (Protected: Employer Only)
app.post('/api/jobs', requireRole('employer'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const employer = req.authUser!;
    const {
      title,
      description,
      content_language,
      title_th,
      title_en,
      description_th,
      description_en,
      responsibilities_th,
      responsibilities_en,
      qualifications_th,
      qualifications_en,
      required_skills_th,
      required_skills_en,
      benefits_th,
      benefits_en,
      category,
      location,
      province,
      status,
      company_name,
      company_logo,
      salary_range,
      work_type,
      application_deadline,
    } = req.body;

    const cleanStr = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
    const selectedLang: JobContentLanguage =
      content_language === 'en' || content_language === 'both' ? content_language : 'th';

    const resolvedTitleTh =
      cleanStr(title_th) || (selectedLang === 'th' ? cleanStr(title) : '');
    const resolvedDescTh =
      cleanStr(description_th) || (selectedLang === 'th' ? cleanStr(description) : '');
    const resolvedTitleEn =
      cleanStr(title_en) || (selectedLang === 'en' ? cleanStr(title) : '');
    const resolvedDescEn =
      cleanStr(description_en) || (selectedLang === 'en' ? cleanStr(description) : '');

    if (!category || !cleanStr(location) || !cleanStr(province)) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (หมวดหมู่, สถานที่, จังหวัด)',
      });
    }

    if (selectedLang === 'th' && (!resolvedTitleTh || !resolvedDescTh)) {
      return res.status(400).json({
        success: false,
        message: 'กรุณากรอกชื่อตำแหน่งงานและรายละเอียดงาน (ภาษาไทย) ให้ครบถ้วน',
      });
    }

    if (selectedLang === 'en' && (!resolvedTitleEn || !resolvedDescEn)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Job Title (English) and Job Description (English).',
      });
    }

    if (
      selectedLang === 'both' &&
      (!resolvedTitleTh || !resolvedDescTh || !resolvedTitleEn || !resolvedDescEn)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'สำหรับการลงประกาศสองภาษา กรุณากรอกชื่อตำแหน่งงานและรายละเอียดงานทั้งภาษาไทยและภาษาอังกฤษ',
      });
    }

    const canonicalTitle = resolvedTitleTh || resolvedTitleEn || cleanStr(title);
    const canonicalDescription = resolvedDescTh || resolvedDescEn || cleanStr(description);

    const newJob: Job = {
      id: `job-${Date.now()}`,
      title: canonicalTitle,
      description: canonicalDescription,
      content_language: selectedLang,
      title_th: resolvedTitleTh || undefined,
      title_en: resolvedTitleEn || undefined,
      description_th: resolvedDescTh || undefined,
      description_en: resolvedDescEn || undefined,
      responsibilities_th: cleanStr(responsibilities_th) || undefined,
      responsibilities_en: cleanStr(responsibilities_en) || undefined,
      qualifications_th: cleanStr(qualifications_th) || undefined,
      qualifications_en: cleanStr(qualifications_en) || undefined,
      required_skills_th: cleanStr(required_skills_th) || undefined,
      required_skills_en: cleanStr(required_skills_en) || undefined,
      benefits_th: cleanStr(benefits_th) || undefined,
      benefits_en: cleanStr(benefits_en) || undefined,
      category,
      location: cleanStr(location),
      province: cleanStr(province),
      status: status || 'open',
      company_name: company_name || employer.companyName || employer.name,
      company_logo: cleanStr(company_logo) || undefined,
      employer_id: employer.id,
      salary_range: cleanStr(salary_range) || 'ตามตกลง',
      work_type: work_type || 'Full-time',
      application_deadline: cleanStr(application_deadline) || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    jobs.unshift(newJob);
    res.status(201).json({ success: true, data: newJob, message: 'สร้างประกาศงานสำเร็จเรียบร้อย' });
  } catch {
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการสร้างประกาศงาน' });
  }
});

// PATCH /api/jobs/:id (Protected: Employer Only)
app.patch('/api/jobs/:id', requireRole('employer'), (req: AuthenticatedRequest, res: Response) => {
  const employer = req.authUser!;
  const index = jobs.findIndex((j) => j.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'ไม่พบประกาศงานที่ระบุ' });
  }

  const existing = jobs[index];
  const canManageDemo = employer.id === 'emp-1' && Boolean(existing.is_demo);
  if (existing.employer_id !== employer.id && !canManageDemo) {
    return res.status(403).json({
      success: false,
      message: 'คุณไม่มีสิทธิ์แก้ไขประกาศงานของบริษัทอื่น',
    });
  }

  const body = req.body || {};

  // Non-destructive merge: editing Thai content never erases existing English fields (and vice versa)
  const mergeOptionalText = (key: keyof Job): string | undefined => {
    if (!(key in body)) {
      return existing[key] as string | undefined;
    }
    const incoming = typeof body[key] === 'string' ? body[key].trim() : '';
    return incoming || undefined;
  };

  const nextTitleTh = mergeOptionalText('title_th');
  const nextTitleEn = mergeOptionalText('title_en');
  const nextDescTh = mergeOptionalText('description_th');
  const nextDescEn = mergeOptionalText('description_en');

  const nextContentLang: JobContentLanguage =
    body.content_language === 'th' ||
    body.content_language === 'en' ||
    body.content_language === 'both'
      ? body.content_language
      : existing.content_language || resolveJobEffectiveLanguage(existing);

  // Keep top-level legacy `title` & `description` compatible without overwriting untouched descriptions
  const nextCanonicalTitle =
    typeof body.title === 'string' && body.title.trim()
      ? body.title.trim()
      : nextContentLang === 'en'
        ? nextTitleEn || nextTitleTh || existing.title
        : nextTitleTh || nextTitleEn || existing.title;

  const nextCanonicalDesc =
    typeof body.description === 'string' && body.description.trim()
      ? body.description.trim()
      : nextContentLang === 'en'
        ? nextDescEn || nextDescTh || existing.description
        : nextDescTh || nextDescEn || existing.description;

  const updatedJob: Job = {
    ...existing,
    ...body,
    id: existing.id,
    employer_id: existing.employer_id,
    title: nextCanonicalTitle,
    description: nextCanonicalDesc,
    content_language: nextContentLang,
    title_th: nextTitleTh,
    title_en: nextTitleEn,
    description_th: nextDescTh,
    description_en: nextDescEn,
    responsibilities_th: mergeOptionalText('responsibilities_th'),
    responsibilities_en: mergeOptionalText('responsibilities_en'),
    qualifications_th: mergeOptionalText('qualifications_th'),
    qualifications_en: mergeOptionalText('qualifications_en'),
    required_skills_th: mergeOptionalText('required_skills_th'),
    required_skills_en: mergeOptionalText('required_skills_en'),
    benefits_th: mergeOptionalText('benefits_th'),
    benefits_en: mergeOptionalText('benefits_en'),
    application_deadline: mergeOptionalText('application_deadline'),
    updated_at: new Date().toISOString(),
  };

  jobs[index] = updatedJob;
  res.json({ success: true, data: updatedJob, message: 'แก้ไขประกาศงานสำเร็จเรียบร้อย' });
});

// DELETE /api/jobs/:id (Protected: Employer Only)
app.delete('/api/jobs/:id', requireRole('employer'), (req: AuthenticatedRequest, res: Response) => {
  const employer = req.authUser!;
  const index = jobs.findIndex((j) => j.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'ไม่พบประกาศงานที่ต้องการลบ' });
  }

  const canManageDemo = employer.id === 'emp-1' && Boolean(jobs[index].is_demo);
  if (jobs[index].employer_id !== employer.id && !canManageDemo) {
    return res.status(403).json({
      success: false,
      message: 'คุณไม่มีสิทธิ์ลบประกาศงานของบริษัทอื่น',
    });
  }

  const removed = jobs.splice(index, 1)[0];
  res.json({ success: true, data: removed, message: 'ลบประกาศงานสำเร็จเรียบร้อย' });
});

// --- 2. APPLICATIONS ENDPOINTS ---

// POST /api/jobs/:jobId/applications (Protected: Student Only)
app.post(
  '/api/jobs/:jobId/applications',
  requireRole('student'),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const student = req.authUser!;
      const { jobId } = req.params;
      const { student_name, student_email, student_phone, notes, resume_url } = req.body;

      const job = jobs.find((j) => j.id === jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'ไม่พบประกาศงานที่ต้องการสมัคร' });
      }

      if (job.status !== 'open') {
        return res.status(400).json({
          success: false,
          message: 'ประกาศงานนี้ปิดรับสมัครแล้ว ไม่สามารถส่งใบสมัครได้',
        });
      }

      const existing = applications.find(
        (a) => a.job_id === jobId && a.student_id === student.id
      );
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'คุณได้ส่งใบสมัครสำหรับตำแหน่งงานนี้ไปแล้ว',
        });
      }

      const newApp: Application = {
        id: `app-${Date.now()}`,
        job_id: jobId,
        student_id: student.id,
        student_code: student.studentId || undefined,
        student_name: student_name || student.name || 'นิสิตนักศึกษา',
        student_email: student_email || student.email || '',
        student_phone: student_phone || student.phone || '',
        avatar_url: student.avatarUrl || undefined,
        university: student.university || undefined,
        faculty: student.faculty || undefined,
        major: student.major || undefined,
        year_of_study: student.yearOfStudy || undefined,
        notes: notes || '',
        resume_url: resume_url || '',
        portfolio_url: req.body?.portfolio_url || student.portfolioUrl || undefined,
        status: 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      applications.push(newApp);

      notifications.unshift({
        id: `notif-${Date.now()}`,
        recipient_id: student.id,
        title: 'ส่งใบสมัครสำเร็จ',
        message: `คุณได้สมัครตำแหน่ง ${job.title} ที่บริษัท ${job.company_name} เรียบร้อยแล้ว`,
        type: 'new_application',
        related_application_id: newApp.id,
        read: false,
        created_at: new Date().toISOString(),
      });

      res.status(201).json({
        success: true,
        data: enrichApplicationRecord(newApp),
        message: 'ส่งใบสมัครเรียบร้อยแล้ว',
      });
    } catch {
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการส่งใบสมัคร' });
    }
  }
);

function enrichApplicationRecord(appItem: Application) {
  const job = jobs.find((j) => j.id === appItem.job_id);
  const studentAccount = users.find((u) => u.id === appItem.student_id);

  // Only fall back to account-level fields when the application field was not explicitly set
  const pickField = (appVal: string | undefined, accountVal: string | undefined) => {
    if (typeof appVal === 'string' && appVal.trim()) return appVal.trim();
    if (appVal === undefined && typeof accountVal === 'string' && accountVal.trim()) {
      return accountVal.trim();
    }
    return undefined;
  };

  return {
    ...appItem,
    student_code: pickField(appItem.student_code, studentAccount?.studentId),
    student_name: pickField(appItem.student_name, studentAccount?.name) || 'ผู้สมัครงาน',
    student_email: pickField(appItem.student_email, studentAccount?.email),
    student_phone: pickField(appItem.student_phone, studentAccount?.phone),
    avatar_url: pickField(appItem.avatar_url, studentAccount?.avatarUrl),
    university: pickField(appItem.university, studentAccount?.university),
    faculty: pickField(appItem.faculty, studentAccount?.faculty),
    major: pickField(appItem.major, studentAccount?.major),
    year_of_study: pickField(appItem.year_of_study, studentAccount?.yearOfStudy),
    notes: typeof appItem.notes === 'string' && appItem.notes.trim() ? appItem.notes.trim() : undefined,
    resume_url:
      typeof appItem.resume_url === 'string' && appItem.resume_url.trim()
        ? appItem.resume_url.trim()
        : undefined,
    portfolio_url:
      typeof appItem.portfolio_url === 'string' && appItem.portfolio_url.trim()
        ? appItem.portfolio_url.trim()
        : undefined,
    employer_feedback:
      typeof appItem.employer_feedback === 'string' && appItem.employer_feedback.trim()
        ? appItem.employer_feedback.trim()
        : undefined,
    job_title: job?.title || 'ตำแหน่งงานที่ไม่ระบุ',
    job_title_th: job?.title_th,
    job_title_en: job?.title_en,
    company_name: job?.company_name || 'บริษัทที่ไม่ระบุ',
    location: job?.location || '-',
    province: job?.province || '-',
    category: job?.category || 'Other',
    work_type: job?.work_type,
    salary_range: job?.salary_range,
  };
}

// GET /api/applications/me (Protected: Student Only)
app.get(
  '/api/applications/me',
  requireRole('student'),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const student = req.authUser!;
      const userApps = applications.filter((a) => a.student_id === student.id);

      const enriched = userApps.map((appItem) => enrichApplicationRecord(appItem));

      enriched.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      res.json({
        success: true,
        data: enriched,
        total: enriched.length,
      });
    } catch {
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูลใบสมัคร' });
    }
  }
);

// PATCH /api/applications/:applicationId/status (Protected: Employer Only)
app.patch(
  '/api/applications/:applicationId/status',
  requireRole('employer'),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const employer = req.authUser!;
      const { applicationId } = req.params;
      const { status, employer_feedback } = req.body as {
        status?: unknown;
        employer_feedback?: unknown;
      };

      const allowedStatuses: ApplicationStatusType[] = [
        'submitted',
        'reviewing',
        'shortlisted',
        'interview',
        'rejected',
        'accepted',
      ];
      if (typeof status !== 'string' || !allowedStatuses.includes(status as ApplicationStatusType)) {
        return res.status(400).json({
          success: false,
          message: `สถานะไม่ถูกต้อง อนุญาตเฉพาะ: ${allowedStatuses.join(', ')}`,
        });
      }

      const validatedStatus = status as ApplicationStatusType;

      const appIndex = applications.findIndex((a) => a.id === applicationId);
      if (appIndex === -1) {
        return res.status(404).json({ success: false, message: 'ไม่พบใบสมัครที่ระบุ' });
      }

      const targetApp = applications[appIndex];
      const job = jobs.find((j) => j.id === targetApp.job_id);
      const canManageDemoApp = Boolean(job && employer.id === 'emp-1' && job.is_demo);
      if (job && job.employer_id !== employer.id && !canManageDemoApp) {
        return res.status(403).json({
          success: false,
          message: 'คุณไม่มีสิทธิ์อัปเดตสถานะใบสมัครของบริษัทอื่น',
        });
      }

      applications[appIndex].status = validatedStatus;
      if (typeof employer_feedback === 'string') {
        applications[appIndex].employer_feedback = employer_feedback.trim() || undefined;
      }
      applications[appIndex].updated_at = new Date().toISOString();

      const statusLabels: Record<ApplicationStatusType, string> = {
        submitted: 'ส่งใบสมัครแล้ว',
        reviewing: 'กำลังตรวจสอบ',
        shortlisted: 'ผ่านการคัดเลือกเบื้องต้น',
        interview: 'นัดสัมภาษณ์',
        accepted: 'ผ่านการคัดเลือก',
        rejected: 'ไม่ผ่านการคัดเลือก',
      };

      const feedbackNoteSuffix =
        applications[appIndex].employer_feedback
          ? ` — หมายเหตุจากบริษัท: ${applications[appIndex].employer_feedback}`
          : '';

      notifications.unshift({
        id: `notif-${Date.now()}`,
        recipient_id: targetApp.student_id,
        title: `อัปเดตสถานะใบสมัคร: ${statusLabels[validatedStatus] || validatedStatus}`,
        message: `ใบสมัครสำหรับตำแหน่ง ${job?.title || 'งาน'} ได้รับการเปลี่ยนสถานะเป็น "${statusLabels[validatedStatus] || validatedStatus}"${feedbackNoteSuffix}`,
        type: 'status_change',
        related_application_id: targetApp.id,
        read: false,
        created_at: new Date().toISOString(),
      });

      res.json({
        success: true,
        data: enrichApplicationRecord(applications[appIndex]),
        message: 'อัปเดตสถานะใบสมัครเรียบร้อยแล้ว',
      });
    } catch {
      res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะใบสมัคร' });
    }
  }
);

// --- 3. INTEGRATION & NOTIFICATION ENDPOINTS ---

app.get(
  '/api/integration/applications/:applicationId',
  requireAuth,
  (req: AuthenticatedRequest, res: Response) => {
    const application = applications.find((a) => a.id === req.params.applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: 'ไม่พบข้อมูลใบสมัครในการเชื่อมต่อระบบ' });
    }

    const job = jobs.find((j) => j.id === application.job_id);
    res.json({
      success: true,
      data: {
        application: enrichApplicationRecord(application),
        job,
        integration_timestamp: new Date().toISOString(),
      },
    });
  }
);

app.post('/api/integration/notifications', requireAuth, (req: Request, res: Response) => {
  const { recipient_id, title, message, type, related_application_id } = req.body;
  if (!recipient_id || !title || !message) {
    return res.status(400).json({ success: false, message: 'ข้อมูลการแจ้งเตือนไม่ครบถ้วน' });
  }

  const notif: NotificationItem = {
    id: `notif-${Date.now()}`,
    recipient_id,
    title,
    message,
    type: type || 'system',
    related_application_id,
    read: false,
    created_at: new Date().toISOString(),
  };

  notifications.unshift(notif);
  res.status(201).json({ success: true, data: notif, message: 'ส่งการแจ้งเตือนสำเร็จ' });
});

app.post('/api/webhooks/notification', (req: Request, res: Response) => {
  console.log('[Webhook Notification Received]:', req.body);
  res.json({
    success: true,
    received_at: new Date().toISOString(),
    payload: req.body,
  });
});

app.get('/api/notifications', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.authUser!;
  const result = notifications.filter((n) => n.recipient_id === user.id);
  res.json({ success: true, data: result });
});

// Employer applicants list (Protected: Employer Only)
app.get(
  '/api/employer/applicants',
  requireRole('employer'),
  (req: AuthenticatedRequest, res: Response) => {
    const employer = req.authUser!;
    const empJobs = jobs.filter(
      (j) => j.employer_id === employer.id || (employer.id === 'emp-1' && Boolean(j.is_demo))
    );
    const jobIds = new Set(empJobs.map((j) => j.id));

    const empApps = applications
      .filter((a) => jobIds.has(a.job_id))
      .map((appItem) => enrichApplicationRecord(appItem));

    empApps.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    res.json({
      success: true,
      data: empApps,
      total: empApps.length,
    });
  }
);

// Employer single applicant detail review (Protected: Employer Only)
app.get(
  '/api/employer/applicants/:applicationId',
  requireRole('employer'),
  (req: AuthenticatedRequest, res: Response) => {
    const employer = req.authUser!;
    const { applicationId } = req.params;

    const targetApp = applications.find((a) => a.id === applicationId);
    if (!targetApp) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลใบสมัครที่ระบุ (Applicant application not found)',
      });
    }

    const job = jobs.find((j) => j.id === targetApp.job_id);
    const canManageDemoApp = Boolean(job && employer.id === 'emp-1' && job.is_demo);
    if (!job || (job.employer_id !== employer.id && !canManageDemoApp)) {
      return res.status(403).json({
        success: false,
        message: 'คุณไม่มีสิทธิ์เข้าดูข้อมูลใบสมัครของบริษัทอื่น',
      });
    }

    return res.json({
      success: true,
      data: enrichApplicationRecord(targetApp),
    });
  }
);

// Ensure unknown /api/* routes always return JSON 404 instead of SPA HTML
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'ไม่พบ API Endpoint ที่ร้องขอ',
  });
});

// --- VITE MIDDLEWARE / STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get(['/auth/callback', '/auth/callback/', '*'], (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JobBoard Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
