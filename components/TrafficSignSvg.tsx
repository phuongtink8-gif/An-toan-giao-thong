import React from 'react';

interface TrafficSignSvgProps {
  signType: 'cam_xe_dap' | 'cam_nguoi_di_bo' | 'duong_nguoi_di_bo' | 'han_che_toc_do_40' | 'giao_duong_sat_rao_chan';
  size?: number;
  className?: string;
  showStand?: boolean;
}

export const TrafficSignSvg: React.FC<TrafficSignSvgProps> = ({
  signType,
  size = 180,
  className = '',
  showStand = false,
}) => {
  const renderSignFace = () => {
    switch (signType) {
      case 'cam_xe_dap':
        // Biển P.110a: Tròn viền đỏ, nền trắng, hình xe đạp đen
        return (
          <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
            <circle cx="100" cy="100" r="95" fill="#DC2626" />
            <circle cx="100" cy="100" r="76" fill="#FFFFFF" />
            {/* Bicycle icon */}
            <g stroke="#1E293B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {/* Wheels */}
              <circle cx="62" cy="125" r="22" strokeWidth="5" />
              <circle cx="138" cy="125" r="22" strokeWidth="5" />
              {/* Spoke center dots */}
              <circle cx="62" cy="125" r="3" fill="#1E293B" />
              <circle cx="138" cy="125" r="3" fill="#1E293B" />
              {/* Frame */}
              <line x1="62" y1="125" x2="88" y2="125" />
              <line x1="88" y1="125" x2="122" y2="92" />
              <line x1="62" y1="125" x2="80" y2="92" />
              <line x1="80" y1="92" x2="122" y2="92" />
              <line x1="88" y1="125" x2="80" y2="92" />
              <line x1="138" y1="125" x2="122" y2="92" />
              {/* Fork and handlebar */}
              <line x1="138" y1="125" x2="125" y2="78" />
              <line x1="120" y1="78" x2="135" y2="78" />
              {/* Seat post and seat */}
              <line x1="88" y1="125" x2="76" y2="82" />
              <path d="M 68 82 Q 78 80 88 82" strokeWidth="7" />
            </g>
          </svg>
        );

      case 'cam_nguoi_di_bo':
        // Biển P.112: Tròn viền đỏ, nền trắng, người đi bộ đen gạch chéo đỏ
        return (
          <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
            <circle cx="100" cy="100" r="95" fill="#DC2626" />
            <circle cx="100" cy="100" r="76" fill="#FFFFFF" />
            {/* Person silhouette */}
            <g fill="#1E293B">
              {/* Head */}
              <circle cx="100" cy="65" r="14" />
              {/* Torso */}
              <path d="M 92 84 L 108 84 L 105 125 L 95 125 Z" />
              {/* Left leg */}
              <path d="M 96 122 L 80 152 L 72 150 L 92 120 Z" />
              {/* Right leg */}
              <path d="M 104 122 L 120 152 L 128 150 L 108 120 Z" />
              {/* Left arm */}
              <path d="M 93 88 L 78 112 L 84 116 L 97 92 Z" />
              {/* Right arm */}
              <path d="M 107 88 L 122 112 L 116 116 L 103 92 Z" />
            </g>
            {/* Red diagonal bar */}
            <line x1="45" y1="45" x2="155" y2="155" stroke="#DC2626" strokeWidth="16" strokeLinecap="round" />
          </svg>
        );

      case 'duong_nguoi_di_bo':
        // Biển I.423: Hình vuông màu xanh lam, người đi bộ màu trắng trên vạch sang đường
        return (
          <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
            <rect x="5" y="5" width="190" height="190" rx="18" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="6" />
            {/* White crosswalk zebra bars */}
            <g fill="#FFFFFF">
              <rect x="40" y="148" width="120" height="8" rx="3" />
              <rect x="48" y="132" width="104" height="8" rx="3" />
              <rect x="56" y="116" width="88" height="8" rx="3" />
            </g>
            {/* White walking person */}
            <g fill="#FFFFFF">
              {/* Head */}
              <circle cx="100" cy="56" r="14" />
              {/* Body angled forward */}
              <path d="M 93 72 L 107 72 L 105 106 L 95 106 Z" />
              {/* Legs walking on zebra */}
              <path d="M 96 104 L 78 138 L 86 142 L 101 108 Z" />
              <path d="M 104 104 L 122 138 L 114 142 L 99 108 Z" />
              {/* Arms swinging */}
              <path d="M 94 76 L 76 96 L 82 101 L 98 80 Z" />
              <path d="M 106 76 L 124 96 L 118 101 L 102 80 Z" />
            </g>
          </svg>
        );

      case 'han_che_toc_do_40':
        // Biển P.127: Tròn viền đỏ, nền trắng, số 40 màu đen
        return (
          <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
            <circle cx="100" cy="100" r="95" fill="#DC2626" />
            <circle cx="100" cy="100" r="76" fill="#FFFFFF" />
            {/* Number 40 bold font */}
            <text
              x="100"
              y="126"
              fontFamily="Arial, 'Segoe UI', system-ui, sans-serif"
              fontSize="78"
              fontWeight="900"
              fill="#111827"
              textAnchor="middle"
              letterSpacing="-2"
            >
              40
            </text>
          </svg>
        );

      case 'giao_duong_sat_rao_chan':
        // Biển W.210: Tam giác đều đỉnh hướng lên, viền đỏ nền vàng, hàng rào sắt màu đen
        return (
          <svg viewBox="0 0 200 200" width={size} height={size} className="drop-shadow-lg">
            {/* Outer red triangle */}
            <polygon points="100,10 192,175 8,175" fill="#DC2626" strokeLinejoin="round" stroke="#DC2626" strokeWidth="8" />
            {/* Inner yellow triangle */}
            <polygon points="100,32 174,165 26,165" fill="#FACC15" />
            {/* Railway Fence Icon */}
            <g stroke="#1F2937" strokeWidth="4.5" strokeLinecap="round" fill="none">
              {/* Horizontal beams */}
              <line x1="50" y1="125" x2="150" y2="125" strokeWidth="6" />
              <line x1="50" y1="145" x2="150" y2="145" strokeWidth="6" />
              {/* Vertical posts with pointed tips */}
              <line x1="62" y1="112" x2="62" y2="155" strokeWidth="5" />
              <line x1="82" y1="110" x2="82" y2="155" strokeWidth="5" />
              <line x1="100" y1="108" x2="100" y2="155" strokeWidth="5" />
              <line x1="118" y1="110" x2="118" y2="155" strokeWidth="5" />
              <line x1="138" y1="112" x2="138" y2="155" strokeWidth="5" />
              {/* Pointed picket heads */}
              <polygon points="62,106 58,114 66,114" fill="#1F2937" />
              <polygon points="82,104 78,112 86,112" fill="#1F2937" />
              <polygon points="100,102 96,110 104,110" fill="#1F2937" />
              <polygon points="118,104 114,112 122,112" fill="#1F2937" />
              <polygon points="138,106 134,114 142,114" fill="#1F2937" />
            </g>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {renderSignFace()}
      {showStand && (
        <div className="flex flex-col items-center -mt-1">
          {/* Sign Post */}
          <div className="w-4 h-24 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 border border-slate-500 rounded-sm shadow-md" />
          {/* Concrete Base */}
          <div className="w-16 h-6 bg-slate-400 border border-slate-500 rounded-t-lg shadow" />
        </div>
      )}
    </div>
  );
};
