import React, { useState, useRef } from 'react';
import { Upload, Camera, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { appraiseBookImage } from '../services/geminiService';
import { AppraisalResult } from '../types';

export const Appraiser: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AppraisalResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null); // Reset result on new image
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAppraise = async () => {
    if (!image || !file) return;

    setIsLoading(true);
    try {
      // Extract base64 without prefix
      const base64Data = image.split(',')[1];
      const mimeType = file.type;

      const data = await appraiseBookImage(base64Data, mimeType);
      setResult(data);
    } catch (error) {
      console.error("Appraisal failed", error);
      alert("Analysis failed. Please try a different image.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-heading text-[#2C2420] mb-4">Digital Appraisal</h2>
        <p className="text-[#5C4D45] font-body-serif text-lg max-w-2xl mx-auto">
          Upload a clear photograph of a book's cover or spine. Our system will analyze its visual characteristics to estimate its era, identify the edition, and assess its physical condition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Upload Section */}
        <div className="space-y-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              image ? 'border-[#8B5E3C] bg-[#FDFBF7]' : 'border-[#D4C5B0] hover:border-[#8B5E3C] hover:bg-[#F5F0E6]/50'
            }`}
          >
            {image ? (
              <div className="relative">
                <img src={image} alt="Preview" className="max-h-96 mx-auto rounded shadow-lg" />
                <button 
                  onClick={() => {
                    setImage(null);
                    setResult(null);
                    setFile(null);
                  }}
                  className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-[#2C2420] hover:text-red-600"
                >
                  <AlertCircle className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <div 
                className="cursor-pointer flex flex-col items-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-16 h-16 text-[#D4C5B0] mb-4" />
                <p className="text-lg font-medium text-[#2C2420]">Click to upload image</p>
                <p className="text-sm text-[#8B5E3C] mt-2">JPG or PNG formats supported</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden" 
            />
          </div>

          <button
            onClick={handleAppraise}
            disabled={!image || isLoading}
            className={`w-full py-4 rounded-sm font-semibold flex items-center justify-center text-lg transition-colors ${
              !image || isLoading 
                ? 'bg-[#E5DCC5] text-[#5C4D45] cursor-not-allowed'
                : 'bg-[#2C2420] text-[#E6C685] hover:bg-[#1A1614]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Analyzing Pigments & Typography...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5 mr-2" />
                Begin Appraisal
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white border border-[#E5DCC5] rounded-sm p-8 shadow-sm min-h-[400px]">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-[#D4C5B0] text-center">
              <Camera className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-heading">Awaiting Analysis</p>
              <p className="text-sm mt-2 max-w-xs">Upload an image to reveal the secrets of your volume.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-[#E5DCC5] pb-4">
                <h3 className="text-2xl font-heading text-[#2C2420]">Appraisal Report</h3>
                <CheckCircle className="text-green-600 w-6 h-6" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-1">Identified Title</label>
                  <p className="text-lg text-[#2C2420] font-serif">{result.title || "Unknown"}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-1">Estimated Era</label>
                  <p className="text-lg text-[#2C2420] font-serif">{result.estimatedEra || "Unknown"}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-1">Condition</label>
                <div className="bg-[#FDFBF7] p-3 border border-[#E5DCC5] rounded-sm">
                  <p className="text-[#5C4D45]">{result.conditionAssessment || "N/A"}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8B5E3C] uppercase tracking-wider mb-1">Analysis</label>
                <p className="text-[#2C2420] leading-relaxed font-body-serif text-lg">
                  {result.rawAnalysis}
                </p>
              </div>

              {result.historicalSignificance && (
                <div className="bg-[#F5F0E6] p-4 rounded-sm border-l-4 border-[#8B5E3C]">
                  <p className="text-sm text-[#5C4D45] italic">
                    <span className="font-bold not-italic text-[#2C2420]">Significance: </span>
                    {result.historicalSignificance}
                  </p>
                </div>
              )}
              
              <div className="text-xs text-[#D4C5B0] mt-8 text-center">
                * Estimations are generated by AI and do not constitute a guaranteed professional valuation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};