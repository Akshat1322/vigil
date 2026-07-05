import MatrixLoader from '@/components/MatrixLoader';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 flex items-center justify-center relative overflow-hidden font-sans">
      <div className="orb-container bg-transparent">
        <div className="stars"></div>
        <div className="aurora-blob aurora-1"></div>
        <div className="aurora-blob aurora-2"></div>
      </div>
      <div className="relative z-10 w-full">
        <MatrixLoader />
      </div>
    </div>
  );
}
