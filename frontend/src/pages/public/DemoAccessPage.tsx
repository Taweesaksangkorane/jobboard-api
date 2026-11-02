import { BriefcaseBusiness, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function DemoAccessPage() {
  const navigate = useNavigate();
  const { selectRole } = useAuth();

  const enter = (role: 'student' | 'employer') => {
    selectRole(role);
    navigate(role === 'student' ? '/student/dashboard' : '/employer/dashboard');
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-6 py-12">
      <div className="w-full rounded-3xl border border-[#E9EAF1] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#25243A]">เลือกบทบาทสำหรับทดสอบระบบ</h1>
        <p className="mt-2 text-sm text-[#73758A]">
          ระบบ backend ปัจจุบันยังไม่มี API เข้าสู่ระบบ หน้านี้จึงใช้บัญชีทดสอบ Student #4 และ Employer #1 เท่านั้น
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button onClick={() => enter('student')} className="rounded-2xl border border-[#DDD7FA] p-6 text-left hover:bg-[#F7F5FF]">
            <GraduationCap className="mb-4 h-8 w-8 text-[#6C4CE3]" />
            <span className="block font-bold text-[#25243A]">เข้าใช้งานเป็นนักศึกษา</span>
            <span className="mt-1 block text-xs text-[#73758A]">ดูงาน สมัครงาน และติดตามใบสมัคร</span>
          </button>
          <button onClick={() => enter('employer')} className="rounded-2xl border border-[#DDD7FA] p-6 text-left hover:bg-[#F7F5FF]">
            <BriefcaseBusiness className="mb-4 h-8 w-8 text-[#6C4CE3]" />
            <span className="block font-bold text-[#25243A]">เข้าใช้งานเป็นนายจ้าง</span>
            <span className="mt-1 block text-xs text-[#73758A]">สร้าง แก้ไข และจัดการประกาศงาน</span>
          </button>
        </div>
      </div>
    </div>
  );
}
