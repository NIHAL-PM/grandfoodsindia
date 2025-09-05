import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { CertificateRecord } from '@/utils/localStore';
import { KAISAN_LOGO_PATH } from '@/lib/branding';

interface Props {
  certificate: CertificateRecord;
}

// Simple printable certificate layout.
export const CertificatePreview: React.FC<Props> = ({ certificate }) => {
  const qrRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (qrRef.current) {
      QRCode.toCanvas(qrRef.current, certificate.verificationUrl, { width: 120 });
    }
  }, [certificate.verificationUrl]);

  return (
    <div className="w-full bg-white text-black p-8 shadow relative max-w-3xl mx-auto font-serif border">
      <div className="flex justify-between items-start mb-4">
  <img src={KAISAN_LOGO_PATH} alt="Kaisan Associates" className="h-16 object-contain" />
        <div className="text-right text-xs">
          <p className="font-semibold">Kaisan Associates</p>
          <p>Professional Certification</p>
          <p className="mt-1 font-mono">{certificate.certificateNumber}</p>
        </div>
      </div>
      <div className="text-center mt-8 mb-6">
        <h1 className="text-3xl font-bold tracking-wide mb-2">Certificate of Completion</h1>
        <p className="text-sm uppercase tracking-[0.3em] text-gray-600">This certifies that</p>
      </div>
      <div className="text-center mb-6">
        <p className="text-2xl font-semibold underline decoration-wavy decoration-primary/60 underline-offset-8">{certificate.studentName}</p>
        <p className="mt-4 text-gray-700">has successfully completed the course</p>
        <p className="mt-2 text-xl font-medium">{certificate.courseTitle}</p>
        {certificate.courseSubtitle && (
          <p className="text-sm text-gray-600">{certificate.courseSubtitle}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm mb-8">
        <div>
          <p className="text-gray-500">Issued Date</p>
          <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Instructor</p>
          <p className="font-medium">{certificate.instructor || '—'}</p>
        </div>
        {certificate.hours && (
          <div>
            <p className="text-gray-500">Training Hours</p>
            <p className="font-medium">{certificate.hours}</p>
          </div>
        )}
        {certificate.grade && (
          <div>
            <p className="text-gray-500">Grade</p>
            <p className="font-medium">{certificate.grade}</p>
          </div>
        )}
      </div>
      <div className="flex justify-between items-end mt-12">
        <div className="text-center">
          <div className="h-12" />
          <div className="border-t w-40 mx-auto" />
          <p className="text-xs mt-2">Authorized Signatory</p>
        </div>
        <div className="text-center text-xs max-w-xs">
          <canvas ref={qrRef} />
          <p className="mt-2">Scan to verify</p>
        </div>
      </div>
      <p className="mt-6 text-[10px] text-gray-500 font-mono">Hash: {certificate.hash}</p>
    </div>
  );
};

export default CertificatePreview;
