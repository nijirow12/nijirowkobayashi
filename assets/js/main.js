/* assets/js/main.js
   - 画像の読み込みフォールバック（スペースや名前違いを試す）
   - vCard ダウンロード処理
*/
document.addEventListener('DOMContentLoaded', function(){
  // PROFILE IMAGE: try multiple filenames (handles spaces and different conventions)
  const img = document.querySelector('.profile-photo img');
  const candidates = [
    '/assets/images/img_7570.svg',
    '/assets/images/IMG_7570 2.jpg',
    '/assets/images/IMG_7570%202.jpg',
    '/assets/images/IMG_7570_2.jpg',
    '/assets/images/IMG_7570-2.jpg',
    '/assets/images/img_7570.jpg'
  ];
  let idx = 0;
  function tryNext(){
    if(!img) return;
    if(idx >= candidates.length){
      // fallback SVG placeholder
      img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#e9ecef"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6c757d" font-family="Arial" font-size="20">No image</text></svg>');
      return;
    }
    const candidate = candidates[idx++];
    img.src = candidate;
    // If load fails, try next
    img.onerror = tryNext;
    // If loads, clear onerror
    img.onload = function(){ img.onerror = null; };
  }
  tryNext();

  // vCard download logic (moved from inline)
  const contact = {
    fn: 'nijirow kobayashi',
    email: 'niji1012buster@gmail.com',
    tel: '07075473565',
    url: window.location.origin
  };

  function makeVCard(c){
    const parts = c.fn.split(/\s+/);
    const n = parts.length>=2 ? `N:${parts[parts.length-1]};${parts.slice(0,-1).join(' ')};;;` : `N:${c.fn};;;;`;
    const lines = ['BEGIN:VCARD','VERSION:3.0',`FN:${c.fn}`, n];
    if(c.tel) lines.push(`TEL;TYPE=CELL:${c.tel}`);
    if(c.email) lines.push(`EMAIL;TYPE=HOME:${c.email}`);
    if(c.url) lines.push(`URL:${c.url}`);
    lines.push('END:VCARD');
    return lines.join('\r\n');
  }

  const btn = document.getElementById('download');
  if(btn){
    btn.addEventListener('click', function(){
      const v = makeVCard(contact);
      const blob = new Blob([v], {type:'text/vcard;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nijirow_kobayashi.vcf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }
});
