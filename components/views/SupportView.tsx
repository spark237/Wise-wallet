
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Mail, MessageCircle, Phone } from 'lucide-react';

export const SupportView: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    // In a real app, this would send data to a backend
  };

  if (isSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
          <Mail size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Message Sent!</h2>
        <p className="text-slate-500 max-w-md">
          Thank you for contacting us. We have received your inquiry and will get back to you within 24 hours.
        </p>
        <Button onClick={() => { setIsSent(false); setSubject(''); setMessage(''); }}>Send Another Message</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Support Center</h1>
        <p className="text-slate-500">How can we help you today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Send us a message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Subject" 
              value={subject} 
              onChange={e => setSubject(e.target.value)} 
              placeholder="e.g. Issue with transaction"
              required 
            />
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all min-h-[150px]"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe your issue or question..."
                required
              />
            </div>

            <Button type="submit" className="w-full">Submit Inquiry</Button>
          </form>
        </div>

        {/* Contact Info & FAQ */}
        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
             <h3 className="text-indigo-900 font-bold mb-4">Contact Information</h3>
             <div className="space-y-3 text-indigo-800">
                <div className="flex items-center gap-3">
                   <Mail size={18} />
                   <span>support@wisewallet.demo</span>
                </div>
                <div className="flex items-center gap-3">
                   <Phone size={18} />
                   <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                   <MessageCircle size={18} />
                   <span>Live Chat (Mon-Fri, 9am-5pm)</span>
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
             <div className="space-y-4">
                <div>
                   <h4 className="font-medium text-slate-800 text-sm">How do I change my currency?</h4>
                   <p className="text-xs text-slate-500 mt-1">Currently, currency is set during account creation. Please contact support to change it.</p>
                </div>
                <div>
                   <h4 className="font-medium text-slate-800 text-sm">Is my data secure?</h4>
                   <p className="text-xs text-slate-500 mt-1">Yes, all data is stored locally on your device for this demo version.</p>
                </div>
                <div>
                   <h4 className="font-medium text-slate-800 text-sm">Can I export my data?</h4>
                   <p className="text-xs text-slate-500 mt-1">Yes, go to the Export section to download CSV or JSON files.</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
