import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { analyzePriceQuote, detectMaterialFromImage } from '../../lib/gemini';
import { addPriceReport } from '../../lib/firestore';
import { getCurrentLocation } from '../../lib/geo';

const MATERIALS = ['cement', 'steel', 'sand', 'bricks', 'paint', 'tiles'] as const;
const BRANDS: Record<string, string[]> = {
  cement: ['UltraTech', 'Ambuja', 'ACC', 'Shree', 'Local'],
  steel: ['Tata Tiscon', 'JSW Neo', 'Kamdhenu', 'Sail', 'Local'],
  sand: ['River Sand', 'M-Sand', 'Local'],
  bricks: ['Red Bricks', 'Fly Ash', 'Concrete Blocks', 'Local'],
  paint: ['Asian Paints', 'Berger', 'Nerolac', 'Dulux', 'Local'],
  tiles: ['Kajaria', 'Somany', 'Johnson', 'Local']
};

const UNITS: Record<string, string[]> = {
  cement: ['50kg bag', 'Ton'],
  steel: ['Kg', 'Quintal', 'Ton'],
  sand: ['Cubic Feet (cft)', 'Tractor', 'Truck'],
  bricks: ['1000 pieces', 'Piece'],
  paint: ['Liter', '20L Bucket'],
  tiles: ['Sq Ft', 'Box']
};

