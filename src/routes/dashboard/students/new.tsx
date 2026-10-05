import { createFileRoute, useNavigate } from '@tanstack/react-router';
import api from '@/lib/apiClient';
import { StudentForm } from '../../../components/forms/StudentForm';

export const Route = createFileRoute('/dashboard/students/new')({
  component: NewStudentPage,
});

function NewStudentPage() {
  const navigate = useNavigate();
  const handleSave = async (studentData: any) => {
    await api.post('/api/students', studentData);
    navigate({ to: '/dashboard/students' });
  };

  return (
    <StudentForm
      onSave={handleSave}
      onCancel={() => navigate({ to: '/dashboard/students' })}
      title="تسجيل طالب جديد في المدرسة"
      subtitle="أدخل بيانات الطالب الشخصية وحدد موضع الحفظ القرآني الحالي. أضف الطالب إلى حلقة من صفحة الحلقة."
    />
  );
}
