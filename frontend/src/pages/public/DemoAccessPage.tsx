import React, { useEffect, useState } from 'react';
import { BriefcaseBusiness, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { studentService, type DemoEmployer, type DemoStudent } from '../../services/studentService';

export function DemoAccessPage() {
  const navigate = useNavigate();
  const { selectRole, selectDemoEmployer, selectDemoStudent } = useAuth();
  const [students, setStudents] = useState<DemoStudent[]>([]);
  const [employers, setEmployers] = useState<DemoEmployer[]>([]);
  const [studentId, setStudentId] = useState('4');
  const [employerId, setEmployerId] = useState('1');

  useEffect(() => {
    Promise.all([studentService.getStudents(), studentService.getEmployers()])
      .then(([studentData, employerData]) => {
        setStudents(studentData);
        setEmployers(employerData);
        if (!studentData.some((student) => String(student.student_id) === '4') && studentData[0]) setStudentId(String(studentData[0].student_id));
        if (!employerData.some((employer) => String(employer.employer_id) === '1') && employerData[0]) setEmployerId(String(employerData[0].employer_id));
      })
      .catch(() => {});
  }, []);

  const enter = (role: 'student' | 'employer') => {
    if (role === 'student') {
      const student = students.find((item) => String(item.student_id) === studentId);
      if (student) selectDemoStudent({ id: String(student.student_id), name: student.name, email: student.email || '' });
      else selectRole(role);
    } else {
      const employer = employers.find((item) => String(item.employer_id) === employerId);
      if (employer) selectDemoEmployer({ id: String(employer.employer_id), companyName: employer.company_name });
      else selectRole(role);
    }
    navigate(role === 'student' ? '/student/dashboard' : '/employer/dashboard');
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-6 py-12">
      <div className="w-full rounded-3xl border border-[#E9EAF1] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-[#25243A]">เลือกบทบาทสำหรับทดสอบระบบ</h1>
        <p className="mt-2 text-sm text-[#73758A]">
          เลือกบัญชีตัวอย่างก่อนเข้าสู่ระบบ ข้อมูลที่แก้ไขในหน้านี้มีไว้สำหรับสาธิตเท่านั้น
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#DDD7FA] p-6 text-left">
            <GraduationCap className="mb-4 h-8 w-8 text-[#6C4CE3]" />
            <span className="block font-bold text-[#25243A]">เข้าใช้งานเป็นนักศึกษา</span>
            <span className="mt-1 block text-xs text-[#73758A]">ดูงาน สมัครงาน และติดตามใบสมัคร</span>
            <label className="mt-5 block text-xs font-medium text-[#25243A]" htmlFor="demo-access-student">เลือกนักศึกษา</label>
            <select id="demo-access-student" value={studentId} onChange={(event) => setStudentId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#E9EAF1] bg-white px-3 py-2 text-sm text-[#25243A] outline-none focus:border-[#6C4CE3]">
              {students.map((student) => <option key={student.student_id} value={student.student_id}>{student.name}</option>)}
            </select>
            <button onClick={() => enter('student')} className="mt-3 w-full rounded-xl bg-[#6C4CE3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5638C5]">เข้าสู่ Student Demo</button>
          </div>
          <div className="rounded-2xl border border-[#DDD7FA] p-6 text-left">
            <BriefcaseBusiness className="mb-4 h-8 w-8 text-[#6C4CE3]" />
            <span className="block font-bold text-[#25243A]">เข้าใช้งานเป็นนายจ้าง</span>
            <span className="mt-1 block text-xs text-[#73758A]">สร้าง แก้ไข และจัดการประกาศงาน</span>
            <label className="mt-5 block text-xs font-medium text-[#25243A]" htmlFor="demo-access-employer">เลือกบริษัท</label>
            <select id="demo-access-employer" value={employerId} onChange={(event) => setEmployerId(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#E9EAF1] bg-white px-3 py-2 text-sm text-[#25243A] outline-none focus:border-[#6C4CE3]">
              {employers.map((employer) => <option key={employer.employer_id} value={employer.employer_id}>{employer.company_name}</option>)}
            </select>
            <button onClick={() => enter('employer')} className="mt-3 w-full rounded-xl bg-[#6C4CE3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#5638C5]">เข้าสู่ Employer Demo</button>
          </div>
        </div>
      </div>
    </div>
  );
}
