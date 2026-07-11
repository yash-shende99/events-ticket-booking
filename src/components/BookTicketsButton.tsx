"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookTicketsButtonProps {
  movieId: string;
  movieTitle: string;
  certification: string;
  formats: string[];
  languages: string[];
}

export default function BookTicketsButton({ movieId, movieTitle, certification, formats, languages }: BookTicketsButtonProps) {
  const router = useRouter();
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [showFormatModal, setShowFormatModal] = useState(false);

  const handleBookClick = () => {
    if (certification === "A") {
      setShowAgeModal(true);
    } else {
      setShowFormatModal(true);
    }
  };

  const handleAgeContinue = () => {
    setShowAgeModal(false);
    setShowFormatModal(true);
  };

  return (
    <>
      <button 
        onClick={handleBookClick}
        className="bg-[#f84464] hover:bg-[#d83552] text-white font-semibold text-lg px-12 py-3 rounded-lg w-max transition shadow-lg"
      >
        Book tickets
      </button>

      {/* Age Verification Modal */}
      {showAgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">This movie is rated "A"</h3>
              <div className="flex gap-4 items-start mb-6">
                <div className="w-12 h-12 rounded-full border-2 border-[#f84464] flex items-center justify-center shrink-0">
                  <span className="font-bold text-[#f84464] text-lg">18+</span>
                </div>
                <p className="text-sm text-gray-600">
                  This movie is only for viewers above 18. Please carry a valid ID/Age Proof to the theatre. If you are denied entry due to age or ID issues, you will not get a refund.
                </p>
              </div>
              <button 
                onClick={handleAgeContinue}
                className="w-full bg-[#f84464] hover:bg-[#d83552] text-white font-semibold py-3 rounded-lg transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Format Selection Modal */}
      {showFormatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b">
              <div>
                <p className="text-xs text-gray-500">{movieTitle}</p>
                <h3 className="text-lg font-semibold text-gray-900">Select language and format</h3>
              </div>
              <button onClick={() => setShowFormatModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-0">
              {languages.map((lang, idx) => (
                <div key={idx} className="mb-2">
                  <div className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">
                    {lang.toUpperCase()}
                  </div>
                  <div className="px-4 py-4 flex gap-3 flex-wrap">
                    {formats.map((format, fIdx) => (
                      <button 
                        key={fIdx} 
                        onClick={() => {
                          setShowFormatModal(false);
                          router.push(`/movies/${movieId}/buytickets?lang=${lang}&format=${format}`);
                        }}
                        className="px-4 py-1.5 rounded-full border border-gray-300 text-[#f84464] hover:bg-red-50 text-sm font-medium transition"
                      >
                        {format}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
