import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api';
import { ArrowRight, Save, AlertCircle } from 'lucide-react';

function StudentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        student_code: '',
        name: '',
        phone: '',
        address: '',
        parent_name: '',
        parent_phone: '',
        academic_level: 1,
        specialization: 'Gen',
        total_score: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            loadStudent();
        }
    }, [id]);

    const loadStudent = async () => {
        try {
            const data = await api.getStudent(id);
            setFormData({
                student_code: data.student_code,
                name: data.name,
                phone: data.phone || '',
                address: data.address || '',
                parent_name: data.parent_name,
                parent_phone: data.parent_phone,
                academic_level: data.academic_level,
                specialization: data.specialization,
                total_score: data.result?.total_score || '',
            });
        } catch (error) {
            console.error('Failed to load student:', error);
            navigate('/dashboard/students');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: name === 'academic_level' ? Number(value) : value
            };

            // If grade changed to 1 or 2, auto-set specialization to 'Gen'
            if (name === 'academic_level' && Number(value) < 3) {
                newData.specialization = 'Gen';
            }

            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const submitData = { ...formData };

        // Ensure academic_level is number
        submitData.academic_level = Number(submitData.academic_level);

        // Handle empty total_score (DRF DecimalField doesn't like empty strings)
        if (submitData.total_score === '' || submitData.total_score === null) {
            delete submitData.total_score;
        } else {
            submitData.total_score = Number(submitData.total_score);
        }

        // If not Grade 3, forced to General
        if (submitData.academic_level < 3) {
            submitData.specialization = 'Gen';
        }

        try {
            if (isEdit) {
                await api.updateStudent(id, submitData);
            } else {
                await api.createStudent(submitData);
            }
            navigate('/dashboard/students');
        } catch (err) {
            setError(err.message || 'فشل حفظ بيانات الطالب');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    to="/dashboard/students"
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <ArrowRight className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isEdit ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
                    </h1>
                    <p className="text-gray-500">
                        {isEdit ? 'تعديل بيانات الطالب الحالية' : 'إدخال بيانات طالب جديد'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg space-y-6">
                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Code */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">كود الطالب *</label>
                        <input
                            type="text"
                            name="student_code"
                            value={formData.student_code}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            placeholder="مثال: STD001"
                        />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">اسم الطالب *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            placeholder="الاسم الكامل"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">هاتف الطالب</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            placeholder="اختياري"
                        />
                    </div>

                    {/* Parent Name */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">اسم ولي الأمر *</label>
                        <input
                            type="text"
                            name="parent_name"
                            value={formData.parent_name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        />
                    </div>

                    {/* Parent Phone */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">هاتف ولي الأمر *</label>
                        <input
                            type="text"
                            name="parent_phone"
                            value={formData.parent_phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        />
                    </div>

                    {/* Academic Level */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">الصف الدراسي *</label>
                        <select
                            name="academic_level"
                            value={formData.academic_level}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                        >
                            <option value={1}>الصف الأول</option>
                            <option value={2}>الصف الثاني</option>
                            <option value={3}>الصف الثالث</option>
                        </select>
                    </div>

                    {/* Specialization */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            التخصص *
                            {formData.academic_level < 3 && <span className="text-xs text-gray-400 mr-2">(متاح للصف الثالث فقط)</span>}
                        </label>
                        <select
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            disabled={formData.academic_level < 3}
                            className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all ${formData.academic_level < 3 ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                        >
                            <option value="Gen">عام</option>
                            <option value="Sci">علمي</option>
                            <option value="Lit">أدبي</option>
                        </select>
                    </div>

                    {/* Total Score */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">النتيجة (اختياري)</label>
                        <input
                            type="number"
                            name="total_score"
                            value={formData.total_score}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            placeholder="الدرجة الكلية"
                        />
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">العنوان</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                        placeholder="اختياري"
                    />
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl gradient-primary text-white font-bold hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/30 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                جاري الحفظ...
                            </span>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {isEdit ? 'حفظ التعديلات' : 'إضافة الطالب'}
                            </>
                        )}
                    </button>
                    <Link
                        to="/dashboard/students"
                        className="px-8 py-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium"
                    >
                        إلغاء
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default StudentForm;
