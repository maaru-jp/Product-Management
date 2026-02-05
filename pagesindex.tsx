import React, { useState, useEffect } from 'react';
import { Camera, Package, ShoppingCart, BarChart3, Save, ExternalLink, Search, Trash2 } from 'lucide-react';

// 自動縮圖技術：解決手機容量問題
const optimizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200; 
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.8)); 
      };
    };
  });
};

export default function OmoPlatform() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pass, setPass] = useState('');
  const [view, setView] = useState<'dashboard' | 'product'>('product'); // 預設進商品管理
  
  const [product, setProduct] = useState({
    name: '', brand: '', category: '居家用品',
    priceTWD: 0, priceJPY: 0, exchangeRate: 4.5, costTWD: 0,
    stock: 0, status: '上架', description: '', images: [] as string[]
  });

  // 自動計算成本 (日幣 / 匯率 = 台幣)
  useEffect(() => {
    if (product.priceJPY > 0 && product.exchangeRate > 0) {
      setProduct(prev => ({ ...prev, costTWD: Math.round(product.priceJPY / product.exchangeRate) }));
    }
  }, [product.priceJPY, product.exchangeRate]);

  // 結帳跳轉 LINE 邏輯
  const handleGoToLine = () => {
    const msg = `你好！我要訂購商品：\n名稱：${product.name}\n品牌：${product.brand}\n售價：NT$${product.priceTWD}`;
    const lineUrl = `https://line.me/R/oaMessage/@你的ID/?${encodeURIComponent(msg)}`;
    window.open(lineUrl, '_blank');
  };

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#fdf2f4]">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-96 text-center border border-pink-100">
          <h2 className="text-2xl font-bold mb-2">OMO ADMIN</h2>
          <p className="text-gray-400 text-sm mb-8">MAARU 日本萌物管理系統</p>
          <input type="password" placeholder="輸入管理密碼" className="w-full border-2 border-pink-50 p-3 rounded-xl mb-4 focus:border-pink-300 outline-none transition-all" onChange={(e)=>setPass(e.target.value)} />
          <button onClick={() => pass === '0918' ? setIsLoggedIn(true) : alert('密碼錯誤')} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800">登入後台</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fdf2f4]">
      {/* 側邊欄 */}
      <aside className="w-64 bg-black text-white p-6 flex flex-col shadow-xl">
        <div className="mb-12">
          <div className="font-bold text-xl tracking-tighter italic">OMO ADMIN</div>
          <div className="text-[10px] text-gray-500 font-light">MAARU日本萌物 GO</div>
        </div>
        <nav className="space-y-4 flex-1">
          <button onClick={() => setView('dashboard')} className={`flex items-center gap-3 w-full p-3 rounded-xl transition ${view === 'dashboard' ? 'bg-white/10 text-pink-300' : 'text-gray-400 hover:text-white'}`}><BarChart3 size={20}/> 總覽報表</button>
          <button onClick={() => setView('product')} className={`flex items-center gap-3 w-full p-3 rounded-xl transition ${view === 'product' ? 'bg-white/10 text-pink-300' : 'text-gray-400 hover:text-white'}`}><Package size={20}/> 商品管理</button>
          <button className="flex items-center gap-3 w-full p-3 text-gray-600 cursor-not-allowed text-sm italic"><ShoppingCart size={18}/> 訂單管理 (開發中)</button>
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="bg-white/5 py-2 rounded-lg text-xs text-gray-400 hover:text-white transition">登出系統</button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{view === 'dashboard' ? '總覽報表' : '編輯商品'}</h2>
          <div className="flex gap-4">
             <button onClick={handleGoToLine} className="flex items-center gap-2 text-sm text-gray-500 hover:text-pink-500 transition font-medium">前往官網 <ExternalLink size={14}/></button>
          </div>
        </header>

        {view === 'dashboard' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              {['總營業額', '預估總成本', '預估毛利'].map((t) => (
                <div key={t} className="bg-white p-8 rounded-[2rem] shadow-sm border border-pink-50">
                  <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">{t}</p>
                  <p className="text-3xl font-black italic">NT$ 0</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl bg-white rounded-[2.5rem] p-10 shadow-sm border border-pink-50">
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1">商品名稱 *</label>
                <input type="text" className="w-full border-b-2 border-gray-100 p-2 outline-none focus:border-pink-300 transition-colors" placeholder="請輸入商品名稱" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1">品牌名稱 (圖片分類)</label>
                <input type="text" className="w-full border-b-2 border-gray-100 p-2 outline-none focus:border-pink-300 transition-colors" placeholder="請輸入品牌" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 bg-pink-50/50 p-6 rounded-3xl mb-10">
              <div><label className="text-[10px] text-gray-500 font-black">台幣售價</label><input type="number" className="w-full bg-transparent border-b border-pink-200 outline-none py-1 font-bold" /></div>
              <div><label className="text-[10px] text-gray-500 font-black">日幣原價 (¥)</label><input type="number" value={product.priceJPY} onChange={(e)=>setProduct({...product, priceJPY: Number(e.target.value)})} className="w-full bg-transparent border-b border-pink-200 outline-none py-1 font-bold" /></div>
              <div><label className="text-[10px] text-gray-500 font-black">匯率 (÷)</label><input type="number" value={product.exchangeRate} onChange={(e)=>setProduct({...product, exchangeRate: Number(e.target.value)})} className="w-full bg-transparent border-b border-pink-200 outline-none py-1 font-bold" /></div>
              <div><label className="text-[10px] text-pink-600 font-black">台幣成本 (自動)</label><div className="text-lg font-black text-pink-600">NT$ {product.costTWD}</div></div>
            </div>

            <div className="border-4 border-dashed border-pink-50 rounded-[2rem] p-12 text-center hover:border-pink-200 transition-all cursor-pointer bg-gray-50/30">
              <input type="file" multiple accept="image/*" className="hidden" id="imgs" onChange={async (e)=>{
                if(e.target.files) {
                  const optimized = await Promise.all(Array.from(e.target.files).map(f => optimizeImage(f)));
                  setProduct(prev => ({...prev, images: [...prev.images, ...optimized]}));
                }
              }} />
              <label htmlFor="imgs" className="cursor-pointer group">
                <Camera className="mx-auto text-pink-200 group-hover:text-pink-400 transition-colors mb-4" size={50} />
                <p className="text-sm font-bold text-gray-400">點擊上傳多張照片</p>
                <p className="text-[10px] text-pink-300 mt-2 italic">自動縮圖技術已開啟，上傳後即可刪除手機原始檔</p>
              </label>
              <div className="flex gap-4 mt-8 flex-wrap justify-center">
                {product.images.map((img, i) => (
                  <div key={i} className="relative group w-24 h-24">
                    <img src={img} className="w-full h-full object-cover rounded-2xl border-2 border-white shadow-md" />
                    <button onClick={()=>setProduct(p=>({ ...p, images: p.images.filter((_,idx)=>idx!==i)}))} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex justify-end">
               <button className="bg-black text-white px-12 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-black/10">
                 <Save size={20}/> 儲存並上架
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}