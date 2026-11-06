import React, { useState, useEffect, useRef } from 'react';
import { PARTICLE_SIZES, ParticleSizeItem } from '../data/caseStudies';
import { SlidersHorizontal, Mountain, Wind, Flame, AlertTriangle, Eye, Info } from 'lucide-react';

export const InversionSimulator: React.FC = () => {
  // Simulator Controls
  const [inversionActive, setInversionActive] = useState<boolean>(true);
  const [topographyType, setTopographyType] = useState<'basin' | 'flat'>('basin');
  const [windSpeed, setWindSpeed] = useState<number>(1); // 0 to 5
  const [emissionRate, setEmissionRate] = useState<number>(3); // 1 to 5

  // Particle Size comparison selector
  const [selectedParticle, setSelectedParticle] = useState<ParticleSizeItem>(PARTICLE_SIZES[4]); // PM2.5 default

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Particles array
  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
    color: string;
  }

  const particlesRef = useRef<Particle[]>([]);

  // Simulation physics loop with serene eye-friendly daytime sky
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      // Clear background - Soft gentle sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#e0f2fe'); // Soft sky blue aloft
      skyGrad.addColorStop(1, '#f0fdf4'); // Soft mint near surface
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Inversion layer ceiling Y coordinate
      const inversionY = 150;

      // Draw Atmospheric Layers
      if (inversionActive) {
        // Upper Warm Layer (Lid) - Gentle amber tint
        const warmGrad = ctx.createLinearGradient(0, 60, 0, inversionY);
        warmGrad.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
        warmGrad.addColorStop(1, 'rgba(245, 158, 11, 0.35)');
        ctx.fillStyle = warmGrad;
        ctx.fillRect(0, 60, width, inversionY - 60);

        // Inversion Boundary Line (The Lid)
        ctx.beginPath();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.moveTo(0, inversionY);
        ctx.lineTo(width, inversionY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label on inversion line
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('⚡ แนวอุณหภูมิผกผัน (Thermal Inversion Lid) อากาศอุ่นกดทับ ~ 300 ม.', 14, inversionY - 8);

        // Lower Cold Trapping Zone - Light cyan tint
        ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
        ctx.fillRect(0, inversionY, width, height - inversionY);
      } else {
        // Normal Atmosphere: Clean free air
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText('☁️ บรรยากาศปกติ: อากาศถ่ายเทสู่ชั้นบนได้ดี (Normal Lapse Rate)', 14, 30);
      }

      // Draw Topography - Pleasant green hills
      ctx.beginPath();
      if (topographyType === 'basin') {
        // Basin with mountains on both sides
        ctx.moveTo(0, 160);
        ctx.lineTo(100, 240);
        ctx.lineTo(160, 280);
        ctx.lineTo(440, 280);
        ctx.lineTo(500, 240);
        ctx.lineTo(600, 160);
        ctx.lineTo(600, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Mountain inner body fill
        ctx.fillStyle = '#047857';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('⛰️ เทือกเขาด้านตะวันตก', 15, 200);
        ctx.fillText('⛰️ เทือกเขาด้านตะวันออก', 470, 200);
        ctx.fillStyle = '#065f46';
        ctx.fillText('ก้นแอ่งกระทะ (Valley Basin)', 240, 298);
      } else {
        // Flat Plains
        ctx.moveTo(0, 280);
        ctx.lineTo(width, 280);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('ภูมิประเทศที่ราบเปิด (Flat Plains)', 240, 298);
      }

      // Emission Sources (Smoke stacks / Biomass burn)
      const emitterX1 = topographyType === 'basin' ? 240 : 180;
      const emitterX2 = topographyType === 'basin' ? 360 : 380;
      const groundY = 280;

      // Draw small factory / bonfire icons
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(emitterX1 - 6, groundY - 14, 12, 14);
      ctx.fillRect(emitterX2 - 6, groundY - 14, 12, 14);

      // Spawn new particles based on emissionRate
      const spawnCount = emissionRate * 2;
      for (let i = 0; i < spawnCount; i++) {
        if (particlesRef.current.length < 500) {
          const originX = Math.random() > 0.5 ? emitterX1 : emitterX2;
          particlesRef.current.push({
            x: originX + (Math.random() - 0.5) * 10,
            y: groundY - 15,
            vx: (Math.random() - 0.5) * 0.8 + (windSpeed * 0.5),
            vy: -1.2 - Math.random() * 1.5,
            size: Math.random() * 2.5 + 1.5,
            alpha: 0.85,
            color: '#dc2626',
          });
        }
      }

      // Update and Draw Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply wind speed
        p.x += p.vx + (windSpeed * 0.4);
        p.y += p.vy;

        // Inversion ceiling physics
        if (inversionActive && p.y <= inversionY + 5) {
          p.vy = Math.abs(p.vy) * 0.3;
          p.vx += (Math.random() - 0.5) * 1.2;
          p.alpha -= 0.002;
        } else if (!inversionActive) {
          p.alpha -= 0.005;
        }

        // Mountain barrier collision in Basin mode
        if (topographyType === 'basin') {
          if (p.x < 140 && p.y > 180) {
            p.vx = Math.abs(p.vx) * 0.8;
          }
          if (p.x > 460 && p.y > 180) {
            p.vx = -Math.abs(p.vx) * 0.8;
          }
        }

        // Draw particle - soft reddish brown smoke dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(225, 29, 72, ${p.alpha})`;
        ctx.fill();

        // Kill particle if off screen or decayed
        if (p.y < 0 || p.x > width + 20 || p.x < -20 || p.alpha <= 0.05 || p.y > groundY + 10) {
          particles.splice(i, 1);
        }
      }

      // Wind Vector Indicator
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`ความเร็วลม: ${windSpeed * 3} กม./ชม. ${windSpeed === 0 ? '(ลมสงบนิ่ง)' : '➔'}`, width - 180, 28);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [inversionActive, topographyType, windSpeed, emissionRate]);

  // Calculate simulated AQI estimate
  const estimatedAQI = Math.min(
    500,
    Math.round(
      (inversionActive ? 180 : 35) +
      (topographyType === 'basin' ? 120 : 20) +
      (emissionRate * 35) -
      (windSpeed * 30)
    )
  );

  return (
    <div className="space-y-8">
      {/* Header - Soothing Green & Sky */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
              <span>ห้องปฏิบัติการภูมิศาสตร์กายภาพจำลอง (Interactive Atmospheric Lab)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              แบบจำลองปรากฏการณ์อุณหภูมิผกผัน & ภูมิประเทศแอ่งกระทะ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              ทดลองปรับเปลี่ยนสภาพทางภูมิศาสตร์และอุตุนิยมวิทยา เพื่อสังเกตพฤติกรรมการกักขังของฝุ่นพิษ PM2.5 ในชั้นบรรยากาศ
            </p>
          </div>

          {/* AQI Meter Badge */}
          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shrink-0">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">ดัชนีคุณภาพอากาศจำลอง</span>
              <span className="text-2xl font-black font-mono text-rose-600">
                AQI {estimatedAQI}
              </span>
            </div>
            <div className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
              estimatedAQI > 200
                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                : estimatedAQI > 100
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}>
              {estimatedAQI > 200 ? '🚨 วิกฤตอันตราย' : estimatedAQI > 100 ? '⚠️ เริ่มมีผลกระทบ' : '✅ อากาศดี'}
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Visualizer */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-500">
            <span>ภาพจำลองหน้าตัดชั้นบรรยากาศ (Atmospheric Cross-Section)</span>
            <span className="text-emerald-700 font-semibold">แบบจำลองอนุภาคตามเวลาจริง</span>
          </div>

          <div className="my-2 relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={600}
              height={340}
              className="w-full h-auto max-h-[380px] block"
            />
          </div>

          {/* Explanation bar below canvas */}
          <div className="pt-2 text-xs text-slate-600 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              {inversionActive
                ? 'เมื่อเกิด "อุณหภูมิผกผัน": อากาศร้อนด้านบนทำหน้าที่เป็นฝาชี ดักควันไม่ให้ลอยขึ้น เมื่อรวมกับ "แอ่งกระทะ" มลพิษจะสะสมตัวเข้มข้นรวดเร็ว'
                : 'ใน "สภาวะปกติ": อากาศร้อนที่ผิวดินจะลอยตัวสูงขึ้นอย่างอิสระ พาฝุ่นมลพิษระบายออกสู่บรรยากาศระดับสูง'}
            </span>
          </div>
        </div>

        {/* Simulator Controls Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-5 space-y-5 shadow-xs">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            ตัวแปรและเงื่อนไขทางภูมิศาสตร์
          </h3>

          {/* Toggle Inversion */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              1. สภาวะอุณหภูมิผกผัน (Thermal Inversion)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setInversionActive(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  inversionActive
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🔒 อุณหภูมิผกผัน (มีฝาชี)
              </button>
              <button
                onClick={() => setInversionActive(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  !inversionActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🔓 สภาวะปกติ (ระบายดี)
              </button>
            </div>
          </div>

          {/* Toggle Topography */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              2. ลักษณะธรณีสัณฐาน (Topography)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setTopographyType('basin')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  topographyType === 'basin'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Mountain className="w-3.5 h-3.5" />
                <span>แอ่งกระทะหุบเขา</span>
              </button>
              <button
                onClick={() => setTopographyType('flat')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  topographyType === 'flat'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>ที่ราบเปิดกว้าง</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              *แอ่งเชียงใหม่ ลำปาง และ LA คือตัวอย่างของแอ่งกระทะที่มีภูเขาปิดล้อม
            </p>
          </div>

          {/* Wind Speed Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-sky-600" />
                3. ความเร็วลม (Wind Speed)
              </span>
              <span className="font-mono text-sky-700 font-bold">{windSpeed * 3} กม./ชม.</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={windSpeed}
              onChange={(e) => setWindSpeed(parseInt(e.target.value, 10))}
              className="w-full accent-sky-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 (ลมสงบนิ่งสนิท)</span>
              <span>5 (ลมพัดแรง)</span>
            </div>
          </div>

          {/* Emission Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                4. อัตราการปล่อยมลพิษ (Emissions)
              </span>
              <span className="font-mono text-rose-600 font-bold">ระดับ {emissionRate}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={emissionRate}
              onChange={(e) => setEmissionRate(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>เผาน้อย/ควบคุมได้</span>
              <span>เผาหนักชีวมวล/ไอเสียสะสม</span>
            </div>
          </div>

          {/* Quick preset scenarios */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              สถานการณ์จำลองยอดนิยม:
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setInversionActive(true);
                  setTopographyType('basin');
                  setWindSpeed(0);
                  setEmissionRate(5);
                }}
                className="text-left text-xs p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition-colors"
              >
                🔥 <strong>วิกฤตฝุ่นเชียงใหม่/แม่ฮ่องสอน มี.ค.:</strong> แอ่งกระทะ + อุณหภูมิผกผัน + ลมนิ่ง
              </button>
              <button
                onClick={() => {
                  setInversionActive(true);
                  setTopographyType('flat');
                  setWindSpeed(1);
                  setEmissionRate(4);
                }}
                className="text-left text-xs p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 transition-colors"
              >
                🏙️ <strong>วิกฤตฝุ่น กทม. ม.ค.:</strong> ที่ราบ + อุณหภูมิผกผัน + ไอเสียดีเซลสะสม
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Particle Size & Scale Comparison Section */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold mb-2">
            <Eye className="w-3.5 h-3.5 text-sky-600" />
            <span>สเกลเปรียบเทียบขนาดอนุภาคและการทะลุทะลวงสู่ปอด</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            ทำไมฝุ่น PM2.5 จึงอันตรายกว่าฝุ่นทั่วไป?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            ฝุ่นขนาด 2.5 ไมโครเมตร (PM2.5) มีขนาดเล็กกว่าเส้นผมมนุษย์เกือบ 30 เท่า ทำให้ระบบกรองธรรมชาติของร่างกายไม่สามารถดักจับได้
          </p>
        </div>

        {/* Visual Scale Diagram */}
        <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 relative overflow-hidden flex flex-col md:flex-row items-center justify-around gap-6">
          {/* Hair Circle Representation */}
          <div className="flex flex-col items-center text-center">
            <div className="w-48 h-48 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center relative p-2 shadow-xs">
              <span className="text-xs text-slate-600 font-bold">เส้นผมมนุษย์ ~ 70 µm</span>
              
              {/* PM10 inside */}
              <div className="w-14 h-14 rounded-full border border-amber-400 bg-amber-50 absolute bottom-3 right-5 flex items-center justify-center">
                <span className="text-[9px] font-bold text-amber-800">PM10</span>
                
                {/* PM2.5 inside PM10 */}
                <div className="w-3.5 h-3.5 rounded-full bg-rose-500 absolute bottom-1 right-1 shadow-xs ring-2 ring-white" />
              </div>
            </div>
            <span className="text-[11px] text-slate-500 mt-2 font-mono">สัดส่วนขนาดสัมพัทธ์ในระดับไมครอน</span>
          </div>

          {/* Interactive Particle Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl w-full">
            {PARTICLE_SIZES.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedParticle(item)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  selectedParticle.id === item.id
                    ? 'bg-emerald-50 border-emerald-400 shadow-xs ring-1 ring-emerald-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {item.nameTh}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 block font-semibold">
                  {item.sizeLabel}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Particle Detail Card */}
        {selectedParticle && (
          <div className="bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900">
                  {selectedParticle.nameTh} ({selectedParticle.nameEn})
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-white text-emerald-800 border border-emerald-200 font-semibold">
                  {selectedParticle.sizeLabel}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedParticle.descriptionTh}
              </p>
              <div className="text-xs text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <strong>ระดับการทะลุทะลวงสู่ร่างกาย: </strong>
                  {selectedParticle.penetrationDepth}
                </div>
              </div>
            </div>

            <div className="shrink-0 p-3 bg-white rounded-2xl border border-emerald-100 text-center w-full md:w-auto shadow-2xs">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">อัตราส่วนเทียบ PM2.5</span>
              <span className="text-xl font-mono font-bold text-emerald-700">
                {selectedParticle.scaleRatio >= 1 ? `${selectedParticle.scaleRatio} เท่า` : `${selectedParticle.scaleRatio} เท่า`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