export const NirmaanMitra: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  const [material, setMaterial] = useState<string>('cement');
  const [brand, setBrand] = useState<string>('UltraTech');
  const [quantity, setQuantity] = useState<string>('1');
  const [unit, setUnit] = useState<string>('50kg bag');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState('total');
  const [city, setCity] = useState(localStorage.getItem('ns_city') || '');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const icons: Record<string, string> = { cement: '🧱', steel: '🏗️', sand: '🏜️', bricks: '🧱', paint: '🎨', tiles: '🔲' };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Url = e.target?.result as string;
      if (base64Url) {
        setImage(base64Url);
        const mimeType = base64Url.split(';')[0].split(':')[1];
        const base64Data = base64Url.split(',')[1];
        
        try {
          const detection = await detectMaterialFromImage(base64Data, mimeType);
          const detectedMaterial = (detection.material || '').toLowerCase();
          if (MATERIALS.includes(detectedMaterial as any)) {
            setMaterial(detectedMaterial);
            
            // Try to match brand
            const availableBrands = BRANDS[detectedMaterial];
            const safeBrand = (detection.brand || '').toLowerCase();
            const matchedBrand = availableBrands.find(b => b.toLowerCase().includes(safeBrand)) || availableBrands[0];
            setBrand(matchedBrand);

            // Try to match unit
            const availableUnits = UNITS[detectedMaterial];
            const safeUnit = (detection.unit || '').toLowerCase();
            const matchedUnit = availableUnits.find(u => u.toLowerCase().includes(safeUnit)) || availableUnits[0];
            setUnit(matchedUnit);

            if (detection.quantity && !isNaN(Number(detection.quantity))) {
              setQuantity(String(Number(detection.quantity)));
            }
          }
        } catch (err) {
          console.error("Image detection failed", err);
        }
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCheck = async () => {
    if (!price || !city) return;
    setLoading(true);
    setResult(null);
    localStorage.setItem('ns_city', city);
    
    try {
      const numericPrice = parseFloat(price);
      const numericQty = parseFloat(quantity) || 1;

      if (isNaN(numericPrice) || numericPrice <= 0 || isNaN(numericQty) || numericQty <= 0) {
        setResult({ verdict: 'fair', avgPrice: 0, difference: 'Error', advice: 'Price and Quantity must be valid, positive numbers.' });
        setLoading(false);
        return;
      }

      const mimeType = image ? image.split(';')[0].split(':')[1] : undefined;
      const imageBase64 = image ? image.split(',')[1] : undefined;
      
      let priceUnitLabel = 'Total';
      if (priceType === 'per_unit') priceUnitLabel = `Per ${unit}`;
      else if (priceType === 'per_kg') priceUnitLabel = 'Per Kg';

      const res = await analyzePriceQuote(material, brand, numericPrice, priceUnitLabel, numericQty, unit, city, language === 'hi' ? 'Hindi' : 'English', imageBase64, mimeType);
      setResult(res);
      setLoading(false); // Update UI immediately!
      
      if (user) {
        // Fire and forget telemetry, do not await it
        addPriceReport({
          userId: user.uid,
          material, brand, price: numericPrice, unit, city, state: 'Unknown'
        }).catch(e => console.error('Firestore log failed:', e));
      }
    } catch (e: any) {
      console.error(e);
      setResult({ verdict: 'fair', avgPrice: 0, difference: 'Error', advice: 'Failed to analyze: ' + e.message });
      setLoading(false);
    }
  };

  const handleLocate = async () => {
    setLocating(true);
    const loc = await getCurrentLocation();
    if (loc.city) setCity(loc.city);
    setLocating(false);
  };

  return (
    <div className="feature-page">
      <div className="feature-header">
        <span className="feature-header-icon">🏗️</span>
        <h2>{t.nirmaanMitra}</h2>
      </div>

      <div className="glass-card" style={{ padding: 20 }}>
        <div className="section-title">{t.selectMaterial}</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <button className="action-btn dastavez" style={{ flex: 1, padding: 12, fontSize: 14 }} onClick={() => fileInputRef.current?.click()}>
            📷 Auto-Detect from Photo
          </button>
          <input type="file" ref={fileInputRef} hidden accept="image/*" capture="environment" onChange={handleFileChange} />
        </div>
        
        {image && (
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <img src={image} alt="Material" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            <button style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24 }} onClick={() => setImage(null)}>✕</button>
          </div>
        )}

        <div className="material-grid">
          {MATERIALS.map(m => (
            <button key={m} className={`material-btn ${material === m ? 'active' : ''}`} onClick={() => { setMaterial(m); setBrand(BRANDS[m][0]); setUnit(UNITS[m][0]); }}>
              <span className="material-icon">{icons[m]}</span>
              <span className="material-name">{(t as any)[m] || m}</span>
            </button>
          ))}
        </div>

        <div className="section-title">Select Brand / Type</div>
        <div className="material-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {BRANDS[material].map(b => (
            <button key={b} className={`material-btn ${brand === b ? 'active' : ''}`} style={{ padding: '10px 8px' }} onClick={() => setBrand(b)}>
              <span className="material-name" style={{ fontSize: 14 }}>{b}</span>
            </button>
          ))}
        </div>

        <div className="input-group" style={{ marginBottom: 12 }}>
          <button className="action-btn nirmaan" style={{ width: 'auto', position: 'absolute', right: 4, top: 4, bottom: 4, padding: '0 12px', fontSize: 12 }} onClick={handleLocate} disabled={locating}>
            📍 {locating ? '...' : 'GPS'}
          </button>
          <input className="input-field" style={{ paddingRight: 80 }} placeholder={t.city} value={city} onChange={e => setCity(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <input className="input-field" type="number" style={{ flex: 1, marginBottom: 0 }} placeholder="Qty" value={quantity} onChange={e => setQuantity(e.target.value)} />
          <select className="input-field" style={{ flex: 2, marginBottom: 0, paddingRight: 10 }} value={unit} onChange={e => setUnit(e.target.value)}>
            {UNITS[material].map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div className="input-group" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="input-field" type="number" style={{ flex: 1, marginBottom: 0 }} placeholder={t.enterPrice} value={price} onChange={e => setPrice(e.target.value)} />
            <select className="input-field" style={{ flex: 1, marginBottom: 0, paddingRight: 10 }} value={priceType} onChange={e => setPriceType(e.target.value)}>
              <option value="total">Total Price</option>
              <option value="per_unit">Per {unit}</option>
              {material === 'cement' || material === 'steel' ? <option value="per_kg">Per Kg</option> : null}
            </select>
          </div>
        </div>

        <button className="action-btn nirmaan" onClick={handleCheck} disabled={loading || !price || !city || !quantity}>
          {loading ? t.checking : `💰 ${t.checkPrice}`}
        </button>
      </div>

      {loading && <div className="loading-spinner"></div>}

      {result && !loading && (
        <div className={`result-card ${result.verdict === 'overpriced' ? 'danger' : result.verdict === 'underpriced' ? 'warning' : 'safe'}`}>
          <div className="result-verdict">
            {result.verdict === 'overpriced' ? '⚠️ Overpriced' : result.verdict === 'underpriced' ? '⚠️ Underpriced' : '✅ Fair Price'}
          </div>
          
          <div style={{ display: 'flex', gap: 20, margin: '16px 0' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Your Quote {priceType === 'total' ? '(Total)' : priceType === 'per_unit' ? `(Per ${unit})` : '(Per Kg)'}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>₹{price}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                Area Average {priceType === 'total' ? '(Total)' : priceType === 'per_unit' ? `(Per ${unit})` : '(Per Kg)'}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>₹{result.avgPrice}</div>
            </div>
          </div>

          <div className="result-details" style={{ marginBottom: 12 }}>
            <strong>Difference:</strong> {result.difference}
          </div>
          <div className="result-details" style={{ padding: 12, background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
            <strong>Advice:</strong> {result.advice}
          </div>
        </div>
      )}
    </div>
  );
};
