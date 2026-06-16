import React, { useState } from 'react';
import { addBookingInquiry, getSocialLinks } from '../utils/storage';
import { Mail, Calendar, MapPin, Send, User, Phone, Info } from 'lucide-react';
import { FadeIn } from './FadeIn';

interface BookingFormSectionProps {
  lang: 'vi' | 'en';
}

export const BookingFormSection: React.FC<BookingFormSectionProps> = ({ lang }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    phone: '',
    date: '',
    venue: '',
    eventType: 'Club Show',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.email || !formData.date || !formData.venue) {
      alert(lang === 'vi' ? 'Vui lòng điền các trường bắt buộc (*).' : 'Please fill in all required fields (*).');
      return;
    }

    // Save to local storage
    addBookingInquiry(formData);
    
    // Open email client prefilled
    const djEmail = getSocialLinks().email || 'nguyenvietanh2169@gmail.com';
    const emailSubject = `[Booking Inquiry] ${formData.clientName} - ${formData.date}`;
    const emailBody = `YÊU CẦU BOOKING DJ VANZI:
----------------------------------
Họ tên / Đơn vị: ${formData.clientName}
Email: ${formData.email}
Số điện thoại: ${formData.phone || 'N/A'}
Ngày sự kiện: ${formData.date}
Địa điểm: ${formData.venue}
Thể loại chương trình: ${formData.eventType}
Lời nhắn: ${formData.message || 'N/A'}
----------------------------------
Yêu cầu được gửi tự động từ Website.`;

    const mailtoUrl = `mailto:${djEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    setIsSubmitted(true);
    
    // Trigger mail client redirect after a short toast delay
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      email: '',
      phone: '',
      date: '',
      venue: '',
      eventType: 'Club Show',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <section 
      id="booking-form" 
      className="relative py-20 sm:py-28 w-full bg-[#0C0C0C] border-b border-white/5 overflow-hidden"
    >
      <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#F2BF00]/5 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] rounded-full bg-[#F2BF00]/5 blur-[90px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <FadeIn delay={0} y={30} as="div">
            <span className="text-[#F2BF00] text-xs sm:text-sm uppercase tracking-widest font-mono font-bold mb-2 block">
              {lang === 'vi' ? 'LIÊN HỆ ĐẶT LỊCH' : 'RESERVE A DATE'}
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight hero-heading leading-none">
              {lang === 'vi' ? 'Form Booking Siêu Tốc' : 'Quick Booking Inquiry'}
            </h2>
            <p className="text-xs sm:text-sm text-[#D7E2EA]/50 max-w-lg mx-auto mt-4 leading-relaxed font-medium">
              {lang === 'vi' 
                ? 'Gửi yêu cầu booking trực tiếp. Biểu mẫu sẽ tự động lưu thông tin và mở ứng dụng Email để gửi yêu cầu chính thức tới DJ.' 
                : 'Send booking inquiries directly. The form will save the details and launch your mail application to send a formal request.'}
            </p>
          </FadeIn>
        </div>

        {/* Booking Form Layout */}
        <FadeIn delay={0.15} y={40} className="w-full" as="div">
          <div className="bg-[#141416]/75 border border-[#D7E2EA]/10 p-6 sm:p-10 rounded-3xl backdrop-blur-md shadow-2xl">
            {isSubmitted ? (
              <div className="text-center py-12 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-[#F2BF00]/10 border border-[#F2BF00]/30 rounded-full flex items-center justify-center text-[#F2BF00] animate-pulse">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold uppercase text-white tracking-wider">
                  {lang === 'vi' ? 'Gửi Yêu Cầu Thành Công!' : 'Inquiry Submitted!'}
                </h3>
                <p className="text-sm text-[#D7E2EA]/60 max-w-sm">
                  {lang === 'vi' 
                    ? 'Thông tin đã được lưu. Đang kết nối tới ứng dụng Email của bạn...' 
                    : 'Information saved successfully. Launching your email client...'}
                </p>
                <button 
                  onClick={resetForm}
                  className="mt-6 text-xs font-bold uppercase text-[#F2BF00] hover:text-white transition-colors"
                >
                  {lang === 'vi' ? 'Gửi yêu cầu khác' : 'Submit another booking request'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Form fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                      <User className="w-3 h-3 text-[#F2BF00]" />
                      {lang === 'vi' ? 'Họ tên / Đơn vị *' : 'Name / Organization *'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder={lang === 'vi' ? 'VD: Nguyễn Văn A' : 'e.g. John Doe'}
                      value={formData.clientName}
                      onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                      className="bg-[#0c0c0e]/95 border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-3 rounded-2xl text-sm transition-colors text-white font-medium"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#F2BF00]" />
                      {lang === 'vi' ? 'Email Liên hệ *' : 'Contact Email *'}
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="bg-[#0c0c0e]/95 border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-3 rounded-2xl text-sm transition-colors text-white font-medium"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#F2BF00]" />
                      {lang === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                    </label>
                    <input 
                      type="tel" 
                      placeholder="VD: 0987654321"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-[#0c0c0e]/95 border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-3 rounded-2xl text-sm transition-colors text-white font-medium"
                    />
                  </div>

                  {/* Event Date */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#F2BF00]" />
                      {lang === 'vi' ? 'Ngày sự kiện *' : 'Event Date *'}
                    </label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="bg-[#0c0c0e]/95 border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-3 rounded-2xl text-sm transition-colors text-white font-medium"
                    />
                  </div>

                  {/* Venue */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F2BF00]" />
                      {lang === 'vi' ? 'Địa điểm / Venue *' : 'Venue / Location *'}
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder={lang === 'vi' ? 'VD: 1900 Club, Hà Nội' : 'e.g. 1900 Club, Hanoi'}
                      value={formData.venue}
                      onChange={e => setFormData({ ...formData, venue: e.target.value })}
                      className="bg-[#0c0c0e]/95 border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-3 rounded-2xl text-sm transition-colors text-white font-medium"
                    />
                  </div>

                  {/* Event Type */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                      <Info className="w-3 h-3 text-[#F2BF00]" />
                      {lang === 'vi' ? 'Thể loại chương trình' : 'Event Type'}
                    </label>
                    <select 
                      value={formData.eventType}
                      onChange={e => setFormData({ ...formData, eventType: e.target.value })}
                      className="bg-[#0c0c0e]/95 border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-3 py-3 rounded-2xl text-sm transition-colors text-white font-medium focus:bg-[#0c0c0e]"
                    >
                      <option value="Club Show">{lang === 'vi' ? 'Club Set / Quán Bar' : 'Club Show'}</option>
                      <option value="Festival">{lang === 'vi' ? 'Lễ hội Âm nhạc / Festival' : 'Music Festival'}</option>
                      <option value="Private Set">{lang === 'vi' ? 'Sự kiện riêng tư / Private Set' : 'Private Event'}</option>
                      <option value="Other">{lang === 'vi' ? 'Khác' : 'Other'}</option>
                    </select>
                  </div>

                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[10px] text-[#D7E2EA]/50 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                    <Info className="w-3 h-3 text-[#F2BF00]" />
                    {lang === 'vi' ? 'Lời nhắn gửi / Chi tiết công việc' : 'Message / Details'}
                  </label>
                  <textarea 
                    rows={4}
                    placeholder={lang === 'vi' ? 'Chi tiết thời gian set nhạc, cát-xê dự kiến, thiết bị có sẵn...' : 'Details about set times, budget, equipment available...'}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="bg-[#0c0c0e]/95 border border-[#D7E2EA]/10 focus:border-[#F2BF00]/50 outline-none px-4 py-3.5 rounded-2xl text-sm transition-colors leading-relaxed"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="mt-4 flex items-center justify-center gap-2 bg-[#F2BF00] hover:bg-white text-black font-semibold uppercase text-xs tracking-widest py-4 rounded-2xl transition-all shadow-lg hover:shadow-[0_4px_20px_rgba(242,191,0,0.3)] active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  {lang === 'vi' ? 'Gửi Yêu Cầu Booking' : 'Send Booking Inquiry'}
                </button>

              </form>
            )}
          </div>
        </FadeIn>

      </div>
    </section>
  );
};
