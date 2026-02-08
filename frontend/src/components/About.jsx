import { Target, Eye, Heart, Lightbulb } from 'lucide-react';

function About() {
    const features = [
        {
            icon: Target,
            title: 'رسالتنا',
            description: 'تقديم تعليم عالي الجودة يمكّن الطلاب من تحقيق إمكاناتهم الكاملة والمساهمة في بناء مجتمعهم.',
            color: 'from-primary-500 to-primary-600',
        },
        {
            icon: Eye,
            title: 'رؤيتنا',
            description: 'أن نكون مؤسسة تعليمية رائدة في السودان، معروفة بتميزها الأكاديمي وقيمها الأصيلة.',
            color: 'from-accent-500 to-accent-600',
        },
        {
            icon: Heart,
            title: 'قيمنا',
            description: 'النزاهة، الاحترام، التميز، الإبداع، والعمل الجماعي هي أساس كل ما نقوم به.',
            color: 'from-rose-500 to-rose-600',
        },
        {
            icon: Lightbulb,
            title: 'منهجنا',
            description: 'نتبع المنهج السوداني المعتمد مع إضافة برامج إثرائية تنمي مهارات الطلاب.',
            color: 'from-amber-500 to-orange-500',
        },
    ];

    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 font-medium mb-4">
                        من نحن
                    </span>

                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                        أكاديمية ستينج الخاصة بنين - بنات

                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        تأسست أكاديمية ستينج الخاصة بنين - بنات عام 2014 لتكون     منارة للعلم والمعرفة في السودان.
                        نحن ملتزمون بتوفير بيئة تعليمية آمنة ومحفزة لجميع طلابنا.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow animate-fadeIn"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                                <feature.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Academic Levels */}
                <div className="mt-16 bg-white rounded-3xl p-8 shadow-lg">
                    <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">المراحل الدراسية</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 border border-primary-100">
                            <div className="text-4xl font-bold text-primary-600 mb-2">الأول</div>
                            <div className="text-gray-600 font-medium">الصف الأول الثانوي</div>
                            <div className="text-sm text-gray-500 mt-2">أساسيات العلوم والآداب</div>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100/50 border border-accent-100">
                            <div className="text-4xl font-bold text-accent-600 mb-2">الثاني</div>
                            <div className="text-gray-600 font-medium">الصف الثاني الثانوي</div>
                            <div className="text-sm text-gray-500 mt-2">التخصص (علمي / أدبي)</div>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100">
                            <div className="text-4xl font-bold text-amber-600 mb-2">الثالث</div>
                            <div className="text-gray-600 font-medium">الصف الثالث الثانوي</div>
                            <div className="text-sm text-gray-500 mt-2">الإعداد للشهادة السودانية</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
