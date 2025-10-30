(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $('.fixed-top').css('top', $('.top-bar').height());
    $(window).scroll(function () {
        if ($(this).scrollTop()) {
            $('.fixed-top').addClass('bg-dark').css('top', 0);
        } else {
            $('.fixed-top').removeClass('bg-dark').css('top', $('.top-bar').height());
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1500,
        loop: true,
        nav: true,
        dots: false,
        items: 1,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: false,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });

    
})(jQuery);


    // contoh produk — sesuaikan katalog kamu
const PRODUCTS = [
  {id:'R001',title:'Roti Pia Susu',price:25000,img:'img/Roti Pia Susu new.jpg'},
  {id:'R002',title:'Roti Wijen (6 pcs)',price:5000,img:'img/Roti Wijen new.jpg'},
  {id:'R003',title:'Roti Klemben (4 pcs)',price:15000,img:'img/Roti Klemben new.jpg'},
  {id:'R004',title:'Onde-onde Ketawa',price:25000,img:'img/onde onde ketawa new.jpg'},
  {id:'R005',title:'Roti Marie Kelapa',price:25000,img:'img/Roti Marie Kelapa new.jpg'}
];

let cart = {};

const rupiah = n => 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const productsContainer = document.getElementById('productsContainer');
const cartList = document.getElementById('cartList');
const subtotalEl = document.getElementById('subtotal');
const cartCountEl = document.getElementById('cartCount');

function renderProducts(){
  productsContainer.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const c = document.createElement('div'); c.className='card';
    c.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h4>${p.title}</h4>
      <div class="price">${rupiah(p.price)}</div>
      <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
        <button class="btn btn-outline" data-action="dec" data-id="${p.id}">-</button>
        <div id="count-${p.id}" style="min-width:26px;text-align:center">0</div>
        <button class="btn btn-primary" data-action="inc" data-id="${p.id}">+</button>
      </div>
    `;
    productsContainer.appendChild(c);
  });
}

function renderCart(){
  const keys = Object.keys(cart);
  if(keys.length===0){
    cartList.innerHTML='Keranjang kosong';
    subtotalEl.textContent='Rp 0';
    cartCountEl.textContent='0';
    PRODUCTS.forEach(p=>{
      const el = document.getElementById('count-'+p.id);
      if(el) el.textContent='0';
    });
    return;
  }
  cartList.innerHTML = '';
  let sub=0, totalItems=0;
  keys.forEach(k=>{
    const it = cart[k];
    sub += it.price * it.qty;
    totalItems += it.qty;
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.marginBottom = '6px';
    row.innerHTML = `<div>${it.title} <small>(${it.qty})</small></div><div>${rupiah(it.price*it.qty)}</div>`;
    cartList.appendChild(row);
  });
  subtotalEl.textContent = rupiah(sub);
  cartCountEl.textContent = totalItems;
  PRODUCTS.forEach(p=>{
    const el = document.getElementById('count-'+p.id);
    if(el) el.textContent = cart[p.id] ? cart[p.id].qty : '0';
  });
}

function changeQty(id, delta){
  const prod = PRODUCTS.find(p=>p.id===id);
  if(!prod) return;
  if(!cart[id]){
    if(delta<=0) return;
    cart[id] = {...prod, qty:0};
  }
  cart[id].qty += delta;
  if(cart[id].qty <= 0) delete cart[id];
  localStorage.setItem('roti515_cart', JSON.stringify(cart));
  renderCart();
}

function loadCart(){
  try{
    const raw = localStorage.getItem('roti515_cart');
    if(raw) cart = JSON.parse(raw);
  }catch(e){cart={}}
}

document.addEventListener('click', e=>{
  const act = e.target.dataset.action;
  const id = e.target.dataset.id;
  if(!act) return;
  if(act === 'inc') changeQty(id, +1);
  if(act === 'dec') changeQty(id, -1);
});

document.getElementById('checkoutBtn').addEventListener('click', ()=>{
  if(Object.keys(cart).length === 0) return alert('Keranjang kosong');
  let msg = 'Pesanan:\n';
  let total=0;
  Object.keys(cart).forEach(k=>{
    msg += `${cart[k].title} x${cart[k].qty} = ${rupiah(cart[k].price*cart[k].qty)}\n`;
    total += cart[k].price*cart[k].qty;
  });
  msg += `Total: ${rupiah(total)}`;
  alert(msg);
});

loadCart();
renderProducts();
renderCart();
