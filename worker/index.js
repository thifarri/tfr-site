var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/index.ts
function parseJsonObjects(value) {
  try {
    const parsed = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
__name(parseJsonObjects, "parseJsonObjects");
var jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
var json = /* @__PURE__ */ __name((data, status = 200) => new Response(JSON.stringify(data), { status, headers: jsonHeaders }), "json");
function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
__name(escapeHtml, "escapeHtml");
function absoluteUrl(env, path = "/") {
  const base = (env.SITE_URL || "https://tfrprojetos.com.br").replace(/\/+$/, "");
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
__name(absoluteUrl, "absoluteUrl");
function businessJsonLd(env) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${absoluteUrl(env, "/")}#empresa`,
    name: "TFR Projetos",
    legalName: "T. H. F. Ribeiro LTDA",
    url: absoluteUrl(env, "/"),
    logo: absoluteUrl(env, "/tfr-logo.png"),
    image: absoluteUrl(env, "/111.png"),
    description: "Empresa de engenharia el\xE9trica com atua\xE7\xE3o em projetos el\xE9tricos, SPDA, subesta\xE7\xF5es e automa\xE7\xE3o industrial.",
    telephone: "+55 14 3120-0349",
    email: "engenharia@tfrprojetos.com.br",
    address: { "@type": "PostalAddress", addressLocality: "Bauru", addressRegion: "SP", addressCountry: "BR" },
    areaServed: { "@type": "Country", name: "Brasil" },
    sameAs: ["https://www.instagram.com/eng.thiagofabbro", "https://www.youtube.com/@Eng.ThiagoRibeiro"]
  };
}
__name(businessJsonLd, "businessJsonLd");
async function seoForPath(env, path) {
  if (path === "/") {
    return {
      title: "Projetos El\xE9tricos, SPDA e Subesta\xE7\xF5es | TFR Projetos",
      description: "Projetos el\xE9tricos, SPDA, subesta\xE7\xF5es e automa\xE7\xE3o industrial em Bauru/SP e atendimento em todo o Brasil. Engenharia el\xE9trica com seguran\xE7a e responsabilidade t\xE9cnica.",
      canonical: absoluteUrl(env, "/"),
      image: absoluteUrl(env, "/111.png"),
      jsonLd: businessJsonLd(env)
    };
  }
  if (path === "/biblioteca" || path === "/biblioteca/") {
    return {
      title: "Biblioteca de Engenharia, Software e Arquivos DWG | TFR Projetos",
      description: "Biblioteca t\xE9cnica da TFR Projetos com softwares, projetos-modelo, arquivos DWG e materiais de refer\xEAncia para profissionais de engenharia el\xE9trica.",
      canonical: absoluteUrl(env, "/biblioteca"),
      image: absoluteUrl(env, "/111.png"),
      jsonLd: [businessJsonLd(env), {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Biblioteca TFR Projetos",
        url: absoluteUrl(env, "/biblioteca"),
        description: "Biblioteca t\xE9cnica com softwares, materiais e projetos-modelo para profissionais de engenharia el\xE9trica."
      }]
    };
  }
  if (path === "/loja" || path === "/loja/") {
    return {
      title: "Loja TFR Projetos | Pain\xE9is, produtos e solu\xE7\xF5es el\xE9tricas",
      description: "Loja da TFR Projetos com pain\xE9is el\xE9tricos, componentes e solu\xE7\xF5es t\xE9cnicas. Consulte pre\xE7os, prazo de produ\xE7\xE3o, frete e finalize o pagamento online.",
      canonical: "https://loja.tfrprojetos.com.br/",
      image: absoluteUrl(env, "/111.png"),
      jsonLd: [businessJsonLd(env), { "@context": "https://schema.org", "@type": "CollectionPage", name: "Loja TFR Projetos", url: "https://loja.tfrprojetos.com.br/" }]
    };
  }
  const storeProductMatch = path.match(/^\/loja\/([^/]+)\/?$/);
  if (storeProductMatch && storeProductMatch[1] !== "checkout") {
    const slug = decodeURIComponent(storeProductMatch[1]);
    const row = await getStoreProductBySlug(env, slug).catch(() => null);
    if (row) {
      const description = (row.description || "Produto da Loja TFR Projetos.").slice(0, 300);
      const image = row.image_keys_json && row.image_keys_json !== "[]" ? `https://loja.tfrprojetos.com.br/api/loja/produtos/${encodeURIComponent(row.slug)}/imagem/0` : absoluteUrl(env, "/111.png");
      return {
        title: `${row.name} | Loja TFR Projetos`,
        description,
        canonical: `https://loja.tfrprojetos.com.br/loja/${encodeURIComponent(row.slug)}`,
        image,
        jsonLd: [businessJsonLd(env), { "@context": "https://schema.org", "@type": "Product", name: row.name, description, image, brand: { "@type": "Brand", name: "TFR Projetos" }, offers: { "@type": "Offer", priceCurrency: "BRL", price: (Number(row.price_cents || 0) / 100).toFixed(2), availability: row.made_to_order || Number(row.stock_qty) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `https://loja.tfrprojetos.com.br/loja/${encodeURIComponent(row.slug)}` } }]
      };
    }
  }
  const productMatch = path.match(/^\/biblioteca\/([^/]+)\/?$/);
  if (productMatch) {
    const slug = decodeURIComponent(productMatch[1]);
    const row = await getProductBySlug(env, slug);
    if (row && ["active", "coming"].includes(row.status)) {
      const title = `${row.title} | TFR Projetos`;
      const description = (row.short_description || row.description || "Material t\xE9cnico da Biblioteca TFR Projetos.").slice(0, 300);
      const canonical = absoluteUrl(env, `/biblioteca/${encodeURIComponent(row.slug)}`);
      const image = row.cover_key ? absoluteUrl(env, `/api/biblioteca/produtos/${encodeURIComponent(row.slug)}/capa`) : absoluteUrl(env, "/111.png");
      return {
        title,
        description,
        canonical,
        image,
        jsonLd: [businessJsonLd(env), {
          "@context": "https://schema.org",
          "@type": "Product",
          name: row.title,
          description,
          image,
          url: canonical,
          brand: { "@type": "Brand", name: "TFR Projetos" },
          offers: row.status === "active" ? { "@type": "Offer", priceCurrency: "BRL", price: (Math.max(0, Number(row.price || 0)) / 100).toFixed(2), availability: "https://schema.org/InStock", url: row.delivery_mode === "free_external" && row.external_download_url ? row.external_download_url : absoluteUrl(env, `/oferta/${encodeURIComponent(row.slug)}`) } : void 0
        }]
      };
    }
    return { title: "Produto n\xE3o encontrado | TFR Projetos", description: "O material solicitado n\xE3o foi encontrado.", canonical: absoluteUrl(env, path), robots: "noindex,follow" };
  }
  const offerMatch = path.match(/^\/oferta\/([^/]+)\/?$/);
  if (offerMatch) {
    const slug = decodeURIComponent(offerMatch[1]);
    const { product, landing } = await getLandingBySlug(env, slug);
    if (product && product.status === "active" && landing && landing.status === "published") {
      const title = (landing.seo_title || `${product.title} | TFR Projetos`).slice(0, 180);
      const description = (landing.seo_description || product.short_description || product.description || "").slice(0, 300);
      const canonical = absoluteUrl(env, `/oferta/${encodeURIComponent(product.slug)}`);
      const image = landing.hero_image_key ? absoluteUrl(env, `/api/ofertas/${encodeURIComponent(product.slug)}/hero`) : product.cover_key ? absoluteUrl(env, `/api/biblioteca/produtos/${encodeURIComponent(product.slug)}/capa`) : absoluteUrl(env, "/111.png");
      return {
        title,
        description,
        canonical,
        image,
        jsonLd: [businessJsonLd(env), {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description,
          image,
          url: canonical,
          brand: { "@type": "Brand", name: "TFR Projetos" },
          offers: { "@type": "Offer", priceCurrency: "BRL", price: (product.price / 100).toFixed(2), availability: "https://schema.org/InStock", url: canonical }
        }]
      };
    }
    return { title: "Oferta indispon\xEDvel | TFR Projetos", description: "A p\xE1gina solicitada n\xE3o est\xE1 dispon\xEDvel.", canonical: absoluteUrl(env, path), robots: "noindex,follow" };
  }
  if (/^\/(checkout|pedido|colaborador|admin)(\/|$)/.test(path)) {
    return { title: "TFR Projetos", description: "\xC1rea funcional da TFR Projetos.", canonical: absoluteUrl(env, path), robots: "noindex,nofollow,noarchive" };
  }
  return { title: "P\xE1gina n\xE3o encontrada | TFR Projetos", description: "A p\xE1gina solicitada n\xE3o foi encontrada.", canonical: absoluteUrl(env, path), robots: "noindex,follow" };
}
__name(seoForPath, "seoForPath");
function injectSeo(html, seo) {
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const canonical = escapeHtml(seo.canonical);
  const robots = escapeHtml(seo.robots || "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
  const image = escapeHtml(seo.image || "https://tfrprojetos.com.br/111.png");
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${description}" />`);
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
  html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="${robots}" />`);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${title}" />`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${description}" />`);
  html = html.replace(/<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${image}" />`);
  html = html.replace(/<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${title}" />`);
  html = html.replace(/<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${description}" />`);
  html = html.replace(/<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${image}" />`);
  if (seo.jsonLd) {
    const safeJson = JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c");
    html = html.replace(/<script\s+type=["']application\/ld\+json["']\s+id=["']tfr-structured-data["'][\s\S]*?<\/script>/i, `<script type="application/ld+json" id="tfr-structured-data">${safeJson}<\/script>`);
  } else {
    html = html.replace(/<script\s+type=["']application\/ld\+json["']\s+id=["']tfr-structured-data["'][\s\S]*?<\/script>/i, "");
  }
  return html;
}
__name(injectSeo, "injectSeo");
function injectStoreCart(html) {
  const block = `
<style id="tfr-store-cart-style">
  .tfr-cart-fab{position:fixed;right:22px;bottom:92px;z-index:2147483000;display:flex;align-items:center;gap:10px;border:0;border-radius:999px;background:#071a37;color:#fff;padding:13px 17px;font:800 14px/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 15px 35px rgba(3,24,56,.28);cursor:pointer;transition:transform .15s ease,box-shadow .15s ease}.tfr-cart-fab:hover{transform:translateY(-2px);box-shadow:0 18px 40px rgba(3,24,56,.34)}.tfr-cart-fab svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:2}.tfr-cart-badge{display:grid;place-items:center;min-width:24px;height:24px;padding:0 6px;border-radius:999px;background:#0aa966;color:#fff;font-size:12px;font-weight:900}
  .tfr-cart-add{display:inline-flex;align-items:center;justify-content:center;min-height:48px;margin-left:10px;padding:0 18px;border:1px solid #0b65df;border-radius:12px;background:#fff;color:#0b5fd3;font:800 14px/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;box-shadow:0 8px 20px rgba(16,84,177,.08);transition:transform .15s ease,background .15s ease}.tfr-cart-add:hover{transform:translateY(-1px);background:#f5f9ff}.tfr-cart-add[data-added="1"]{border-color:#0aa966;color:#087a4d;background:#f0fff8}
  .tfr-cart-overlay{position:fixed;inset:0;z-index:2147483500;background:rgba(3,14,32,.58);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);display:flex;justify-content:flex-end;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.tfr-cart-drawer{width:min(100%,460px);height:100%;background:#f7f9fc;box-shadow:-26px 0 70px rgba(3,22,52,.24);display:flex;flex-direction:column;animation:tfrCartSlide .24s ease-out}.tfr-cart-head{display:flex;align-items:center;justify-content:space-between;padding:24px 22px;background:#fff;border-bottom:1px solid #e5edf6}.tfr-cart-head h2{margin:0;color:#071a37;font-size:23px}.tfr-cart-close{width:38px;height:38px;border:1px solid #dbe5ef;border-radius:11px;background:#fff;color:#34506e;font-size:24px;cursor:pointer}.tfr-cart-body{flex:1;overflow:auto;padding:18px 18px 10px}.tfr-cart-empty{padding:48px 18px;text-align:center;color:#6e7f94}.tfr-cart-item{display:grid;grid-template-columns:58px 1fr auto;gap:13px;align-items:center;background:#fff;border:1px solid #e3ebf4;border-radius:16px;padding:12px;margin-bottom:11px;box-shadow:0 6px 18px rgba(18,45,82,.05)}.tfr-cart-thumb{width:58px;height:58px;border-radius:12px;background:#edf3fa;overflow:hidden;display:grid;place-items:center;color:#8090a5;font-size:11px}.tfr-cart-thumb img{width:100%;height:100%;object-fit:cover}.tfr-cart-name{font-weight:800;color:#102644;font-size:14px;line-height:1.35}.tfr-cart-price{margin-top:4px;color:#5e718a;font-size:13px}.tfr-cart-qty{display:flex;align-items:center;gap:7px;margin-top:9px}.tfr-cart-qty button{width:29px;height:29px;border:1px solid #d9e3ee;border-radius:9px;background:#fff;color:#173557;font-weight:900;cursor:pointer}.tfr-cart-qty strong{min-width:22px;text-align:center;font-size:13px}.tfr-cart-remove{border:0;background:transparent;color:#9b4b56;font-size:12px;font-weight:800;cursor:pointer;padding:5px}.tfr-cart-foot{background:#fff;border-top:1px solid #e1eaf3;padding:18px 20px 22px}.tfr-cart-total{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;color:#4f637c}.tfr-cart-total strong{font-size:21px;color:#071a37}.tfr-cart-checkout{width:100%;min-height:52px;border:0;border-radius:14px;background:linear-gradient(135deg,#0a67e8,#154bd7);color:#fff;font:900 15px/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;box-shadow:0 12px 28px rgba(24,89,211,.22)}.tfr-cart-continue{width:100%;min-height:44px;margin-top:9px;border:1px solid #d9e3ee;border-radius:12px;background:#fff;color:#294764;font-weight:800;cursor:pointer}
  .tfr-cart-checkout-summary{margin:18px 0 20px;padding:18px;border:1px solid #dce7f3;border-radius:16px;background:#fff;box-shadow:0 8px 22px rgba(18,45,82,.06);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.tfr-cart-checkout-summary h3{margin:0 0 13px;color:#071a37;font-size:17px}.tfr-cart-checkout-line{display:flex;justify-content:space-between;gap:16px;padding:8px 0;border-bottom:1px solid #edf2f7;color:#5a6e87;font-size:13px}.tfr-cart-checkout-line:last-of-type{border-bottom:0}.tfr-cart-checkout-line strong{color:#102644;text-align:right}.tfr-cart-checkout-sum{display:flex;justify-content:space-between;margin-top:12px;padding-top:12px;border-top:1px solid #dce6f0;font-size:15px;color:#405875}.tfr-cart-checkout-sum strong{color:#071a37;font-size:18px}
  .tfr-cart-toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:2147483600;background:#09213e;color:#fff;border-radius:999px;padding:12px 18px;font:800 13px/1.2 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 12px 30px rgba(3,24,56,.28);animation:tfrCartToast .2s ease-out}.tfr-cart-toast b{color:#65e1a5}
  @keyframes tfrCartSlide{from{transform:translateX(28px);opacity:.3}to{transform:translateX(0);opacity:1}}@keyframes tfrCartToast{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
  @media(max-width:620px){.tfr-cart-fab{right:15px;bottom:86px}.tfr-cart-drawer{width:100%}.tfr-cart-add{display:flex;width:100%;margin:10px 0 0}.tfr-cart-checkout-summary{margin-left:0;margin-right:0}}
</style>
<script id="tfr-store-cart-script">
(function(){
  if(window.__TFR_STORE_CART__) return;
  window.__TFR_STORE_CART__=true;
  var CART_KEY="tfr_store_cart_v1";
  var CHECKOUT_KEY="tfr_store_cart_checkout_v1";
  var nativeFetch=window.fetch.bind(window);
  function loadCart(){try{var x=JSON.parse(localStorage.getItem(CART_KEY)||"[]");return Array.isArray(x)?x:[];}catch(e){return [];}}
  function saveCart(items){try{localStorage.setItem(CART_KEY,JSON.stringify(items));}catch(e){} updateBadge();}
  function money(cents){try{return (Number(cents||0)/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}catch(e){return "R$ "+(Number(cents||0)/100).toFixed(2).replace(".",",");}}
  function count(){return loadCart().reduce(function(s,x){return s+Math.max(1,Number(x.quantity||1));},0);}
  function subtotal(){return loadCart().reduce(function(s,x){return s+Number(x.priceCents||0)*Math.max(1,Number(x.quantity||1));},0);}
  function updateBadge(){var b=document.querySelector(".tfr-cart-badge");if(b)b.textContent=String(count());}
  function toast(name){var old=document.querySelector(".tfr-cart-toast");if(old)old.remove();var el=document.createElement("div");el.className="tfr-cart-toast";el.innerHTML="<b>Adicionado!</b> "+String(name||"Produto").replace(/[<>&]/g,"");document.body.appendChild(el);setTimeout(function(){el.remove();},1800);}
  function productImage(product){return product&&Array.isArray(product.images)&&product.images[0]?product.images[0]:"";}
  function addProduct(product,qty){var items=loadCart();var slug=String(product.slug||"");var found=items.find(function(x){return x.slug===slug;});if(found){found.quantity=Math.min(20,Math.max(1,Number(found.quantity||1))+Math.max(1,Number(qty||1)));}else{items.push({slug:slug,name:String(product.name||"Produto"),priceCents:Number(product.priceCents||0),quantity:Math.max(1,Number(qty||1)),image:productImage(product),madeToOrder:Boolean(product.madeToOrder),leadDays:Number(product.leadDays||0)});}saveCart(items);toast(product.name);}
  function changeQty(slug,delta){var items=loadCart();var found=items.find(function(x){return x.slug===slug;});if(!found)return;found.quantity=Math.max(1,Math.min(20,Number(found.quantity||1)+delta));saveCart(items);renderDrawer();renderCheckoutSummary();}
  function removeItem(slug){saveCart(loadCart().filter(function(x){return x.slug!==slug;}));renderDrawer();renderCheckoutSummary();}
  function cartPayload(){return loadCart().map(function(x){return {slug:x.slug,quantity:Math.max(1,Number(x.quantity||1))};});}
  function createFab(){if(document.querySelector(".tfr-cart-fab"))return;var btn=document.createElement("button");btn.type="button";btn.className="tfr-cart-fab";btn.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 7H7"></path><circle cx="10" cy="20" r="1"></circle><circle cx="18" cy="20" r="1"></circle></svg><span>Carrinho</span><span class="tfr-cart-badge">0</span>';btn.addEventListener("click",openDrawer);document.body.appendChild(btn);updateBadge();}
  function openDrawer(){var old=document.querySelector(".tfr-cart-overlay");if(old){renderDrawer();return;}var overlay=document.createElement("div");overlay.className="tfr-cart-overlay";overlay.innerHTML='<aside class="tfr-cart-drawer"><div class="tfr-cart-head"><h2>Seu carrinho</h2><button type="button" class="tfr-cart-close" aria-label="Fechar">×</button></div><div class="tfr-cart-body"></div><div class="tfr-cart-foot"><div class="tfr-cart-total"><span>Subtotal</span><strong data-cart-total></strong></div><button type="button" class="tfr-cart-checkout">Finalizar compra</button><button type="button" class="tfr-cart-continue">Continuar comprando</button></div></aside>';document.body.appendChild(overlay);overlay.addEventListener("click",function(e){if(e.target===overlay)overlay.remove();});overlay.querySelector(".tfr-cart-close").onclick=function(){overlay.remove();};overlay.querySelector(".tfr-cart-continue").onclick=function(){overlay.remove();if(location.pathname.indexOf("/loja/checkout/")===0)location.href="/loja";};overlay.querySelector(".tfr-cart-checkout").onclick=function(){var items=loadCart();if(!items.length)return;try{localStorage.setItem(CHECKOUT_KEY,"1");}catch(e){}location.href="/loja/checkout/"+encodeURIComponent(items[0].slug)+"?cart=1";};renderDrawer();}
  function renderDrawer(){var body=document.querySelector(".tfr-cart-body");var totalEl=document.querySelector("[data-cart-total]");if(!body||!totalEl)return;var items=loadCart();totalEl.textContent=money(subtotal());if(!items.length){body.innerHTML='<div class="tfr-cart-empty"><strong>Seu carrinho está vazio.</strong><br><br>Adicione produtos para continuar.</div>';return;}body.innerHTML="";items.forEach(function(item){var row=document.createElement("div");row.className="tfr-cart-item";var img=item.image?'<img src="'+String(item.image).replace(/"/g,"&quot;")+'" alt="">':'Produto';row.innerHTML='<div class="tfr-cart-thumb">'+img+'</div><div><div class="tfr-cart-name">'+String(item.name||"Produto").replace(/[<>&]/g,"")+'</div><div class="tfr-cart-price">'+money(item.priceCents)+'</div><div class="tfr-cart-qty"><button type="button" data-minus>−</button><strong>'+Math.max(1,Number(item.quantity||1))+'</strong><button type="button" data-plus>+</button></div></div><button type="button" class="tfr-cart-remove">Remover</button>';row.querySelector("[data-minus]").onclick=function(){changeQty(item.slug,-1);};row.querySelector("[data-plus]").onclick=function(){changeQty(item.slug,1);};row.querySelector(".tfr-cart-remove").onclick=function(){removeItem(item.slug);};body.appendChild(row);});}
  function installProductButton(){var m=location.pathname.match(/^\/loja\/([^/]+)\/?$/);if(!m||m[1]==="checkout")return;var slug=decodeURIComponent(m[1]);var tries=0;var timer=setInterval(function(){tries++;var buy=Array.from(document.querySelectorAll('a[href*="/loja/checkout/"]')).find(function(a){return a.href.indexOf("/loja/checkout/"+encodeURIComponent(slug))>=0||a.href.indexOf("/loja/checkout/"+slug)>=0;});if(!buy&&tries<40)return;clearInterval(timer);if(!buy||document.querySelector(".tfr-cart-add"))return;nativeFetch("/api/loja/produtos/"+encodeURIComponent(slug),{headers:{accept:"application/json"},cache:"no-store"}).then(function(r){return r.json();}).then(function(data){var product=data&&data.product;if(!product)return;var btn=document.createElement("button");btn.type="button";btn.className="tfr-cart-add";btn.textContent="Adicionar ao carrinho";btn.onclick=function(){addProduct(product,1);btn.dataset.added="1";btn.textContent="Adicionado ✓";setTimeout(function(){btn.dataset.added="0";btn.textContent="Adicionar ao carrinho";},1500);};buy.insertAdjacentElement("afterend",btn);}).catch(function(){});},250);}
  function isCartCheckout(){var active=false;try{active=localStorage.getItem(CHECKOUT_KEY)==="1";}catch(e){}return location.pathname.indexOf("/loja/checkout/")===0&&loadCart().length>0&&(active||new URLSearchParams(location.search).get("cart")==="1");}
  function renderCheckoutSummary(){if(!isCartCheckout())return;var items=loadCart();var box=document.getElementById("tfr-cart-checkout-summary");if(!box){box=document.createElement("div");box.id="tfr-cart-checkout-summary";box.className="tfr-cart-checkout-summary";var h1=document.querySelector("main h1");if(h1&&h1.parentNode)h1.parentNode.insertBefore(box,h1.nextSibling);else{var main=document.querySelector("main");if(main)main.prepend(box);} }if(!box)return;var sig=JSON.stringify(items.map(function(x){return [x.slug,x.quantity,x.priceCents,x.name];}));if(box.dataset.sig!==sig){box.dataset.sig=sig;box.innerHTML='<h3>Itens do carrinho</h3>'+items.map(function(item){return '<div class="tfr-cart-checkout-line"><span>'+Math.max(1,Number(item.quantity||1))+'× '+String(item.name||"Produto").replace(/[<>&]/g,"")+'</span><strong>'+money(Number(item.priceCents||0)*Math.max(1,Number(item.quantity||1)))+'</strong></div>';}).join("")+'<div class="tfr-cart-checkout-sum"><span>Subtotal dos produtos</span><strong>'+money(subtotal())+'</strong></div>';}Array.from(document.querySelectorAll("label")).forEach(function(label){if(/^Quantidade\b/i.test(String(label.textContent||"").trim())){if(label.style.display!=="none")label.style.display="none";var input=label.querySelector("input");if(input&&String(input.value)!=="1"){input.value="1";try{input.dispatchEvent(new Event("input",{bubbles:true}));input.dispatchEvent(new Event("change",{bubbles:true}));}catch(e){}}}});}
  if(isCartCheckout()){
    window.fetch=async function(input,init){
      init=init||{};var url=typeof input==="string"?input:(input&&input.url?input.url:"");var method=String(init.method||(input&&input.method)||"GET").toUpperCase();
      if(method==="POST"&&(url.indexOf("/api/loja/frete")>=0||url.indexOf("/api/loja/checkout/pagar")>=0)&&typeof init.body==="string"){
        try{var payload=JSON.parse(init.body);var items=cartPayload();payload.items=items;payload.slug=items[0]?items[0].slug:payload.slug;payload.quantity=1;init=Object.assign({},init,{body:JSON.stringify(payload)});}catch(e){}
      }
      var response=await nativeFetch(input,init);
      if(method==="GET"&&url.indexOf("/api/loja/checkout/config/")>=0){
        try{var data=await response.clone().json();if(data&&data.product){var items2=loadCart();data.product.name=items2.length===1?items2[0].name:"Carrinho TFR - "+count()+" item(ns)";data.product.priceCents=subtotal();data.product.compareAtPriceCents=null;data.product.madeToOrder=items2.some(function(x){return x.madeToOrder;});data.product.leadDays=items2.reduce(function(m,x){return Math.max(m,Number(x.leadDays||0));},0);return new Response(JSON.stringify(data),{status:response.status,statusText:response.statusText,headers:response.headers});}}catch(e){}
      }
      return response;
    };
    var mo=new MutationObserver(function(){renderCheckoutSummary();});
    if(document.documentElement)mo.observe(document.documentElement,{childList:true,subtree:true});
  }
  var maintainTimer=null;
  function maintainUi(){
    createFab();
    if(location.pathname.match(/^\/loja\/[^/]+\/?$/)&&!document.querySelector(".tfr-cart-add")){
      installProductButton();
    }
    renderCheckoutSummary();
  }
  function scheduleMaintain(){
    if(maintainTimer)return;
    maintainTimer=setTimeout(function(){maintainTimer=null;maintainUi();},80);
  }
  function init(){
    maintainUi();
    var target=document.body||document.documentElement;
    if(target){
      var uiObserver=new MutationObserver(scheduleMaintain);
      uiObserver.observe(target,{childList:true,subtree:true});
    }
    setInterval(maintainUi,1500);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
</script>`;
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${block}</body>`);
  return `${html}${block}`;
}
__name(injectStoreCart, "injectStoreCart");

function injectStoreCheckoutConfirmation(html) {
  const block = `
<style id="tfr-store-payment-confirmation-style">
  .tfr-pay-confirmation-overlay{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:22px;background:rgba(3,14,32,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:tfrPayFade .22s ease-out}
  .tfr-pay-confirmation-card{position:relative;width:min(100%,540px);overflow:hidden;border:1px solid rgba(255,255,255,.72);border-radius:28px;background:linear-gradient(180deg,#fff 0%,#f8fbff 100%);box-shadow:0 30px 90px rgba(0,30,75,.30);padding:38px 34px 30px;text-align:center;color:#081a35;animation:tfrPayPop .32s cubic-bezier(.2,.85,.32,1.15)}
  .tfr-pay-confirmation-glow{position:absolute;inset:-120px -80px auto;height:210px;background:radial-gradient(circle,rgba(17,176,104,.20),rgba(29,107,255,.10) 48%,transparent 70%);pointer-events:none}
  .tfr-pay-confirmation-icon{position:relative;margin:0 auto 18px;width:86px;height:86px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#11ad68,#05c47b);box-shadow:0 16px 34px rgba(12,171,101,.28)}
  .tfr-pay-confirmation-icon svg{width:44px;height:44px;stroke:#fff;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round}
  .tfr-pay-confirmation-kicker{position:relative;margin:0 0 8px;color:#0d9f61;font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase}
  .tfr-pay-confirmation-title{position:relative;margin:0;color:#071a37;font-size:32px;line-height:1.12;font-weight:900;letter-spacing:-.035em}
  .tfr-pay-confirmation-text{position:relative;margin:12px auto 22px;max-width:420px;color:#607087;font-size:15px;line-height:1.6}
  .tfr-pay-confirmation-summary{position:relative;display:grid;gap:0;margin:0 0 24px;border:1px solid #e5edf7;border-radius:18px;background:#fff;text-align:left;box-shadow:0 8px 24px rgba(21,48,86,.06);overflow:hidden}
  .tfr-pay-confirmation-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 17px;border-bottom:1px solid #edf2f8;font-size:14px}
  .tfr-pay-confirmation-row:last-child{border-bottom:0}
  .tfr-pay-confirmation-row span{color:#708198}.tfr-pay-confirmation-row strong{color:#0b1e3a;text-align:right;font-weight:800}
  .tfr-pay-confirmation-actions{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .tfr-pay-confirmation-btn{min-height:50px;border-radius:14px;border:1px solid #d8e2ef;font:inherit;font-size:14px;font-weight:800;cursor:pointer;transition:transform .15s ease,box-shadow .15s ease,background .15s ease}
  .tfr-pay-confirmation-btn:hover{transform:translateY(-1px)}
  .tfr-pay-confirmation-btn-primary{border:0;color:#fff;background:linear-gradient(135deg,#0a67e8,#154bd7);box-shadow:0 12px 26px rgba(24,89,211,.24)}
  .tfr-pay-confirmation-btn-secondary{color:#233a59;background:#fff}
  .tfr-pay-confirmation-note{position:relative;margin:18px 0 0;color:#8190a3;font-size:12px;line-height:1.5}
  .tfr-pay-confetti{position:absolute;inset:0;pointer-events:none;overflow:hidden}.tfr-pay-confetti i{position:absolute;width:8px;height:13px;border-radius:3px;opacity:.72;animation:tfrConfetti 1.8s ease-out both}.tfr-pay-confetti i:nth-child(1){left:12%;top:8%;background:#19b66d;transform:rotate(18deg)}.tfr-pay-confetti i:nth-child(2){left:23%;top:17%;background:#2878ff;animation-delay:.1s}.tfr-pay-confetti i:nth-child(3){right:18%;top:10%;background:#ffbd2f;animation-delay:.18s}.tfr-pay-confetti i:nth-child(4){right:8%;top:28%;background:#16b86e;animation-delay:.24s}.tfr-pay-confetti i:nth-child(5){left:8%;top:31%;background:#ff7a59;animation-delay:.3s}.tfr-pay-confetti i:nth-child(6){right:28%;top:22%;background:#7b61ff;animation-delay:.14s}
  @keyframes tfrPayFade{from{opacity:0}to{opacity:1}}@keyframes tfrPayPop{from{opacity:0;transform:translateY(16px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}@keyframes tfrConfetti{0%{opacity:0;transform:translateY(-18px) rotate(0)}25%{opacity:.9}100%{opacity:0;transform:translateY(130px) rotate(260deg)}}
  @media(max-width:560px){.tfr-pay-confirmation-card{padding:32px 22px 24px;border-radius:22px}.tfr-pay-confirmation-title{font-size:28px}.tfr-pay-confirmation-actions{grid-template-columns:1fr}.tfr-pay-confirmation-btn-primary{order:-1}}
</style>
<script id="tfr-store-payment-confirmation-script">
(function(){
  if(window.__TFR_STORE_PAYMENT_CONFIRMATION__) return;
  window.__TFR_STORE_PAYMENT_CONFIRMATION__ = true;
  var storageKey = "tfr_store_pending_payment_v1";
  var currentWatch = "";
  var watchTimer = null;
  var nativeFetch = window.fetch.bind(window);

  function money(cents){
    try{return (Number(cents||0)/100).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}
    catch(e){return "R$ " + (Number(cents||0)/100).toFixed(2).replace(".",",");}
  }

  function clearPending(){
    try{localStorage.removeItem(storageKey);}catch(e){}
    if(watchTimer){clearTimeout(watchTimer);watchTimer=null;}
    currentWatch="";
  }

  function savePending(orderId,paymentId){
    try{localStorage.setItem(storageKey,JSON.stringify({orderId:Number(orderId),paymentId:String(paymentId||""),savedAt:Date.now()}));}catch(e){}
  }

  function showConfirmation(order){
    if(document.getElementById("tfr-pay-confirmation")) return;
    clearPending();
    try{localStorage.removeItem("tfr_store_cart_v1");localStorage.removeItem("tfr_store_cart_checkout_v1");var cartBadge=document.querySelector(".tfr-cart-badge");if(cartBadge)cartBadge.textContent="0";}catch(e){}
    var overlay=document.createElement("div");
    overlay.id="tfr-pay-confirmation";
    overlay.className="tfr-pay-confirmation-overlay";
    overlay.setAttribute("role","dialog");
    overlay.setAttribute("aria-modal","true");
    overlay.setAttribute("aria-label","Pagamento confirmado");
    var delivery=order.isPickup ? "Retirada na loja" : (order.shippingServiceName || "Entrega selecionada");
    var orderLabel="#"+String(order.id||"").padStart(6,"0");
    overlay.innerHTML='<div class="tfr-pay-confirmation-card">'+
      '<div class="tfr-pay-confirmation-glow"></div>'+
      '<div class="tfr-pay-confetti"><i></i><i></i><i></i><i></i><i></i><i></i></div>'+
      '<div class="tfr-pay-confirmation-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"></path></svg></div>'+
      '<p class="tfr-pay-confirmation-kicker">Pagamento aprovado</p>'+
      '<h2 class="tfr-pay-confirmation-title">Compra confirmada!</h2>'+
      '<p class="tfr-pay-confirmation-text">Recebemos seu pagamento e seu pedido já foi encaminhado para a equipe da TFR Projetos.</p>'+
      '<div class="tfr-pay-confirmation-summary">'+
        '<div class="tfr-pay-confirmation-row"><span>Pedido</span><strong>'+orderLabel+'</strong></div>'+
        '<div class="tfr-pay-confirmation-row"><span>Valor pago</span><strong>'+money(order.totalCents)+'</strong></div>'+
        '<div class="tfr-pay-confirmation-row"><span>Entrega</span><strong>'+String(delivery).replace(/[<>&]/g,"")+'</strong></div>'+
      '</div>'+
      '<div class="tfr-pay-confirmation-actions">'+
        '<button type="button" class="tfr-pay-confirmation-btn tfr-pay-confirmation-btn-secondary" data-tfr-close>Fechar</button>'+
        '<button type="button" class="tfr-pay-confirmation-btn tfr-pay-confirmation-btn-primary" data-tfr-shop>Continuar comprando</button>'+
      '</div>'+
      '<p class="tfr-pay-confirmation-note">A confirmação também foi enviada para o e-mail informado na compra.</p>'+
    '</div>';
    document.body.appendChild(overlay);
    var close=function(){overlay.remove();};
    overlay.querySelector("[data-tfr-close]").addEventListener("click",close);
    overlay.querySelector("[data-tfr-shop]").addEventListener("click",function(){window.location.href="/";});
    overlay.addEventListener("click",function(event){if(event.target===overlay) close();});
    document.addEventListener("keydown",function esc(event){if(event.key==="Escape"){close();document.removeEventListener("keydown",esc);}});
  }

  async function checkStatus(orderId,paymentId){
    try{
      var response=await nativeFetch("/api/loja/pedido/"+encodeURIComponent(orderId)+"/status?paymentId="+encodeURIComponent(paymentId),{method:"GET",headers:{"accept":"application/json"},cache:"no-store"});
      if(!response.ok) return null;
      var data=await response.json();
      return data && data.order ? data.order : null;
    }catch(e){return null;}
  }

  function watch(orderId,paymentId){
    orderId=Number(orderId);paymentId=String(paymentId||"");
    if(!orderId||!paymentId) return;
    var key=orderId+":"+paymentId;
    if(currentWatch===key) return;
    currentWatch=key;
    savePending(orderId,paymentId);
    var started=Date.now();
    async function tick(){
      if(currentWatch!==key) return;
      var order=await checkStatus(orderId,paymentId);
      if(order && order.status==="approved"){
        showConfirmation(order);
        return;
      }
      if(order && ["rejected","cancelled","refunded","charged_back"].indexOf(String(order.status))>=0){clearPending();return;}
      if(Date.now()-started > 30*60*1000){currentWatch="";return;}
      watchTimer=setTimeout(tick,4000);
    }
    tick();
  }

  window.fetch=async function(){
    var args=Array.prototype.slice.call(arguments);
    var response=await nativeFetch.apply(null,args);
    try{
      var input=args[0];
      var init=args[1]||{};
      var url=typeof input==="string"?input:(input&&input.url?input.url:"");
      var method=String(init.method||(input&&input.method)||"GET").toUpperCase();
      if(method==="POST" && url.indexOf("/api/loja/checkout/pagar")>=0){
        var clone=response.clone();
        clone.json().then(function(data){
          if(data&&data.orderId&&data.paymentId) watch(data.orderId,data.paymentId);
        }).catch(function(){});
      }
    }catch(e){}
    return response;
  };

  try{
    var pending=JSON.parse(localStorage.getItem(storageKey)||"null");
    if(pending&&pending.orderId&&pending.paymentId) watch(pending.orderId,pending.paymentId);
  }catch(e){}
})();
</script>`;
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, `${block}</body>`);
  return `${html}${block}`;
}
__name(injectStoreCheckoutConfirmation, "injectStoreCheckoutConfirmation");
async function serveSeoHtml(request, env, path) {
  const assetUrl = new URL("/", request.url);
  const assetRequest = new Request(assetUrl.toString(), {
    method: "GET",
    headers: request.headers
  });
  const assetResponse = await env.ASSETS.fetch(assetRequest);
  if (!assetResponse.ok) return assetResponse;
  const seo = await seoForPath(env, path);
  let html = injectSeo(await assetResponse.text(), seo);
  const htmlHost = new URL(request.url).hostname.toLowerCase();
  if (htmlHost === "loja.tfrprojetos.com.br" || (htmlHost.startsWith("tfr-site-cart-prep.") && htmlHost.endsWith(".workers.dev"))) {
    html = injectStoreCart(html);
    html = injectStoreCheckoutConfirmation(html);
  }
  const headers = new Headers(assetResponse.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  if (htmlHost.startsWith("tfr-site-cart-prep.") && htmlHost.endsWith(".workers.dev")) {
    headers.set("x-tfr-cart-prep", "injected");
  }
  headers.set(
    "cache-control",
    path === "/" || path === "/biblioteca" ? "public, max-age=300" : "public, max-age=60"
  );
  if (seo.robots?.startsWith("noindex")) {
    headers.set("x-robots-tag", seo.robots);
  }
  headers.delete("location");
  return new Response(html, {
    status: 200,
    headers
  });
}
__name(serveSeoHtml, "serveSeoHtml");
async function dynamicSitemap(env) {
  const base = (env.SITE_URL || "https://tfrprojetos.com.br").replace(/\/+$/, "");
  const urls = [
    { loc: `${base}/`, priority: "1.0", changefreq: "monthly" },
    { loc: `${base}/biblioteca`, priority: "0.8", changefreq: "weekly" },
    { loc: `https://loja.tfrprojetos.com.br/`, priority: "0.8", changefreq: "weekly" }
  ];
  try {
    const { results } = await env.DB.prepare("SELECT slug,status FROM products WHERE status IN ('active','coming') ORDER BY id DESC").all();
    for (const row of results || []) urls.push({ loc: `${base}/biblioteca/${encodeURIComponent(row.slug)}`, priority: row.status === "active" ? "0.8" : "0.5", changefreq: "weekly" });
  } catch (error) {
    console.warn("Sitemap: n\xE3o foi poss\xEDvel listar produtos.", error);
  }
  try {
    const { results: offers } = await env.DB.prepare("SELECT p.slug FROM landing_pages l JOIN products p ON p.id=l.product_id WHERE l.status='published' AND p.status='active' ORDER BY l.id DESC").all();
    for (const row of offers || []) urls.push({ loc: `${base}/oferta/${encodeURIComponent(row.slug)}`, priority: "0.7", changefreq: "weekly" });
  } catch (error) {
    console.warn("Sitemap: n\xE3o foi poss\xEDvel listar ofertas.", error);
  }
  try {
    const { results: storeRows } = await env.DB.prepare("SELECT slug FROM store_products WHERE status='active' ORDER BY updated_at DESC").all();
    for (const row of storeRows || []) urls.push({ loc: `https://loja.tfrprojetos.com.br/loja/${encodeURIComponent(row.slug)}`, priority: "0.8", changefreq: "weekly" });
  } catch (error) {
    console.warn("Sitemap: n\xE3o foi poss\xEDvel listar produtos da loja.", error);
  }
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${escapeHtml(u.loc)}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=300" } });
}
__name(dynamicSitemap, "dynamicSitemap");
function parseJsonArray(value) {
  try {
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}
__name(parseJsonArray, "parseJsonArray");
function money(value) {
  if (value === null || value === void 0) return null;
  return (value / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
__name(money, "money");
function productDto(row, items = []) {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    category: row.category || "RECURSO T\xC9CNICO",
    description: row.short_description || row.description || "",
    longDescription: row.description || row.short_description || "",
    status: row.status,
    tags: parseJsonArray(row.tags_json),
    powers: parseJsonArray(row.powers_json),
    format: row.format || "",
    typologies: row.typologies || "",
    priceCents: row.price || 0,
    originalPriceCents: row.original_price,
    price: row.price ? money(row.price) : null,
    oldPrice: row.original_price ? money(row.original_price) : null,
    cover: row.cover_key ? `/api/biblioteca/produtos/${encodeURIComponent(row.slug)}/capa?v=${encodeURIComponent(row.updated_at || row.cover_key)}` : null,
    hasDownload: Boolean(row.download_key),
    fileName: row.file_name,
    fileSize: row.file_size,
    deliverables: items.map((i) => ({ title: i.title, text: i.description || "" })),
    displayOrder: row.display_order || 0,
    deliveryMode: row.delivery_mode || "paid_private",
    externalDownloadUrl: row.external_download_url || null,
    versionLabel: row.version_label || null
  };
}
__name(productDto, "productDto");
async function getProductBySlug(env, slug) {
  return env.DB.prepare("SELECT * FROM products WHERE slug = ?").bind(slug).first();
}
__name(getProductBySlug, "getProductBySlug");
async function getItems(env, productId) {
  const { results } = await env.DB.prepare("SELECT id, title, description, sort_order FROM product_items WHERE product_id = ? ORDER BY sort_order, id").bind(productId).all();
  return results || [];
}
__name(getItems, "getItems");
function safeSlug(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
}
__name(safeSlug, "safeSlug");
function fileExt(file) {
  const name = file.name || "";
  const m = name.match(/\.([a-zA-Z0-9]{1,8})$/);
  return m ? `.${m[1].toLowerCase()}` : "";
}
__name(fileExt, "fileExt");
function isLocal(request) {
  const host = new URL(request.url).hostname;
  return host === "localhost" || host === "127.0.0.1";
}
__name(isLocal, "isLocal");
function cookieValue(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return "";
}
__name(cookieValue, "cookieValue");
async function hasAdminSession(request, env) {
  const token = cookieValue(request, "tfr_admin_session");
  if (!token) return false;
  const row = await env.DB.prepare("SELECT session_token FROM admin_sessions WHERE session_token = ? AND expires_at > ?").bind(token, Date.now()).first();
  return Boolean(row?.session_token);
}
__name(hasAdminSession, "hasAdminSession");
async function requireAdminAccess(request, env) {
  if (env.ADMIN_DEV_BYPASS === "true" || isLocal(request)) return null;
  if (request.headers.get("cf-access-jwt-assertion")) return null;
  if (await hasAdminSession(request, env)) return null;
  return json({ error: "Acesso administrativo requer Cloudflare Access." }, 403);
}
__name(requireAdminAccess, "requireAdminAccess");
async function createAdminSession(request, env) {
  if (env.ADMIN_DEV_BYPASS !== "true" && !isLocal(request) && !request.headers.get("cf-access-jwt-assertion")) {
    return json({ error: "Acesso administrativo requer Cloudflare Access." }, 403);
  }
  const sessionToken = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
  const expiresAt = Date.now() + 8 * 60 * 60 * 1e3;
  await env.DB.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").bind(Date.now()).run();
  await env.DB.prepare("INSERT INTO admin_sessions (session_token, expires_at, created_at) VALUES (?, ?, ?)").bind(sessionToken, expiresAt, (/* @__PURE__ */ new Date()).toISOString()).run();
  const headers = new Headers(jsonHeaders);
  headers.set("set-cookie", `tfr_admin_session=${encodeURIComponent(sessionToken)}; Max-Age=28800; Path=/admin/; HttpOnly; Secure; SameSite=Strict`);
  return new Response(JSON.stringify({ ok: true, expiresAt }), { status: 200, headers });
}
__name(createAdminSession, "createAdminSession");
async function listPublic(env) {
  const { results } = await env.DB.prepare("SELECT * FROM products WHERE status IN ('active','coming') ORDER BY display_order DESC, id DESC").all();
  return json({ products: (results || []).map((r) => productDto(r)) });
}
__name(listPublic, "listPublic");
async function publicProduct(env, slug) {
  const row = await getProductBySlug(env, slug);
  if (!row || !["active", "coming"].includes(row.status)) return json({ error: "Produto n\xE3o encontrado." }, 404);
  const items = await getItems(env, row.id);
  return json({ product: productDto(row, items) });
}
__name(publicProduct, "publicProduct");
async function publicCover(env, slug) {
  const row = await getProductBySlug(env, slug);
  if (!row?.cover_key) return new Response("Not found", { status: 404 });
  const obj = await env.PRODUCT_FILES.get(row.cover_key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=3600");
  return new Response(obj.body, { headers });
}
__name(publicCover, "publicCover");
async function adminList(env) {
  const { results } = await env.DB.prepare("SELECT * FROM products WHERE status <> 'deleted' ORDER BY display_order DESC, id DESC").all();
  const products = [];
  for (const row of results || []) products.push(productDto(row, await getItems(env, row.id)));
  return json({ products });
}
__name(adminList, "adminList");
async function saveItems(env, productId, raw) {
  let items = [];
  try {
    items = raw ? JSON.parse(raw) : [];
  } catch {
    items = [];
  }
  await env.DB.prepare("DELETE FROM product_items WHERE product_id = ?").bind(productId).run();
  let order = 10;
  for (const item of items) {
    if (!item?.title?.trim()) continue;
    await env.DB.prepare("INSERT INTO product_items (product_id,title,description,sort_order) VALUES (?,?,?,?)").bind(productId, item.title.trim(), (item.text || "").trim(), order).run();
    order += 10;
  }
}
__name(saveItems, "saveItems");
async function initProductUpload(request, env) {
  const body = await request.json().catch(() => ({}));
  const fileName = String(body?.fileName || "arquivo.bin");
  const contentType = String(body?.contentType || "application/octet-stream");
  const slug = safeSlug(String(body?.slug || "produto")) || "produto";
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const key = `produtos/${slug}/${crypto.randomUUID()}-${cleanName}`;
  const upload = await env.PRODUCT_FILES.createMultipartUpload(key, {
    httpMetadata: { contentType }
  });
  return json({ key, uploadId: upload.uploadId });
}
__name(initProductUpload, "initProductUpload");
async function uploadProductPart(request, env) {
  const key = request.headers.get("x-upload-key") || "";
  const uploadId = request.headers.get("x-upload-id") || "";
  const partNumber = Number(request.headers.get("x-part-number") || 0);
  if (!key || !uploadId || !Number.isInteger(partNumber) || partNumber < 1) {
    return json({ error: "Par\xE2metros de upload inv\xE1lidos." }, 400);
  }
  if (!request.body) return json({ error: "Parte do arquivo vazia." }, 400);
  const upload = env.PRODUCT_FILES.resumeMultipartUpload(key, uploadId);
  const part = await upload.uploadPart(partNumber, request.body);
  return json({ partNumber: part.partNumber, etag: part.etag });
}
__name(uploadProductPart, "uploadProductPart");
async function completeProductUpload(request, env) {
  const body = await request.json().catch(() => ({}));
  const key = String(body?.key || "");
  const uploadId = String(body?.uploadId || "");
  const parts = Array.isArray(body?.parts) ? body.parts.map((p) => ({ partNumber: Number(p.partNumber), etag: String(p.etag) })) : [];
  if (!key || !uploadId || !parts.length) return json({ error: "Upload incompleto." }, 400);
  const upload = env.PRODUCT_FILES.resumeMultipartUpload(key, uploadId);
  await upload.complete(parts);
  return json({ ok: true, key });
}
__name(completeProductUpload, "completeProductUpload");
async function abortProductUpload(request, env) {
  const body = await request.json().catch(() => ({}));
  const key = String(body?.key || "");
  const uploadId = String(body?.uploadId || "");
  if (key && uploadId) {
    const upload = env.PRODUCT_FILES.resumeMultipartUpload(key, uploadId);
    await upload.abort().catch(() => {
    });
  }
  return json({ ok: true });
}
__name(abortProductUpload, "abortProductUpload");
async function cleanupProductUpload(request, env) {
  const body = await request.json().catch(() => ({}));
  const key = String(body?.key || "");
  if (key) await env.PRODUCT_FILES.delete(key).catch(() => {
  });
  return json({ ok: true });
}
__name(cleanupProductUpload, "cleanupProductUpload");
async function saveProduct(request, env, id) {
  const form = await request.formData();
  const title = String(form.get("title") || "").trim();
  const slug = safeSlug(String(form.get("slug") || title));
  if (!title || !slug) return json({ error: "T\xEDtulo e slug s\xE3o obrigat\xF3rios." }, 400);
  const category = String(form.get("category") || "RECURSO T\xC9CNICO").trim();
  const shortDescription = String(form.get("description") || "").trim();
  const longDescription = String(form.get("longDescription") || shortDescription).trim();
  const requestedStatus = String(form.get("status") || "coming");
  const status = ["active", "coming", "draft"].includes(requestedStatus) ? requestedStatus : "coming";
  const tags = String(form.get("tags") || "[]");
  const powers = String(form.get("powers") || "[]");
  const format = String(form.get("format") || "").trim();
  const typologies = String(form.get("typologies") || "").trim();
  const price = Math.max(0, Number(form.get("priceCents") || 0) || 0);
  const originalPriceRaw = Number(form.get("originalPriceCents") || 0) || 0;
  const originalPrice = originalPriceRaw > 0 ? originalPriceRaw : null;
  const displayOrder = Number(form.get("displayOrder") || 0) || 0;
  const requestedDeliveryMode = String(form.get("deliveryMode") || "paid_private");
  const deliveryMode = requestedDeliveryMode === "free_external" ? "free_external" : "paid_private";
  const externalDownloadUrl = String(form.get("externalDownloadUrl") || "").trim() || null;
  const versionLabel = String(form.get("versionLabel") || "").trim() || null;
  if (deliveryMode === "free_external" && !externalDownloadUrl) return json({ error: "Informe o link p\xFAblico de download para o produto gratuito." }, 400);
  if (externalDownloadUrl && !/^https:\/\//i.test(externalDownloadUrl)) return json({ error: "O link p\xFAblico de download deve usar HTTPS." }, 400);
  const itemsRaw = String(form.get("deliverables") || "[]");
  let current = null;
  if (id) {
    current = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first();
    if (!current) return json({ error: "Produto n\xE3o encontrado para edi\xE7\xE3o." }, 404);
  }
  const slugOwner = await env.DB.prepare("SELECT id,title FROM products WHERE slug=?").bind(slug).first();
  if (slugOwner && (!id || Number(slugOwner.id) !== Number(id))) {
    return json({ error: `J\xE1 existe um produto usando o endere\xE7o \u201C${slug}\u201D. Altere o slug antes de salvar.` }, 409);
  }
  const previousCoverKey = current?.cover_key || null;
  let coverKey = previousCoverKey;
  let downloadKey = current?.download_key || null;
  let fileName = current?.file_name || null;
  let fileSize = current?.file_size || null;
  const cover = form.get("cover");
  if (cover instanceof File && cover.size > 0) {
    coverKey = `capas/${slug}/${crypto.randomUUID()}${fileExt(cover)}`;
    await env.PRODUCT_FILES.put(coverKey, cover.stream(), { httpMetadata: { contentType: cover.type || "application/octet-stream" } });
  }
  const previousDownloadKey = downloadKey;
  const uploadedDownloadKey = String(form.get("uploadedDownloadKey") || "").trim();
  if (uploadedDownloadKey) {
    downloadKey = uploadedDownloadKey;
    fileName = String(form.get("uploadedFileName") || "").trim() || fileName;
    const uploadedSize = Number(form.get("uploadedFileSize") || 0) || 0;
    fileSize = uploadedSize > 0 ? uploadedSize : fileSize;
  } else {
    const download = form.get("download");
    if (download instanceof File && download.size > 0) {
      const cleanName = download.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
      downloadKey = `produtos/${slug}/${crypto.randomUUID()}-${cleanName}`;
      fileName = download.name;
      fileSize = download.size;
      await env.PRODUCT_FILES.put(downloadKey, download.stream(), { httpMetadata: { contentType: download.type || "application/octet-stream" } });
    }
  }
  if (id && current) {
    await env.DB.prepare(`UPDATE products SET slug=?, title=?, short_description=?, description=?, category=?, price=?, original_price=?, status=?, cover_key=?, download_key=?, file_name=?, file_size=?, tags_json=?, powers_json=?, format=?, typologies=?, display_order=?, delivery_mode=?, external_download_url=?, version_label=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(slug, title, shortDescription, longDescription, category, price, originalPrice, status, coverKey, downloadKey, fileName, fileSize, tags, powers, format, typologies, displayOrder, deliveryMode, externalDownloadUrl, versionLabel, id).run();
    await saveItems(env, id, itemsRaw);
    if (previousCoverKey && coverKey !== previousCoverKey) {
      await env.PRODUCT_FILES.delete(previousCoverKey);
    }
    if (previousDownloadKey && downloadKey !== previousDownloadKey) {
      await env.PRODUCT_FILES.delete(previousDownloadKey);
    }
    const row2 = await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(id).first();
    return json({ product: productDto(row2, await getItems(env, id)) });
  }
  const result = await env.DB.prepare(`INSERT INTO products (slug,title,short_description,description,category,price,original_price,status,cover_key,download_key,file_name,file_size,tags_json,powers_json,format,typologies,display_order,delivery_mode,external_download_url,version_label) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(slug, title, shortDescription, longDescription, category, price, originalPrice, status, coverKey, downloadKey, fileName, fileSize, tags, powers, format, typologies, displayOrder, deliveryMode, externalDownloadUrl, versionLabel).run();
  const newId = Number(result.meta.last_row_id);
  await saveItems(env, newId, itemsRaw);
  const row = await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(newId).first();
  return json({ product: productDto(row, await getItems(env, newId)) }, 201);
}
__name(saveProduct, "saveProduct");
async function deleteProduct(env, id) {
  const row = await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(id).first();
  if (!row) return json({ error: "Produto n\xE3o encontrado." }, 404);
  const orderStats = await env.DB.prepare(`SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN payment_status IN ('approved','authorized','refunded','charged_back') THEN 1 ELSE 0 END) AS protected_count
    FROM orders WHERE product_id=?`).bind(id).first();
  const protectedCount = Number(orderStats?.protected_count || 0);
  const totalOrders = Number(orderStats?.total || 0);
  if (protectedCount > 0) {
    await env.DB.batch([
      env.DB.prepare("UPDATE products SET status='deleted', updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(id),
      env.DB.prepare("UPDATE landing_pages SET status='disabled', updated_at=CURRENT_TIMESTAMP WHERE product_id=?").bind(id),
      env.DB.prepare("DELETE FROM checkout_sessions WHERE product_id=?").bind(id)
    ]);
    return json({ ok: true, archived: true, protectedOrders: protectedCount, removedOrders: 0 });
  }
  const landing = await getLandingByProductId(env, id);
  const assetKeys = /* @__PURE__ */ new Set();
  if (row.cover_key) assetKeys.add(row.cover_key);
  if (row.download_key) assetKeys.add(row.download_key);
  for (const key of collectLandingKeys(landing)) assetKeys.add(key);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM checkout_sessions WHERE product_id=?").bind(id),
    env.DB.prepare("DELETE FROM landing_pages WHERE product_id=?").bind(id),
    env.DB.prepare("DELETE FROM product_items WHERE product_id=?").bind(id),
    env.DB.prepare("DELETE FROM orders WHERE product_id=?").bind(id),
    env.DB.prepare("DELETE FROM products WHERE id=?").bind(id)
  ]);
  for (const key of assetKeys) await env.PRODUCT_FILES.delete(key).catch(() => {
  });
  return json({ ok: true, removedOrders: totalOrders });
}
__name(deleteProduct, "deleteProduct");
async function getLandingByProductId(env, productId) {
  return env.DB.prepare("SELECT * FROM landing_pages WHERE product_id=?").bind(productId).first();
}
__name(getLandingByProductId, "getLandingByProductId");
async function getLandingBySlug(env, slug) {
  const product = await getProductBySlug(env, slug);
  if (!product) return { product: null, landing: null };
  const landing = await getLandingByProductId(env, product.id);
  return { product, landing };
}
__name(getLandingBySlug, "getLandingBySlug");
function landingPublicDto(row, product, items = []) {
  const productData = productDto(product, items);
  const gallery = parseJsonObjects(row.gallery_json).map((item, index) => ({
    name: String(item?.name || `Imagem ${index + 1}`),
    caption: String(item?.caption || ""),
    url: `/api/ofertas/${encodeURIComponent(product.slug)}/galeria/${index}?v=${encodeURIComponent(row.updated_at || String(row.id))}`
  }));
  return {
    id: String(row.id),
    productId: String(row.product_id),
    status: row.status,
    heroBadge: row.hero_badge || "BIBLIOTECA DE PROJETOS",
    heroTitle: row.hero_title || product.title,
    heroHighlight: row.hero_highlight || "",
    heroSubtitle: row.hero_subtitle || product.short_description || product.description || "",
    ctaText: row.cta_text || "QUERO ACESSAR OS PROJETOS",
    heroImage: row.hero_image_key ? `/api/ofertas/${encodeURIComponent(product.slug)}/hero?v=${encodeURIComponent(row.updated_at || String(row.id))}` : productData.cover,
    video: row.video_key ? `/api/ofertas/${encodeURIComponent(product.slug)}/video?v=${encodeURIComponent(row.updated_at || String(row.id))}` : null,
    videoName: row.video_name,
    videoSize: row.video_size,
    benefits: parseJsonObjects(row.benefits_json),
    gallery,
    salesTitle: row.sales_title || "Mais produtividade para o seu dia a dia",
    salesText: row.sales_text || "",
    offerLabel: row.offer_label || "OFERTA ESPECIAL",
    offerBullets: parseJsonArray(row.offer_bullets_json),
    faq: parseJsonObjects(row.faq_json),
    technicalNotice: row.technical_notice || "",
    timerEnabled: Boolean(row.timer_enabled),
    timerMinutes: Math.max(1, Number(row.timer_minutes || 10)),
    timerText: row.timer_text || "Sua condi\xE7\xE3o est\xE1 reservada por",
    seoTitle: row.seo_title || product.title,
    seoDescription: row.seo_description || product.short_description || product.description || "",
    updatedAt: row.updated_at,
    product: productData
  };
}
__name(landingPublicDto, "landingPublicDto");
function landingAdminDto(row, product, items = []) {
  if (!row) return { product: productDto(product, items), landing: null };
  const publicData = landingPublicDto(row, product, items);
  const galleryRaw = parseJsonObjects(row.gallery_json).map((item, index) => ({
    key: String(item?.key || ""),
    name: String(item?.name || `Imagem ${index + 1}`),
    caption: String(item?.caption || ""),
    url: `/admin/landing-pages/api/ofertas/${encodeURIComponent(product.slug)}/galeria/${index}?v=${encodeURIComponent(row.updated_at || String(row.id))}`
  }));
  return {
    product: publicData.product,
    landing: {
      ...publicData,
      heroImageKey: row.hero_image_key || "",
      heroImageName: row.hero_image_name || "",
      heroImage: row.hero_image_key ? `/admin/landing-pages/api/ofertas/${encodeURIComponent(product.slug)}/hero?v=${encodeURIComponent(row.updated_at || String(row.id))}` : publicData.product.cover,
      videoKey: row.video_key || "",
      video: row.video_key ? `/admin/landing-pages/api/ofertas/${encodeURIComponent(product.slug)}/video?v=${encodeURIComponent(row.updated_at || String(row.id))}` : null,
      gallery: galleryRaw
    }
  };
}
__name(landingAdminDto, "landingAdminDto");
async function publicLanding(env, slug) {
  const { product, landing } = await getLandingBySlug(env, slug);
  if (!product || product.status !== "active" || !landing || landing.status !== "published") {
    return json({ error: "P\xE1gina de venda n\xE3o encontrada." }, 404);
  }
  const items = await getItems(env, product.id);
  return json({ landing: landingPublicDto(landing, product, items) });
}
__name(publicLanding, "publicLanding");
async function adminLandingList(env) {
  const { results } = await env.DB.prepare("SELECT * FROM products WHERE status <> 'deleted' ORDER BY display_order DESC, id DESC").all();
  const rows = [];
  for (const product of results || []) {
    const landing = await getLandingByProductId(env, product.id);
    rows.push(landingAdminDto(landing, product, await getItems(env, product.id)));
  }
  return json({ items: rows });
}
__name(adminLandingList, "adminLandingList");
async function adminLandingBySlug(env, slug) {
  const { product, landing } = await getLandingBySlug(env, slug);
  if (!product) return json({ error: "Produto n\xE3o encontrado." }, 404);
  return json(landingAdminDto(landing, product, await getItems(env, product.id)));
}
__name(adminLandingBySlug, "adminLandingBySlug");
function collectLandingKeys(row) {
  const keys = /* @__PURE__ */ new Set();
  if (!row) return keys;
  if (row.hero_image_key) keys.add(row.hero_image_key);
  if (row.video_key) keys.add(row.video_key);
  for (const item of parseJsonObjects(row.gallery_json)) if (item?.key) keys.add(String(item.key));
  return keys;
}
__name(collectLandingKeys, "collectLandingKeys");
async function saveLanding(request, env, productId) {
  const product = await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(productId).first();
  if (!product) return json({ error: "Produto n\xE3o encontrado." }, 404);
  const body = await request.json().catch(() => ({}));
  const current = await getLandingByProductId(env, productId);
  const requestedStatus = String(body?.status || "draft");
  const status = ["draft", "published", "disabled"].includes(requestedStatus) ? requestedStatus : "draft";
  const benefits = Array.isArray(body?.benefits) ? body.benefits : [];
  const gallery = Array.isArray(body?.gallery) ? body.gallery.filter((x) => x?.key) : [];
  const offerBullets = Array.isArray(body?.offerBullets) ? body.offerBullets.filter(Boolean) : [];
  const faq = Array.isArray(body?.faq) ? body.faq : [];
  const heroImageKey = String(body?.heroImageKey || "");
  const heroImageName = String(body?.heroImageName || "");
  const videoKey = String(body?.videoKey || "");
  const videoName = String(body?.videoName || "");
  const videoSize = Math.max(0, Number(body?.videoSize || 0) || 0);
  const values = [
    productId,
    status,
    String(body?.heroBadge || "").trim() || null,
    String(body?.heroTitle || "").trim() || null,
    String(body?.heroHighlight || "").trim() || null,
    String(body?.heroSubtitle || "").trim() || null,
    String(body?.ctaText || "").trim() || null,
    heroImageKey || null,
    heroImageName || null,
    videoKey || null,
    videoName || null,
    videoSize || null,
    JSON.stringify(benefits),
    JSON.stringify(gallery),
    String(body?.salesTitle || "").trim() || null,
    String(body?.salesText || "").trim() || null,
    String(body?.offerLabel || "").trim() || null,
    JSON.stringify(offerBullets),
    JSON.stringify(faq),
    String(body?.technicalNotice || "").trim() || null,
    body?.timerEnabled === false ? 0 : 1,
    Math.min(120, Math.max(1, Number(body?.timerMinutes || 10) || 10)),
    String(body?.timerText || "").trim() || null,
    String(body?.seoTitle || "").trim() || null,
    String(body?.seoDescription || "").trim() || null
  ];
  await env.DB.prepare(`INSERT INTO landing_pages (
    product_id,status,hero_badge,hero_title,hero_highlight,hero_subtitle,cta_text,
    hero_image_key,hero_image_name,video_key,video_name,video_size,benefits_json,gallery_json,
    sales_title,sales_text,offer_label,offer_bullets_json,faq_json,technical_notice,
    timer_enabled,timer_minutes,timer_text,seo_title,seo_description
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  ON CONFLICT(product_id) DO UPDATE SET
    status=excluded.status,hero_badge=excluded.hero_badge,hero_title=excluded.hero_title,
    hero_highlight=excluded.hero_highlight,hero_subtitle=excluded.hero_subtitle,cta_text=excluded.cta_text,
    hero_image_key=excluded.hero_image_key,hero_image_name=excluded.hero_image_name,
    video_key=excluded.video_key,video_name=excluded.video_name,video_size=excluded.video_size,
    benefits_json=excluded.benefits_json,gallery_json=excluded.gallery_json,
    sales_title=excluded.sales_title,sales_text=excluded.sales_text,offer_label=excluded.offer_label,
    offer_bullets_json=excluded.offer_bullets_json,faq_json=excluded.faq_json,
    technical_notice=excluded.technical_notice,timer_enabled=excluded.timer_enabled,
    timer_minutes=excluded.timer_minutes,timer_text=excluded.timer_text,
    seo_title=excluded.seo_title,seo_description=excluded.seo_description,updated_at=CURRENT_TIMESTAMP`).bind(...values).run();
  const saved = await getLandingByProductId(env, productId);
  const oldKeys = collectLandingKeys(current);
  const newKeys = collectLandingKeys(saved);
  for (const key of oldKeys) if (!newKeys.has(key)) await env.PRODUCT_FILES.delete(key).catch(() => {
  });
  return json(landingAdminDto(saved, product, await getItems(env, productId)));
}
__name(saveLanding, "saveLanding");
async function deleteLanding(env, productId) {
  const current = await getLandingByProductId(env, productId);
  if (!current) return json({ ok: true });
  const keys = collectLandingKeys(current);
  await env.DB.prepare("DELETE FROM landing_pages WHERE product_id=?").bind(productId).run();
  for (const key of keys) await env.PRODUCT_FILES.delete(key).catch(() => {
  });
  return json({ ok: true });
}
__name(deleteLanding, "deleteLanding");
async function landingAsset(request, env, slug, kind, index = 0, admin = false) {
  const { product, landing } = await getLandingBySlug(env, slug);
  if (!product || !landing) return new Response("Not found", { status: 404 });
  if (!admin && (product.status !== "active" || landing.status !== "published")) return new Response("Not found", { status: 404 });
  let key = "";
  if (kind === "hero") key = landing.hero_image_key || "";
  if (kind === "video") key = landing.video_key || "";
  if (kind === "gallery") key = String(parseJsonObjects(landing.gallery_json)[index]?.key || "");
  if (!key) return new Response("Not found", { status: 404 });
  if (kind === "video") {
    const rangeHeader = request.headers.get("range") || "";
    const head = await env.PRODUCT_FILES.head(key);
    if (!head) return new Response("Not found", { status: 404 });
    const total = head.size;
    const match = rangeHeader.match(/^bytes=(\d+)-(\d*)$/);
    if (match) {
      const start = Math.min(total - 1, Math.max(0, Number(match[1])));
      const requestedEnd = match[2] ? Number(match[2]) : Math.min(total - 1, start + 4 * 1024 * 1024 - 1);
      const end = Math.min(total - 1, Math.max(start, requestedEnd));
      const obj2 = await env.PRODUCT_FILES.get(key, { range: { offset: start, length: end - start + 1 } });
      if (!obj2) return new Response("Not found", { status: 404 });
      const headers2 = new Headers();
      obj2.writeHttpMetadata(headers2);
      headers2.set("etag", obj2.httpEtag);
      headers2.set("accept-ranges", "bytes");
      headers2.set("content-range", `bytes ${start}-${end}/${total}`);      headers2.set("content-length", String(end - start + 1));
      headers2.set("cache-control", admin ? "private, no-store" : "public, max-age=3600");
      return new Response(obj2.body, { status: 206, headers: headers2 });
    }
  }
  const obj = await env.PRODUCT_FILES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", admin ? "private, no-store" : "public, max-age=3600");
  if (kind === "video") headers.set("accept-ranges", "bytes");
  return new Response(obj.body, { headers });
}
__name(landingAsset, "landingAsset");
function baseUrl(request, env) {
  return (env.SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
}
__name(baseUrl, "baseUrl");
function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
__name(randomToken, "randomToken");
async function getSiteSetting(env, key) {
  const row = await env.DB.prepare("SELECT value FROM site_settings WHERE key=?").bind(key).first();
  return row?.value ? String(row.value) : "";
}
__name(getSiteSetting, "getSiteSetting");
async function adminCheckoutSettings(env) {
  const publicKey = await getSiteSetting(env, "mercado_pago_public_key");
  return json({ mercadoPagoPublicKey: publicKey, configured: Boolean(publicKey) });
}
__name(adminCheckoutSettings, "adminCheckoutSettings");
async function saveAdminCheckoutSettings(request, env) {
  const body = await request.json().catch(() => ({}));
  const publicKey = String(body?.mercadoPagoPublicKey || "").trim();
  if (publicKey && !publicKey.startsWith("APP_USR-") && !publicKey.startsWith("TEST-")) {
    return json({ error: "A Public Key informada n\xE3o parece v\xE1lida." }, 400);
  }
  if (publicKey) {
    await env.DB.prepare(`INSERT INTO site_settings (key,value,updated_at) VALUES ('mercado_pago_public_key',?,CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP`).bind(publicKey).run();
  } else {
    await env.DB.prepare("DELETE FROM site_settings WHERE key='mercado_pago_public_key'").run();
  }
  return adminCheckoutSettings(env);
}
__name(saveAdminCheckoutSettings, "saveAdminCheckoutSettings");
async function checkoutConfig(env, slug) {
  const product = await getProductBySlug(env, slug);
  if (!product || product.status !== "active") return json({ error: "Produto indispon\xEDvel para compra." }, 404);
  const landing = await getLandingByProductId(env, product.id);
  const publicKey = await getSiteSetting(env, "mercado_pago_public_key");
  return json({
    publicKey,
    publicKeyConfigured: Boolean(publicKey),
    product: productDto(product, await getItems(env, product.id)),
    checkout: {
      timerEnabled: landing ? Boolean(landing.timer_enabled) : true,
      timerMinutes: landing ? Math.max(1, Number(landing.timer_minutes || 10)) : 10,
      timerText: landing?.timer_text || "Sua condi\xE7\xE3o est\xE1 reservada por"
    }
  });
}
__name(checkoutConfig, "checkoutConfig");
async function createCheckoutSession(request, env) {
  const body = await request.json().catch(() => ({}));
  const slug = String(body?.slug || "").trim();
  const product = await getProductBySlug(env, slug);
  if (!product || product.status !== "active") return json({ error: "Produto indispon\xEDvel para compra." }, 404);
  if (product.delivery_mode === "free_external") return json({ error: "Este produto \xE9 gratuito e deve ser baixado diretamente pela p\xE1gina do produto." }, 409);
  if (!product.download_key) return json({ error: "Este produto ainda n\xE3o possui arquivo de entrega configurado." }, 409);
  if (!product.price || product.price <= 0) return json({ error: "Pre\xE7o do produto inv\xE1lido." }, 409);
  const landing = await getLandingByProductId(env, product.id);
  const timerMinutes = landing?.timer_enabled === 0 ? 120 : Math.min(120, Math.max(1, Number(landing?.timer_minutes || 10)));
  const token = randomToken();
  const startsAt = (/* @__PURE__ */ new Date()).toISOString();
  const expiresAt = new Date(Date.now() + timerMinutes * 60 * 1e3).toISOString();
  const utm = body?.utm || {};
  await env.DB.prepare(`INSERT INTO checkout_sessions (
    token,product_id,starts_at,expires_at,status,utm_source,utm_medium,utm_campaign,utm_content,utm_term
  ) VALUES (?,?,?,?,?,?,?,?,?,?)`).bind(
    token,
    product.id,
    startsAt,
    expiresAt,
    "active",
    String(utm?.source || "").slice(0, 200) || null,
    String(utm?.medium || "").slice(0, 200) || null,
    String(utm?.campaign || "").slice(0, 300) || null,
    String(utm?.content || "").slice(0, 300) || null,
    String(utm?.term || "").slice(0, 300) || null
  ).run();
  return json({ token, startsAt, expiresAt, timerMinutes });
}
__name(createCheckoutSession, "createCheckoutSession");
async function getCheckoutSession(env, token) {
  const session = await env.DB.prepare(`SELECT s.*,p.slug,p.title,p.price,p.original_price,p.status AS product_status,p.cover_key,p.updated_at AS product_updated_at
    FROM checkout_sessions s JOIN products p ON p.id=s.product_id WHERE s.token=?`).bind(token).first();
  if (!session) return json({ error: "Sess\xE3o de checkout n\xE3o encontrada." }, 404);
  const expired = Date.parse(session.expires_at) < Date.now() && !session.order_id;
  if (expired && session.status === "active") {
    await env.DB.prepare("UPDATE checkout_sessions SET status='expired',updated_at=CURRENT_TIMESTAMP WHERE token=?").bind(token).run();
    session.status = "expired";
  }
  const product = await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(session.product_id).first();
  if (!product) return json({ error: "Produto n\xE3o encontrado." }, 404);
  return json({
    session: {
      token: session.token,
      status: session.status,
      startsAt: session.starts_at,
      expiresAt: session.expires_at,
      expired,
      orderId: session.order_id,
      product: productDto(product, await getItems(env, product.id))
    }
  });
}
__name(getCheckoutSession, "getCheckoutSession");
async function mpRequest(env, path, init = {}) {
  const accessToken = env.MERCADO_PAGO_ACCESS_TOKEN || env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Mercado Pago ainda n\xE3o foi conectado. Configure MERCADO_PAGO_ACCESS_TOKEN no Worker.");
  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${accessToken}`);
  headers.set("content-type", "application/json");
  headers.set("accept", "application/json");
  const response = await fetch(`https://api.mercadopago.com${path}`, { ...init, headers });
  const raw = await response.text();
  let data = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = { raw };
    }
  }
  if (!response.ok) {
    const details = [
      data?.message,
      data?.error,
      data?.cause ? JSON.stringify(data.cause) : null,
      data?.status ? `status=${data.status}` : null,
      data?.raw ? String(data.raw).slice(0, 500) : null,
      response.statusText || null
    ].filter(Boolean).join(" | ");
    console.error("Mercado Pago API error", { status: response.status, statusText: response.statusText, data, requestId: response.headers.get("x-request-id") });
    throw new Error(`Mercado Pago HTTP ${response.status}${details ? `: ${details}` : ""}`);
  }
  return data;
}
__name(mpRequest, "mpRequest");
async function resendRequest(env, payload, idempotencyKey) {
  if (!env.RESEND_API_KEY) throw new Error("Resend ainda n\xE3o foi conectado. Configure RESEND_API_KEY no Worker.");
  const headers = new Headers({
    "authorization": `Bearer ${env.RESEND_API_KEY}`,
    "content-type": "application/json"
  });
  if (idempotencyKey) headers.set("idempotency-key", idempotencyKey);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || data?.error || `Resend HTTP ${response.status}`);
  return data;
}
__name(resendRequest, "resendRequest");
async function sendDeliveryEmail(request, env, order, token, expiresAt) {
  const site = baseUrl(request, env);
  const downloadUrl = `${site}/api/download/${token}`;
  const expiresText = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo"
  }).format(new Date(expiresAt));
  const amountText = money(Number(order.amount)) || "";
  const customerName = String(order.customer_name || "").trim();
  const greeting = customerName ? `Ol\xE1, ${escapeHtml(customerName)}.` : "Ol\xE1.";
  const title = escapeHtml(order.product_title || "Material TFR Projetos");
  const html = `<!doctype html><html><body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#071333"><div style="max-width:640px;margin:0 auto;padding:32px 18px"><div style="background:#ffffff;border:1px solid #dce5f2;border-radius:14px;padding:32px"><div style="font-size:13px;font-weight:700;letter-spacing:.08em;color:#1769d2">TFR PROJETOS</div><h1 style="font-size:26px;line-height:1.2;margin:12px 0 18px">Seu material est\xE1 dispon\xEDvel</h1><p style="font-size:16px;line-height:1.6">${greeting}</p><p style="font-size:16px;line-height:1.6">Seu pagamento foi confirmado e o material abaixo j\xE1 pode ser baixado:</p><div style="background:#f7f9fc;border-radius:10px;padding:18px;margin:22px 0"><strong>${title}</strong><br><span style="color:#52627a">Pagamento aprovado${amountText ? ` \u2022 ${escapeHtml(amountText)}` : ""}</span></div><p style="text-align:center;margin:28px 0"><a href="${escapeHtml(downloadUrl)}" style="display:inline-block;background:#0b5ed7;color:#fff;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:8px">BAIXAR MEU MATERIAL</a></p><p style="font-size:14px;line-height:1.6;color:#52627a">O link \xE9 pessoal, permite at\xE9 3 downloads e fica dispon\xEDvel at\xE9 ${escapeHtml(expiresText)}.</p><p style="font-size:14px;line-height:1.6;color:#52627a">Em caso de d\xFAvida, responda a este e-mail.</p></div><p style="font-size:12px;color:#718096;text-align:center;margin-top:18px">TFR Projetos \u2022 Biblioteca Digital</p></div></body></html>`;
  const text = `${customerName ? `Ol\xE1, ${customerName}.` : "Ol\xE1."}

Seu pagamento foi confirmado.
Produto: ${order.product_title || "Material TFR Projetos"}${amountText ? `
Valor: ${amountText}` : ""}

Baixe seu material: ${downloadUrl}

O link permite at\xE9 3 downloads e fica dispon\xEDvel at\xE9 ${expiresText}.

TFR Projetos`;
  return resendRequest(env, {
    from: "TFR Projetos <contato@tfrprojetos.com.br>",
    to: [String(order.customer_email)],
    reply_to: "contato@tfrprojetos.com.br",
    subject: "Seu material da TFR Projetos est\xE1 dispon\xEDvel",
    html,
    text
  }, `tfr-order-${order.id}-delivery-v1`);
}
__name(sendDeliveryEmail, "sendDeliveryEmail");
async function applyPaymentToOrder(request, env, orderId, payment) {
  const order = await env.DB.prepare("SELECT * FROM orders WHERE id=?").bind(orderId).first();
  if (!order) throw new Error("Pedido n\xE3o encontrado para atualiza\xE7\xE3o do pagamento.");
  const amountCents = Math.round(Number(payment?.transaction_amount || 0) * 100);
  if (amountCents !== Number(order.amount)) throw new Error("Valor do pagamento n\xE3o confere com o pedido.");
  const status = String(payment?.status || "unknown");
  let token = order.download_token;
  let expires = order.download_expires_at;
  if (status === "approved" && !token) {
    token = randomToken();
    expires = new Date(Date.now() + 48 * 60 * 60 * 1e3).toISOString();
  }
  await env.DB.prepare("UPDATE orders SET payment_id=?,payment_status=?,download_token=?,download_expires_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(String(payment?.id || ""), status, token, expires, orderId).run();
  if (status === "approved" && token && expires) {
    const delivery = await env.DB.prepare(`SELECT o.id,o.customer_name,o.customer_email,o.amount,o.delivery_email_sent_at,p.title AS product_title
      FROM orders o JOIN products p ON p.id=o.product_id WHERE o.id=?`).bind(orderId).first();
    if (delivery && !delivery.delivery_email_sent_at) {
      try {
        const sent = await sendDeliveryEmail(request, env, delivery, token, expires);
        await env.DB.prepare("UPDATE orders SET delivery_email_sent_at=CURRENT_TIMESTAMP,delivery_email_id=?,delivery_email_last_error=NULL,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(String(sent?.id || ""), orderId).run();
      } catch (emailError) {
        const emailMessage = String(emailError?.message || "Falha ao enviar e-mail de entrega.").slice(0, 1e3);
        await env.DB.prepare("UPDATE orders SET delivery_email_last_error=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(emailMessage, orderId).run().catch(() => {
        });
        throw new Error(`Pagamento aprovado, mas o e-mail de entrega falhou: ${emailMessage}`);
      }
    }
  }
  return { status, token, expires };
}
__name(applyPaymentToOrder, "applyPaymentToOrder");
async function processBrickPayment(request, env) {
  const body = await request.json().catch(() => ({}));
  const sessionToken = String(body?.sessionToken || "").trim();
  const attemptId = String(body?.attemptId || "").trim();
  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const formData = body?.formData && typeof body.formData === "object" ? body.formData : null;
  if (!sessionToken || !email || !email.includes("@") || !formData) return json({ error: "Dados do pagamento incompletos." }, 400);
  const idempotencyKey = /^[0-9a-f-]{16,64}$/i.test(attemptId) ? attemptId : crypto.randomUUID();
  const session = await env.DB.prepare("SELECT * FROM checkout_sessions WHERE token=?").bind(sessionToken).first();
  if (!session) return json({ error: "Sess\xE3o de checkout n\xE3o encontrada." }, 404);
  const product = await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(session.product_id).first();
  if (!product || product.status !== "active") return json({ error: "Produto indispon\xEDvel." }, 404);
  if (!session.order_id && Date.parse(session.expires_at) < Date.now()) {
    await env.DB.prepare("UPDATE checkout_sessions SET status='expired',updated_at=CURRENT_TIMESTAMP WHERE token=?").bind(sessionToken).run();
    return json({ error: "Sua sess\xE3o de checkout expirou. Gere uma nova sess\xE3o para continuar." }, 410);
  }
  let orderId = Number(session.order_id || 0);
  if (!orderId) {
    const result = await env.DB.prepare(`INSERT INTO orders (product_id,customer_name,customer_email,amount,payment_provider,payment_id,payment_status,download_token,download_count,download_limit,download_expires_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(product.id, name || null, email, product.price, "mercadopago", `brick:${sessionToken.slice(0, 16)}`, "pending", null, 0, 3, null).run();
    orderId = Number(result.meta.last_row_id);
    await env.DB.prepare(`UPDATE checkout_sessions SET order_id=?,customer_name=?,customer_email=?,status='submitting',updated_at=CURRENT_TIMESTAMP WHERE token=?`).bind(orderId, name || null, email, sessionToken).run();
  }
  const externalReference = `tfr-order-${orderId}-brick-${sessionToken.slice(0, 12)}`;
  const payer = { ...formData.payer || {}, email };
  const paymentPayload = {
    ...formData,
    payer,
    transaction_amount: Number((Number(product.price) / 100).toFixed(2)),
    description: String(product.title).slice(0, 120),
    external_reference: externalReference,
    metadata: { ...formData.metadata || {}, tfr_order_id: orderId, checkout_session: sessionToken.slice(0, 16), product_slug: product.slug }
  };
  delete paymentPayload.amount;
  delete paymentPayload.order_id;
  delete paymentPayload.id;
  try {
    const payment = await mpRequest(env, "/v1/payments", {
      method: "POST",
      headers: { "x-idempotency-key": idempotencyKey },
      body: JSON.stringify(paymentPayload)
    });
    await env.DB.prepare(`UPDATE checkout_sessions SET status='payment_created',customer_name=?,customer_email=?,updated_at=CURRENT_TIMESTAMP WHERE token=?`).bind(name || null, email, sessionToken).run();
    const applied = await applyPaymentToOrder(request, env, orderId, payment);
    return json({ paymentId: String(payment.id), status: applied.status, orderId });
  } catch (error) {
    const message = String(error?.message || "Falha ao processar pagamento.");
    await env.DB.prepare(`UPDATE checkout_sessions SET status='payment_error',customer_name=?,customer_email=?,updated_at=CURRENT_TIMESTAMP WHERE token=?`).bind(name || null, email, sessionToken).run().catch(() => {
    });
    await env.DB.prepare("UPDATE orders SET payment_status='payment_error',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(orderId).run().catch(() => {
    });
    return json({ error: message, orderId }, 502);
  }
}
__name(processBrickPayment, "processBrickPayment");
async function createCheckout(request, env) {
  const body = await request.json().catch(() => ({}));
  const slug = String(body?.slug || "").trim();
  const email = String(body?.email || "").trim().toLowerCase();
  const name = String(body?.name || "").trim();
  if (!slug || !email || !email.includes("@")) return json({ error: "Informe nome/e-mail v\xE1lidos para continuar." }, 400);
  const product = await getProductBySlug(env, slug);
  if (!product || product.status !== "active") return json({ error: "Produto indispon\xEDvel para compra." }, 404);
  if (!product.download_key) return json({ error: "Este produto ainda n\xE3o possui arquivo de entrega configurado." }, 409);
  if (!product.price || product.price <= 0) return json({ error: "Pre\xE7o do produto inv\xE1lido." }, 409);
  const orderRef = crypto.randomUUID();
  const result = await env.DB.prepare(`INSERT INTO orders (product_id,customer_name,customer_email,amount,payment_provider,payment_id,payment_status,download_token,download_count,download_limit,download_expires_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`).bind(product.id, name || null, email, product.price, "mercadopago", `pref:${orderRef}`, "pending", null, 0, 3, null).run();
  const orderId = Number(result.meta.last_row_id);
  const externalReference = `tfr-order-${orderId}-${orderRef}`;
  const site = baseUrl(request, env);
  try {
    const preferencePayload = {
      items: [{
        title: String(product.title).slice(0, 120),
        quantity: 1,
        currency_id: "BRL",
        unit_price: Number((Number(product.price) / 100).toFixed(2))
      }],
      external_reference: externalReference
    };
    console.log("Creating Mercado Pago preference", {
      orderId,
      amount: preferencePayload.items[0].unit_price,
      externalReference
    });
    const preference = await mpRequest(env, "/checkout/preferences", {
      method: "POST",
      body: JSON.stringify(preferencePayload)
    });
    await env.DB.prepare("UPDATE orders SET payment_id=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(`preference:${preference.id}`, orderId).run();
    return json({ checkoutUrl: preference.init_point, sandboxCheckoutUrl: preference.sandbox_init_point, orderId });
  } catch (error) {
    await env.DB.prepare("UPDATE orders SET payment_status='checkout_error', updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(orderId).run();
    const message = error instanceof Error ? error.message : "Falha ao criar checkout no Mercado Pago.";
    console.error("Checkout creation failed", { orderId, message });
    return json({ error: message, orderId }, 502);
  }
}
__name(createCheckout, "createCheckout");
async function validateWebhookSignature(request, env, dataId) {
  const webhookSecret = env.MERCADO_PAGO_WEBHOOK_SECRET || env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!webhookSecret) return true;
  const signature = request.headers.get("x-signature") || "";
  const requestId = request.headers.get("x-request-id") || "";
  const parts = Object.fromEntries(signature.split(",").map((part) => part.trim().split("=")));
  const ts = parts.ts || "";
  const v1 = parts.v1 || "";
  if (!ts || !v1 || !requestId || !dataId) return false;
  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(webhookSecret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signed = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(manifest));
  const expected = Array.from(new Uint8Array(signed), (b) => b.toString(16).padStart(2, "0")).join("");
  if (expected.length !== v1.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ v1.charCodeAt(i);
  return diff === 0;
}
__name(validateWebhookSignature, "validateWebhookSignature");
function storeSlug(value) {
  return String(value || "produto").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "produto";
}
__name(storeSlug, "storeSlug");
function storeProductDto(row) {
  let keys = [];
  try {
    const parsed = JSON.parse(row.image_keys_json || "[]");
    if (Array.isArray(parsed)) keys = parsed.filter(Boolean);
  } catch {
  }
  return {
    id: row.id,
    externalId: row.external_id,
    sourceType: row.source_type,
    sourceId: row.source_id,
    slug: row.slug,
    name: row.name,
    description: row.description || "",
    category: row.category || "",
    priceCents: Number(row.price_cents || 0),
    compareAtPriceCents: row.compare_at_price_cents == null ? null : Number(row.compare_at_price_cents),
    featured: Boolean(row.featured),
    madeToOrder: Boolean(row.made_to_order),
    leadDays: Number(row.lead_days || 0),
    stockQty: Number(row.stock_qty || 0),
    weightGrams: Number(row.weight_grams || 0),
    lengthCm: Number(row.length_cm || 0),
    widthCm: Number(row.width_cm || 0),
    heightCm: Number(row.height_cm || 0),
    images: keys.map((_, i) => `/api/loja/produtos/${encodeURIComponent(row.slug)}/imagem/${i}`)
  };
}
__name(storeProductDto, "storeProductDto");
async function listStoreProducts(env) {
  const result = await env.DB.prepare(`SELECT * FROM store_products WHERE status='active' ORDER BY featured DESC, updated_at DESC, id DESC`).all();
  return json({ products: (result.results || []).map(storeProductDto) });
}
__name(listStoreProducts, "listStoreProducts");
async function getStoreProductBySlug(env, slug) {
  return env.DB.prepare(`SELECT * FROM store_products WHERE slug=? AND status='active'`).bind(slug).first();
}
__name(getStoreProductBySlug, "getStoreProductBySlug");
async function publicStoreProduct(env, slug) {
  const row = await getStoreProductBySlug(env, slug);
  if (!row) return json({ error: "Produto n\xE3o encontrado." }, 404);
  return json({ product: storeProductDto(row) });
}
__name(publicStoreProduct, "publicStoreProduct");
async function publicStoreImage(env, slug, index) {
  const row = await getStoreProductBySlug(env, slug);
  if (!row) return new Response("Not found", { status: 404 });
  let keys = [];
  try {
    const parsed = JSON.parse(row.image_keys_json || "[]");
    if (Array.isArray(parsed)) keys = parsed.filter(Boolean);
  } catch {
  }
  const key = keys[index];
  if (!key) return new Response("Not found", { status: 404 });
  const obj = await env.PRODUCT_FILES.get(key);
  if (!obj) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=3600");
  return new Response(obj.body, { headers });
}
__name(publicStoreImage, "publicStoreImage");
async function syncStoreProduct(request, env) {
  const configured = String(env.STORE_SYNC_SECRET || "").trim();
  const supplied = String(request.headers.get("x-tfr-store-key") || "").trim();
  if (!configured) return json({ error: "STORE_SYNC_SECRET n\xE3o configurado no site." }, 503);
  if (!supplied || supplied !== configured) return json({ error: "Sincroniza\xE7\xE3o n\xE3o autorizada." }, 401);
  const form = await request.formData();
  const raw = String(form.get("metadata") || "");
  let meta = {};
  try {
    meta = JSON.parse(raw);
  } catch {
    return json({ error: "Metadados inv\xE1lidos." }, 400);
  }
  const externalId = String(meta.externalId || "").trim();
  if (!externalId) return json({ error: "externalId ausente." }, 400);
  const existing = await env.DB.prepare("SELECT * FROM store_products WHERE external_id=?").bind(externalId).first();
  if (!meta.enabled) {
    if (existing) await env.DB.prepare("UPDATE store_products SET status='inactive',updated_at=CURRENT_TIMESTAMP WHERE external_id=?").bind(externalId).run();
    return json({ ok: true, status: "inactive" });
  }
  const name = String(meta.name || "").trim();
  if (!name) return json({ error: "Nome do produto ausente." }, 400);
  const priceCents = Math.max(0, Math.round(Number(meta.price || 0) * 100));
  if (!priceCents) return json({ error: "Informe um pre\xE7o maior que zero antes de publicar." }, 400);
  const sourceType = String(meta.sourceType || "product").trim();
  const sourceId = String(meta.sourceId || "").trim();
  let slug = existing?.slug || `${storeSlug(name)}-${storeSlug(sourceType)}-${storeSlug(sourceId || externalId).slice(-16)}`.slice(0, 96);
  let oldKeys = [];
  try {
    const parsed = JSON.parse(existing?.image_keys_json || "[]");
    if (Array.isArray(parsed)) oldKeys = parsed.filter(Boolean);
  } catch {
  }
  const files = form.getAll("images").filter((x) => typeof x !== "string" && Number(x.size || 0) > 0);
  let imageKeys = oldKeys;
  if (files.length) {
    const newKeys = [];
    for (const file of files.slice(0, 8)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) continue;
      const ext = (file.name.split(".").pop() || "img").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "img";
      const key = `store/${slug}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      await env.PRODUCT_FILES.put(key, file.stream(), { httpMetadata: { contentType: file.type || "application/octet-stream" }, customMetadata: { originalName: file.name, storeExternalId: externalId } });
      newKeys.push(key);
    }
    if (newKeys.length) {
      imageKeys = newKeys;
      for (const key of oldKeys) await env.PRODUCT_FILES.delete(key).catch(() => {
      });
    }
  }
  await env.DB.prepare(`INSERT INTO store_products (
    external_id,source_type,source_id,slug,name,description,category,price_cents,compare_at_price_cents,featured,made_to_order,lead_days,stock_qty,weight_grams,length_cm,width_cm,height_cm,image_keys_json,status,created_at,updated_at
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, 'active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)
  ON CONFLICT(external_id) DO UPDATE SET
    source_type=excluded.source_type,source_id=excluded.source_id,name=excluded.name,description=excluded.description,category=excluded.category,price_cents=excluded.price_cents,compare_at_price_cents=excluded.compare_at_price_cents,featured=excluded.featured,made_to_order=excluded.made_to_order,lead_days=excluded.lead_days,stock_qty=excluded.stock_qty,weight_grams=excluded.weight_grams,length_cm=excluded.length_cm,width_cm=excluded.width_cm,height_cm=excluded.height_cm,image_keys_json=excluded.image_keys_json,status='active',updated_at=CURRENT_TIMESTAMP`).bind(
    externalId,
    sourceType,
    sourceId,
    slug,
    name,
    String(meta.description || ""),
    String(meta.category || ""),
    priceCents,
    Number(meta.compareAtPrice || 0) > 0 ? Math.round(Number(meta.compareAtPrice) * 100) : null,
    meta.featured ? 1 : 0,
    meta.madeToOrder ? 1 : 0,
    Math.max(0, Math.floor(Number(meta.leadDays || 0))),
    Math.max(0, Number(meta.stockQty || 0)),
    Math.max(0, Math.round(Number(meta.weightGrams || 0))),
    Math.max(0, Number(meta.lengthCm || 0)),
    Math.max(0, Number(meta.widthCm || 0)),
    Math.max(0, Number(meta.heightCm || 0)),
    JSON.stringify(imageKeys)
  ).run();
  const originCep = String(meta.originCep || "").replace(/\D/g, "").slice(0, 8);
  if (originCep.length === 8) {
    await env.DB.prepare(`INSERT INTO site_settings (key,value,updated_at) VALUES ('store_origin_cep',?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP`).bind(originCep).run();
  }
  const row = await env.DB.prepare("SELECT * FROM store_products WHERE external_id=?").bind(externalId).first();
  return json({ ok: true, product: row ? storeProductDto(row) : null });
}
__name(syncStoreProduct, "syncStoreProduct");
async function storeOriginCep(env) {
  const fromDb = await getSiteSetting(env, "store_origin_cep").catch(() => "");
  return String(fromDb || env.STORE_ORIGIN_CEP || "").replace(/\D/g, "").slice(0, 8);
}
__name(storeOriginCep, "storeOriginCep");
async function setSiteSetting(env, key, value) {
  const clean = String(value ?? "");
  await env.DB.prepare(`INSERT INTO site_settings (key,value,updated_at) VALUES (?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP`).bind(key, clean).run();
}
__name(setSiteSetting, "setSiteSetting");
async function storePublicConfig(env) {
  const [heroTitle, heroSubtitle, heroVideoUrl, announcement, supportWhatsapp, originCep, localEnabled, localPrice, localPrefixes] = await Promise.all([
    getSiteSetting(env, "store_hero_title").catch(() => ""),
    getSiteSetting(env, "store_hero_subtitle").catch(() => ""),
    getSiteSetting(env, "store_hero_video_url").catch(() => ""),
    getSiteSetting(env, "store_announcement").catch(() => ""),
    getSiteSetting(env, "store_support_whatsapp").catch(() => ""),
    storeOriginCep(env),
    getSiteSetting(env, "store_local_delivery_enabled").catch(() => ""),
    getSiteSetting(env, "store_local_delivery_price").catch(() => ""),
    getSiteSetting(env, "store_local_delivery_cep_prefixes").catch(() => "")
  ]);
  const tokenRow = await melhorEnvioTokenRow(env).catch(() => null);
  return {
    heroTitle: heroTitle || "Engenharia que voc\xEA pode comprar pronta.",
    heroSubtitle: heroSubtitle || "Pain\xE9is, quadros, montagens e produtos selecionados pela TFR Projetos, com pagamento seguro e entrega calculada para o seu CEP.",
    heroVideoUrl: heroVideoUrl || "",
    announcement: announcement || "Loja oficial TFR Projetos \u2022 compra segura \u2022 suporte t\xE9cnico especializado",
    supportWhatsapp: String(supportWhatsapp || "551431200349").replace(/\D/g, ""),
    shippingReady: originCep.length === 8 && Boolean(tokenRow?.access_token || String(env.MELHOR_ENVIO_TOKEN || "").trim()),
    localDeliveryEnabled: ["1", "true", "yes", "sim"].includes(String(localEnabled).toLowerCase()),
    localDeliveryPriceCents: Math.max(0, Math.round(Number(localPrice || 0) * 100)),
    localDeliveryCepPrefixes: String(localPrefixes || "")
  };
}
__name(storePublicConfig, "storePublicConfig");
async function publicStoreConfig(env) {
  return json(await storePublicConfig(env));
}
__name(publicStoreConfig, "publicStoreConfig");
async function syncStoreConfig(request, env) {
  const configured = String(env.STORE_SYNC_SECRET || "").trim();
  const supplied = String(request.headers.get("x-tfr-store-key") || "").trim();
  if (!configured) return json({ error: "STORE_SYNC_SECRET n\xE3o configurado no site." }, 503);
  if (!supplied || supplied !== configured) return json({ error: "Sincroniza\xE7\xE3o n\xE3o autorizada." }, 401);
  const body = await request.json().catch(() => ({}));
  const originCep = String(body.originCep || "").replace(/\D/g, "").slice(0, 8);
  if (String(body.originCep || "").trim() && originCep.length !== 8) return json({ error: "CEP de origem inv\xE1lido." }, 400);
  const pairs = [
    ["store_hero_title", String(body.heroTitle || "").trim()],
    ["store_hero_subtitle", String(body.heroSubtitle || "").trim()],
    ["store_hero_video_url", String(body.heroVideoUrl || "").trim()],
    ["store_announcement", String(body.announcement || "").trim()],
    ["store_support_whatsapp", String(body.supportWhatsapp || "").replace(/\D/g, "")],
    ["store_origin_cep", originCep],
    ["store_local_delivery_enabled", body.localDeliveryEnabled ? "true" : "false"],
    ["store_local_delivery_price", String(Math.max(0, Number(body.localDeliveryPrice || 0)))],
    ["store_local_delivery_cep_prefixes", String(body.localDeliveryCepPrefixes || "").trim()]
  ];
  for (const [key, value] of pairs) await setSiteSetting(env, key, value);
  return json({ ok: true, config: await storePublicConfig(env) });
}
__name(syncStoreConfig, "syncStoreConfig");
function localDeliveryMatches(prefixes, cep) {
  const list = String(prefixes || "").split(/[;,\s]+/).map((x) => x.replace(/\D/g, "")).filter((x) => x.length >= 3 && x.length <= 8);
  return list.some((prefix) => cep.startsWith(prefix));
}
__name(localDeliveryMatches, "localDeliveryMatches");
function melhorEnvioSandbox(env) {
  return String(env.MELHOR_ENVIO_SANDBOX || "").toLowerCase() === "true" || String(env.MELHOR_ENVIO_SANDBOX || "") === "1";
}
__name(melhorEnvioSandbox, "melhorEnvioSandbox");
function melhorEnvioBaseUrl(env) {
  return melhorEnvioSandbox(env) ? "https://sandbox.melhorenvio.com.br" : "https://melhorenvio.com.br";
}
__name(melhorEnvioBaseUrl, "melhorEnvioBaseUrl");
function melhorEnvioRedirectUri(env) {
  return String(env.MELHOR_ENVIO_REDIRECT_URI || "https://tfrprojetos.com.br/api/melhor-envio/callback").trim();
}
__name(melhorEnvioRedirectUri, "melhorEnvioRedirectUri");
async function melhorEnvioTokenRow(env) {
  return env.DB.prepare(`SELECT provider,access_token,refresh_token,token_type,scope,expires_at,refresh_expires_at,updated_at FROM oauth_tokens WHERE provider='melhor_envio'`).first();
}
__name(melhorEnvioTokenRow, "melhorEnvioTokenRow");
async function saveMelhorEnvioToken(env, data) {
  const now = Date.now();
  const expiresIn = Math.max(60, Number(data?.expires_in || 2592e3));
  const accessToken = String(data?.access_token || "").trim();
  const refreshToken = String(data?.refresh_token || "").trim();
  if (!accessToken) throw new Error("O Melhor Envio n\xE3o retornou access_token.");
  const expiresAt = now + expiresIn * 1e3;
  const refreshExpiresAt = refreshToken ? now + 45 * 24 * 60 * 60 * 1e3 : null;
  await env.DB.prepare(`INSERT INTO oauth_tokens (provider,access_token,refresh_token,token_type,scope,expires_at,refresh_expires_at,updated_at)
    VALUES ('melhor_envio',?,?,?,?,?,?,CURRENT_TIMESTAMP)
    ON CONFLICT(provider) DO UPDATE SET access_token=excluded.access_token,refresh_token=excluded.refresh_token,token_type=excluded.token_type,scope=excluded.scope,expires_at=excluded.expires_at,refresh_expires_at=excluded.refresh_expires_at,updated_at=CURRENT_TIMESTAMP`).bind(accessToken, refreshToken || null, String(data?.token_type || "Bearer"), String(data?.scope || ""), expiresAt, refreshExpiresAt).run();
  return accessToken;
}
__name(saveMelhorEnvioToken, "saveMelhorEnvioToken");
async function requestMelhorEnvioToken(env, payload) {
  const clientId = String(env.MELHOR_ENVIO_CLIENT_ID || "").trim();
  const clientSecret = String(env.MELHOR_ENVIO_CLIENT_SECRET || "").trim();
  if (!clientId || !clientSecret) throw new Error("Configure MELHOR_ENVIO_CLIENT_ID e MELHOR_ENVIO_CLIENT_SECRET no Worker do site.");
  const response = await fetch(`${melhorEnvioBaseUrl(env)}/oauth/token`, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "user-agent": "TFR Projetos Loja (tfr.projetos.eletricos@gmail.com)"
    },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, ...payload })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || data?.error_description || data?.error || `Melhor Envio OAuth HTTP ${response.status}`);
  return saveMelhorEnvioToken(env, data);
}
__name(requestMelhorEnvioToken, "requestMelhorEnvioToken");
async function refreshMelhorEnvioToken(env) {
  const row = await melhorEnvioTokenRow(env);
  const refreshToken = String(row?.refresh_token || "").trim();
  if (!refreshToken) throw new Error("A integra\xE7\xE3o com o Melhor Envio precisa ser autorizada novamente.");
  return requestMelhorEnvioToken(env, { grant_type: "refresh_token", refresh_token: refreshToken });
}
__name(refreshMelhorEnvioToken, "refreshMelhorEnvioToken");
async function melhorEnvioAccessToken(env) {
  const row = await melhorEnvioTokenRow(env).catch(() => null);
  const now = Date.now();
  if (row?.access_token && Number(row.expires_at || 0) > now + 5 * 60 * 1e3) return row.access_token;
  if (row?.refresh_token) {
    try {
      return await refreshMelhorEnvioToken(env);
    } catch (error) {
      console.warn("Falha ao renovar token Melhor Envio", error);
    }
  }
  const legacy = String(env.MELHOR_ENVIO_TOKEN || "").trim();
  if (legacy) return legacy;
  throw new Error("Melhor Envio ainda n\xE3o foi conectado. Autorize a integra\xE7\xE3o no painel administrativo.");
}
__name(melhorEnvioAccessToken, "melhorEnvioAccessToken");
async function melhorEnvioConnect(request, env) {
  const clientId = String(env.MELHOR_ENVIO_CLIENT_ID || "").trim();
  const clientSecret = String(env.MELHOR_ENVIO_CLIENT_SECRET || "").trim();
  if (!clientId || !clientSecret) return json({ error: "Configure MELHOR_ENVIO_CLIENT_ID e MELHOR_ENVIO_CLIENT_SECRET antes de conectar." }, 503);
  const state = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
  const expiresAt = Date.now() + 15 * 60 * 1e3;
  await env.DB.prepare(`DELETE FROM oauth_states WHERE expires_at <= ?`).bind(Date.now()).run();
  await env.DB.prepare(`INSERT INTO oauth_states (state,provider,expires_at,created_at) VALUES (?,'melhor_envio',?,CURRENT_TIMESTAMP)`).bind(state, expiresAt).run();
  const authorize = new URL(`${melhorEnvioBaseUrl(env)}/oauth/authorize`);
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", melhorEnvioRedirectUri(env));
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("scope", "shipping-calculate");
  return Response.redirect(authorize.toString(), 302);
}
__name(melhorEnvioConnect, "melhorEnvioConnect");
async function melhorEnvioCallback(request, env) {
  const url = new URL(request.url);
  const code = String(url.searchParams.get("code") || "").trim();
  const state = String(url.searchParams.get("state") || "").trim();
  const oauthError = String(url.searchParams.get("error") || "").trim();
  if (oauthError) return new Response(`Autoriza\xE7\xE3o do Melhor Envio n\xE3o conclu\xEDda: ${oauthError}`, { status: 400 });
  if (!code || !state) return new Response("Callback inv\xE1lido: code/state ausente.", { status: 400 });
  const saved = await env.DB.prepare(`SELECT state FROM oauth_states WHERE state=? AND provider='melhor_envio' AND expires_at>?`).bind(state, Date.now()).first();
  if (!saved) return new Response("Autoriza\xE7\xE3o expirada ou state inv\xE1lido. Inicie a conex\xE3o novamente.", { status: 400 });
  await env.DB.prepare(`DELETE FROM oauth_states WHERE state=?`).bind(state).run();
  await requestMelhorEnvioToken(env, { grant_type: "authorization_code", redirect_uri: melhorEnvioRedirectUri(env), code });
  const body = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Melhor Envio conectado</title><style>body{font-family:Arial,sans-serif;background:#050A30;color:white;display:grid;place-items:center;min-height:100vh;margin:0}.card{max-width:560px;padding:36px;border-radius:18px;background:#0d1747;box-shadow:0 18px 50px #0005}.ok{font-size:48px}a{color:#7db3ff}</style></head><body><main class="card"><div class="ok">\u2713</div><h1>Melhor Envio conectado</h1><p>A Loja TFR j\xE1 pode calcular fretes usando a conta autorizada. O token ser\xE1 renovado automaticamente enquanto o refresh token permanecer v\xE1lido.</p><p><a href="/loja">Abrir Loja TFR</a></p></main></body></html>`;
  return new Response(body, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
__name(melhorEnvioCallback, "melhorEnvioCallback");
async function melhorEnvioStatus(env) {
  const row = await melhorEnvioTokenRow(env).catch(() => null);
  return json({ connected: Boolean(row?.access_token), expiresAt: row?.expires_at || null, updatedAt: row?.updated_at || null, sandbox: melhorEnvioSandbox(env) });
}
__name(melhorEnvioStatus, "melhorEnvioStatus");
async function calculateShippingFor(env, product, destinationCep, quantity) {
  let token = await melhorEnvioAccessToken(env);
  const origin = await storeOriginCep(env);
  if (origin.length !== 8) throw new Error("CEP de origem da TFR ainda n\xE3o foi configurado para a loja.");
  const dest = destinationCep.replace(/\D/g, "").slice(0, 8);
  if (dest.length !== 8) throw new Error("Informe um CEP v\xE1lido.");
  if (!product.weight_grams || !product.width_cm || !product.height_cm || !product.length_cm) throw new Error("Este produto ainda n\xE3o possui peso e dimens\xF5es suficientes para calcular o frete.");
  const weightKg = Number(Math.max(0.01, Number(product.weight_grams || 0) / 1e3).toFixed(3));
  const width = Math.max(1, Math.ceil(Number(product.width_cm || 0)));
  const height = Math.max(1, Math.ceil(Number(product.height_cm || 0)));
  const length = Math.max(1, Math.ceil(Number(product.length_cm || 0)));
  const qty = Math.max(1, Math.min(100, Math.floor(Number(quantity || 1))));
  const endpoint = `${melhorEnvioBaseUrl(env)}/api/v2/me/shipment/calculate`;
  const body = {
    from: { postal_code: origin },
    to: { postal_code: dest },
    products: [{
      // Evita caracteres de identificação interna (ex.: "recipe:123") no id enviado ao provedor.
      id: `tfr-${product.id}`,
      width,
      height,
      length,
      weight: weightKg,
      insurance_value: Number((Number(product.price_cents || 0) / 100).toFixed(2)),
      quantity: qty
    }],
    options: { receipt: false, own_hand: false, collect: false }
  };
  const doRequest = /* @__PURE__ */ __name((bearer) => fetch(endpoint, { method: "POST", headers: { "authorization": `Bearer ${bearer}`, "accept": "application/json", "content-type": "application/json", "user-agent": "TFR Projetos Loja (tfr.projetos.eletricos@gmail.com)" }, body: JSON.stringify(body) }), "doRequest");
  let response = await doRequest(token);
  if (response.status === 401) {
    const row = await melhorEnvioTokenRow(env).catch(() => null);
    if (row?.refresh_token) {
      token = await refreshMelhorEnvioToken(env);
      response = await doRequest(token);
    }
  }
  const data = await response.json().catch(() => []);
  if (!response.ok) {
    const providerMessage = Array.isArray(data) ? data.map((x) => x?.error || x?.message).filter(Boolean).join(" | ") : String(data?.message || data?.error || "").trim();
    const validationDetails = data && !Array.isArray(data) && data.errors && typeof data.errors === "object" ? Object.entries(data.errors).flatMap(([field, messages]) => {
      const list = Array.isArray(messages) ? messages : [messages];
      return list.filter(Boolean).map((message) => `${field}: ${String(message)}`);
    }).join(" | ") : "";
    const detail = [providerMessage, validationDetails].filter(Boolean).join(" \u2014 ");
    throw new Error(detail || `Melhor Envio HTTP ${response.status}`);
  }
  const rows = Array.isArray(data) ? data : [];
  const options = rows.filter((x) => !x?.error && Number(x?.custom_price || x?.price || 0) > 0).map((x) => ({
    id: String(x.id),
    rawId: x.id,
    name: String(x.name || "Entrega"),
    company: String(x.company?.name || "Transportadora"),
    priceCents: Math.round(Number(x.custom_price || x.price || 0) * 100),
    days: Number(x.custom_delivery_time || x.delivery_time || 0)
  })).sort((a, b) => a.priceCents - b.priceCents);
  if (!options.length) {
    const providerErrors = rows.map((x) => x?.error || x?.message).filter(Boolean).map(String);
    throw new Error(providerErrors.length ? `Nenhum frete dispon\xEDvel: ${Array.from(new Set(providerErrors)).slice(0, 3).join(" | ")}` : "Nenhuma transportadora dispon\xEDvel para este CEP e volume.");
  }
  return options;
}
__name(calculateShippingFor, "calculateShippingFor");
async function storeShippingOptions(env, product, cep, quantity) {
  const config = await storePublicConfig(env);

  const pickupOptions = [
    {
      id: "tfr-retirada",
      rawId: "tfr-retirada",
      name: "Retirada na loja — Rua Aquidabam nº 87 - Centro - Duartina/SP - CEP 17470-000",
      company: "TFR Projetos",
      priceCents: 0,
      days: Math.max(0, Number(product.lead_days || 0))
    }
  ];

  const localOptions = [];

  if (
    config.localDeliveryEnabled &&
    localDeliveryMatches(config.localDeliveryCepPrefixes, cep)
  ) {
    localOptions.push({
      id: "tfr-local",
      rawId: "tfr-local",
      name: "Entrega local TFR",
      company: "TFR Projetos",
      priceCents: Number(config.localDeliveryPriceCents || 0),
      days: 1
    });
  }

  try {
    const carrierOptions = await calculateShippingFor(
      env,
      product,
      cep,
      quantity
    );

    return {
      options: [
        ...pickupOptions,
        ...localOptions,
        ...carrierOptions
      ].sort((a, b) => a.priceCents - b.priceCents),
      warning: ""
    };
  } catch (e) {
    const message = String(e?.message || e);

    return {
      options: [
        ...pickupOptions,
        ...localOptions
      ].sort((a, b) => a.priceCents - b.priceCents),
      warning: message
    };
  }
}
__name(storeShippingOptions, "storeShippingOptions");
async function resolveStoreCart(env, rawItems) {
  const source = Array.isArray(rawItems) ? rawItems : [];
  if (!source.length) throw new Error("Carrinho vazio.");
  if (source.length > 20) throw new Error("O carrinho excede o limite de itens diferentes.");
  const merged = new Map();
  for (const item of source) {
    const slug = String(item?.slug || "").trim();
    if (!slug) continue;
    const quantity = Math.max(1, Math.min(20, Math.floor(Number(item?.quantity || 1))));
    merged.set(slug, Math.min(20, Number(merged.get(slug) || 0) + quantity));
  }
  if (!merged.size) throw new Error("Carrinho vazio.");
  const items = [];
  for (const [slug, quantity] of merged.entries()) {
    const product = await getStoreProductBySlug(env, slug);
    if (!product) throw new Error(`Produto indisponível: ${slug}`);
    if (!product.made_to_order && Number(product.stock_qty || 0) < quantity) {
      throw new Error(`Quantidade indisponível em estoque para ${product.name}.`);
    }
    items.push({ product, quantity });
  }
  return items;
}
__name(resolveStoreCart, "resolveStoreCart");
async function calculateShippingForCart(env, cartItems, destinationCep) {
  let token = await melhorEnvioAccessToken(env);
  const origin = await storeOriginCep(env);
  if (origin.length !== 8) throw new Error("CEP de origem da TFR ainda não foi configurado para a loja.");
  const dest = String(destinationCep || "").replace(/\D/g, "").slice(0, 8);
  if (dest.length !== 8) throw new Error("Informe um CEP válido.");
  const products = [];
  for (const entry of cartItems) {
    const product = entry.product;
    if (!product.weight_grams || !product.width_cm || !product.height_cm || !product.length_cm) {
      throw new Error(`O produto ${product.name} ainda não possui peso e dimensões suficientes para calcular o frete.`);
    }
    products.push({
      id: `tfr-${product.id}`,
      width: Math.max(1, Math.ceil(Number(product.width_cm || 0))),
      height: Math.max(1, Math.ceil(Number(product.height_cm || 0))),
      length: Math.max(1, Math.ceil(Number(product.length_cm || 0))),
      weight: Number(Math.max(0.01, Number(product.weight_grams || 0) / 1e3).toFixed(3)),
      insurance_value: Number((Number(product.price_cents || 0) / 100).toFixed(2)),
      quantity: Math.max(1, Math.min(20, Math.floor(Number(entry.quantity || 1))))
    });
  }
  const endpoint = `${melhorEnvioBaseUrl(env)}/api/v2/me/shipment/calculate`;
  const body = {
    from: { postal_code: origin },
    to: { postal_code: dest },
    products,
    options: { receipt: false, own_hand: false, collect: false }
  };
  const doRequest = /* @__PURE__ */ __name((bearer) => fetch(endpoint, {
    method: "POST",
    headers: {
      "authorization": `Bearer ${bearer}`,
      "accept": "application/json",
      "content-type": "application/json",
      "user-agent": "TFR Projetos Loja (tfr.projetos.eletricos@gmail.com)"
    },
    body: JSON.stringify(body)
  }), "doRequest");
  let response = await doRequest(token);
  if (response.status === 401) {
    const row = await melhorEnvioTokenRow(env).catch(() => null);
    if (row?.refresh_token) {
      token = await refreshMelhorEnvioToken(env);
      response = await doRequest(token);
    }
  }
  const data = await response.json().catch(() => []);
  if (!response.ok) {
    const providerMessage = Array.isArray(data)
      ? data.map((x) => x?.error || x?.message).filter(Boolean).join(" | ")
      : String(data?.message || data?.error || "").trim();
    const validationDetails = data && !Array.isArray(data) && data.errors && typeof data.errors === "object"
      ? Object.entries(data.errors).flatMap(([field, messages]) => {
          const list = Array.isArray(messages) ? messages : [messages];
          return list.filter(Boolean).map((message) => `${field}: ${String(message)}`);
        }).join(" | ")
      : "";
    const detail = [providerMessage, validationDetails].filter(Boolean).join(" — ");
    throw new Error(detail || `Melhor Envio HTTP ${response.status}`);
  }
  const rows = Array.isArray(data) ? data : [];
  const options = rows
    .filter((x) => !x?.error && Number(x?.custom_price || x?.price || 0) > 0)
    .map((x) => ({
      id: String(x.id),
      rawId: x.id,
      name: String(x.name || "Entrega"),
      company: String(x.company?.name || "Transportadora"),
      priceCents: Math.round(Number(x.custom_price || x.price || 0) * 100),
      days: Number(x.custom_delivery_time || x.delivery_time || 0)
    }))
    .sort((a, b) => a.priceCents - b.priceCents);
  if (!options.length) {
    const providerErrors = rows.map((x) => x?.error || x?.message).filter(Boolean).map(String);
    throw new Error(providerErrors.length
      ? `Nenhum frete disponível: ${Array.from(new Set(providerErrors)).slice(0, 3).join(" | ")}`
      : "Nenhuma transportadora disponível para este CEP e volume.");
  }
  return options;
}
__name(calculateShippingForCart, "calculateShippingForCart");
async function storeShippingOptionsForCart(env, cartItems, cep) {
  const config = await storePublicConfig(env);
  const maxLeadDays = cartItems.reduce((max, entry) => Math.max(max, Number(entry.product?.lead_days || 0)), 0);
  const pickupOptions = [{
    id: "tfr-retirada",
    rawId: "tfr-retirada",
    name: "Retirada na loja — Rua Aquidabam nº 87 - Centro - Duartina/SP - CEP 17470-000",
    company: "TFR Projetos",
    priceCents: 0,
    days: maxLeadDays
  }];
  const localOptions = [];
  if (config.localDeliveryEnabled && localDeliveryMatches(config.localDeliveryCepPrefixes, cep)) {
    localOptions.push({
      id: "tfr-local",
      rawId: "tfr-local",
      name: "Entrega local TFR",
      company: "TFR Projetos",
      priceCents: Number(config.localDeliveryPriceCents || 0),
      days: Math.max(1, maxLeadDays)
    });
  }
  try {
    const carrierOptions = await calculateShippingForCart(env, cartItems, cep);
    return {
      options: [...pickupOptions, ...localOptions, ...carrierOptions].sort((a, b) => a.priceCents - b.priceCents),
      warning: ""
    };
  } catch (e) {
    return {
      options: [...pickupOptions, ...localOptions].sort((a, b) => a.priceCents - b.priceCents),
      warning: String(e?.message || e)
    };
  }
}
__name(storeShippingOptionsForCart, "storeShippingOptionsForCart");
async function getStoreOrderItems(env, orderId) {
  const result = await env.DB.prepare(`SELECT
      i.id,i.order_id,i.product_id,i.product_name,i.product_slug,i.quantity,i.unit_price_cents,i.subtotal_cents,
      p.external_id,p.source_type,p.source_id,p.made_to_order,p.lead_days,p.stock_qty,p.name AS current_product_name
    FROM store_order_items i
    LEFT JOIN store_products p ON p.id=i.product_id
    WHERE i.order_id=?
    ORDER BY i.id`).bind(orderId).all();
  return result?.results || [];
}
__name(getStoreOrderItems, "getStoreOrderItems");
async function storeShippingQuote(request, env) {
  const body = await request.json().catch(() => ({}));
  const cep = String(body.cep || "").replace(/\D/g, "").slice(0, 8);
  if (cep.length !== 8) return json({ error: "Informe um CEP válido." }, 400);
  try {
    if (Array.isArray(body.items) && body.items.length) {
      const cartItems = await resolveStoreCart(env, body.items);
      return json(await storeShippingOptionsForCart(env, cartItems, cep));
    }
    const slug = String(body.slug || "").trim();
    const quantity = Math.max(1, Math.min(20, Math.floor(Number(body.quantity || 1))));
    const product = await getStoreProductBySlug(env, slug);
    if (!product) return json({ error: "Produto não encontrado." }, 404);
    if (!product.made_to_order && Number(product.stock_qty || 0) < quantity) {
      return json({ error: "Quantidade indisponível em estoque." }, 409);
    }
    return json(await storeShippingOptions(env, product, cep, quantity));
  } catch (e) {
    return json({ error: String(e?.message || e) }, 503);
  }
}
__name(storeShippingQuote, "storeShippingQuote");
async function storeCheckoutConfig(env, slug) {
  const product = await getStoreProductBySlug(env, slug);
  if (!product) return json({ error: "Produto indispon\xEDvel." }, 404);
  const publicKey = await getSiteSetting(env, "mercado_pago_public_key");
  return json({ publicKey, publicKeyConfigured: Boolean(publicKey), product: storeProductDto(product) });
}
__name(storeCheckoutConfig, "storeCheckoutConfig");
async function sendStoreOrderConfirmationEmail(env, order, product) {
  const customerName = String(order.customer_name || "").trim();
  let items = await getStoreOrderItems(env, order.id).catch(() => []);
  if (!items.length) {
    const quantity = Math.max(1, Number(order.quantity || 1));
    items = [{
      product_name: String(product?.name || "Produto TFR Projetos"),
      quantity,
      unit_price_cents: Math.round(Number(order.subtotal_cents || 0) / quantity),
      subtotal_cents: Number(order.subtotal_cents || 0),
      made_to_order: product?.made_to_order,
      lead_days: product?.lead_days    }];
  }
  const subtotalText = money(Number(order.subtotal_cents || 0)) || "";
  const shippingText = money(Number(order.shipping_cents || 0)) || "R$ 0,00";
  const totalText = money(Number(order.total_cents || 0)) || "";
  const isPickup = String(order.shipping_service_id || "") === "tfr-retirada";
  const deliveryText = isPickup
    ? "Retirada na loja — Rua Aquidabam nº 87 - Centro - Duartina/SP - CEP 17470-000"
    : `${order.shipping_address || ""}, ${order.shipping_number || ""}${order.shipping_complement ? ` - ${order.shipping_complement}` : ""} - ${order.shipping_district || ""} - ${order.shipping_city || ""}/${order.shipping_state || ""} - CEP ${order.shipping_cep || ""}`;
  const maxLeadDays = items.reduce((max, item) => Math.max(max, Number(item.lead_days || 0)), 0);
  const hasMadeToOrder = items.some((item) => Boolean(item.made_to_order));
  const itemRowsHtml = items.map((item) => {
    const itemSubtotal = money(Number(item.subtotal_cents || 0)) || "";
    return `<div style="display:flex;justify-content:space-between;gap:18px;padding:12px 0;border-bottom:1px solid #e7edf5"><div><strong>${escapeHtml(item.product_name || "Produto TFR Projetos")}</strong><br><span style="color:#66778f;font-size:13px">Quantidade: ${Math.max(1, Number(item.quantity || 1))}</span></div><strong style="white-space:nowrap">${escapeHtml(itemSubtotal)}</strong></div>`;
  }).join("");
  const itemRowsText = items.map((item) => `- ${item.product_name || "Produto TFR Projetos"} | Qtd: ${Math.max(1, Number(item.quantity || 1))} | ${money(Number(item.subtotal_cents || 0)) || ""}`).join("\n");
  const productionText = hasMadeToOrder
    ? `<p style="font-size:15px;line-height:1.6">Seu pedido possui item(ns) produzido(s) sob encomenda.${maxLeadDays > 0 ? ` O maior prazo de produção informado é de aproximadamente ${maxLeadDays} dia(s).` : ""}</p>`
    : "";
  const html = `<!doctype html><html><body style="margin:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#071333"><div style="max-width:640px;margin:0 auto;padding:32px 18px"><div style="background:#ffffff;border:1px solid #dce5f2;border-radius:14px;padding:32px"><div style="font-size:13px;font-weight:700;letter-spacing:.08em;color:#1769d2">TFR PROJETOS</div><h1 style="font-size:26px;line-height:1.2;margin:12px 0 18px">Compra confirmada</h1><p style="font-size:16px;line-height:1.6">${customerName ? `Olá, ${escapeHtml(customerName)}.` : "Olá."}</p><p style="font-size:16px;line-height:1.6">Recebemos seu pagamento e o pedido <strong>#${order.id}</strong> foi confirmado com sucesso.</p><div style="background:#f7f9fc;border-radius:10px;padding:18px;margin:22px 0"><strong>Itens do pedido</strong><div style="margin-top:8px">${itemRowsHtml}</div><div style="padding-top:14px;line-height:1.8">Produtos: ${escapeHtml(subtotalText)}<br>Frete: ${escapeHtml(shippingText)}<br><strong>Total pago: ${escapeHtml(totalText)}</strong></div></div>${productionText}<div style="background:#f7f9fc;border-radius:10px;padding:18px;margin:22px 0"><strong>${isPickup ? "Retirada" : "Entrega"}</strong><br><br>${escapeHtml(deliveryText)}</div><p style="font-size:15px;line-height:1.6">${isPickup ? "Avisaremos quando o pedido estiver pronto para retirada." : "Assim que o pedido avançar para envio, acompanhe as informações fornecidas pela TFR Projetos."}</p><p style="font-size:14px;line-height:1.6;color:#52627a">Em caso de dúvida, responda a este e-mail.</p></div><p style="font-size:12px;color:#718096;text-align:center;margin-top:18px">TFR Projetos</p></div></body></html>`;
  const text = `${customerName ? `Olá, ${customerName}.` : "Olá."}

Compra confirmada - TFR Projetos

Pedido #${order.id}

Itens:
${itemRowsText}

Produtos: ${subtotalText}
Frete: ${shippingText}
Total pago: ${totalText}

${isPickup ? "Retirada" : "Entrega"}:
${deliveryText}

${isPickup ? "Avisaremos quando o pedido estiver pronto para retirada." : ""}

TFR Projetos`;
  return resendRequest(env, {
    from: "TFR Projetos <contato@tfrprojetos.com.br>",
    to: [String(order.customer_email)],
    bcc: ["engenharia@tfrprojetos.com.br"],
    reply_to: "engenharia@tfrprojetos.com.br",
    subject: `Compra confirmada - Pedido #${order.id} | TFR Projetos`,
    html,
    text
  }, `tfr-store-order-${order.id}-confirmation-v2`);
}

__name(
  sendStoreOrderConfirmationEmail,
  "sendStoreOrderConfirmationEmail"
);
async function syncStoreOrderToProductionState(db, order, product, payment, storeItems = []) {
  const storeOrderId = Number(order.id);
  const total = Number((Number(order.total_cents || 0) / 100).toFixed(2));
  const paymentId = String(payment?.id || order.payment_id || "");
  const normalizedItems = Array.isArray(storeItems) && storeItems.length
    ? storeItems
    : [{
        product_name: String(product?.name || "Produto Loja TFR"),
        quantity: Math.max(1, Number(order.quantity || 1)),
        unit_price_cents: Math.round(Number(order.subtotal_cents || 0) / Math.max(1, Number(order.quantity || 1))),
        subtotal_cents: Number(order.subtotal_cents || 0),
        source_type: product?.source_type || "",
        source_id: product?.source_id || "",
        lead_days: product?.lead_days || 0
      }];
  const quantity = normalizedItems.reduce((sum, item) => sum + Math.max(1, Number(item.quantity || 1)), 0);
  const deadlineDays = normalizedItems.reduce((max, item) => Math.max(max, Number(item.lead_days || 0)), Number(order.shipping_days || 0));
  const orderDate = String(order.created_at || payment?.date_approved || new Date().toISOString()).slice(0, 10);
  const customerEmail = String(order.customer_email || "").trim().toLowerCase();
  const customerPhone = String(order.customer_phone || "").trim();
  const isPickup = String(order.shipping_service_id || "") === "tfr-retirada";
  const deliveryText = isPickup
    ? "Retirada na loja - Rua Aquidabam nº 87 - Centro - Duartina/SP - CEP 17470-000"
    : `${order.shipping_address || ""}, ${order.shipping_number || ""}` +
      `${order.shipping_complement ? ` - ${order.shipping_complement}` : ""}` +
      ` - ${order.shipping_district || ""}` +
      ` - ${order.shipping_city || ""}/${order.shipping_state || ""}` +
      ` - CEP ${order.shipping_cep || ""}`;
  const due = (() => {
    if (!deadlineDays) return "";
    const d = new Date(`${orderDate}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + deadlineDays);
    return d.toISOString().slice(0, 10);
  })();
  const createdAt = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
  for (let attempt = 0; attempt < 5; attempt++) {
    const row = await db.prepare(`SELECT revision, data FROM app_state WHERE id=1`).first();
    if (!row?.data) throw new Error("Estado principal do TFR Produção não encontrado em app_state.");
    const state = JSON.parse(row.data);
    const datasets = state.datasets || (state.datasets = {});
    datasets.orders = Array.isArray(datasets.orders) ? datasets.orders : [];
    datasets.clients = Array.isArray(datasets.clients) ? datasets.clients : [];
    datasets.payments = Array.isArray(datasets.payments) ? datasets.payments : [];
    datasets.events = Array.isArray(datasets.events) ? datasets.events : [];
    const alreadyImported = datasets.orders.find((item) => Number(item?.storeOrderId || 0) === storeOrderId);
    if (alreadyImported) {
      return { stateOrderId: String(alreadyImported.id || ""), duplicate: true };
    }
    const currentSequence = Math.max(
      Number(datasets["document-sequence"] || 0),
      ...datasets.orders.map((item) => Number(String(item?.id || "").replace(/\D/g, "")) || 0)
    );
    const nextSequence = currentSequence + 1;
    const stateOrderId = `#${String(nextSequence).padStart(5, "0")}`;
    let client = null;
    if (customerEmail) {
      client = datasets.clients.find((item) => String(item?.email || "").trim().toLowerCase() === customerEmail);
    }
    if (!client && customerPhone) {
      const normalizedPhone = customerPhone.replace(/\D/g, "");
      client = datasets.clients.find((item) => String(item?.phone || "").replace(/\D/g, "") === normalizedPhone);
    }
    if (!client) {
      client = {
        name: String(order.customer_name || "Cliente Loja TFR").trim(),
        phone: customerPhone,
        email: customerEmail,
        instagram: "",
        cep: String(order.shipping_cep || "").replace(/\D/g, "").slice(0, 8),
        address: String(order.shipping_address || "").trim(),
        addressNumber: String(order.shipping_number || "").trim(),
        addressComplement: String(order.shipping_complement || "").trim(),
        photoBlobId: "",
        id: Date.now(),
        orders: 0,
        spent: 0
      };
      datasets.clients.unshift(client);
    }
    client.orders = Math.max(0, Number(client.orders || 0)) + 1;
    client.spent = Number((Number(client.spent || 0) + total).toFixed(2));
    if (!client.phone && customerPhone) client.phone = customerPhone;
    if (!client.email && customerEmail) client.email = customerEmail;
    const stateItems = normalizedItems.map((item) => {
      const q = Math.max(1, Number(item.quantity || 1));
      const stateItem = {
        product: String(item.product_name || item.current_product_name || "Produto Loja TFR"),
        quantity: q,
        unitPrice: Number((Number(item.unit_price_cents || 0) / 100).toFixed(2))
      };
      const sourceType = String(item.source_type || "");
      const sourceId = Number(item.source_id || 0);
      if (sourceType === "recipe" && sourceId) stateItem.recipeId = sourceId;
      if (sourceType === "resale" && sourceId) stateItem.resaleId = sourceId;
      return stateItem;
    });
    const productLabel = stateItems.length === 1 ? stateItems[0].product : `${stateItems.length} produtos`;
    const details = [
      `Venda automática da Loja TFR - pedido #${storeOrderId}`,
      paymentId ? `Mercado Pago: ${paymentId}` : "",
      `Entrega: ${order.shipping_service_name || ""}`,
      deliveryText
    ].filter(Boolean).join("\n");
    datasets.orders.unshift({
      client: client.name,
      product: productLabel,
      items: stateItems,
      details,
      status: "Planejamento",
      quantity,
      total,
      paid: total,
      orderDate,
      acceptedDate: orderDate,
      deadlineDays,
      due,
      id: stateOrderId,
      accent: "blue",
      age: "Criado agora",
      financeLinked: true,
      storeOrderId,
      storePaymentId: paymentId,
      source: "loja_tfr"
    });
    const paymentSequence = Math.max(0, ...datasets.payments.map((item) => {
      const match = String(item?.id || "").match(/(\d+)$/);
      return match ? Number(match[1]) : 0;
    })) + 1;
    datasets.payments.unshift({
      id: `PG-${paymentSequence}`,
      client: client.name,
      order: stateOrderId,
      value: total,
      paidValue: total,
      receipts: [],
      method: String(payment?.payment_method_id || "Mercado Pago"),
      status: "Pago",
      date: orderDate,
      dueDate: orderDate,
      installmentCurrent: 1,
      installmentTotal: 1,
      notes: `Venda da Loja TFR. Pedido #${storeOrderId}. Mercado Pago ${paymentId}.`,
      autoOrder: true,
      storeOrderId
    });
    datasets.events.unshift({
      id: Date.now() + Math.random(),
      orderId: stateOrderId,
      kind: "sistema",
      text: "Ordem criada automaticamente a partir de uma compra aprovada na Loja TFR.",
      createdAt
    });
    datasets["document-sequence"] = nextSequence;
    const update = await db.prepare(`UPDATE app_state SET revision=revision+1,data=?,updated_at=datetime('now') WHERE id=1 AND revision=?`)
      .bind(JSON.stringify(state), Number(row.revision || 0)).run();
    if (Number(update?.meta?.changes || 0) === 1) {
      return { stateOrderId, duplicate: false };
    }
  }
  throw new Error("Não foi possível atualizar o estado do TFR Produção após várias tentativas.");
}

__name(
  syncStoreOrderToProductionState,
  "syncStoreOrderToProductionState"
);
async function syncStoreOrderToProduction(env, order, product, payment) {
  if (!env.PROD_DB) throw new Error("Binding PROD_DB não configurado no Worker.");
  const db = env.PROD_DB;
  const storeOrderId = Number(order.id);
  const orderNumber = `LOJA-${String(storeOrderId).padStart(6, "0")}`;
  const customerName = String(order.customer_name || "").trim() || "Cliente Loja TFR";
  const customerEmail = String(order.customer_email || "").trim().toLowerCase();
  const customerPhone = String(order.customer_phone || "").trim();
  const paymentId = String(payment?.id || "");
  const isPickup = String(order.shipping_service_id || "") === "tfr-retirada";
  const deliveryText = isPickup
    ? "Retirada na loja - Rua Aquidabam nº 87 - Centro - Duartina/SP - CEP 17470-000"
    : `${order.shipping_address || ""}, ${order.shipping_number || ""}` +
      `${order.shipping_complement ? ` - ${order.shipping_complement}` : ""}` +
      ` - ${order.shipping_district || ""}` +
      ` - ${order.shipping_city || ""}/${order.shipping_state || ""}` +
      ` - CEP ${order.shipping_cep || ""}`;
  let storeItems = await getStoreOrderItems(env, storeOrderId).catch(() => []);
  if (!storeItems.length) {
    const quantity = Math.max(1, Number(order.quantity || 1));
    storeItems = [{
      product_id: order.product_id,
      product_name: String(product?.name || "Produto Loja TFR"),
      product_slug: product?.slug || null,
      quantity,
      unit_price_cents: Math.round(Number(order.subtotal_cents || 0) / quantity),
      subtotal_cents: Number(order.subtotal_cents || 0),
      source_type: product?.source_type || "",
      source_id: product?.source_id || "",
      made_to_order: product?.made_to_order || 0,
      lead_days: product?.lead_days || 0
    }];
  }
  let client = null;
  if (customerEmail) {
    client = await db.prepare(`SELECT * FROM clients WHERE lower(email)=lower(?) ORDER BY id DESC LIMIT 1`).bind(customerEmail).first();
  }
  if (!client && customerPhone) {
    client = await db.prepare(`SELECT * FROM clients WHERE phone=? ORDER BY id DESC LIMIT 1`).bind(customerPhone).first();
  }
  let clientId;
  if (!client) {
    const clientResult = await db.prepare(`INSERT INTO clients (name,phone,email,notes) VALUES (?,?,?,?)`)
      .bind(customerName, customerPhone || null, customerEmail || null, `Cliente criado automaticamente pela Loja TFR. Pedido da loja #${storeOrderId}.`).run();
    clientId = Number(clientResult.meta.last_row_id);
  } else {
    clientId = Number(client.id);
    await db.prepare(`UPDATE clients SET phone=CASE WHEN phone IS NULL OR trim(phone)='' THEN ? ELSE phone END,email=CASE WHEN email IS NULL OR trim(email)='' THEN ? ELSE email END,updated_at=datetime('now') WHERE id=?`)
      .bind(customerPhone || null, customerEmail || null, clientId).run();
  }
  let productionOrder = await db.prepare(`SELECT * FROM orders WHERE order_number=? LIMIT 1`).bind(orderNumber).first();
  const totalCents = Number(order.total_cents || 0);
  const subtotalCents = Number(order.subtotal_cents || 0);
  const shippingCents = Number(order.shipping_cents || 0);
  const notes = [
    "Venda automática da Loja TFR",
    `Pedido da loja: #${storeOrderId}`,
    `Pagamento Mercado Pago: ${paymentId}`,
    `Forma de entrega: ${order.shipping_service_name || ""}`,
    `Destino/retirada: ${deliveryText}`
  ].join("\n");
  let productionOrderId;
  if (!productionOrder) {
    const result = await db.prepare(`INSERT INTO orders (order_number,client_id,status,subtotal_cents,discount_cents,total_cents,paid_cents,notes) VALUES (?,?,'planejamento',?,0,?,?,?)`)
      .bind(orderNumber, clientId, subtotalCents, totalCents, totalCents, notes).run();
    productionOrderId = Number(result.meta.last_row_id);
  } else {
    productionOrderId = Number(productionOrder.id);
    await db.prepare(`UPDATE orders SET client_id=?,subtotal_cents=?,total_cents=?,paid_cents=?,notes=?,updated_at=datetime('now') WHERE id=?`)
      .bind(clientId, subtotalCents, totalCents, totalCents, notes, productionOrderId).run();
  }
  const itemCount = await db.prepare(`SELECT COUNT(*) AS total FROM order_items WHERE order_id=?`).bind(productionOrderId).first();
  if (Number(itemCount?.total || 0) === 0) {
    for (const item of storeItems) {
      await db.prepare(`INSERT INTO order_items (order_id,description,quantity,unit_price_cents,total_cents,specs_json) VALUES (?,?,?,?,?,?)`)
        .bind(
          productionOrderId,
          String(item.product_name || "Produto Loja TFR"),
          Math.max(1, Number(item.quantity || 1)),
          Number(item.unit_price_cents || 0),
          Number(item.subtotal_cents || 0),
          JSON.stringify({
            source: "loja_tfr",
            store_order_id: storeOrderId,
            store_product_id: item.product_id,
            store_product_slug: item.product_slug || null
          })
        ).run();
    }
    if (shippingCents > 0) {
      await db.prepare(`INSERT INTO order_items (order_id,description,quantity,unit_price_cents,total_cents,specs_json) VALUES (?,?,1,?,?,?)`)
        .bind(
          productionOrderId,
          `Frete - ${order.shipping_service_name || "Entrega"}`,
          shippingCents,
          shippingCents,
          JSON.stringify({ source: "loja_tfr_shipping", store_order_id: storeOrderId, shipping_service_id: order.shipping_service_id })
        ).run();
    }
  }
  const paymentNote = `Loja TFR #${storeOrderId} | Mercado Pago payment_id=${paymentId}`;
  const existingPayment = await db.prepare(`SELECT id FROM payments WHERE order_id=? AND notes=? LIMIT 1`).bind(productionOrderId, paymentNote).first();
  if (!existingPayment) {
    await db.prepare(`INSERT INTO payments (order_id,amount_cents,method,paid_at,notes) VALUES (?,?,?,?,?)`)
      .bind(productionOrderId, totalCents, String(payment?.payment_method_id || payment?.payment_type_id || "mercadopago"), String(payment?.date_approved || new Date().toISOString()), paymentNote).run();
  }
  const historyDescription = `Venda da Loja TFR confirmada. Pedido da loja #${storeOrderId}.`;
  const historyExists = await db.prepare(`SELECT id FROM order_history WHERE order_id=? AND event_type='loja_pagamento_aprovado' AND description=? LIMIT 1`)
    .bind(productionOrderId, historyDescription).first();
  if (!historyExists) {
    await db.prepare(`INSERT INTO order_history (order_id,event_type,from_status,to_status,description) VALUES (?,?,?,?,?)`)
      .bind(productionOrderId, "loja_pagamento_aprovado", null, "planejamento", historyDescription).run();
  }
  const stateSync = await syncStoreOrderToProductionState(db, order, product, payment, storeItems);
  return { productionOrderId, orderNumber, stateOrderId: stateSync.stateOrderId };
}

__name(
  syncStoreOrderToProduction,
  "syncStoreOrderToProduction"
);
async function applyPaymentToStoreOrder(env, orderId, payment) {
  const order = await env.DB
    .prepare("SELECT * FROM store_orders WHERE id=?")
    .bind(orderId)
    .first();

  if (!order) {
    throw new Error("Pedido da loja não encontrado.");
  }

  const amountCents = Math.round(
    Number(payment?.transaction_amount || 0) * 100
  );

  if (amountCents !== Number(order.total_cents)) {
    throw new Error(
      "Valor do pagamento da loja não confere com o pedido."
    );
  }

  const status = String(payment?.status || "unknown");

  await env.DB
    .prepare(`
      UPDATE store_orders
      SET payment_id=?,
          payment_status=?,
          updated_at=CURRENT_TIMESTAMP
      WHERE id=?
    `)
    .bind(
      String(payment?.id || ""),
      status,
      orderId
    )
    .run();

  if (status === "approved") {
    const product = await env.DB
      .prepare("SELECT * FROM store_products WHERE id=?")
      .bind(order.product_id)
      .first();

    let storeItems = await getStoreOrderItems(env, orderId).catch(() => []);
    if (!storeItems.length && product) {
      storeItems = [{
        product_id: product.id,
        quantity: Math.max(1, Number(order.quantity || 1)),
        made_to_order: product.made_to_order
      }];
    }

    if (!order.stock_applied) {
      for (const item of storeItems) {
        if (!item.made_to_order) {
          await env.DB
            .prepare(`
              UPDATE store_products
              SET stock_qty=MAX(0,stock_qty-?),
                  updated_at=CURRENT_TIMESTAMP
              WHERE id=?
            `)
            .bind(
              Math.max(1, Number(item.quantity || 1)),
              Number(item.product_id)
            )
            .run();
        }
      }

      await env.DB
        .prepare(`
          UPDATE store_orders
          SET stock_applied=1,
              updated_at=CURRENT_TIMESTAMP
          WHERE id=?
        `)
        .bind(orderId)
        .run();
    }

    const updatedOrder = await env.DB
      .prepare("SELECT * FROM store_orders WHERE id=?")
      .bind(orderId)
      .first();

    if (
      updatedOrder &&
      updatedOrder.customer_email &&
      !updatedOrder.confirmation_email_sent_at
    ) {
      try {
        const sent = await sendStoreOrderConfirmationEmail(
          env,
          updatedOrder,
          product
        );

        await env.DB
          .prepare(`
            UPDATE store_orders
            SET confirmation_email_sent_at=CURRENT_TIMESTAMP,
                confirmation_email_id=?,
                confirmation_email_last_error=NULL,
                updated_at=CURRENT_TIMESTAMP
            WHERE id=?
          `)
          .bind(
            String(sent?.id || ""),
            orderId
          )
          .run();

      } catch (emailError) {
        const emailMessage = String(
          emailError?.message ||
          "Falha ao enviar confirmação da compra."
        ).slice(0, 1000);

        console.error(
          "Store order confirmation email failed",
          {
            orderId,
            emailMessage
          }
        );

        await env.DB
          .prepare(`
            UPDATE store_orders
            SET confirmation_email_last_error=?,
                updated_at=CURRENT_TIMESTAMP
            WHERE id=?
          `)
          .bind(
            emailMessage,
            orderId
          )
          .run()
          .catch(() => {});
      }
    }

    if (
      updatedOrder &&
      !updatedOrder.production_sync_at
    ) {
      try {
        const production = await syncStoreOrderToProduction(
          env,
          updatedOrder,
          product,
          payment
        );

        await env.DB
          .prepare(`
            UPDATE store_orders
            SET production_order_id=?,
                production_sync_at=CURRENT_TIMESTAMP,
                production_sync_error=NULL,
                updated_at=CURRENT_TIMESTAMP
            WHERE id=?
          `)
          .bind(
            production.productionOrderId,
            orderId
          )
          .run();

      } catch (syncError) {
        const syncMessage = String(
          syncError?.message ||
          "Falha ao enviar pedido para o sistema de produção."
        ).slice(0, 1000);

        console.error(
          "Store order production sync failed",
          {
            orderId,
            syncMessage
          }
        );

        await env.DB
          .prepare(`
            UPDATE store_orders
            SET production_sync_error=?,
                updated_at=CURRENT_TIMESTAMP
            WHERE id=?
          `)
          .bind(
            syncMessage,
            orderId
          )
          .run()
          .catch(() => {});
      }
    }
  }

  return { status };
}

__name(
  applyPaymentToStoreOrder,
  "applyPaymentToStoreOrder"
);
async function storeCheckoutPay(request, env) {
  const body = await request.json().catch(() => ({}));
  let cartItems;
  try {
    if (Array.isArray(body.items) && body.items.length) {
      cartItems = await resolveStoreCart(env, body.items);
    } else {
      cartItems = await resolveStoreCart(env, [{ slug: String(body.slug || "").trim(), quantity: body.quantity || 1 }]);
    }
  } catch (e) {
    return json({ error: String(e?.message || e) }, 409);
  }
  const customer = body.customer || {};
  const email = String(customer.email || "").trim().toLowerCase();
  const name = String(customer.name || "").trim();
  const cep = String(customer.cep || "").replace(/\D/g, "").slice(0, 8);
  const formData = body.formData && typeof body.formData === "object" ? body.formData : null;
  if (!name || !email.includes("@") || cep.length !== 8 || !formData) {
    return json({ error: "Dados do checkout incompletos." }, 400);
  }
  let quotes;
  try {
    quotes = (await storeShippingOptionsForCart(env, cartItems, cep)).options;
  } catch (e) {
    return json({ error: String(e?.message || e) }, 503);
  }
  const shipping = quotes.find((q) => String(q.id) === String(body.shippingServiceId || ""));
  if (!shipping) return json({ error: "Opção de frete inválida ou expirou. Calcule novamente." }, 409);
  const subtotalCents = cartItems.reduce((sum, entry) => sum + Number(entry.product.price_cents || 0) * Number(entry.quantity || 1), 0);
  const shippingCents = Number(shipping.priceCents || 0);
  const totalCents = subtotalCents + shippingCents;
  const firstProduct = cartItems[0].product;
  const totalQuantity = cartItems.reduce((sum, entry) => sum + Number(entry.quantity || 1), 0);
  const result = await env.DB.prepare(`INSERT INTO store_orders (
      product_id,quantity,subtotal_cents,shipping_cents,total_cents,
      shipping_service_id,shipping_service_name,shipping_company,shipping_days,
      customer_name,customer_email,customer_phone,shipping_cep,shipping_address,
      shipping_number,shipping_complement,shipping_district,shipping_city,shipping_state,
      payment_provider,payment_status,stock_applied,created_at,updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'pending',0,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`)
    .bind(
      firstProduct.id,
      totalQuantity,
      subtotalCents,
      shippingCents,
      totalCents,
      String(shipping.id),
      String(shipping.name),
      String(shipping.company),
      Number(shipping.days || 0),
      name,
      email,
      String(customer.phone || ""),
      cep,
      String(customer.address || ""),
      String(customer.number || ""),
      String(customer.complement || ""),
      String(customer.district || ""),
      String(customer.city || ""),
      String(customer.state || "").toUpperCase().slice(0, 2),
      "mercadopago"
    ).run();
  const orderId = Number(result.meta.last_row_id);
  try {
    await env.DB.batch(cartItems.map((entry) => env.DB.prepare(`INSERT INTO store_order_items (
        order_id,product_id,product_name,product_slug,quantity,unit_price_cents,subtotal_cents,created_at
      ) VALUES (?,?,?,?,?,?,?,CURRENT_TIMESTAMP)`)
      .bind(
        orderId,
        entry.product.id,
        String(entry.product.name || "Produto Loja TFR"),
        String(entry.product.slug || ""),
        Number(entry.quantity || 1),
        Number(entry.product.price_cents || 0),
        Number(entry.product.price_cents || 0) * Number(entry.quantity || 1)
      )));
  } catch (itemError) {
    await env.DB.prepare("UPDATE store_orders SET payment_status='cart_error',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(orderId).run().catch(() => {});
    return json({ error: `Não foi possível salvar os itens do carrinho: ${String(itemError?.message || itemError)}`, orderId }, 500);
  }
  const attemptId = String(body.attemptId || "");
  const idempotencyKey = /^[0-9a-f-]{16,64}$/i.test(attemptId) ? attemptId : crypto.randomUUID();
  const payer = { ...formData.payer || {}, email };
  const itemCount = cartItems.reduce((sum, entry) => sum + Number(entry.quantity || 1), 0);
  const paymentPayload = {
    ...formData,
    payer,
    transaction_amount: Number((totalCents / 100).toFixed(2)),
    description: cartItems.length === 1 ? String(firstProduct.name).slice(0, 120) : `Pedido Loja TFR - ${itemCount} item(ns)`,
    external_reference: `tfr-store-order-${orderId}-${crypto.randomUUID().slice(0, 8)}`,
    metadata: {
      ...formData.metadata || {},
      tfr_store_order_id: orderId,
      cart_item_count: itemCount,
      shipping_service: String(shipping.id)
    }
  };
  delete paymentPayload.amount;
  delete paymentPayload.order_id;
  delete paymentPayload.id;
  try {
    const payment = await mpRequest(env, "/v1/payments", {
      method: "POST",
      headers: { "x-idempotency-key": idempotencyKey },
      body: JSON.stringify(paymentPayload)
    });
    const applied = await applyPaymentToStoreOrder(env, orderId, payment);
    return json({ paymentId: String(payment.id), status: applied.status, orderId, itemCount });
  } catch (e) {
    await env.DB.prepare("UPDATE store_orders SET payment_status='payment_error',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(orderId).run().catch(() => {});
    return json({ error: String(e?.message || "Falha ao processar pagamento."), orderId }, 502);
  }
}
__name(storeCheckoutPay, "storeCheckoutPay");
async function storeOrderPaymentStatus(request, env, orderId) {
  const id = Number(orderId);
  const url = new URL(request.url);
  const paymentId = String(url.searchParams.get("paymentId") || "").trim();
  if (!Number.isInteger(id) || id < 1 || !paymentId) {
    return json({ error: "Pedido não encontrado." }, 404);
  }
  const row = await env.DB.prepare(`SELECT
    id,payment_id,payment_status,total_cents,shipping_service_id,shipping_service_name,shipping_days
    FROM store_orders
    WHERE id=?
    LIMIT 1`).bind(id).first();
  if (!row || String(row.payment_id || "") !== paymentId) {
    return json({ error: "Pedido não encontrado." }, 404);
  }
  return json({
    order: {
      id: Number(row.id),
      status: String(row.payment_status || "pending"),
      approved: String(row.payment_status || "") === "approved",
      totalCents: Number(row.total_cents || 0),
      shippingServiceName: String(row.shipping_service_name || ""),
      shippingDays: Number(row.shipping_days || 0),
      isPickup: String(row.shipping_service_id || "") === "tfr-retirada"
    }
  });
}
__name(storeOrderPaymentStatus, "storeOrderPaymentStatus");
async function mercadoPagoWebhook(request, env) {
  const url = new URL(request.url);
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { "allow": "POST, OPTIONS" } });
  }
  if (request.method !== "POST") {
    return json({ error: "Method Not Allowed" }, 405);
  }
  const body = await request.json().catch(() => ({}));
  const dataId = String(url.searchParams.get("data.id") || url.searchParams.get("data_id") || body?.data?.id || body?.id || "");
  const type = String(url.searchParams.get("type") || body?.type || body?.topic || "");
  if (body?.live_mode === false && dataId === "123456") {
    return json({ ok: true, test: true });
  }
  if (!dataId || type && type !== "payment") return json({ ok: true });
  if (!await validateWebhookSignature(request, env, dataId)) return json({ error: "Assinatura de webhook inv\xE1lida." }, 401);
  const payment = await mpRequest(env, `/v1/payments/${encodeURIComponent(dataId)}`, { method: "GET" });
  const external = String(payment.external_reference || "");
  const storeMatch = external.match(/^tfr-store-order-(\d+)-/);
  if (storeMatch) {
    const storeOrderId = Number(storeMatch[1]);
    const order2 = await env.DB.prepare("SELECT id FROM store_orders WHERE id=?").bind(storeOrderId).first();
    if (!order2) return json({ ok: true });
    try {
      await applyPaymentToStoreOrder(env, storeOrderId, payment);
    } catch (error) {
      const message = String(error?.message || "Falha ao atualizar pedido da loja.");
      if (message.includes("Valor do pagamento")) return json({ error: message }, 409);
      throw error;
    }
    return json({ ok: true, store: true });
  }
  const match = external.match(/^tfr-order-(\d+)-/);
  if (!match) return json({ ok: true });
  const orderId = Number(match[1]);
  const order = await env.DB.prepare("SELECT id FROM orders WHERE id=?").bind(orderId).first();
  if (!order) return json({ ok: true });
  try {
    await applyPaymentToOrder(request, env, orderId, payment);
  } catch (error) {
    const message = String(error?.message || "Falha ao atualizar pedido.");
    if (message.includes("Valor do pagamento n\xE3o confere")) return json({ error: message }, 409);
    throw error;
  }
  await env.DB.prepare("UPDATE checkout_sessions SET status='completed',updated_at=CURRENT_TIMESTAMP WHERE order_id=?").bind(orderId).run().catch(() => {
  });
  return json({ ok: true });
}
__name(mercadoPagoWebhook, "mercadoPagoWebhook");
async function orderStatus(env, token) {
  const row = await env.DB.prepare(`SELECT o.id,o.customer_email,o.amount,o.payment_status,o.download_token,o.download_count,o.download_limit,o.download_expires_at,p.title,p.slug,p.file_name FROM orders o JOIN products p ON p.id=o.product_id WHERE o.download_token=?`).bind(token).first();
  if (!row) return json({ error: "Pedido n\xE3o encontrado." }, 404);
  const expired = row.download_expires_at ? Date.parse(row.download_expires_at) < Date.now() : true;
  return json({ order: { id: row.id, title: row.title, status: row.payment_status, email: row.customer_email, fileName: row.file_name, downloadsRemaining: Math.max(0, row.download_limit - row.download_count), expiresAt: row.download_expires_at, canDownload: row.payment_status === "approved" && !expired && row.download_count < row.download_limit, downloadUrl: `/api/download/${token}` } });
}
__name(orderStatus, "orderStatus");
async function downloadOrder(env, token) {
  const row = await env.DB.prepare(`SELECT o.id,o.payment_status,o.download_count,o.download_limit,o.download_expires_at,p.download_key,p.file_name FROM orders o JOIN products p ON p.id=o.product_id WHERE o.download_token=?`).bind(token).first();
  if (!row || row.payment_status !== "approved" || !row.download_key) return new Response("Download n\xE3o autorizado.", { status: 403 });
  if (!row.download_expires_at || Date.parse(row.download_expires_at) < Date.now()) return new Response("Link expirado.", { status: 410 });
  if (Number(row.download_count) >= Number(row.download_limit)) return new Response("Limite de downloads atingido.", { status: 410 });
  const obj = await env.PRODUCT_FILES.get(row.download_key);
  if (!obj) return new Response("Arquivo n\xE3o encontrado.", { status: 404 });
  await env.DB.prepare("UPDATE orders SET download_count=download_count+1, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(row.id).run();
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("content-disposition", `attachment; filename*=UTF-8''${encodeURIComponent(row.file_name || "produto-tfr.zip")}`);
  headers.set("cache-control", "private, no-store");
  return new Response(obj.body, { headers });
}
__name(downloadOrder, "downloadOrder");
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const hostname = url.hostname.toLowerCase();
    const isCartPrepHost = hostname.startsWith("tfr-site-cart-prep.") && hostname.endsWith(".workers.dev");
    try {
      if (isCartPrepHost && request.method === "GET" && path === "/__cart-prep-health") {
        return json({
          ok: true,
          worker: "tfr-site-cart-prep",
          cartInjectorPresent: typeof injectStoreCart === "function",
          version: "diag-2026-10-08-2"
        });
      }
      if (isCartPrepHost && request.method === "GET" && path === "/loja/__cart-diag") {
        return json({
          ok: true,
          matchedLojaRoute: true,
          path,
          hostname,
          version: "diag-2026-10-08-3"
        });
      }
      if (isCartPrepHost && request.method === "GET" && path === "/loja/__cart-html-diag") {
        const testResponse = await serveSeoHtml(request, env, "/loja/item-teste-recipe-1791376360975");
        const testHtml = await testResponse.text();
        return json({
          ok: true,
          status: testResponse.status,
          hasCartScript: testHtml.includes('id="tfr-store-cart-script"'),
          hasCartStyle: testHtml.includes('id="tfr-store-cart-style"'),
          hasCartFabCss: testHtml.includes(".tfr-cart-fab"),
          htmlLength: testHtml.length,
          version: "diag-2026-10-08-3"
        });
      }
      if (isCartPrepHost && request.method === "GET" && (path === "/loja" || path === "/loja/" || path.startsWith("/loja/"))) {
        return serveSeoHtml(request, env, path);
      }
      if (isCartPrepHost) {
        if (request.method === "POST" && path === "/api/loja/frete") {
          const target = new URL(path + url.search, "https://loja.tfrprojetos.com.br");
          const headers = new Headers(request.headers);
          headers.delete("cookie");
          headers.delete("authorization");
          headers.set("content-type", request.headers.get("content-type") || "application/json");
          return fetch(new Request(target.toString(), {
            method: "POST",
            headers,
            body: await request.arrayBuffer(),
            redirect: "follow"
          }));
        }

        const readOnlyStoreApi = request.method === "GET" && path.startsWith("/api/loja/");
        const sharedStaticAsset = request.method === "GET" && [
          "/tfr-logo.png",
          "/kim-flow-logo.png",
          "/favicon.png",
          "/111.png"
        ].includes(path);

        if (readOnlyStoreApi || sharedStaticAsset) {
          const target = new URL(path + url.search, "https://loja.tfrprojetos.com.br");
          const headers = new Headers(request.headers);
          headers.delete("cookie");
          headers.delete("authorization");
          return fetch(new Request(target.toString(), {
            method: "GET",
            headers,
            redirect: "follow"
          }));
        }

        if (path.startsWith("/api/loja/") && request.method !== "GET") {
          return json({
            error: "Ambiente de teste: operações que criam pedidos, fretes ou pagamentos estão bloqueadas."
          }, 403);
        }
      }
      const normalizedPath = path.replace(/\/+$/, "") || "/";
      if (normalizedPath === "/api/mercadopago/webhook" || normalizedPath === "/api/webhooks/mercadopago") {
        return mercadoPagoWebhook(request, env);
      }
      if (request.method === "GET" && normalizedPath === "/sitemap.xml") return dynamicSitemap(env);
      if (request.method === "GET" && normalizedPath === "/api/melhor-envio/callback") return melhorEnvioCallback(request, env);
      if (request.method === "GET" && path === "/api/loja/config") return publicStoreConfig(env);
      if (request.method === "GET" && path === "/api/loja/produtos") return listStoreProducts(env);
      const storeImageMatch = path.match(/^\/api\/loja\/produtos\/([^/]+)\/imagem\/(\d+)$/);
      if (request.method === "GET" && storeImageMatch) return publicStoreImage(env, decodeURIComponent(storeImageMatch[1]), Number(storeImageMatch[2]));
      const storeProductMatch = path.match(/^\/api\/loja\/produtos\/([^/]+)$/);
      if (request.method === "GET" && storeProductMatch) return publicStoreProduct(env, decodeURIComponent(storeProductMatch[1]));
      if (request.method === "POST" && path === "/api/loja/frete") return storeShippingQuote(request, env);
      const storeCheckoutConfigMatch = path.match(/^\/api\/loja\/checkout\/config\/([^/]+)$/);
      if (request.method === "GET" && storeCheckoutConfigMatch) return storeCheckoutConfig(env, decodeURIComponent(storeCheckoutConfigMatch[1]));
      if (request.method === "POST" && path === "/api/loja/checkout/pagar") return storeCheckoutPay(request, env);
      const storeOrderStatusMatch = path.match(/^\/api\/loja\/pedido\/(\d+)\/status$/);
      if (request.method === "GET" && storeOrderStatusMatch) return storeOrderPaymentStatus(request, env, Number(storeOrderStatusMatch[1]));
      if (request.method === "POST" && path === "/api/loja/sync") return await syncStoreProduct(request, env);
      if (request.method === "POST" && path === "/api/loja/config/sync") return await syncStoreConfig(request, env);
      const checkoutConfigMatch = path.match(/^\/api\/checkout\/config\/([^/]+)$/);
      if (request.method === "GET" && checkoutConfigMatch) return checkoutConfig(env, decodeURIComponent(checkoutConfigMatch[1]));
      if (request.method === "POST" && path === "/api/checkout/session") return createCheckoutSession(request, env);
      const checkoutSessionMatch = path.match(/^\/api\/checkout\/session\/([a-f0-9]{64})$/);
      if (request.method === "GET" && checkoutSessionMatch) return getCheckoutSession(env, checkoutSessionMatch[1]);
      if (request.method === "POST" && path === "/api/checkout/brick/pay") return processBrickPayment(request, env);
      if (request.method === "POST" && path === "/api/checkout") return createCheckout(request, env);
      const orderMatch = path.match(/^\/api\/pedido\/([a-f0-9]{64})$/);
      if (request.method === "GET" && orderMatch) return orderStatus(env, orderMatch[1]);
      const downloadMatch = path.match(/^\/api\/download\/([a-f0-9]{64})$/);
      if (request.method === "GET" && downloadMatch) return downloadOrder(env, downloadMatch[1]);
      const offerHeroMatch = path.match(/^\/api\/ofertas\/([^/]+)\/hero$/);
      if (request.method === "GET" && offerHeroMatch) return landingAsset(request, env, decodeURIComponent(offerHeroMatch[1]), "hero");
      const offerVideoMatch = path.match(/^\/api\/ofertas\/([^/]+)\/video$/);
      if (request.method === "GET" && offerVideoMatch) return landingAsset(request, env, decodeURIComponent(offerVideoMatch[1]), "video");
      const offerGalleryMatch = path.match(/^\/api\/ofertas\/([^/]+)\/galeria\/(\d+)$/);
      if (request.method === "GET" && offerGalleryMatch) return landingAsset(request, env, decodeURIComponent(offerGalleryMatch[1]), "gallery", Number(offerGalleryMatch[2]));
      const offerMatch = path.match(/^\/api\/ofertas\/([^/]+)$/);
      if (request.method === "GET" && offerMatch) return publicLanding(env, decodeURIComponent(offerMatch[1]));
      if (request.method === "GET" && path === "/api/biblioteca/produtos") return listPublic(env);
      const coverMatch = path.match(/^\/api\/biblioteca\/produtos\/([^/]+)\/capa$/);
      if (request.method === "GET" && coverMatch) return publicCover(env, decodeURIComponent(coverMatch[1]));
      const publicProductMatch = path.match(/^\/api\/biblioteca\/produtos\/([^/]+)$/);
      if (request.method === "GET" && publicProductMatch) return publicProduct(env, decodeURIComponent(publicProductMatch[1]));
      if (path.startsWith("/admin/landing-pages/api/")) {
        const denied = await requireAdminAccess(request, env);
        if (denied) return denied;
        if (request.method === "GET" && path === "/admin/landing-pages/api/melhor-envio/connect") return melhorEnvioConnect(request, env);
        if (request.method === "GET" && path === "/admin/landing-pages/api/melhor-envio/status") return melhorEnvioStatus(env);
        if (request.method === "POST" && path === "/admin/landing-pages/api/uploads/init") return initProductUpload(request, env);
        if (request.method === "PUT" && path === "/admin/landing-pages/api/uploads/part") return uploadProductPart(request, env);
        if (request.method === "POST" && path === "/admin/landing-pages/api/uploads/complete") return completeProductUpload(request, env);
        if (request.method === "POST" && path === "/admin/landing-pages/api/uploads/abort") return abortProductUpload(request, env);
        if (request.method === "POST" && path === "/admin/landing-pages/api/uploads/cleanup") return cleanupProductUpload(request, env);
        if (request.method === "GET" && path === "/admin/landing-pages/api/ofertas") return adminLandingList(env);
        if (request.method === "GET" && path === "/admin/landing-pages/api/settings/checkout") return adminCheckoutSettings(env);
        if (request.method === "PUT" && path === "/admin/landing-pages/api/settings/checkout") return saveAdminCheckoutSettings(request, env);
        const adminOfferHero = path.match(/^\/admin\/landing-pages\/api\/ofertas\/([^/]+)\/hero$/);
        if (request.method === "GET" && adminOfferHero) return landingAsset(request, env, decodeURIComponent(adminOfferHero[1]), "hero", 0, true);
        const adminOfferVideo = path.match(/^\/admin\/landing-pages\/api\/ofertas\/([^/]+)\/video$/);
        if (request.method === "GET" && adminOfferVideo) return landingAsset(request, env, decodeURIComponent(adminOfferVideo[1]), "video", 0, true);
        const adminOfferGallery = path.match(/^\/admin\/landing-pages\/api\/ofertas\/([^/]+)\/galeria\/(\d+)$/);
        if (request.method === "GET" && adminOfferGallery) return landingAsset(request, env, decodeURIComponent(adminOfferGallery[1]), "gallery", Number(adminOfferGallery[2]), true);
        const adminOfferBySlug = path.match(/^\/admin\/landing-pages\/api\/ofertas\/slug\/([^/]+)$/);
        if (request.method === "GET" && adminOfferBySlug) return adminLandingBySlug(env, decodeURIComponent(adminOfferBySlug[1]));
        const adminOfferByProduct = path.match(/^\/admin\/landing-pages\/api\/ofertas\/(\d+)$/);
        if (adminOfferByProduct && request.method === "PUT") return saveLanding(request, env, Number(adminOfferByProduct[1]));
        if (adminOfferByProduct && request.method === "DELETE") return deleteLanding(env, Number(adminOfferByProduct[1]));
      }
      if (path.startsWith("/admin/biblioteca/api/")) {
        if (request.method === "POST" && path === "/admin/biblioteca/api/admin-session") return createAdminSession(request, env);
        const denied = await requireAdminAccess(request, env);
        if (denied) return denied;
        if (request.method === "POST" && path === "/admin/biblioteca/api/uploads/init") return initProductUpload(request, env);
        if (request.method === "PUT" && path === "/admin/biblioteca/api/uploads/part") return uploadProductPart(request, env);
        if (request.method === "POST" && path === "/admin/biblioteca/api/uploads/complete") return completeProductUpload(request, env);
        if (request.method === "POST" && path === "/admin/biblioteca/api/uploads/abort") return abortProductUpload(request, env);
        if (request.method === "POST" && path === "/admin/biblioteca/api/uploads/cleanup") return cleanupProductUpload(request, env);
        if (request.method === "GET" && path === "/admin/biblioteca/api/produtos") return adminList(env);
        if (request.method === "POST" && path === "/admin/biblioteca/api/produtos") return saveProduct(request, env);
        const itemMatch = path.match(/^\/admin\/biblioteca\/api\/produtos\/(\d+)$/);
        if (itemMatch && request.method === "PUT") return saveProduct(request, env, Number(itemMatch[1]));
        if (itemMatch && request.method === "DELETE") return deleteProduct(env, Number(itemMatch[1]));
      }
      const forcePrepHtml = isCartPrepHost && request.method === "GET" && (
        path === "/" ||
        path === "/loja" ||
        path === "/loja/" ||
        path.startsWith("/loja/")
      );
      if (forcePrepHtml || (request.method === "GET" && (request.headers.get("accept") || "").includes("text/html"))) {
        const seoPath = (hostname === "loja.tfrprojetos.com.br" || isCartPrepHost) && (path === "/" || path === "") ? "/loja" : path;
        return serveSeoHtml(request, env, seoPath);
      }
      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error(error);
      const message = String(error?.message || "Erro interno.");
      if (message.includes("UNIQUE constraint failed: products.slug")) {
        return json({ error: "J\xE1 existe um produto com este endere\xE7o (slug). Altere o slug e tente novamente." }, 409);
      }
      if (message.includes("no such table: store_products") || message.includes("no such table: store_orders")) {
        return json({ error: `O m\xF3dulo da Loja TFR ainda n\xE3o foi ativado no D1. Aplique a migration 010_store.sql. Detalhe: ${message}` }, 500);
      }
      if (message.includes("no such table: oauth_tokens") || message.includes("no such table: oauth_states")) {
        return json({ error: `A integra\xE7\xE3o OAuth do Melhor Envio ainda n\xE3o foi ativada no D1. Aplique a migration 011_melhor_envio_oauth.sql. Detalhe: ${message}` }, 500);
      }
      if (message.includes("no such table: landing_pages") || message.includes("no such table: site_settings") || message.includes("no such table: checkout_sessions")) {
        return json({ error: `O m\xF3dulo de p\xE1ginas de venda ainda n\xE3o foi ativado no D1. Aplique a migration 006_landing_pages.sql. Detalhe: ${message}` }, 500);
      }
      if (message.includes("no such column") || message.includes("has no column named")) {
        return json({ error: `O banco da Biblioteca est\xE1 desatualizado. Verifique as migrations do D1. Detalhe: ${message}` }, 500);
      }
      return json({ error: message }, 500);
    }
  }};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map