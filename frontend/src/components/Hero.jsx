import { BookOpen, Award, Users } from 'lucide-react';
import logo from '../assets/rem.png';
import logo2 from '../assets/socity.png';
function Hero() {
  return (
    <section id="home" className="min-h-screen pt-16 relative overflow-hidden">
      {/* Background - Kept clean without the image inside it */}
      <div className="absolute inset-0 gradient-hero"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Right Column: Content */}
          <div className="text-right order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white mb-8 animate-fadeIn">
              <Award className="w-5 h-5" />
              <span className="font-medium">منذ عام 2014 - التميز في التعليم</span>
            </div>

            <h1 className="text-4xl gap-2 sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight animate-fadeIn">
              مرحباً بكم في

              <span className="block text-2xl sm:text-3xl lg:text-4xl mt-2 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text ">

                أكاديمية ستينج الخاصة بنين - بنات

                <br />


              </span>
            </h1>
            <span className="block text-white font-bold text-2xl sm:text-3xl lg:text-4xl  animate-slideIn delay-100 duration-500  ease-in-out transition-all  hover:scale-105 cursor-pointer  hover:text-yellow-500 
                hover:font-bold hover:animate-pulse hover:animate-infinite mt-2
                 hover:animate-duration-500 hover:animate-delay-500 
                 hover:animate-iteration-count-infinite  ">التعليم</span>
            <p className="text-xl text-white/80 max-w-2xl mb-10 animate-fadeIn">
              نحن نؤمن بأن كل طالب يستحق تعليماً متميزاً. نقدم بيئة تعليمية محفزة تجمع بين الأصالة والمعاصرة.
            </p>

            <div className="flex flex-wrap gap-4 mb-16 animate-fadeIn">
              <a href="#about" className="px-8 py-3.5 rounded-xl bg-white text-primary-700 font-bold hover:bg-gray-100 transition-colors shadow-xl">
                تعرف علينا
              </a>
              <a href="#contact" className="px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-colors">
                تواصل معنا
              </a>
            </div>
          </div>

          {/* Left Column: YOUR IMAGE HERE */}
          <div className="relative order-1 lg:order-2 animate-fadeIn">
            {/* Added a defined height/aspect ratio wrapper */}
            <div className="relative z-10 ">
              <img
                src={logo2}
                alt="أكاديمية ستينج"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative background glow behind the image */}
            <div className="absolute -top-4 -right-4 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl -z-10"></div>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-20">
          <div className="glass rounded-2xl p-6 animate-fadeIn text-center">
            <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">+500</div>
            <div className="text-gray-600">طالب وطالبة</div>
          </div>

          <div className="glass rounded-2xl p-6 animate-fadeIn text-center" style={{ animationDelay: '0.1s' }}>
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">+30</div>
            <div className="text-gray-600">معلم متميز</div>
          </div>

          <div className="glass rounded-2xl p-6 animate-fadeIn text-center" style={{ animationDelay: '0.2s' }}>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">98%</div>
            <div className="text-gray-600">نسبة النجاح</div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}

export default Hero;