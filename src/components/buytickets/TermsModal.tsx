"use client";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[80vh]">
        <div className="p-6 pb-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Terms & Conditions</h2>
        </div>
        
        <div className="p-6 overflow-y-auto text-sm text-gray-600 space-y-3 leading-relaxed">
          <p>1. Seat layouts shown are indicative; actual auditorium layouts may vary.</p>
          <p>2. Tickets are mandatory for children aged 3+ (5+ in Uttarakhand).</p>
          <p>3. Entry is restricted for patrons below 18 years for A certified films.</p>
          <p>4. Baggage counter facilities are unavailable; avoid carrying large/restricted items.</p>
          <p>5. 3D ticket prices include charges for 3D glasses usage.</p>
          <p>6. Outside food & beverages are strictly prohibited, including deliveries via third-party apps, even if containing PVR INOX items.</p>
          <p>7. Prohibited items include laptops, tablets, cameras, weapons, and hazardous or inflammable objects.</p>
          <p>8. Carry bags, helmets, and large handbags are not permitted inside auditoriums.</p>
          <p>9. Entry will be denied to patrons under the influence of alcohol or drugs.</p>
          <p>10. Tickets once purchased are non-cancellable, non-transferable, and cannot be modified.</p>
          <p>11. PVR INOX may contact patrons for feedback and service improvement.</p>
          <p>12. Management reserves the right of admission; all decisions are final and binding.</p>
          <p>13. Pre-booked F&B must be collected from designated counters.</p>
          <p>14. Recording or transmitting film content via any device is strictly prohibited and punishable under law.</p>
          <p>15. Smoking and use of cigarettes, lighters, matchsticks, gutkha, and pan masala are prohibited.</p>
          <p>16. Ticket prices are subject to change without prior notice.</p>
          <p>17. For private screenings or special occasions, please contact the cinema manager.</p>
          <p>18. Infants below 4 years or children under 3.6 feet are not permitted in 4DX auditoriums due to safety norms.</p>
          <p>19. Smart recording devices (including Meta glasses) are strictly prohibited inside auditoriums. Entry may be denied or cancelled without refund in case of non-compliance.</p>
        </div>
        
        <div className="p-6 pt-4 border-t flex gap-4 bg-white relative">
          <div className="absolute top-0 left-0 right-0 h-4 -mt-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-md border border-[#f84464] text-[#f84464] font-semibold hover:bg-red-50 transition"
          >
            Cancel
          </button>
          <button 
            onClick={onAccept}
            className="flex-1 py-3 rounded-md bg-[#f84464] text-white font-semibold shadow-md hover:bg-[#e03c5a] transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
