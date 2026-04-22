import { useState, useEffect, useCallback, useRef } from "react";
import './styles.css';
import { buildMapHTML } from './map.js';

/* ══════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════ */
const ADMIN_PHONE = "919751789854";
const ADMIN_PHONE2 = "919159192568";
const ADMIN_EMAIL = "silambuvasantha@gmail.com";
const ADMIN_NAME  = "RVS Catering Service";
const ADMIN_ADDRESS = "Melaperumpallam, Karuvi, Tamil Nadu 609107";
const BUSINESS_HOURS = "7AM – 10PM Daily";

/* ══════════════════════════════════════════════════════════════
   TRANSLATIONS
══════════════════════════════════════════════════════════════ */
const T = {
  en:{
    brand:"RVS",sub:"Catering Service",tagline:"1000+ Events Served · தமிழ் பாரம்பரிய சமையல்",
    h1a:"Serving Tradition",h1b:"With Heart & Soul",
    hdesc:"From sacred Karumathi to grand Kalyanam — every Tamil function catered with devotion, purity and authentic flavour.",
    bookNow:"Book Your Event",exploreMenu:"View Menu",
    nav:{home:"Home",services:"Services",menu:"Menu",booking:"Booking",reviews:"Reviews",contact:"Contact"},
    svcLbl:"Our Services",svcTitle:"Tamil Celebration Catering",svcSub:"Every ceremony served with generational recipes and heartfelt care.",
    menuLbl:"Food Menu",menuTitle:"Traditional Tamil Cuisine",menuSub:"Banana-leaf meals to grand feasts — authentic recipes preserved with love.",
    bookLbl:"Reserve",bookTitle:"Book Your Occasion",bookSub:"Select date, optional time, your details — owner contacts you on pricing.",
    rvwLbl:"Reviews",rvwTitle:"What Families Say",rvwSub:"Real stories from Tamil Nadu celebrations.",
    ctcLbl:"Contact",ctcTitle:"Let's Plan Together",ctcSub:"Call us or message — we'll work out the perfect menu and price for you.",
    step1:"Select Date",step2:"Time (Optional)",step3:"Your Details",
    name:"Full Name",phone:"Phone Number",address:"Venue / Address",
    func:"Function Type",notes:"Special Requests",guests:"No. of Guests",
    food:"Food Type",veg:"Vegetarian Only",nonveg:"Non-Vegetarian",both:"Both Veg + Non-Veg",
    confirm:"Send Booking Request",confirmed:"Booking Request Sent!",
    confirmedSub:"Owner will contact you within 24 hours to discuss menu, pricing and confirmation.",
    skipTime:"Skip — I'm flexible",contactPrice:"Contact for Price",
    pending:"Pending",approved:"Approved",completed:"Completed",rejected:"Rejected",
    admin:"Admin",dashboard:"Dashboard",myBookings:"My Bookings",
    signIn:"Sign In",logout:"Logout",register:"Register",
    writeReview:"Write a Review",submitReview:"Submit",
    approve:"Approve",reject:"Reject",markDone:"Mark Done",
    call:"Call",sendMsg:"Send Message",
    adminHint:"Admin: silambuvasantha@gmail.com",
    vegFoods:"Vegetarian Items",nonvegFoods:"Non-Veg Items",
    noTime:"Flexible",
    statusNote:{
      Pending:"Your booking is under review. Owner will contact you soon.",
      Approved:"✅ Confirmed! Owner will reach you for menu & pricing.",
      Rejected:"❌ Unavailable on this date. Please rebook.",
      Completed:"🎊 Event completed. Thank you for choosing RVS!",
    },
    notif:{
      title:"Notifications",markAll:"Mark all read",clear:"Clear all",empty:"No notifications yet",
      newBk:"New Booking Request",approved:"Booking Approved ✅",rejected:"Booking Rejected ❌",completed:"Event Completed 🎊",
      sendWa:"WhatsApp",sendSms:"SMS",callNow:"Call",
      forAdmin:"(Admin)",forClient:"(Client)",
      waNote:"Opens WhatsApp with pre-filled message",
      smsNote:"Opens SMS app with pre-filled message",
      tabAll:"All",tabUnread:"Unread",tabAdmin:"Admin",tabClient:"Client",
    },
    ticker:"🌿 Authentic Tamil Nadu Catering · Since 2019 · All Auspicious Occasions 🌸 Kalyanam · Karumathi · Valaikappu · Pongal · Seemantham 🍛",
    fdesc:"Bringing the soul of Tamil Nadu cooking to your most cherished celebrations since 2019.",
  },
  ta:{
    brand:"ஆர்.வி.ஸ்",sub:"கேட்டரிங் சர்விஸ்",tagline:"1000+ கொண்டாட்டங்கள் · பொது பாரம்பரிய சமையல்",
    h1a:"பாரம்பரியத்தை",h1b:"அன்போடு பரிமாறுகிறோம்",
    hdesc:"கருமாதி முதல் கல்யாணம் வரை — ஒவ்வொரு தமிழ் நிகழ்வையும் அர்ப்பணிப்போடும் தூய்மையோடும் சமைக்கிறோம்.",
    bookNow:"இப்போதே முன்பதிவு செய்க",exploreMenu:"உணவு பட்டியல்",
    nav:{home:"முகப்பு",services:"சேவைகள்",menu:"உணவகம்",booking:"முன்பதிவு",reviews:"மதிப்புரை",contact:"தொடர்பு"},
    svcLbl:"எங்கள் சேவைகள்",svcTitle:"தமிழ் விழா உணவு சேவை",svcSub:"ஒவ்வொரு சடங்கும் — தலைமுறைகளாக வந்த சமையல் முறையில் அன்போடு பரிமாறப்படும்.",
    menuLbl:"உணவு பட்டியல்",menuTitle:"தமிழ் பாரம்பரிய உணவுகள்",menuSub:"வாழை இலை சாப்பாடு முதல் பெரிய விருந்து வரை — தமிழ் சுவையை காப்பாற்றுகிறோம்.",
    bookLbl:"முன்பதிவு",bookTitle:"உங்கள் நிகழ்வை முன்பதிவு செய்க",bookSub:"தேதி, விருப்பமான நேரம், விவரங்கள் — உரிமையாளர் விலை பேசி உறுதிப்படுத்துவார்.",
    rvwLbl:"மதிப்புரைகள்",rvwTitle:"குடும்பங்கள் என்ன சொல்கிறார்கள்",rvwSub:"தமிழ்நாட்டு விழாக்களிலிருந்து உண்மையான கதைகள்.",
    ctcLbl:"தொடர்பு",ctcTitle:"சேர்ந்து திட்டமிடலாம்",ctcSub:"அழையுங்கள் அல்லது செய்தி அனுப்புங்கள் — உங்களுக்கு ஏற்ற மெனு மற்றும் விலை பேசுவோம்.",
    step1:"தேதி தேர்க",step2:"நேரம் (விருப்பமானால்)",step3:"விவரங்கள்",
    name:"முழு பெயர்",phone:"தொலைபேசி எண்",address:"நிகழ்வு இடம் / முகவரி",
    func:"நிகழ்வு வகை",notes:"கூடுதல் கோரிக்கைகள்",guests:"விருந்தினர் எண்ணிக்கை",
    food:"உணவு வகை",veg:"சைவம் மட்டும்",nonveg:"அசைவம்",both:"இரண்டும் (சைவம் + அசைவம்)",
    confirm:"முன்பதிவு கோரிக்கை அனுப்புக",confirmed:"முன்பதிவு கோரிக்கை அனுப்பப்பட்டது!",
    confirmedSub:"உரிமையாளர் 24 மணி நேரத்தில் மெனு, விலை மற்றும் உறுதிப்படுத்தலுக்கு தொடர்பு கொள்வார்.",
    skipTime:"தவிர் — நேரம் நெகிழ்வானது",contactPrice:"விலைக்கு தொடர்பு",
    pending:"நிலுவையில்",approved:"அங்கீகரிக்கப்பட்டது",completed:"நிறைவுற்றது",rejected:"நிராகரிக்கப்பட்டது",
    admin:"நிர்வாகி",dashboard:"கட்டுப்பாட்டு பலகை",myBookings:"என் முன்பதிவுகள்",
    signIn:"உள்நுழைக",logout:"வெளியேறு",register:"பதிவு செய்க",
    writeReview:"மதிப்புரை எழுதுக",submitReview:"சமர்ப்பிக்க",
    approve:"அங்கீகரிக்க",reject:"நிராகரிக்க",markDone:"முடிந்தது",
    call:"அழைக்க",sendMsg:"செய்தி அனுப்ப",
    adminHint:"நிர்வாகி: silambuvasantha@gmail.com",
    vegFoods:"சைவ உணவுகள்",nonvegFoods:"அசைவ உணவுகள்",
    noTime:"நெகிழ்வான நேரம்",
    statusNote:{
      Pending:"உங்கள் முன்பதிவு பரிசீலனையில் உள்ளது. உரிமையாளர் விரைவில் தொடர்பு கொள்வார்.",
      Approved:"✅ உறுதிப்பட்டது! மெனு & விலைக்கு உரிமையாளர் தொடர்பு கொள்வார்.",
      Rejected:"❌ இந்த தேதியில் இல்லை. மீண்டும் முன்பதிவு செய்யவும்.",
      Completed:"🎊 நிகழ்வு முடிந்தது. சேவர்கிராஃப்ட் தேர்ந்தெடுத்தமைக்கு நன்றி!",
    },
    notif:{
      title:"அறிவிப்புகள்",markAll:"அனைத்தும் படித்தது",clear:"அனைத்தும் அழி",empty:"இன்னும் அறிவிப்புகள் இல்லை",
      newBk:"புதிய முன்பதிவு கோரிக்கை",approved:"முன்பதிவு அங்கீகரிக்கப்பட்டது ✅",rejected:"முன்பதிவு நிராகரிக்கப்பட்டது ❌",completed:"நிகழ்வு நிறைவுற்றது 🎊",
      sendWa:"WhatsApp",sendSms:"SMS",callNow:"அழைக்க",
      forAdmin:"(நிர்வாகி)",forClient:"(வாடிக்கையாளர்)",
      waNote:"WhatsApp-ல் செய்தி அனுப்பும்",
      smsNote:"SMS செய்தி அனுப்பும்",
      tabAll:"அனைத்தும்",tabUnread:"படிக்காதவை",tabAdmin:"நிர்வாகி",tabClient:"வாடிக்கையாளர்",
    },
    ticker:"🌿 உண்மையான தமிழ்நாடு சமையல் · 2019 முதல் · அனைத்து நல்ல நிகழ்வுகளுக்கும் 🌸 கல்யாணம் · கருமாதி · வளைகாப்பு · பொங்கல் · சீமந்தம் 🍛",
    fdesc:"2019 முதல் தமிழ்நாட்டின் சமையல் ஆத்மாவை உங்கள் விழாக்களுக்கு கொண்டு வருகிறோம்.",
  }
};

/* ══════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════ */
const FUNCTIONS=[
  {id:"kalyanam",  icon:"💍",en:"Kalyanam (Wedding)",        ta:"கல்யாணம்",       col:"#E8871A",den:"Grand Tamil wedding, banana-leaf feast.",dta:"வாழை இலை சாப்பாட்டுடன் பெரிய கல்யாணம்."},
  {id:"birthday",  icon:"🎂",en:"Birthday (பிறந்தநாள்)",    ta:"பிறந்தநாள்",      col:"#D4AC0D",den:"Tamil birthday with sweets & feast.",dta:"இனிப்பு, நாஸ்தா, விருந்துடன் பிறந்தநாள்."},
  {id:"karumathi", icon:"🪔",en:"Karumathi (Funeral Rites)", ta:"கருமாதி",          col:"#6B7280",den:"Pure vegetarian, respectful spread.",dta:"மரியாதையுடன் தூய சைவ உணவு."},
  {id:"valaikappu",icon:"🌸",en:"Valaikappu (Baby Shower)",  ta:"வளைகாப்பு",        col:"#EC407A",den:"Auspicious ceremony with sweets.",dta:"சிறப்பு இனிப்புகளுடன் வளைகாப்பு."},
  {id:"seemantham",icon:"🌺",en:"Seemantham",                 ta:"சீமந்தம்",         col:"#AB47BC",den:"Traditional ceremony with prasadam.",dta:"பாரம்பரிய சீமந்தம் சடங்கு உணவு."},
  {id:"namakaranam",icon:"👶",en:"Namakaranam (Naming)",      ta:"நாமகரணம்",        col:"#26A69A",den:"Sweet naming ceremony spread.",dta:"பெயர் வைப்பு விழா சமையல்."},
  {id:"griha",     icon:"🏠",en:"Grihapravesam",              ta:"கிரஹப்பிரவேசம்",  col:"#FF7043",den:"Housewarming with Pongal & payasam.",dta:"பொங்கல், பாயசம் உடன் வீட்டுப்பிரவேசம்."},
  {id:"poonool",   icon:"🧵",en:"Poonool (Thread Ceremony)",  ta:"பூணூல்",           col:"#5C6BC0",den:"Sacred Upanayanam pure veg spread.",dta:"புனிதமான பூணூல் விழா சமையல்."},
  {id:"reception", icon:"💒",en:"Reception (வரவேற்பு)",       ta:"திருமண வரவேற்பு", col:"#F06292",den:"Elegant wedding reception dinner.",dta:"நேர்த்தியான திருமண வரவேற்பு."},
  {id:"pongal",    icon:"🌾",en:"Pongal Festival",             ta:"பொங்கல் விழா",    col:"#8BC34A",den:"Sweet & savoury pongal festival.",dta:"சக்கரை பொங்கல் உடன் பண்டிகை."},
  {id:"deepavali", icon:"✨",en:"Deepavali / Diwali",          ta:"தீபாவளி விழா",    col:"#FFB300",den:"Festival feast with sweets & snacks.",dta:"இனிப்பு, நாஸ்தா, பண்டிகை விருந்து."},
  {id:"corporate", icon:"💼",en:"Corporate Events",            ta:"கார்ப்பரேட் நிகழ்வு",col:"#1976D2",den:"Professional South Indian lunch.",dta:"தொழில்முறை தமிழ் உணவு."},
];
const MENU={
  veg:[
    {ne:"Banana Leaf Meal",nt:"வாழை இலை சாப்பாடு",e:"🍃",tag:"⭐ Signature"},
    {ne:"Sambar Rice",nt:"சாம்பார் சாதம்",e:"🍲",tag:"Classic"},
    {ne:"Rasam",nt:"ரசம்",e:"🥣",tag:"Must Try"},
    {ne:"Sweet Pongal",nt:"சக்கரை பொங்கல்",e:"🍮",tag:"Festival"},
    {ne:"Avial",nt:"அவியல்",e:"🥗",tag:""},
    {ne:"Puliodharai",nt:"புளியோதரை",e:"🍱",tag:"Temple Style"},
    {ne:"Kootu",nt:"கூட்டு",e:"🍛",tag:""},
    {ne:"Mor Kuzhambu",nt:"மோர் குழம்பு",e:"🫕",tag:""},
    {ne:"Payasam",nt:"பாயசம்",e:"🍬",tag:"Sweet"},
    {ne:"Vada",nt:"வடை",e:"🥏",tag:""},
    {ne:"Adai",nt:"அடை",e:"🥞",tag:"Breakfast"},
    {ne:"Lemon Rice",nt:"எலுமிச்சை சாதம்",e:"🍚",tag:""},
  ],
  nonveg:[
    {ne:"Chicken Biryani",nt:"சிக்கன் பிரியாணி",e:"🍗",tag:"⭐ Best Seller"},
    {ne:"Mutton Biryani",nt:"மட்டன் பிரியாணி",e:"🥩",tag:"Premium"},
    {ne:"Chettinad Chicken",nt:"செட்டிநாடு சிக்கன்",e:"🍖",tag:"Chettinad"},
    {ne:"Fish Curry",nt:"மீன் கறி",e:"🐟",tag:"Coastal"},
    {ne:"Mutton Curry",nt:"மட்டன் கறி",e:"🥘",tag:""},
    {ne:"Goat Leg Soup",nt:"ஆட்டுக்கால் சூப்",e:"🍵",tag:"Traditional"},
    {ne:"Kothu Parotta",nt:"கொத்து பரோட்டா",e:"🫔",tag:"Street Style"},
    {ne:"Prawn Masala",nt:"இறால் மசாலா",e:"🦐",tag:"Coastal"},
    {ne:"Egg Curry",nt:"முட்டை கறி",e:"🥚",tag:""},
    {ne:"Liver Fry",nt:"ஈரல் வறுவல்",e:"🫕",tag:""},
  ]
};
const TIME_SLOTS=["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];

/* ══════════════════════════════════════════════════════════════
   LOCAL DB
══════════════════════════════════════════════════════════════ */
const DB={
  get:k=>{try{return JSON.parse(localStorage.getItem(k))||[]}catch{return[]}},
  set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),
  obj:k=>{try{return JSON.parse(localStorage.getItem(k))||{}}catch{return{}}},
};
const initDB=()=>{
  if(localStorage.getItem("tc3"))return;
  DB.set("tc_bk",[]);
  DB.set("tc_rv",[
    {id:"r1",name:"Meenakshi Sundaram",rating:5,text:"கல்யாணத்தில் வாழை இலை சாப்பாடு அருமையாக இருந்தது! The banana leaf spread was divine — every guest praised it!",avatar:"MS",date:"2025-03-20"},
    {id:"r2",name:"Selvakumar P",rating:5,text:"Karumathi handled with great respect. Pure, traditional and tasteful. மிகவும் நல்லாக நடத்தினார்கள்.",avatar:"SP",date:"2025-04-02"},
    {id:"r3",name:"Bharathi Devi",rating:4,text:"Pongal festival catering was superb! Sakkarai pongal tasted like grandmother's recipe. பாரம்பரிய சுவை!",avatar:"BD",date:"2025-04-10"},
    {id:"r4",name:"Murugan K",rating:5,text:"Ambur biryani for my son's birthday was outstanding — authentic flavour! பிரியாணி சுவை அருமை!",avatar:"MK",date:"2025-04-18"},
  ]);
  DB.set("tc_users",[
    {id:"u_admin",name:"Admin",email:"silambuvasantha@gmail.com",password:"admin123",role:"admin"},
  ]);
  DB.set("tc_slots",{blocked:[]});
  DB.set("tc_notifs",[]);
  localStorage.setItem("tc3","1");
};

/* ══════════════════════════════════════════════════════════════
   NOTIFICATION MESSAGES (WhatsApp & SMS templates)
══════════════════════════════════════════════════════════════ */
function buildWAMsg(type, data, lang){
  const isTa = lang==="ta";
  const fn = FUNCTIONS.find(f=>f.id===data.func);
  const fnName = fn ? (isTa?fn.ta:fn.en) : data.func;
  const divider = "━━━━━━━━━━━━━━━━━━━━";
  const brand = "RVS Catering Service\n+91 97517 89854";

  if(type==="new"){
    return isTa
      ? "*புதிய முன்பதிவு!*\n" + divider + "\nவணக்கம் " + data.name + ",\nஉங்களுக்கு ஒரு புதிய " + fnName + " முன்பதிவு கோரிக்கை வந்துள்ளது.\n\nID: " + data.bkId + " \nதேதி: " + data.date + " \nநேரம்: " + (data.time || "நெகிழ்வானது") + " \n\n" + divider + " \nஉடனே விலை, மெனு மற்றும் உறுதிப்படுத்தலுக்கு தொடர்பு கொள்கிறோம்.\n" + brand
      : "*New Booking Request!*\n" + divider + "\nHello " + data.name + ",\nA new " + fnName + " booking request has arrived.\n\nID: " + data.bkId + " \nDate: " + data.date + " \nTime: " + (data.time || "Flexible") + " \n\n" + divider + " \nWe will contact you soon for pricing, menu and confirmation.\n" + brand;
  }
  if(type==="approved"){
    return isTa
      ? "* Booking Confirmed! *\n" + divider + "\nHi " + data.name + " !\nYour " + fnName + " booking has been approved.\n\nID: " + data.bkId + " \nDate: " + data.date + " \nTime: " + (data.time || "Flexible") + " \n\n" + divider + " \nWe'll contact you soon for pricing & menu.\n" + brand
      : "* Booking Confirmed! *\n" + divider + "\nHi " + data.name + " !\nYour " + fnName + " booking has been approved.\n\nID: " + data.bkId + " \nDate: " + data.date + " \nTime: " + (data.time || "Flexible") + " \n\n" + divider + " \nWe'll contact you soon for pricing & menu.\n" + brand;
  }
if (type === "rejected") {
  return isTa
    ? "*Booking Could Not Be Confirmed*\n" + divider + "\nHi " + data.name + ",\nSorry, we're unavailable on " + data.date + " for " + fnName + ".\n\n" + divider + "\nPlease choose another date and rebook.\n" + brand
    : "*Booking Could Not Be Confirmed*\n" + divider + "\nHi " + data.name + ",\nSorry, we're unavailable on " + data.date + " for " + fnName + ".\n\n" + divider + "\nPlease choose another date and rebook.\n" + brand;
}
if (type === "completed") {
  return isTa
    ? "*Event Successfully Completed!*\n" + divider + "\nDear " + data.name + ", your " + fnName + " event was a great success!\n\nPlease share your experience with us\n\n" + divider + "\nThank you for choosing RVS!\n" + brand
    : "*Event Successfully Completed!*\n" + divider + "\nDear " + data.name + ", your " + fnName + " event was a great success!\n\nPlease share your experience with us\n\n" + divider + "\nThank you for choosing RVS!\n" + brand;
}
return "";
}

function waLink(phone, msg) {
  const p = phone.replace(/\D/g, "");
  const fullP = p.startsWith("91") ? p : "91" + p;
  return "https://wa.me/" + fullP + "?text=" + encodeURIComponent(msg);
}
function smsLink(phone, msg) {
  const p = phone.replace(/\D/g, "");
  const fullP = p.startsWith("91") ? "+" + p : "+91" + p;
  return "sms:" + fullP + "?body=" + encodeURIComponent(msg);
}
function exportToExcel(bookings, lang) {
  const isTa = lang === "ta";
  const headers = isTa ? ["ID", "பெயர்", "தொலைபேசி", "நிகழ்வு", "தேதி", "நேரம்", "விருந்தினர்", "உணவு", "முகவரி", "நிலை", "உருவாக்கப்பட்டது"] : ["ID", "Name", "Phone", "Function", "Date", "Time", "Guests", "Food", "Address", "Status", "Created"];
  const rows = bookings.map(b => {
    const fn = FUNCTIONS.find(f => f.id === b.func);
    return [
      b.id,
      b.name,
      b.phone,
      isTa ? fn?.ta : fn?.en,
      b.date,
      b.time || (isTa ? "நெகிழ்வான" : "Flexible"),
      b.guests,
      b.food === "veg" ? (isTa ? "சைவம்" : "Veg") : b.food === "nonveg" ? (isTa ? "அசைவம்" : "Non-Veg") : (isTa ? "இரண்டும்" : "Both"),
      b.address,
      b.status,
      new Date(b.created).toLocaleDateString()
    ];
  });
  const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `RVS_Bookings_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function pushNotif(notif) {
  const list = DB.get("tc_notifs");
  DB.set("tc_notifs", [{ ...notif, id: "n" + Date.now(), created: new Date().toISOString(), read: false }, ...list]);
}

/* ══════════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════════ */
let _toast = null;
function useToasts() {
  const [ts, setTs] = useState([]);
  _toast = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setTs(t => [...t, { id, msg, type }]);
    setTimeout(() => setTs(t => t.filter(x => x.id !== id)), 3800);
  }, []);
  return ts;
}
const toast = (m, t) => _toast && _toast(m, t);

/* ══════════════════════════════════════════════════════════════
   REUSABLES
══════════════════════════════════════════════════════════════ */
function Particles() {
  const ps = [{ e: "🌸", l: "8%", t: "15%", s: 18, o: .05, d: 0 }, { e: "🪔", l: "82%", t: "20%", s: 22, o: .04, d: .6 }, { e: "🌿", l: "45%", t: "8%", s: 14, o: .06, d: 1.2 }, { e: "🌺", l: "70%", t: "70%", s: 20, o: .04, d: .4 }, { e: "✨", l: "20%", t: "75%", s: 16, o: .05, d: .8 }, { e: "🍃", l: "90%", t: "45%", s: 18, o: .04, d: 1.4 }, { e: "🌾", l: "5%", t: "55%", s: 20, o: .04, d: 1.8 }, { e: "🎊", l: "60%", t: "85%", s: 15, o: .04, d: .2 }];
  return <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>{ps.map((p, i) => <span key={i} style={{ position: "absolute", left: p.l, top: p.t, fontSize: p.s, opacity: p.o, animation: "float " + (4 + i * .5) + "s ease-in-out infinite", animationDelay: p.d + "s" }}>{p.e}</span>)}</div>;
}
function Kolam({ size = 56, style = {} }) {
  return <div style={{ width: size, height: size, position: "relative", ...style }}>{[0, 1, 2].map(i => <div key={i} style={{ position: "absolute", inset: i * 7, borderRadius: "50%", border: "1.5px solid rgba(232,135,26," + (.35 - i * .08) + ")", animation: "kolam " + (6 + i * 2.5) + "s linear infinite " + (i % 2 ? "reverse" : "") }} />)}<div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size / 3.5 }}>🌸</div></div>;
}
function SecHead({ label, title, sub, lang }) {
  const isTa = lang === "ta";
  return (
    <div style={{ textAlign: "center", marginBottom: "clamp(28px,4.5vw,52px)" }}>
      <div style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 3, color: "var(--sf)", textTransform: "uppercase", marginBottom: 12, padding: "5px 15px", background: "rgba(232,135,26,.1)", borderRadius: 20, border: "1px solid rgba(232,135,26,.22)" }}>{label}</div>
      <h2 className={isTa ? "ta-h en-h" : "en-h"} style={{ fontSize: "clamp(22px,4vw,46px)", fontWeight: 700, lineHeight: 1.2, marginBottom: 12, color: "var(--cr)" }}>{title}</h2>
      {sub && <p className={isTa ? "ta" : ""} style={{ color: "var(--mu)", maxWidth: 480, margin: "0 auto", lineHeight: 1.8, fontSize: "clamp(13px,1.8vw,15px)" }}>{sub}</p>}
    </div>
  );
}
function Card({ children, style = {}, onClick, nohov }) {
  const [h, sH] = useState(false);
  return <div onClick={onClick} onMouseEnter={() => !nohov && sH(true)} onMouseLeave={() => sH(false)} style={{ background: "var(--gl)", backdropFilter: "blur(16px)", border: "1px solid " + (h && !nohov ? "rgba(232,135,26,.28)" : "var(--bd)"), borderRadius: 16, transition: "all .25s", transform: h && onClick ? "translateY(-3px)" : "none", boxShadow: h && onClick ? "0 10px 36px rgba(0,0,0,.35)" : "none", cursor: onClick ? "pointer" : "default", ...style }}>{children}</div>;
}
function Btn({ children, onClick, style = {}, disabled, sz = "md", v = "solid", lang }) {
  const [h, sH] = useState(false);
  const ps = { sm: { p: "7px 15px", fs: 12 }, md: { p: "11px 22px", fs: 13.5 }, lg: { p: "13px 30px", fs: 15 } }[sz];
  const isTa = lang === "ta";
  return <button disabled={disabled} onClick={!disabled ? onClick : undefined} onMouseEnter={() => sH(true)} onMouseLeave={() => sH(false)} className={isTa ? "ta" : ""} style={{ padding: ps.p, fontSize: ps.fs, fontWeight: 700, borderRadius: 9, letterSpacing: .4, fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif", border: v === "out" ? "2px solid var(--sf)" : "none", background: disabled ? "rgba(255,255,255,.07)" : v === "out" ? (h ? "var(--sf)" : "transparent") : h ? "var(--sf3)" : "var(--sf)", color: disabled ? "var(--mu)" : v === "out" ? (h ? "var(--dk)" : "var(--sf)") : "var(--dk)", transform: h && !disabled ? "translateY(-2px)" : "none", boxShadow: h && !disabled ? "0 7px 20px rgba(232,135,26,.35)" : "none", transition: "all .2s", cursor: disabled ? "not-allowed" : "pointer", ...style }}>{children}</button>;
}
function Inp({ label, type = "text", value, onChange, ph, opts, req, icon, lang }) {
  const [f, sF] = useState(false);
  const isTa = lang === "ta";
  const fc = isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif";
  const base = { width: "100%", padding: "11px 13px", paddingLeft: icon ? 43 : 13, background: "rgba(255,255,255,.04)", border: "1.5px solid " + (f ? "var(--sf)" : "rgba(255,255,255,.09)"), borderRadius: 9, color: "var(--cr)", fontSize: 13.5, fontFamily: fc, transition: "border .18s", appearance: "none", outline: "none" };
  return (
    <div style={{ marginBottom: 15 }}>
      <label className={isTa ? "ta" : ""} style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: .8, color: "var(--sf)", marginBottom: 6, textTransform: "uppercase" }}>{label}{req && <span style={{ color: "var(--vr)", marginLeft: 3 }}>*</span>}</label>
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 15, opacity: .5, pointerEvents: "none" }}>{icon}</span>}
        {type === "textarea" ? <textarea className={isTa ? "ta" : ""} value={value} onChange={e => onChange(e.target.value)} placeholder={ph} style={{ ...base, resize: "vertical", minHeight: 78 }} onFocus={() => sF(true)} onBlur={() => sF(false)} />
          : type === "select" ? <select className={(isTa ? "ta " : "") + "dark-select"} value={value} onChange={e => onChange(e.target.value)} style={{ ...base, cursor: "pointer", color: "#FDF3E7", background: "#1E0C00" }} onFocus={() => sF(true)} onBlur={() => sF(false)}><option value="" style={{ color: "#999", background: "#1E0C00" }}>{isTa ? "தேர்ந்தெடுக்கவும்..." : "Select..."}</option>{opts.map(([v, l]) => <option key={v} value={v} style={{ backgroundColor: "#1E0C00", color: "#FDF3E7" }}>{l}</option>)}</select>
            : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={ph} style={base} onFocus={() => sF(true)} onBlur={() => sF(false)} />}
      </div>
    </div>
  );
}
function Stars({ rating, interactive, onChange }) {
  const [h, sH] = useState(0);
  return <div style={{ display: "flex", gap: 4 }}>{[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 19, cursor: interactive ? "pointer" : "default", color: s <= (h || rating) ? "#F5A623" : "rgba(255,255,255,.18)", transition: "all .14s", transform: h >= s && interactive ? "scale(1.22)" : "scale(1)" }} onMouseEnter={() => interactive && sH(s)} onMouseLeave={() => interactive && sH(0)} onClick={() => interactive && onChange && onChange(s)}>★</span>)}</div>;
}


function MapPicker({ value, onChange, lang }) {
  const isTa = lang === "ta";
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = (e) => { if (e.data && e.data.type === "MAP_ADDR") { onChange(e.data.address); setShow(false); } };
    window.addEventListener("message", fn);
    return () => window.removeEventListener("message", fn);
  }, [onChange]);
  const base = { width: "100%", padding: "11px 13px 11px 40px", background: "rgba(255,255,255,.04)", border: "1.5px solid rgba(255,255,255,.09)", borderRadius: 9, color: "#FDF3E7", fontSize: 13.5, outline: "none", fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif", transition: "border .18s" };
  return (
    <>
      <div style={{ marginBottom: 15 }}>
        <label className={isTa ? "ta" : ""} style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: .8, color: "var(--sf)", marginBottom: 6, textTransform: "uppercase" }}>{isTa ? "நிகழ்வு இடம் / முகவரி" : "Venue / Address"} <span style={{ color: "var(--vr)" }}>*</span></label>
        <div style={{ position: "relative", marginBottom: 8 }}><span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: .5, pointerEvents: "none" }}>📍</span><input value={value} onChange={e => onChange(e.target.value)} placeholder={isTa ? "முகவரி உள்ளிடுக அல்லது கீழே வரைபடத்தில் தேர்க…" : "Type address or pick on map below…"} style={base} onFocus={e => e.target.style.border = "1.5px solid var(--sf)"} onBlur={e => e.target.style.border = "1.5px solid rgba(255,255,255,.09)"} /></div>
        <button onClick={() => setShow(true)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,rgba(232,135,26,.18),rgba(192,57,43,.1))", border: "1.5px solid rgba(232,135,26,.35)", borderRadius: 10, padding: "9px 18px", cursor: "pointer", color: "var(--sf)", fontSize: 13.5, fontWeight: 700, fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif", boxShadow: "0 4px 16px rgba(232,135,26,.15)", transition: "all .2s" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(232,135,26,.28)"; e.currentTarget.style.transform = "translateY(-1px)" }} onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,rgba(232,135,26,.18),rgba(192,57,43,.1))"; e.currentTarget.style.transform = "none" }}>🗺️ {isTa ? "வரைபடத்தில் இடம் தேர்க / GPS" : "Pick on Map / Use GPS"}</button>
        {value && <div style={{ marginTop: 9, display: "flex", alignItems: "flex-start", gap: 6, padding: "8px 12px", background: "rgba(46,125,50,.08)", border: "1px solid rgba(67,160,71,.22)", borderRadius: 8 }}><span style={{ fontSize: 15, flexShrink: 0 }}>📌</span><span className={isTa ? "ta" : ""} style={{ fontSize: 13, color: "#43A047", fontWeight: 600, lineHeight: 1.5 }}>{value}</span><button onClick={() => onChange("")} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(192,57,43,.6)", fontSize: 16, cursor: "pointer", flexShrink: 0, lineHeight: 1 }}>×</button></div>}
      </div>
      {show && (
        <div onClick={e => { if (e.target === e.currentTarget) setShow(false) }} style={{ position: "fixed", inset: 0, zIndex: 9500, background: "rgba(0,0,0,.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(8px,2vw,20px)", animation: "popIn .25s ease" }}>
          <div style={{ width: "100%", maxWidth: 720, height: "clamp(500px,85vh,780px)", background: "#1E0C00", border: "1px solid rgba(232,135,26,.28)", borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,.8)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "13px 18px", flexShrink: 0, borderBottom: "1px solid rgba(232,135,26,.15)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(232,135,26,.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,var(--sf),var(--vr))", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🗺️</div>
                <div><div className={isTa ? "ta-h en-h" : "en-h"} style={{ fontSize: 15, fontWeight: 700, color: "#FDF3E7", lineHeight: 1 }}>{isTa ? "இடம் தேர்க" : "Select Location"}</div><div className={isTa ? "ta" : ""} style={{ fontSize: 11, color: "var(--mu)", marginTop: 2 }}>{isTa ? "கிளிக் செய்க அல்லது GPS பயன்படுத்துக" : "Click map to pin · GPS for current location · Drag to adjust"}</div></div>
              </div>
              <button onClick={() => setShow(false)} style={{ background: "rgba(192,57,43,.15)", border: "1px solid rgba(192,57,43,.3)", color: "#E74C3C", padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>✕ {isTa ? "மூடு" : "Close"}</button>
            </div>
            <iframe title="location-map" srcDoc={buildMapHTML(isTa)} sandbox="allow-scripts allow-same-origin allow-geolocation" style={{ flex: 1, width: "100%", border: "none", display: "block" }} allow="geolocation" />
          </div>
        </div>
      )}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTIFICATION SEND BUTTONS
══════════════════════════════════════════════════════════════ */
function SendButtons({ phone, waMsg, smsMsg, callPhone, lang, compact }) {
  const isTa = lang === "ta";
  const t = T[lang].notif;
  const wa = waLink(phone || ADMIN_PHONE, waMsg);
  const sms = smsLink(phone || ADMIN_PHONE, smsMsg || waMsg);
  const call = "tel:+91" + (callPhone || phone || "9876543210").replace(/\D/g, "");
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: compact ? 6 : 10 }}>
      <a href={wa} target="_blank" rel="noreferrer" className="sb sb-wa" title={t.waNote}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.062.522 4.046 1.535 5.799L0 24l6.345-1.508A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.032-1.374l-.361-.214-3.741.889.935-3.639-.235-.374A9.875 9.875 0 012.118 12C2.118 6.536 6.536 2.118 12 2.118s9.882 4.418 9.882 9.882-4.418 9.882-9.882 9.882z" /></svg>
        {t.sendWa}
      </a>
      <a href={sms} className="sb sb-sms" title={t.smsNote}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" /></svg>
        {t.sendSms}
      </a>
      <a href={call} className="sb sb-call">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
        {t.callNow}
      </a>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTIFICATION DRAWER
══════════════════════════════════════════════════════════════ */
function NotifDrawer({ open, onClose, lang, user }) {
  const isTa = lang === "ta";
  const t = T[lang].notif;
  const [notifs, setNotifs] = useState(() => DB.get("tc_notifs"));
  const [tab, setTab] = useState("all");

  useEffect(() => {
    if (open) setNotifs(DB.get("tc_notifs"));
  }, [open]);

  const markAll = () => {
    const u = notifs.map(n => ({ ...n, read: true }));
    DB.set("tc_notifs", u); setNotifs(u);
  };
  const clearAll = () => {
    DB.set("tc_notifs", []); setNotifs([]);
  };
  const markRead = (id) => {
    const u = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    DB.set("tc_notifs", u); setNotifs(u);
  };

  // filter by tab and user role
  const isAdmin = user?.role === "admin";
  const allBookings = DB.get("tc_bk");
  const filtered = notifs.filter(n => {
    // Admin sees all notifications
    if (isAdmin) {
      if (tab === "unread") return !n.read;
      if (tab === "admin") return n.target === "admin";
      if (tab === "client") return n.target === "client";
      return true;
    } else {
      // Client sees only their own notifications (by booking ownership)
      if (n.target !== "client") return false;
      // Check if this notification's booking belongs to the current user
      const booking = allBookings.find(b => b.id === n.bkId);
      if (!booking || booking.userId !== user?.id) return false;
      if (tab === "unread") return !n.read;
      return true;
    }
  });

  const typeIcon = { new: "🔔", approved: "✅", rejected: "❌", completed: "🎊", reminder: "⏰" };
  const typeClass = { new: "n-new", approved: "n-approved", rejected: "n-rejected", completed: "n-completed", reminder: "n-reminder" };

  if (!open) return null;
  return (
    <>
      <div className="nd-overlay" onClick={onClose} />
      <div className="nd">
        {/* Header */}
        <div className="nd-head">
          <div>
            <div className={isTa ? "ta-h en-h" : "en-h"} style={{ fontSize: 17, fontWeight: 700, color: "var(--cr)" }}>🔔 {t.title}</div>
            <div style={{ fontSize: 11, color: "var(--mu)", marginTop: 2 }}>{notifs.filter(n => !n.read).length} {isTa ? "படிக்காதவை" : "unread"}</div>
          </div>
          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            <button onClick={markAll} className={isTa ? "ta" : ""} style={{ background: "rgba(232,135,26,.1)", border: "1px solid rgba(232,135,26,.22)", color: "var(--sf)", padding: "5px 11px", borderRadius: 7, cursor: "pointer", fontSize: 11.5, fontWeight: 700 }}>{t.markAll}</button>
            <button onClick={clearAll} className={isTa ? "ta" : ""} style={{ background: "rgba(192,57,43,.1)", border: "1px solid rgba(192,57,43,.22)", color: "var(--vr2)", padding: "5px 11px", borderRadius: 7, cursor: "pointer", fontSize: 11.5, fontWeight: 700 }}>{t.clear}</button>
            <button onClick={onClose} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.1)", color: "var(--mu)", padding: "5px 10px", borderRadius: 7, cursor: "pointer", fontSize: 15, fontWeight: 700 }}>✕</button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.06)", flexShrink: 0 }}>
          {isAdmin 
            ? [["all", t.tabAll], ["unread", t.tabUnread], ["admin", t.tabAdmin], ["client", t.tabClient]].map(([id, lbl]) => (
                <button key={id} onClick={() => setTab(id)} className={isTa ? "ta" : ""} style={{ flex: 1, padding: "10px 6px", border: "none", borderBottom: "2.5px solid " + (tab === id ? "var(--sf)" : "transparent"), background: tab === id ? "rgba(232,135,26,.07)" : "transparent", color: tab === id ? "var(--sf)" : "var(--mu)", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .18s", fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif" }}>{lbl}</button>
              ))
            : [["all", t.tabAll], ["unread", t.tabUnread]].map(([id, lbl]) => (
                <button key={id} onClick={() => setTab(id)} className={isTa ? "ta" : ""} style={{ flex: 1, padding: "10px 6px", border: "none", borderBottom: "2.5px solid " + (tab === id ? "var(--sf)" : "transparent"), background: tab === id ? "rgba(232,135,26,.07)" : "transparent", color: tab === id ? "var(--sf)" : "var(--mu)", fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all .18s", fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif" }}>{lbl}</button>
              ))
          }
        </div>

        {/* Notification list */}
        <div className="nd-body">
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px" }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>🔕</div>
              <p className={isTa ? "ta" : ""} style={{ color: "var(--mu)", fontSize: 14 }}>{t.empty}</p>
            </div>
          ) : filtered.map(n => {
            const fn = FUNCTIONS.find(f => f.id === n.func);
            const fnName = fn ? (isTa ? fn.ta : fn.en.split("(")[0].trim()) : "";
            const isAdminNotif = n.target === "admin";
            // Build WA messages for this notification
            const waData = { bkId: n.bkId, name: n.name, phone: n.phone, func: n.func, date: n.date, time: n.time, guests: n.guests, food: n.food, address: n.address, notes: n.notes };
            const waMsgAdmin = buildWAMsg("new", waData, lang);
            const waMsgClient = buildWAMsg(n.type, waData, lang);
            const waMsg = isAdminNotif ? waMsgAdmin : waMsgClient;
            const targetPhone = isAdminNotif ? ADMIN_PHONE : n.phone;
            return (
              <div key={n.id} className={"ni " + (n.read ? "" : "unread") + " " + (typeClass[n.type] || "")} onClick={() => markRead(n.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 9, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: isAdminNotif ? "rgba(232,135,26,.12)" : "rgba(46,125,50,.12)", border: "1px solid " + (isAdminNotif ? "rgba(232,135,26,.25)" : "rgba(67,160,71,.25)"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{typeIcon[n.type] || "Note"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
                        <span className={isTa ? "ta" : ""} style={{ fontWeight: 700, fontSize: 13.5, color: "var(--cr)" }}>{t[n.type] || n.type}</span>
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: isAdminNotif ? "rgba(232,135,26,.12)" : "rgba(67,160,71,.12)", color: isAdminNotif ? "var(--sf)" : "#43A047", fontWeight: 700 }}>{isAdminNotif ? t.forAdmin : t.forClient}</span>
                        {!n.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--sf)", display: "inline-block" }} />}
                      </div>
                      <div className={isTa ? "ta" : ""} style={{ color: "var(--mu)", fontSize: 12.5, lineHeight: 1.6 }}>
                        User {n.name} · {fn?.icon} {fnName}<br />
                        Date {n.date}{(n.time ? " · Time " + n.time : "")}{(n.guests ? " · Guests " + n.guests : "")}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10.5, color: "rgba(255,255,255,.25)", flexShrink: 0, textAlign: "right" }}>
                    {new Date(n.created).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    <div>{new Date(n.created).toLocaleDateString([], { day: "numeric", month: "short" })}</div>
                  </div>
                </div>
                {/* Action buttons */}
                <SendButtons phone={targetPhone} waMsg={waMsg} lang={lang} callPhone={isAdminNotif ? ADMIN_PHONE : n.phone} />
                {/* Preview of WA message */}
                <details style={{ marginTop: 8 }}>
                  <summary className={isTa ? "ta" : ""} style={{ fontSize: 11, color: "rgba(255,255,255,.3)", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>▸</span> {isTa ? "செய்தி முன்னோட்டம்" : "Preview message"}
                  </summary>
                  <div style={{ marginTop: 7, padding: "10px 12px", background: "rgba(37,211,102,.04)", border: "1px solid rgba(37,211,102,.12)", borderRadius: 8, fontSize: 11.5, color: "rgba(255,255,255,.5)", whiteSpace: "pre-wrap", lineHeight: 1.6, maxHeight: 140, overflowY: "auto", fontFamily: "monospace" }}>
                    {waMsg}
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="nd-foot">
          <div style={{ fontSize: 11.5, color: "var(--mu)", lineHeight: 1.7 }} className={isTa ? "ta" : ""}>
            💡 {isTa
              ? "WhatsApp / SMS பொத்தான்களை அழுத்தினால் தொலைபேசி ஆப் திறக்கும். அனுப்பு பொத்தானை அழுத்தவும்."
              : "WhatsApp & SMS buttons open your phone app with a pre-filled message. Just tap Send."}
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTIFICATION BELL (for navbar)
══════════════════════════════════════════════════════════════ */
function NotifBell({ lang, user, open, onToggle }) {
  const [notifs, setNotifs] = useState(() => DB.get("tc_notifs"));
  const unread = notifs.filter(n => !n.read).length;
  // Refresh count when drawer closes
  useEffect(() => { if (!open) setNotifs(DB.get("tc_notifs")); }, [open]);
  return (
    <div className="bell-wrap" onClick={onToggle} title={T[lang].notif.title}>
      {unread > 0 && <div className="bell-pulse" />}
      <div className={"bell-btn" + (unread > 0 ? " has-unread" : "")}>
        <span aria-hidden="true">🔔</span>
        <span className="hm" style={{ fontSize: 11.5, fontWeight: 700, color: unread > 0 ? "var(--sf)" : "var(--mu)" }}>
          {T[lang].notif.title}
        </span>
      </div>
      {unread > 0 && <div className="bell-badge">{unread > 9 ? "9+" : unread}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════ */
function Nav({ pg, setPg, lang, setLang, user, setUser }) {
  const [sc, setSc] = useState(false);
  const [mo, setMo] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const t = T[lang]; const isTa = lang === "ta";
  useEffect(() => { const fn = () => setSc(window.scrollY > 48); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  const navLinks = [["home", t.nav.home], ["services", t.nav.services], ["menu", t.nav.menu], ["booking", t.nav.booking], ["reviews", t.nav.reviews], ["contact", t.nav.contact]];
  const go = (p) => { setPg(p); setMo(false); };
  return (
    <>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, height: 62, display: "flex", alignItems: "center", padding: "0 clamp(12px,4%,40px)", justifyContent: "space-between", background: sc ? "rgba(22,8,0,.97)" : "transparent", backdropFilter: sc ? "blur(20px)" : "none", borderBottom: sc ? "1px solid rgba(232,135,26,.1)" : "none", transition: "all .28s" }}>
        {/* Logo */}
        <div onClick={() => go("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
          <img src="/logo.png" alt="RVS Logo" style={{ width: 40, height: 40, borderRadius: 9, objectFit: "contain" }} />
          <div className="hm"><div className={isTa ? "ta-h en-h" : "en-h"} style={{ fontSize: 16, fontWeight: 700, color: "var(--cr)", lineHeight: 1 }}>{t.brand}</div><div className={isTa ? "ta" : ""} style={{ fontSize: 8.5, color: "var(--sf)", letterSpacing: 1.5, textTransform: "uppercase" }}>{t.sub}</div></div>
        </div>
        {/* Desktop links */}
        <div className="hm" style={{ display: "flex", gap: 3, alignItems: "center", flex: 1, justifyContent: "center", flexWrap: "wrap" }}>
          {navLinks.map(([id, lbl]) => (
            <button key={id} onClick={() => go(id)} className={isTa ? "ta" : ""} style={{ background: pg === id ? "rgba(232,135,26,.13)" : "transparent", border: pg === id ? "1px solid rgba(232,135,26,.28)" : "1px solid transparent", color: pg === id ? "var(--sf)" : "var(--mu)", padding: "4px 11px", borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: "pointer", transition: "all .18s", fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif" }}>{lbl}</button>
          ))}
        </div>
        {/* Right controls */}
        <div style={{ display: "flex", gap: 7, alignItems: "center", flexShrink: 0 }}>
          <div className="lp">{["ta", "en"].map(l => <button key={l} onClick={() => setLang(l)} className={lang === l ? "on" : "off"}>{l === "ta" ? "தமிழ்" : "EN"}</button>)}</div>
          {/* 🔔 Notification Bell - only for logged in users */}
          {user && <NotifBell lang={lang} user={user} open={notifOpen} onToggle={() => setNotifOpen(o => !o)} />}
          {user ? (
            <>
              {user.role === "admin" ? <Btn sz="sm" lang={lang} onClick={() => go("admin")}>{isTa ? "கட்டுப்பாடு" : "Dashboard"}</Btn> : <Btn sz="sm" v="out" lang={lang} onClick={() => go("history")} style={{ display: "none" }} className="hm">{t.myBookings}</Btn>}
              <button onClick={() => { setUser(null); toast(isTa ? "வெளியேறினீர்கள்" : "Logged out", "info"); }} style={{ background: "rgba(192,57,43,.1)", border: "1px solid rgba(192,57,43,.24)", color: "var(--vr2)", padding: "5px 11px", borderRadius: 7, fontSize: 12, cursor: "pointer", fontWeight: 700 }}>{t.logout}</button>
            </>
          ) : <Btn sz="sm" lang={lang} onClick={() => go("auth")}>{t.signIn}</Btn>}
          <button className="sm-show" onClick={() => setMo(m => !m)} style={{ background: "rgba(255,255,255,.05)", border: "1px solid var(--bd)", borderRadius: 7, padding: "7px 10px", cursor: "pointer", color: "var(--cr)", fontSize: 15, display: "none" }}>{mo ? "X" : "Menu"}</button>
        </div>
      </nav>
      {/* Mobile menu */}
      {mo && (
        <div className="sm-show" style={{ position: "fixed", top: 62, left: 0, right: 0, zIndex: 999, background: "rgba(22,8,0,.98)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--bd)", padding: "14px 18px", display: "none", flexDirection: "column", gap: 7 }}>
          {navLinks.map(([id, lbl]) => <button key={id} onClick={() => go(id)} className={isTa ? "ta" : ""} style={{ background: pg === id ? "rgba(232,135,26,.1)" : "transparent", border: "1px solid " + (pg === id ? "rgba(232,135,26,.24)" : "rgba(255,255,255,.06)"), color: pg === id ? "var(--sf)" : "var(--mu)", padding: "9px 13px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", textAlign: "left", fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif" }}>{lbl}</button>)}
          {user && <Btn sz="sm" lang={lang} v="out" onClick={() => go("history")} style={{ textAlign: "left" }}>{t.myBookings}</Btn>}
        </div>
      )}
      {/* Notification drawer */}
      <NotifDrawer open={notifOpen} onClose={() => setNotifOpen(false)} lang={lang} user={user} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════ */
function Hero({ setPg, lang }) {
  const t = T[lang]; const isTa = lang === "ta";
  return (
    <section style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", background: "radial-gradient(ellipse at 20% 50%,rgba(192,57,43,.13) 0%,transparent 58%),radial-gradient(ellipse at 80% 20%,rgba(232,135,26,.08) 0%,transparent 55%),linear-gradient(135deg,#160800 0%,#2D1200 50%,#160800 100%)", overflow: "hidden", paddingTop: 62 }}>
      <Particles />
      <div style={{ position: "absolute", width: "45vw", height: "45vw", maxWidth: 500, maxHeight: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(192,57,43,.09) 0%,transparent 70%)", top: "5%", right: "-5%", pointerEvents: "none" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(20px,5vw,80px)", padding: "clamp(28px,6%,80px) clamp(16px,6%,80px)", alignItems: "center", width: "100%", position: "relative", zIndex: 1, maxWidth: 1260, margin: "0 auto" }} className="g2">
        <div style={{ animation: "fadeUp .7s ease both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(192,57,43,.1)", border: "1px solid rgba(192,57,43,.25)", borderRadius: 20, padding: "5px 15px", fontSize: 11.5, fontWeight: 700, color: "#FF8A80", letterSpacing: 2, textTransform: "uppercase", marginBottom: 22 }}>🌸 {t.tagline}</div>
          <h1 style={{ marginBottom: 20, lineHeight: 1.1 }}>
            <span className={isTa ? "ta-h en-h" : "en-h"} style={{ display: "block", fontSize: "clamp(30px,5vw,68px)", fontWeight: 900, color: "var(--cr)" }}>{t.h1a}</span>
            <span className={isTa ? "ta-h en-h" : "en-h"} style={{ display: "block", fontSize: "clamp(26px,4.5vw,60px)", fontWeight: 900, fontStyle: "italic", background: "linear-gradient(135deg,var(--sf),var(--vr))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t.h1b}</span>
          </h1>
          <p className={isTa ? "ta" : ""} style={{ color: "var(--mu)", fontSize: "clamp(13px,1.8vw,15.5px)", lineHeight: 1.85, marginBottom: 32, maxWidth: 460 }}>{t.hdesc}</p>
          <div style={{ display: "flex", gap: 13, flexWrap: "wrap" }}>
            <Btn sz="lg" lang={lang} onClick={() => setPg("booking")} style={{ animation: "glow 3s infinite" }}>{t.bookNow} →</Btn>
            <Btn sz="lg" v="out" lang={lang} onClick={() => setPg("menu")}>{t.exploreMenu}</Btn>
          </div>
          <div style={{ display: "flex", gap: "clamp(14px,3.5vw,36px)", marginTop: 44, flexWrap: "wrap" }}>
            {[["1000+", isTa ? "விழாக்கள்" : "Events"], ["40+", isTa ? "ஆண்டுகள்" : "Years"], ["100%", isTa ? "மகிழ்ச்சி" : "Happy"]].map(([n, l]) => (
              <div key={l}><div className="en-h" style={{ fontSize: "clamp(20px,3vw,32px)", fontWeight: 800, color: "var(--sf)" }}>{n}</div><div className={isTa ? "ta" : ""} style={{ fontSize: 11.5, color: "var(--mu)", marginTop: 1 }}>{l}</div></div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, animation: "fadeUp .85s ease both" }}>
          {FUNCTIONS.slice(0, 4).map((fn, i) => (
            <Card key={fn.id} style={{ padding: "clamp(14px,2.2vw,24px)", textAlign: "center" }} onClick={() => setPg("booking")}>
              <div style={{ fontSize: "clamp(26px,3.2vw,42px)", marginBottom: 7, animation: "float " + (3.5 + i * .5) + "s ease-in-out infinite", animationDelay: (i * .3) + "s", display: "block" }}>{fn.icon}</div>
              <div className={isTa ? "ta" : ""} style={{ fontSize: "clamp(11px,1.3vw,13px)", fontWeight: 700, color: "var(--cr2)" }}>{isTa ? fn.ta : fn.en.split("(")[0].trim()}</div>
              <div style={{ marginTop: 7 }}><span className="price-badge" style={{ fontSize: 10.5, padding: "3px 9px" }}>{isTa ? "விலை தொடர்பு" : "Contact for Price"}</span></div>
            </Card>
          ))}
          <Card style={{ gridColumn: "1/-1", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, cursor: "default" }} nohov>
            <Kolam size={44} />
            <div><div className={isTa ? "ta-h en-h" : "en-h"} style={{ fontSize: 14, fontWeight: 700, color: "var(--sf)" }}>{isTa ? "வாழை இலை சாப்பாடு" : "Banana Leaf Feast"}</div><div className={isTa ? "ta" : ""} style={{ fontSize: 12, color: "var(--mu)" }}>{isTa ? "பாரம்பரிய தமிழ் விருந்து" : "Traditional Tamil Grand Spread"}</div></div>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   SERVICES
══════════════════════════════════════════════════════════════ */
function Services({ setPg, lang }) {
  const t = T[lang]; const isTa = lang === "ta";
  return (
    <section style={{ padding: "clamp(60px,8vw,100px) clamp(16px,6%,80px)", background: "linear-gradient(180deg,#160800 0%,#2D1200 100%)" }}>
      <SecHead label={t.svcLbl} title={t.svcTitle} sub={t.svcSub} lang={lang} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(clamp(240px,26vw,290px),1fr))", gap: 18 }}>
        {FUNCTIONS.map(fn => (
          <Card key={fn.id} style={{ padding: "clamp(16px,2.2vw,24px)", position: "relative" }} onClick={() => setPg("booking")}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg," + fn.col + ",transparent)", borderRadius: "16px 16px 0 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: "clamp(28px,3.2vw,36px)" }}>{fn.icon}</span>
              <span className="price-badge">{isTa ? "விலை தொடர்பு" : "Contact for Price"}</span>
            </div>
            <h3 className={isTa ? "ta-h" : "en-h"} style={{ fontSize: "clamp(13.5px,1.7vw,16px)", fontWeight: 700, color: "var(--cr)", marginBottom: 7 }}>{isTa ? fn.ta : fn.en}</h3>
            <p className={isTa ? "ta" : ""} style={{ color: "var(--mu)", fontSize: "clamp(11.5px,1.4vw,13px)", lineHeight: 1.72, marginBottom: 14 }}>{isTa ? fn.dta : fn.den}</p>
            <Btn sz="sm" v="out" lang={lang} onClick={e => { e.stopPropagation(); setPg("booking"); }}>{t.bookNow}</Btn>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 40, padding: "20px 24px", background: "rgba(232,135,26,.06)", border: "1px solid rgba(232,135,26,.18)", borderRadius: 14, maxWidth: 640, margin: "40px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 22, marginBottom: 8 }}>💬</div>
        <p className={isTa ? "ta" : ""} style={{ color: "var(--mu)", fontSize: 13.5, lineHeight: 1.8, marginBottom: 14 }}>{isTa ? "விலை நிகழ்வு வகை, விருந்தினர் எண்ணிக்கை, மெனு தேர்வு ஆகியவற்றை பொறுத்து மாறும். முன்பதிவுக்கு பின் உரிமையாளர் தொடர்பு கொள்வார்." : "Pricing depends on function type, guest count & menu. Owner contacts you after your booking request."}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          <a href={waLink(ADMIN_PHONE, "Hello RVS Catering Service, I am interested in your catering services.")} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--sf)", color: "var(--dk)", padding: "8px 18px", borderRadius: 9, fontWeight: 700, fontSize: 13.5, textDecoration: "none" }}>WhatsApp +91 97517 89854</a>
          <a href={"tel:+" + ADMIN_PHONE2} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(192,57,43,.15)", border: "1px solid rgba(192,57,43,.3)", color: "var(--vr2)", padding: "8px 18px", borderRadius: 9, fontWeight: 700, fontSize: 13.5, textDecoration: "none" }}>Call +91 91591 92568</a>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   MENU
══════════════════════════════════════════════════════════════ */
function MenuSec({ lang }) {
  const t = T[lang]; const isTa = lang === "ta";
  const [tab, setTab] = useState("veg");
  return (
    <section style={{ padding: "clamp(60px,8vw,100px) clamp(16px,6%,80px)", background: "#160800" }}>
      <SecHead label={t.menuLbl} title={t.menuTitle} sub={t.menuSub} lang={lang} />
      <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 36, flexWrap: "wrap" }}>
        {[["veg", t.vegFoods, "Veg", "#43A047"], ["nonveg", t.nonvegFoods, "NonVeg", "#C0392B"]].map(([id, lbl, ic, col]) => (
          <button key={id} onClick={() => setTab(id)} className={isTa ? "ta" : ""} style={{ padding: "9px 22px", borderRadius: 28, fontSize: 13.5, fontWeight: 700, cursor: "pointer", background: tab === id ? col + "1E" : "rgba(255,255,255,.04)", border: tab === id ? "1.5px solid " + col + "55" : "1px solid rgba(255,255,255,.08)", color: tab === id ? col : "var(--mu)", transition: "all .2s", fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif", display: "flex", alignItems: "center", gap: 7 }}>
            {ic} {lbl} <span style={{ width: 8, height: 8, borderRadius: "50%", background: col, display: "inline-block" }} />
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(clamp(210px,24vw,270px),1fr))", gap: 14 }}>
        {MENU[tab].map((item, i) => (
          <Card key={i} style={{ padding: "clamp(13px,1.8vw,18px)", display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ fontSize: "clamp(26px,3.2vw,34px)", flexShrink: 0 }}>{item.e}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                <span className={tab === "veg" ? "vd" : "nvd"} />
                {item.tag && <span style={{ fontSize: 9.5, fontWeight: 700, color: "var(--sf)", background: "rgba(232,135,26,.1)", border: "1px solid rgba(232,135,26,.2)", padding: "2px 7px", borderRadius: 10 }}>{item.tag}</span>}
              </div>
              <div className={isTa ? "ta" : ""} style={{ fontWeight: 700, color: "var(--cr)", fontSize: "clamp(12.5px,1.5vw,14.5px)" }}>{isTa ? item.nt : item.ne}</div>
              <div className={isTa ? "ta" : ""} style={{ marginTop: 5, fontSize: 11.5, color: "var(--mu)" }}>📞 {isTa ? "விலைக்கு அழைக்கவும்" : "Price on request"}</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   BOOKING — with notification triggers
══════════════════════════════════════════════════════════════ */
function Booking({ user, lang }) {
  const t = T[lang]; const isTa = lang === "ta";
  const [step, setStep] = useState(1);
  const [mon, setMon] = useState(new Date());
  const [selDate, setDate] = useState(null);
  const [selTime, setTime] = useState(null);
  const [skipTime, setSkipTime] = useState(false);
  const [bks, setBks] = useState(() => DB.get("tc_bk"));
  const [slots] = useState(() => DB.obj("tc_slots"));
  const [confirmed, setConfirmed] = useState(null);
  const [aiTip, setAiTip] = useState(""); const [aiLoad, setAiLoad] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", phone: "", address: "", func: "", food: "veg", guests: "", notes: "" });
  const [photos, setPhotos] = useState([]);
  const [photoPreview, setPhotoPreview] = useState([]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast(isTa ? "அதிகபட்சம் 5 புகைப்படங்கள் மட்டுமே!" : "Maximum 5 photos allowed!", "err");
      return;
    }

    setPhotos(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPhotoPreview(previews);
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = photoPreview.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setPhotoPreview(newPreviews);
  };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yr = mon.getFullYear(); const mo = mon.getMonth();
  const fd = new Date(yr, mo, 1).getDay();
  const dm = new Date(yr, mo + 1, 0).getDate();
  const monLbl = mon.toLocaleString("default", { month: "long", year: "numeric" });
  const isBlocked = (d, tt) => (slots.blocked || []).includes(d + "-" + tt);
  const isBooked = (d, tt) => bks.some(b => b.date === d && b.time === tt && ["Approved", "Pending"].includes(b.status));
  const dayFull = (d) => TIME_SLOTS.every(tt => isBlocked(d, tt) || isBooked(d, tt));
  const dayBusy = (d) => bks.some(b => b.date === d && ["Approved", "Pending"].includes(b.status)) && !dayFull(d);
  const getAvail = (d) => TIME_SLOTS.filter(tt => !isBlocked(d, tt) && !isBooked(d, tt));

  const getAI = async () => {
    if (!selDate) return toast(isTa ? "முதலில் தேதி தேர்க" : "Select a date first", "err");
    setAiLoad(true);
    const avail = getAvail(selDate); const fn = FUNCTIONS.find(f => f.id === form.func);
    try { const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 160, messages: [{ role: "user", content: "Tamil catering planner. Date:" + selDate + ". Available:" + (avail.join(",") || "none") + ". Event:" + (fn?.en || "Tamil event") + ". Guests:~" + (form.guests || 50) + ". Best slot + 1 sentence reason. Format: SLOT: HH:MM | REASON:" }] }) }); const d = await r.json(); setAiTip(d.content[0].text); }
    catch { setAiTip(isTa ? "Tip: மாலை நேரம் (18:00–20:00) தமிழ் விழாக்களுக்கு மிகவும் ஏற்றது!" : "Tip: Evening slots (18:00–20:00) are best for Tamil celebrations!"); }
    setAiLoad(false);
  };

  const confirmBooking = () => {
    if (!form.name || !form.phone || !form.address || !form.func || !form.guests)
      return toast(isTa ? "அனைத்து புலங்களையும் நிரப்பவும்" : "Fill all required fields", "err");
    const bk = {
      id: "BK" + Date.now(),
      ...form,
      photos: photoPreview, // Store photo URLs
      date: selDate,
      time: skipTime ? null : Array.isArray(selTime) ? selTime : (selTime ? [selTime] : null),
      status: "Pending",
      userId: user?.id || null,
      created: new Date().toISOString()
    };
    const upd = [...bks, bk]; DB.set("tc_bk", upd); setBks(upd);

    // ── Push notification to ADMIN
    const timeStr = skipTime ? null : (Array.isArray(selTime) ? selTime.join(", ") : selTime);
    pushNotif({ type: "new", target: "admin", bkId: bk.id, name: bk.name, phone: bk.phone, func: bk.func, date: bk.date, time: timeStr, guests: bk.guests, food: bk.food, address: bk.address, notes: bk.notes });

    setConfirmed(bk);
    toast(isTa ? "🎉 முன்பதிவு கோரிக்கை அனுப்பப்பட்டது!" : "🎉 Booking request sent!", "ok");
  };

  if (confirmed) {
    const fn = FUNCTIONS.find(f => f.id === confirmed.func);
    const waMsg = buildWAMsg("new", { ...confirmed, bkId: confirmed.id }, lang);
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px clamp(16px,6%,80px)", background: "#160800" }}>
        <Card style={{ maxWidth: 560, width: "100%", padding: "clamp(24px,4vw,48px)", border: "1px solid rgba(232,135,26,.3)", textAlign: "center" }}>
          <div style={{ fontSize: 58, marginBottom: 14 }}>🎊</div>
          <h2 className={isTa ? "ta-h en-h" : "en-h"} style={{ fontSize: "clamp(20px,3vw,28px)", color: "var(--cr)", marginBottom: 8 }}>{t.confirmed}</h2>
          <p style={{ color: "var(--mu)", marginBottom: 6, fontSize: 13.5 }}>{isTa ? "முன்பதிவு எண்" : "Booking ID"}: <strong style={{ color: "var(--sf)" }}>{confirmed.id}</strong></p>
          <div style={{ background: "rgba(232,135,26,.06)", border: "1px solid rgba(232,135,26,.18)", borderRadius: 12, padding: 18, margin: "18px 0", textAlign: "left" }}>
            {[[isTa ? "நிகழ்வு" : "Event", (fn?.icon || "") + " " + (isTa ? fn?.ta : fn?.en)], [isTa ? "தேதி" : "Date", "📅 " + confirmed.date], [isTa ? "நேரம்" : "Time", confirmed.time ? "⏰ " + (Array.isArray(confirmed.time) ? confirmed.time.join(", ") : confirmed.time) : "⏰ " + t.noTime], [isTa ? "விருந்தினர்" : "Guests", "👥 " + confirmed.guests], [isTa ? "விலை" : "Price", "📞 " + (isTa ? "உரிமையாளர் தொடர்பு கொள்வார்" : "Owner will contact you")], [isTa ? "நிலை" : "Status", "⏳ " + (isTa ? "நிலுவையில்" : "Pending Review")]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 13, gap: 8 }}>
                <span style={{ color: "var(--mu)", flexShrink: 0 }}>{k}</span>
                <span className={isTa ? "ta" : ""} style={{ color: "var(--cr)", fontWeight: 600, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(232,135,26,.06)", border: "1px solid rgba(232,135,26,.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
            <p className={isTa ? "ta" : ""} style={{ color: "var(--sf)", fontSize: 13, lineHeight: 1.75, marginBottom: 10 }}>{t.confirmedSub}</p>
            {/* Notify admin directly from confirmation */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 10 }}>
              <div className={isTa ? "ta" : ""} style={{ fontSize: 11.5, color: "var(--mu)", marginBottom: 7 }}>📲 {isTa ? "நிர்வாகிக்கு இப்போதே அறிவிக்கவும்:" : "Notify admin right now:"}</div>
              <SendButtons phone={ADMIN_PHONE} waMsg={waMsg} lang={lang} callPhone={ADMIN_PHONE} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn sz="md" lang={lang} onClick={() => { setConfirmed(null); setStep(1); setDate(null); setTime(null); setSkipTime(false); setForm({ name: "", phone: "", address: "", func: "", food: "veg", guests: "", notes: "" }); }}>{isTa ? "மீண்டும் முன்பதிவு" : "Book Another"}</Btn>
            {user && <Btn sz="md" v="out" lang={lang} onClick={() => { setConfirmed(null); }}>{t.myBookings}</Btn>}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <section style={{ padding: "clamp(60px,8vw,100px) clamp(16px,6%,80px)", background: "#160800", minHeight: "100vh" }}>
      <SecHead label={t.bookLbl} title={t.bookTitle} sub={t.bookSub} lang={lang} />
      {/* Step indicators */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0, marginBottom: "clamp(28px,4.5vw,50px)", flexWrap: "wrap" }}>
        {[t.step1, t.step2, t.step3].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: step > i + 1 ? "var(--sf)" : step === i + 1 ? "linear-gradient(135deg,var(--sf),var(--vr))" : "rgba(255,255,255,.05)", border: step >= i + 1 ? "none" : "1.5px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13.5, fontWeight: 800, color: step >= i + 1 ? "var(--dk)" : "var(--mu)", animation: step === i + 1 ? "glow 2s infinite" : "none", transition: "all .3s", flexShrink: 0 }}>{step > i + 1 ? "✓" : i + 1}</div>
              <span className={isTa ? "ta" : ""} style={{ fontSize: "clamp(9.5px,1.2vw,11.5px)", color: step === i + 1 ? "var(--sf)" : "var(--mu)", whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < 2 && <div style={{ width: "clamp(28px,5.5vw,65px)", height: 2, background: step > i + 1 ? "var(--sf)" : "rgba(255,255,255,.08)", margin: "0 5px 17px", flexShrink: 0, transition: "background .3s" }} />}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1020, margin: "0 auto" }}>
        {step <= 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }} className="g2">
            {/* Calendar */}
            <Card style={{ padding: "clamp(16px,2.2vw,24px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <button onClick={() => setMon(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))} style={{ background: "rgba(255,255,255,.05)", border: "none", color: "var(--cr)", padding: "5px 12px", borderRadius: 7, cursor: "pointer", fontSize: 16 }}>‹</button>
                <span className="en-h" style={{ fontSize: "clamp(13px,1.7vw,15px)", fontWeight: 700, color: "var(--cr)" }}>{monLbl}</span>
                <button onClick={() => setMon(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))} style={{ background: "rgba(255,255,255,.05)", border: "none", color: "var(--cr)", padding: "5px 12px", borderRadius: 7, cursor: "pointer", fontSize: 16 }}>›</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginBottom: 5 }}>
                {(isTa ? ["ஞா", "திங்", "செ", "புத", "வியா", "வெ", "சனி"] : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]).map(d => <div key={d} className={isTa ? "ta" : ""} style={{ textAlign: "center", fontSize: 10, color: "var(--mu)", fontWeight: 700, padding: "3px 0" }}>{d}</div>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
                {Array(fd).fill(null).map((_, i) => <div key={"e" + i} />)}
                {Array(dm).fill(null).map((_, i) => {
                  const day = i + 1; const ds = yr + "-" + String(mo + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
                  const past = new Date(ds) < today; const sel = selDate === ds; const full = dayFull(ds); const busy = !full && dayBusy(ds); const avCnt = getAvail(ds).length;
                  return (<button key={day} disabled={past || full} onClick={() => { setDate(ds); setStep(2); setTime(null); setSkipTime(false); }} className={"cal-day " + (sel ? "sel" : full ? "full" : busy ? "busy" : "avail")} style={{ opacity: past ? .3 : 1 }}><span>{day}</span>{!past && !full && !sel && avCnt < TIME_SLOTS.length && <span style={{ fontSize: 7, color: busy ? "var(--vr2)" : "var(--bn2)" }}>{avCnt}{isTa ? "இட" : "sl"}</span>}{full && !past && <span style={{ fontSize: 7, color: "var(--vr2)" }}>Full</span>}</button>);
                })}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                {[["var(--sf)", "Selected/தேர்வு"], ["rgba(192,57,43,.4)", "Busy/சில"], ["rgba(192,57,43,.6)", "Full/நிறை"], ["rgba(67,160,71,.3)", "Free/கிடைக்கும்"]].map(([bg, lbl]) => (
                  <span key={lbl} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "var(--mu)" }}><span style={{ width: 8, height: 8, background: bg, borderRadius: 2, flexShrink: 0 }} />{lbl}</span>
                ))}
              </div>
            </Card>
            {/* Time slots */}
            <Card style={{ padding: "clamp(16px,2.2vw,24px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <h3 className={isTa ? "ta-h" : "en-h"} style={{ fontSize: "clamp(13px,1.6vw,15px)", color: "var(--cr)", fontWeight: 700 }}>{selDate ? (isTa ? selDate + " நேரங்கள்" : "Slots · " + selDate) : (isTa ? "தேதி தேர்க" : "Select a date first")}</h3>
                <Btn sz="sm" v="out" lang={lang} onClick={getAI} disabled={aiLoad || !selDate}>{aiLoad ? "..." : (isTa ? "AI தேர்வு" : "AI Suggest")}</Btn>
              </div>
              {aiTip && <div className={isTa ? "ta" : ""} style={{ background: "rgba(232,135,26,.07)", border: "1px solid rgba(232,135,26,.18)", borderRadius: 9, padding: "9px 12px", fontSize: 12, color: "var(--sf)", marginBottom: 14, lineHeight: 1.65 }}>AI: {aiTip}</div>}
              <button onClick={() => { setSkipTime(true); setTime(null); setStep(3); }} className={isTa ? "ta" : ""} style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 9, border: "1.5px dashed rgba(212,172,13,.35)", background: "rgba(212,172,13,.05)", color: "var(--tm)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif", transition: "all .2s" }}>📅 {t.skipTime}</button>
              <div style={{ marginBottom: 12, fontSize: 11.5, color: "var(--mu)" }} className={isTa ? "ta" : ""}>{isTa ? "அல்லது பல ஸ்லாட்களை தேர்வு செய்யுங்கள்:" : "Or select multiple slots:"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(70px,1fr))", gap: 7 }}>
                {TIME_SLOTS.map(tt => { const bkd = selDate && (isBlocked(selDate, tt) || isBooked(selDate, tt)); const sel = Array.isArray(selTime) ? selTime.includes(tt) : selTime === tt; return (<button key={tt} disabled={!selDate || bkd} onClick={() => { if (Array.isArray(selTime)) { setTime(selTime.includes(tt) ? selTime.filter(t => t !== tt) : [...selTime, tt].sort()); } else { setTime([tt]); } setSkipTime(false); }} className={"slot " + (!selDate || bkd ? "booked" : sel ? "sel" : "free")} style={{ position: "relative" }}>{tt}{sel && !bkd && <span style={{ position: "absolute", top: 1, right: 2, fontSize: 10, color: "var(--dk)", fontWeight: 700 }}>✓</span>}{bkd && selDate && <div style={{ fontSize: 8.5, marginTop: 1, opacity: .7 }}>{isTa ? "நேரம் நிரமிக்கப்பட்டது" : "Booked"}</div>}</button>); })}
              </div>
              <button onClick={() => { if (Array.isArray(selTime) && selTime.length > 0) setStep(3); else toast(isTa ? "குறைந்தது ஒரு ஸ்லாட் தேர்வு செய்யவும்" : "Select at least one slot", "err"); }} disabled={!selDate || (Array.isArray(selTime) ? selTime.length === 0 : !selTime) && !skipTime} className={isTa ? "ta" : ""} style={{ width: "100%", marginTop: 12, padding: 10, borderRadius: 9, background: !selDate || (Array.isArray(selTime) ? selTime.length === 0 : !selTime) && !skipTime ? "rgba(255,255,255,.03)" : "rgba(232,135,26,.12)", border: "1px solid rgba(232,135,26,.22)", color: !selDate || (Array.isArray(selTime) ? selTime.length === 0 : !selTime) && !skipTime ? "var(--mu2)" : "var(--sf)", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif", transition: "all .2s" }}>{isTa ? "முன்னெழு" : "Continue"}</button>
              <div style={{ marginTop: 12, padding: "9px 12px", background: "rgba(255,255,255,.02)", borderRadius: 8, fontSize: 12, color: "var(--mu)" }} className={isTa ? "ta" : ""}>💡 {isTa ? "முழு நாள் = குறிப்பிட்ட நேரம் இல்லை. ஒரு அல்லது பல ஸ்லாட்களைத் தேர்வு செய்யவும் அல்லது நெகிழ்வாக இருங்கள்." : "Full day = no specific time. Select one or multiple slots, or stay flexible."}</div>
            </Card>
          </div>
        )}
        {step === 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }} className="g2">
            <Card style={{ padding: "clamp(16px,2.5vw,30px)" }}>
              <h3 className={isTa ? "ta-h en-h" : "en-h"} style={{ fontSize: "clamp(15px,2vw,19px)", color: "var(--cr)", marginBottom: 20 }}>{isTa ? "உங்கள் விவரங்கள்" : "Your Details"}</h3>
              <Inp lang={lang} label={t.name} value={form.name} onChange={v => setForm({ ...form, name: v })} icon="👤" req />
              <Inp lang={lang} label={t.phone} type="tel" value={form.phone} onChange={v => setForm({ ...form, phone: v })} icon="📞" ph="+91 ***** *****" req />
              <MapPicker value={form.address} onChange={v => setForm({ ...form, address: v })} lang={lang} />
              <Inp lang={lang} label={t.func} type="select" value={form.func} onChange={v => setForm({ ...form, func: v })} icon="🎊" req opts={FUNCTIONS.map(f => [f.id, isTa ? f.ta : f.en])} />
              <Inp lang={lang} label={t.food} type="select" value={form.food} onChange={v => setForm({ ...form, food: v })} icon="🍽️" opts={[["veg", t.veg], ["nonveg", t.nonveg], ["both", t.both]]} />
              <Inp lang={lang} label={t.guests} type="number" value={form.guests} onChange={v => setForm({ ...form, guests: v })} icon="👥" ph={isTa ? "மொத்த விருந்தினர் எண்ணிக்கை" : "Total number of guests"} req />
              <Inp lang={lang} label={t.notes} type="textarea" value={form.notes} onChange={v => setForm({ ...form, notes: v })} icon="💬" ph={isTa ? "உணவு விருப்பம், சிறப்பு தேவைகள்…" : "Dietary preferences, décor needs…"} />

              {/* Photo Upload Section */}
              <div style={{ marginTop: 20, padding: "16px", background: "rgba(255,255,255,.02)", borderRadius: 12, border: "1px solid rgba(232,135,26,.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18 }}>📸</span>
                  <div>
                    <div className={isTa ? "ta" : ""} style={{ color: "var(--cr)", fontWeight: 600, fontSize: 14 }}>
                      {isTa ? "புகைப்படங்கள் (விருப்பமானது)" : "Photos (Optional)"}
                    </div>
                    <div className={isTa ? "ta" : ""} style={{ color: "var(--mu)", fontSize: 12 }}>
                      {isTa ? "நிகழ்வு இடம் அல்லது உணவு விருப்பங்களைப் பகிருங்கள்" : "Share venue photos or food preferences"}
                    </div>
                  </div>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    background: "rgba(232,135,26,.1)",
                    border: "1px solid rgba(232,135,26,.2)",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    color: "var(--sf)",
                    fontWeight: 600,
                    transition: "all .2s"
                  }}
                >
                  <span>📎</span>
                  {isTa ? "புகைப்படங்கள் தேர்ந்தெடுக்க" : "Choose Photos"}
                </label>

                {photoPreview.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div className={isTa ? "ta" : ""} style={{ fontSize: 12, color: "var(--mu)", marginBottom: 8 }}>
                      {photoPreview.length} {isTa ? "புகைப்படங்கள் தேர்ந்தெடுக்கப்பட்டது" : "photo(s) selected"}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {photoPreview.map((preview, index) => (
                        <div key={index} style={{ position: "relative" }}>
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 8,
                              objectFit: "cover",
                              border: "2px solid rgba(232,135,26,.2)"
                            }}
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            style={{
                              position: "absolute",
                              top: -6,
                              right: -6,
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: "var(--vr)",
                              border: "none",
                              color: "white",
                              fontSize: 12,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <Card style={{ padding: "clamp(16px,2.5vw,30px)" }}>
              <h3 className={isTa ? "ta-h en-h" : "en-h"} style={{ fontSize: "clamp(15px,2vw,19px)", color: "var(--cr)", marginBottom: 20 }}>{isTa ? "முன்பதிவு சுருக்கம்" : "Booking Summary"}</h3>
              {[[isTa ? "📅 தேதி" : "📅 Date", selDate], [isTa ? "⏰ நேரம்" : "⏰ Time", skipTime ? (isTa ? "நெகிழ்வான நேரம்" : "Flexible") : Array.isArray(selTime) ? selTime.join(", ") || "—" : selTime || "—"], [isTa ? "🎊 நிகழ்வு" : "🎊 Event", (() => { const fn = FUNCTIONS.find(f => f.id === form.func); return fn ? (isTa ? fn.ta : fn.en) : "—"; })()], [isTa ? "👥 விருந்தினர்" : "👥 Guests", form.guests || "—"], [isTa ? "🍽️ உணவு" : "🍽️ Food", form.food === "veg" ? t.veg : form.food === "nonveg" ? t.nonveg : t.both], [isTa ? "📍 இடம்" : "📍 Venue", form.address ? (form.address.length > 40 ? form.address.slice(0, 40) + "…" : form.address) : "—"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,.05)", fontSize: 13, gap: 8 }}><span style={{ color: "var(--mu)", flexShrink: 0 }}>{k}</span><span className={isTa ? "ta" : ""} style={{ color: "var(--cr)", fontWeight: 600, textAlign: "right", maxWidth: "55%", wordBreak: "break-word" }}>{v}</span></div>
              ))}
              <div style={{ background: "rgba(192,57,43,.07)", border: "1px solid rgba(192,57,43,.2)", borderRadius: 12, padding: "14px 16px", margin: "18px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><span style={{ fontSize: 22 }}>Price</span><div className={isTa ? "ta-h en-h" : "en-h"} style={{ fontSize: 15, fontWeight: 700, color: "var(--vr2)" }}>{t.contactPrice}</div></div>
                <p className={isTa ? "ta" : ""} style={{ fontSize: 12.5, color: "var(--mu)", lineHeight: 1.75, marginBottom: 10 }}>{isTa ? "விலை நிகழ்வு வகை மற்றும் விருந்தினர் எண்ணிக்கையை பொறுத்து மாறும். உரிமையாளர் தொடர்பு கொண்டு விலை தருவார்." : "Price varies by function & guest count. Owner will personally quote after reviewing your request."}</p>
                <a href={"tel:+" + ADMIN_PHONE} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "var(--sf)", color: "var(--dk)", padding: "6px 14px", borderRadius: 7, fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>Call Now</a>
              </div>
              <div style={{ background: "rgba(212,172,13,.06)", border: "1px solid rgba(212,172,13,.18)", borderRadius: 9, padding: "10px 13px", marginBottom: 18, fontSize: 12.5, color: "var(--tm)" }} className={isTa ? "ta" : ""}>Payment: {isTa ? "கட்டணம்: உரிமையாளர் உறுதிப்படுத்தலுக்குப் பின் செலுத்தலாம்" : "Settled after owner confirmation"}</div>
              <Btn sz="lg" lang={lang} onClick={confirmBooking} style={{ width: "100%", marginBottom: 10 }}>{t.confirm}</Btn>
              <button className={isTa ? "ta" : ""} onClick={() => setStep(2)} style={{ width: "100%", background: "transparent", border: "none", color: "var(--mu)", fontSize: 12.5, cursor: "pointer", fontFamily: "'Catamaran',sans-serif", padding: 6 }}>← {isTa ? "நேர இடத்திற்கு திரும்பு" : "Back to time selection"}</button>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   BOOKING HISTORY
══════════════════════════════════════════════════════════════ */
function BookingHistory({ user, lang, setPg }) {
  const t = T[lang]; const isTa = lang === "ta";
  const myBks = DB.get("tc_bk").filter(b => b.userId === user?.id);
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const SI = { Pending: "⏳", Approved: "✅", Rejected: "❌", Completed: "🎊" };

  // Filter bookings based on status and search
  const filteredBks = myBks.filter(bk => {
    const matchesFilter = filter === "All" || bk.status === filter;
    const matchesSearch = searchTerm === "" ||
      bk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bk.date.includes(searchTerm) ||
      bk.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    All: myBks.length,
    Pending: myBks.filter(b => b.status === "Pending").length,
    Approved: myBks.filter(b => b.status === "Approved").length,
    Rejected: myBks.filter(b => b.status === "Rejected").length,
    Completed: myBks.filter(b => b.status === "Completed").length,
  };

  return (
    <div style={{ padding: "clamp(60px,8vw,100px) clamp(16px,6%,80px)", minHeight: "100vh", background: "linear-gradient(135deg, #160800 0%, #2D1200 50%, #1A0800 100%)" }}>
      <SecHead label={isTa ? "என் கணக்கு" : "My Account"} title={t.myBookings} sub={isTa ? "உங்கள் அனைத்து முன்பதிவுகள் மற்றும் நிலைகளை இங்கே காணலாம்." : "View all your booking requests and their current status."} lang={lang} />

      {/* Search and Filter Controls */}
      <div style={{ maxWidth: 860, margin: "0 auto 28px", display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            type="text"
            placeholder={isTa ? "தேடு... (பெயர், தேதி, இடம்)" : "Search... (name, date, venue)"}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid rgba(232,135,26,.2)",
              background: "rgba(255,255,255,.05)",
              color: "var(--cr)",
              fontSize: 14,
              outline: "none"
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", "Pending", "Approved", "Rejected", "Completed"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                border: filter === status ? "1px solid var(--sf)" : "1px solid rgba(255,255,255,.1)",
                background: filter === status ? "rgba(232,135,26,.15)" : "rgba(255,255,255,.05)",
                color: filter === status ? "var(--sf)" : "var(--mu)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all .2s",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              {status !== "All" && SI[status]} {isTa ? (status === "All" ? "அனைத்தும்" : t[status.toLowerCase()]) : status}
              <span style={{ fontSize: 10, opacity: 0.7 }}>({statusCounts[status]})</span>
            </button>
          ))}
        </div>
      </div>

      {filteredBks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 24, color: "var(--cr)", marginBottom: 12 }}>
            {isTa ? "முன்பதிவுகள் இல்லை" : "No Bookings Found"}
          </div>
          <p className={isTa ? "ta" : ""} style={{ color: "var(--mu)", marginBottom: 22, fontSize: 15 }}>
            {searchTerm || filter !== "All"
              ? (isTa ? "உங்கள் தேடலுக்கு பொருந்தும் முன்பதிவுகள் இல்லை" : "No bookings match your search criteria")
              : t.historyEmpty || "No bookings yet."
            }
          </p>
          <Btn sz="lg" lang={lang} onClick={() => setPg("booking")}>
            {isTa ? "புதிய முன்பதிவு செய்க" : "Make New Booking"}
          </Btn>
        </div>
      ) : (
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ marginBottom: 20, fontSize: 14, color: "var(--mu)" }}>
            {isTa ? `காட்டப்படும் முன்பதிவுகள்: ${filteredBks.length}` : `Showing ${filteredBks.length} booking${filteredBks.length !== 1 ? 's' : ''}`}
          </div>

          {filteredBks.sort((a, b) => new Date(b.created) - new Date(a.created)).map(bk => {
            const fn = FUNCTIONS.find(f => f.id === bk.func); const exp = sel === bk.id;
            const waMsg = buildWAMsg(bk.status === "Approved" ? "approved" : bk.status === "Rejected" ? "rejected" : "new", { ...bk, bkId: bk.id }, lang);
            return (
              <div key={bk.id} style={{ marginBottom: 16 }}>
                <div className="bh-row" onClick={() => setSel(exp ? null : bk.id)} style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,.03) 0%, rgba(255,255,255,.01) 100%)",
                  border: "1px solid rgba(232,135,26,.1)",
                  borderRadius: 16,
                  padding: "20px",
                  cursor: "pointer",
                  transition: "all .3s ease",
                  boxShadow: "0 4px 20px rgba(0,0,0,.1)"
                }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1, flexWrap: "wrap" }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: (fn?.col || "var(--sf)") + "1A",
                      border: "2px solid " + (fn?.col || "var(--sf)") + "33",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 24, flexShrink: 0
                    }}>
                      {fn?.icon || "📅"}
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                        <span className={isTa ? "ta-h en-h" : "en-h"} style={{
                          fontSize: "clamp(16px,1.8vw,18px)",
                          fontWeight: 700,
                          color: "var(--cr)"
                        }}>
                          {isTa ? fn?.ta : fn?.en?.split("(")[0].trim()}
                        </span>
                        <span className={"sp s-" + bk.status.toLowerCase()}>
                          {SI[bk.status]} {isTa ? t[bk.status.toLowerCase()] : bk.status}
                        </span>
                        <span style={{
                          fontSize: 12,
                          color: "var(--mu)",
                          background: "rgba(255,255,255,.05)",
                          padding: "4px 8px",
                          borderRadius: 12
                        }}>
                          ID: {bk.id}
                        </span>
                      </div>
                      <div style={{ color: "var(--mu)", fontSize: 14, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                        <span>📅 {bk.date}</span>
                        <span>⏰ {bk.time || (isTa ? "நெகிழ்வான நேரம்" : "Flexible")}</span>
                        <span>👥 {bk.guests} guests</span>
                        <span>🍽️ {bk.food === "veg" ? "Vegetarian" : bk.food === "nonveg" ? "Non-Veg" : "Both"}</span>
                      </div>
                      <div style={{ color: "var(--sf)", fontSize: 13, marginTop: 6, fontWeight: 500 }}>
                        📍 {bk.address.length > 50 ? bk.address.slice(0, 50) + "..." : bk.address}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    color: "var(--sf)",
                    fontSize: 20,
                    transition: "transform .3s ease",
                    transform: exp ? "rotate(180deg)" : "rotate(0)"
                  }}>
                    ▼
                  </div>
                </div>

                {exp && (
                  <div style={{
                    background: "linear-gradient(135deg, rgba(232,135,26,.04) 0%, rgba(255,255,255,.02) 100%)",
                    border: "1px solid rgba(232,135,26,.12)",
                    borderRadius: "0 0 16px 16px",
                    borderTop: "none",
                    padding: "24px",
                    animation: "fadeUp .3s ease",
                    boxShadow: "inset 0 2px 10px rgba(0,0,0,.1)"
                  }}>
                    <div style={{
                      background: (bk.status === "Approved" ? "rgba(46,125,50,.1)" : bk.status === "Rejected" ? "rgba(192,57,43,.1)" : bk.status === "Completed" ? "rgba(26,94,138,.1)" : "rgba(212,172,13,.08)"),
                      border: "1px solid " + (bk.status === "Approved" ? "rgba(67,160,71,.25)" : bk.status === "Rejected" ? "rgba(192,57,43,.22)" : bk.status === "Completed" ? "rgba(26,94,138,.22)" : "rgba(212,172,13,.2)"),
                      borderRadius: 12, padding: "16px 20px", marginBottom: 20
                    }}>
                      <p className={isTa ? "ta" : ""} style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: bk.status === "Approved" ? "#43A047" : bk.status === "Rejected" ? "var(--vr2)" : bk.status === "Completed" ? "#5DADE2" : "var(--tm)",
                        margin: 0
                      }}>
                        {t.statusNote[bk.status]}
                      </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px 24px", marginBottom: 20 }}>
                      {[
                        [t.bkId || "ID", bk.id],
                        [t.bkDate || "Date", bk.date],
                        [t.bkTime || "Time", bk.time || (isTa ? "நெகிழ்வான நேரம்" : "Flexible")],
                        [t.bkFood || "Food", bk.food === "veg" ? t.veg : bk.food === "nonveg" ? t.nonveg : t.both],
                        [t.bkGuests || "Guests", bk.guests],
                        [isTa ? "இடம்" : "Venue", bk.address],
                        [isTa ? "தொலைபேசி" : "Phone", bk.phone],
                        [isTa ? "பெயர்" : "Name", bk.name]
                      ].map(([k, v]) => (
                        <div key={k} style={{
                          padding: "12px 0",
                          borderBottom: "1px solid rgba(255,255,255,.04)"
                        }}>
                          <div style={{
                            fontSize: 11.5,
                            color: "var(--mu)",
                            fontWeight: 700,
                            letterSpacing: .6,
                            textTransform: "uppercase",
                            marginBottom: 4
                          }}>
                            {k}
                          </div>
                          <div className={isTa ? "ta" : ""} style={{
                            fontSize: 14,
                            color: "var(--cr)",
                            fontWeight: 600
                          }}>
                            {v}
                          </div>
                        </div>
                      ))}
                    </div>

                    {bk.notes && (
                      <div style={{
                        marginBottom: 20,
                        padding: "16px 20px",
                        background: "rgba(255,255,255,.03)",
                        borderRadius: 12,
                        borderLeft: "4px solid rgba(232,135,26,.3)"
                      }}>
                        <div style={{
                          fontSize: 11.5,
                          color: "var(--sf)",
                          fontWeight: 700,
                          letterSpacing: .6,
                          textTransform: "uppercase",
                          marginBottom: 6
                        }}>
                          {t.notes || "Notes"}
                        </div>
                        <div className={isTa ? "ta" : ""} style={{
                          fontSize: 14,
                          color: "var(--mu)",
                          lineHeight: 1.6
                        }}>
                          {bk.notes}
                        </div>
                      </div>
                    )}

                    {/* Contact + Action buttons */}
                    <div style={{
                      padding: "20px 0",
                      borderTop: "1px solid rgba(255,255,255,.05)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 16
                    }}>
                      <div className={isTa ? "ta" : ""} style={{
                        fontSize: 14,
                        color: "var(--mu)",
                        marginBottom: 8
                      }}>
                        📲 {isTa ? "உரிமையாளரை தொடர்பு கொள்க:" : "Contact the owner:"}
                      </div>
                      <SendButtons phone={ADMIN_PHONE} waMsg={waMsg} lang={lang} callPhone={ADMIN_PHONE} />

                      {bk.status === "Rejected" && (
                        <div style={{ marginTop: 12 }}>
                          <Btn sz="md" lang={lang} onClick={() => setPg("booking")} style={{
                            background: "rgba(192,57,43,.1)",
                            border: "1px solid rgba(192,57,43,.3)",
                            color: "var(--vr2)"
                          }}>
                            {isTa ? "மீண்டும் முன்பதிவு செய்க" : "Rebook Event"}
                          </Btn>
                        </div>
                      )}

                      {bk.status === "Approved" && (
                        <div style={{ marginTop: 12 }}>
                          <Btn sz="md" lang={lang} onClick={() => {
                            const msg = buildWAMsg("reminder", bk, lang);
                            window.open(waLink(ADMIN_PHONE, msg), '_blank');
                          }} style={{
                            background: "rgba(46,125,50,.1)",
                            border: "1px solid rgba(67,160,71,.3)",
                            color: "#43A047"
                          }}>
                            {isTa ? "நினைவூட்டல் அனுப்பு" : "Send Reminder"}
                          </Btn>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   REVIEWS
══════════════════════════════════════════════════════════════ */
function Reviews({ lang }) {
  const t = T[lang]; const isTa = lang === "ta";
  const [rvs, setRvs] = useState(() => DB.get("tc_rv"));
  const [show, setShow] = useState(false); const [form, setForm] = useState({ name: "", rating: 5, text: "" });
  const sub = () => {
    if (!form.name || !form.text) return toast(isTa ? "பெயர் மற்றும் மதிப்புரை உள்ளிடவும்" : "Fill name & review", "err");
    const r = { id: "r" + Date.now(), ...form, avatar: form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2), date: new Date().toISOString().split("T")[0] };
    const u = [r, ...rvs]; DB.set("tc_rv", u); setRvs(u); setForm({ name: "", rating: 5, text: "" }); setShow(false);
    toast(isTa ? "நன்றி! மதிப்புரை சேர்க்கப்பட்டது" : "Thank you! Review added", "ok");
  };
  return (
    <section style={{ padding: "clamp(60px,8vw,100px) clamp(16px,6%,80px)", background: "linear-gradient(180deg,#160800,#2D1200)" }}>
      <SecHead label={t.rvwLbl} title={t.rvwTitle} sub={t.rvwSub} lang={lang} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(clamp(250px,27vw,310px),1fr))", gap: 16, marginBottom: 34 }}>
        {rvs.map(r => (
          <Card key={r.id} style={{ padding: "clamp(16px,2.2vw,22px)" }}>
            <div style={{ display: "flex", gap: 11, marginBottom: 13, alignItems: "center" }}>
              <div style={{ width: 43, height: 43, borderRadius: "50%", background: "linear-gradient(135deg,var(--sf),var(--vr))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "white", flexShrink: 0 }}>{r.avatar}</div>
              <div><div style={{ color: "var(--cr)", fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{r.name}</div><Stars rating={r.rating} /></div>
            </div>
            <p className={isTa ? "ta" : ""} style={{ color: "var(--mu)", fontSize: "clamp(12px,1.4vw,13.5px)", lineHeight: 1.78, fontStyle: "italic" }}>"{r.text}"</p>
            <div style={{ marginTop: 11, fontSize: 11, color: "rgba(255,255,255,.18)" }}>{r.date}</div>
          </Card>
        ))}
      </div>
      {!show ? <div style={{ textAlign: "center" }}><Btn v="out" lang={lang} onClick={() => setShow(true)}>✍️ {t.writeReview}</Btn></div> : (
        <Card style={{ maxWidth: 490, margin: "0 auto", padding: "clamp(18px,2.5vw,30px)" }}>
          <h3 className={isTa ? "ta-h en-h" : "en-h"} style={{ fontSize: "clamp(15px,2vw,19px)", color: "var(--cr)", marginBottom: 18 }}>{isTa ? "உங்கள் அனுபவம் பகிருங்கள்" : "Share Your Experience"}</h3>
          <Inp lang={lang} label={isTa ? "உங்கள் பெயர்" : "Your Name"} value={form.name} onChange={v => setForm({ ...form, name: v })} icon="👤" req />
          <div style={{ marginBottom: 14 }}><label className={isTa ? "ta" : ""} style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: .8, color: "var(--sf)", marginBottom: 6, textTransform: "uppercase" }}>{isTa ? "மதிப்பீடு" : "Rating"} *</label><Stars rating={form.rating} interactive onChange={v => setForm({ ...form, rating: v })} /></div>
          <Inp lang={lang} label={isTa ? "மதிப்புரை" : "Review"} type="textarea" value={form.text} onChange={v => setForm({ ...form, text: v })} req />
          <div style={{ display: "flex", gap: 9 }}><Btn lang={lang} onClick={sub}>{t.submitReview}</Btn><Btn v="out" lang={lang} onClick={() => setShow(false)}>{isTa ? "ரத்து" : "Cancel"}</Btn></div>
        </Card>
      )}
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════════════════════ */
function Contact({ lang }) {
  const t = T[lang]; const isTa = lang === "ta";
  const ctcs = [
    {
      n: isTa ? "வாட்ஸ்அப்" : "WhatsApp",
      p: ADMIN_PHONE,
      ic: "💬",
      r: isTa ? "உடனடி செய்திகள் & முன்பதிவுகள்" : "Instant messaging & bookings",
      action: "wa"
    },
    {
      n: isTa ? "ஆதரவு" : "Support Call",
      p: ADMIN_PHONE2,
      ic: "🛎️",
      r: isTa ? "24/7 வாடிக்கையாளர் சேவை" : "24/7 customer support",
      action: "call"
    },
    {
      n: isTa ? "மின்னஞ்சல்" : "Email",
      p: ADMIN_EMAIL,
      ic: "✉️",
      r: isTa ? "விவரமான விசாரணைகளுக்கு" : "For detailed inquiries",
      action: "email"
    }
  ];

  const handleContact = (contact, action) => {
    if (action === "wa") {
      const msg = buildWAMsg("general", {}, lang);
      window.open(waLink(contact.p, msg), '_blank');
    } else if (action === "call") {
      window.open(`tel:${contact.p}`, '_blank');
    } else if (action === "email") {
      window.open(`mailto:${contact.p}?subject=${encodeURIComponent(isTa ? "ஆர்.வி.ஸ் கேட்டரிங் விசாரணை" : "RVS Catering Inquiry")}`, '_blank');
    }
  };

  return (
    <section style={{
      padding: "clamp(60px,8vw,100px) clamp(16px,6%,80px)",
      background: "linear-gradient(135deg, #160800 0%, #2D1200 50%, #1A0800 100%)",
      position: "relative"
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 80%, rgba(232,135,26,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(192,57,43,0.03) 0%, transparent 50%)",
        pointerEvents: "none"
      }} />

      <SecHead label={t.ctcLbl} title={t.ctcTitle} sub={t.ctcSub} lang={lang} />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 32,
        maxWidth: 1000,
        margin: "0 auto",
        position: "relative",
        zIndex: 1
      }} className="g2">

        {/* Contact Methods */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {ctcs.map(c => (
            <div
              key={c.n}
              className="card-modern"
              onClick={() => handleContact(c, c.action)}
              style={{ cursor: "pointer" }}
            >
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16
              }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1 }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, rgba(232,135,26,0.1) 0%, rgba(192,57,43,0.05) 100%)",
                    border: "2px solid rgba(232,135,26,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0
                  }}>
                    {c.ic}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={isTa ? "ta" : ""} style={{
                      color: "var(--cr)",
                      fontWeight: 700,
                      fontSize: "clamp(16px,2vw,18px)",
                      marginBottom: 4
                    }}>
                      {c.n}
                    </div>
                    <div className={isTa ? "ta" : ""} style={{
                      color: "var(--mu)",
                      fontSize: 14,
                      marginBottom: 6
                    }}>
                      {c.r}
                    </div>
                    <div style={{
                      color: "var(--sf)",
                      fontWeight: 600,
                      fontSize: 15,
                      fontFamily: "monospace"
                    }}>
                      {c.p}
                    </div>
                  </div>
                </div>
                <div style={{
                  color: "var(--sf)",
                  fontSize: 20,
                  transition: "transform 0.3s ease"
                }}>
                  →
                </div>
              </div>
            </div>
          ))}

          {/* Office Information */}
          <div className="card-modern">
            <div style={{ fontSize: 28, marginBottom: 12 }}>🏢</div>
            <div className={isTa ? "ta" : ""} style={{
              color: "var(--cr)",
              fontWeight: 700,
              marginBottom: 8,
              fontSize: 16
            }}>
              {isTa ? "தலைமை அலுவலகம்" : "Head Office"}
            </div>
            <div className={isTa ? "ta" : ""} style={{
              color: "var(--mu)",
              fontSize: 14,
              lineHeight: 1.6,
              whiteSpace: "pre-line",
              marginBottom: 12
            }}>
              {ADMIN_ADDRESS}
            </div>
            <div style={{
              paddingTop: 12,
              borderTop: "1px solid rgba(232,135,26,0.1)"
            }}>
              <div className={isTa ? "ta" : ""} style={{
                fontSize: 12,
                color: "var(--sf)",
                fontWeight: 700,
                marginBottom: 4
              }}>
                {isTa ? "✓ உரிமையாளர்:" : "✓ Owner:"}
              </div>
              <div className={isTa ? "ta" : ""} style={{
                color: "var(--cr)",
                fontSize: 14,
                fontWeight: 600
              }}>
                {isTa ? "சு. சிலம்பிராசன் B.Sc" : "R. Silambuprassan B.Sc"}
              </div>
            </div>
          </div>

        </div>

        {/* Contact Form */}
        <div className="card-modern" style={{ height: "fit-content" }}>
          <h3 className={isTa ? "ta-h en-h" : "en-h"} style={{
            fontSize: "clamp(18px,2.5vw,22px)",
            color: "var(--cr)",
            marginBottom: 20,
            textAlign: "center"
          }}>
            {isTa ? "எங்களை தொடர்பு கொள்ளுங்கள்" : "Get In Touch"}
          </h3>

          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            const msg = buildWAMsg("contact", data, lang);
            window.open(waLink(ADMIN_PHONE, msg), '_blank');
            e.target.reset();
            toast(isTa ? "செய்தி அனுப்பப்பட்டது! 📬" : "Message sent! We'll reply soon 📬", "ok");
          }}>

            <div style={{ marginBottom: 16 }}>
              <input
                className="input-modern"
                name="name"
                placeholder={isTa ? "உங்கள் பெயர் *" : "Your Name *"}
                required
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <input
                className="input-modern"
                name="email"
                type="email"
                placeholder={isTa ? "மின்னஞ்சல் *" : "Email *"}
                required
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <input
                className="input-modern"
                name="phone"
                placeholder={isTa ? "தொலைபேசி எண்" : "Phone Number"}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <select
                className="input-modern"
                name="service"
                style={{ width: "100%" }}
              >
                <option value="">
                  {isTa ? "சேவை வகை தேர்ந்தெடுக்க" : "Select Service Type"}
                </option>
                {FUNCTIONS.map(f => (
                  <option key={f.id} value={f.id}>
                    {isTa ? f.ta : f.en.split("(")[0].trim()}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <textarea
                className="input-modern"
                name="message"
                placeholder={isTa ? "உங்கள் செய்தி *" : "Your Message *"}
                required
                rows={4}
                style={{ width: "100%", resize: "vertical" }}
              />
            </div>

            <button
              type="submit"
              className="btn-modern"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: 16,
                fontWeight: 600
              }}
            >
              {isTa ? "📤 செய்தி அனுப்பு" : "📤 Send Message"}
            </button>
          </form>

          <div style={{
            marginTop: 16,
            padding: 12,
            background: "rgba(46,125,50,0.1)",
            border: "1px solid rgba(67,160,71,0.2)",
            borderRadius: 8,
            textAlign: "center"
          }}>
            <div className={isTa ? "ta" : ""} style={{
              color: "#43A047",
              fontSize: 13,
              fontWeight: 600
            }}>
              {isTa ? "24 மணி நேரத்தில் பதிலளிக்கிறோம்!" : "We reply within 24 hours!"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════════════ */
function Auth({ setUser, setPg, lang }) {
  const t = T[lang]; const isTa = lang === "ta";
  const [mode, setMode] = useState("login"); const [form, setForm] = useState({ name: "", email: "", password: "" });
  const handle = () => {
    const us = DB.get("tc_users");
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    if (mode === "login") {
      const adminUser = {id:"u_admin",name:"Admin",email:"silambuvasantha@gmail.com",password:"admin123",role:"admin"};
      let users = us.length ? us : [adminUser];
      if (!us.length) {
        DB.set("tc_users", users);
      } else if (!users.find(u => u.email.trim().toLowerCase() === adminUser.email)) {
        users = [...users, adminUser];
        DB.set("tc_users", users);
      }
      const u = users.find(u => u.email.trim().toLowerCase() === email && u.password === password);
      if (!u) return toast("Invalid credentials", "err");
      setUser(u); toast("Welcome, " + u.name + "!", "ok"); setPg(u.role === "admin" ? "admin" : "home");
    }
    else {
      const name = form.name.trim();
      if (!name || !email || !password) return toast("Fill all fields", "err");
      if (us.find(u => u.email.trim().toLowerCase() === email)) return toast("Email already registered", "err");
      const u = { id: "u" + Date.now(), name, email, password, role: "user" };
      DB.set("tc_users", [...us, u]); setUser(u); toast("Account created!", "ok"); setPg("home");
    }
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#160800", padding: "80px 20px", position: "relative" }}>
      <Particles />
      <Card style={{ width: "100%", maxWidth: 400, padding: "clamp(24px,4vw,38px)", position: "relative", zIndex: 1, border: "1px solid rgba(232,135,26,.22)" }}>
        <div style={{ textAlign: "center", marginBottom: 26 }}><Kolam size={56} style={{ margin: "0 auto 12px" }} /><h2 className="en-h" style={{ fontSize: "clamp(19px,3vw,25px)", color: "var(--cr)", marginBottom: 6 }}>{mode === "login" ? "Welcome Back" : "Create Account"}</h2><p className="" style={{ color: "var(--mu)", fontSize: 13 }}>{mode === "login" ? "Sign in to manage your bookings" : "Join RVS for your special events"}</p></div>
        {mode === "register" && <Inp lang={lang} label={isTa ? "முழு பெயர்" : "Full Name"} value={form.name} onChange={v => setForm({ ...form, name: v })} icon="👤" req />}
        <Inp lang={lang} label={isTa ? "மின்னஞ்சல்" : "Email"} type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} icon="✉️" req />
        <Inp lang={lang} label={isTa ? "கடவுச்சொல்" : "Password"} type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} icon="🔒" req />
        <Btn sz="lg" lang={lang} onClick={handle} style={{ width: "100%", marginBottom: 13 }}>{mode === "login" ? (isTa ? "உள்நுழைக →" : "Sign In →") : (isTa ? "கணக்கு உருவாக்கு →" : "Create Account →")}</Btn>
        <p className={isTa ? "ta" : ""} style={{ textAlign: "center", color: "var(--mu)", fontSize: 13 }}>{mode === "login" ? (isTa ? "கணக்கு இல்லையா? " : "No account? ") : (isTa ? "ஏற்கனவே உள்ளதா? " : "Already registered? ")}<button className={isTa ? "ta" : ""} onClick={() => setMode(m => m === "login" ? "register" : "login")} style={{ background: "none", border: "none", color: "var(--sf)", cursor: "pointer", fontWeight: 700, fontFamily: "inherit" }}>{mode === "login" ? (isTa ? "பதிவு செய்க" : "Register") : (isTa ? "உள்நுழைக" : "Sign In")}</button></p>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADMIN — with notification triggers on status change
══════════════════════════════════════════════════════════════ */
function Admin({ lang }) {
  const t = T[lang]; const isTa = lang === "ta";
  const [bks, setBks] = useState(() => DB.get("tc_bk"));
  const [slots, setSlots] = useState(() => DB.obj("tc_slots"));
  const [tab, setTab] = useState("bookings");
  const [filter, setFilter] = useState("All");
  const [calMonth, setCalMonth] = useState(new Date());

  const updSt = (id, status) => {
    const u = bks.map(b => b.id === id ? { ...b, status } : b); DB.set("tc_bk", u); setBks(u);
    const bk = bks.find(b => b.id === id);
    // ── Push notification to CLIENT
    if (bk) {
      const type = status === "Approved" ? "approved" : status === "Rejected" ? "rejected" : status === "Completed" ? "completed" : "new";
      pushNotif({ type, target: "client", bkId: bk.id, name: bk.name, phone: bk.phone, func: bk.func, date: bk.date, time: bk.time, guests: bk.guests, food: bk.food, address: bk.address });
    }
    toast((isTa ? "நிலை:" : "Status:") + " " + (isTa ? t[status.toLowerCase()] : status), "ok");
  };
  const togSlot = (d, tt) => {
    const key = d + "-" + tt; const bl = slots.blocked || []; const nb = bl.includes(key) ? bl.filter(k => k !== key) : [...bl, key];
    const ns = { ...slots, blocked: nb }; DB.set("tc_slots", ns); setSlots(ns);
    toast(bl.includes(key) ? (isTa ? "திறக்கப்பட்டது" : "Unblocked") : (isTa ? "தடுக்கப்பட்டது" : "Blocked"), "info");
  };

  const stats = [[isTa ? "மொத்த முன்பதிவுகள்" : "Total Bookings", bks.length, "📋", "var(--sf)"], [isTa ? "நிலுவையில்" : "Pending", bks.filter(b => b.status === "Pending").length, "⏳", "#D4AC0D"], [isTa ? "அங்கீகரிப்பு" : "Approved", bks.filter(b => b.status === "Approved").length, "✅", "#43A047"], [isTa ? "உறுதிப்பட்டவை" : "Confirmed", bks.filter(b => ["Approved", "Completed"].includes(b.status)).length, "✨", "#AB47BC"]];
  const fBks = filter === "All" ? bks : bks.filter(b => b.status === filter);

  return (
    <div style={{ padding: "clamp(60px,8vw,100px) clamp(16px,6%,80px)", minHeight: "100vh", background: "#160800" }}>
      <SecHead label={isTa ? "நிர்வாகி" : "Admin"} title={isTa ? "கட்டுப்பாட்டு பலகை" : "Dashboard"} sub={isTa ? "அனைத்து முன்பதிவுகள், நேர இடங்கள் மற்றும் வாடிக்கையாளர் விவரங்களை நிர்வகிக்கவும்." : "Manage all bookings, slots and customer details."} lang={lang} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 32 }} className="g4">
        {stats.map(([l, v, ic, c]) => (
          <Card key={l} style={{ padding: "clamp(14px,2vw,22px)", textAlign: "center", cursor: "default" }} nohov>
            <div style={{ fontSize: "clamp(22px,3vw,30px)", marginBottom: 7 }}>{ic}</div>
            <div className="en-h" style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: c }}>{v}</div>
            <div className={isTa ? "ta" : ""} style={{ fontSize: "clamp(10px,1.2vw,12px)", color: "var(--mu)", marginTop: 3 }}>{l}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", gap: 7, marginBottom: 24, flexWrap: "wrap" }}>
        {[["bookings", isTa ? "முன்பதிவுகள்" : "Bookings"], ["analytics", isTa ? "பகுப்பாய்வு" : "Analytics"], ["calendar", isTa ? "காலண்டர்" : "Calendar"], ["slots", isTa ? "நேர இடங்கள்" : "Slot Mgmt"], ["customers", isTa ? "வாடிக்கையாளர்கள்" : "Customers"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setTab(id)} className={isTa ? "ta" : ""} style={{ padding: "8px 17px", borderRadius: 8, fontSize: 13, fontWeight: 700, background: tab === id ? "var(--sf)" : "rgba(255,255,255,.04)", color: tab === id ? "var(--dk)" : "var(--mu)", border: "none", cursor: "pointer", transition: "all .18s", fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif" }}>{lbl}</button>
        ))}
      </div>

      {tab === "bookings" && (
        <>
          <div style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap" }}>
            {[["All", isTa ? "அனைத்தும்" : "All"], ["Pending", isTa ? "நிலுவை" : "Pending"], ["Approved", isTa ? "அங்கீகரிப்பு" : "Approved"], ["Completed", isTa ? "முடிந்தது" : "Completed"], ["Rejected", isTa ? "நிராகரிப்பு" : "Rejected"]].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)} className={isTa ? "ta" : ""} style={{ padding: "4px 13px", borderRadius: 18, fontSize: 11.5, fontWeight: 700, background: filter === v ? "rgba(232,135,26,.15)" : "rgba(255,255,255,.03)", color: filter === v ? "var(--sf)" : "var(--mu)", border: filter === v ? "1px solid rgba(232,135,26,.28)" : "1px solid rgba(255,255,255,.07)", cursor: "pointer" }}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {fBks.sort((a, b) => new Date(b.created) - new Date(a.created)).map(b => {
              const fn = FUNCTIONS.find(f => f.id === b.func);
              const waApprove = buildWAMsg("approved", { ...b, bkId: b.id }, lang);
              const waReject = buildWAMsg("rejected", { ...b, bkId: b.id }, lang);
              const waDone = buildWAMsg("completed", { ...b, bkId: b.id }, lang);
              return (
                <Card key={b.id} style={{ padding: "clamp(13px,1.8vw,18px)" }} nohov>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 11, alignItems: "flex-start", flex: 1, flexWrap: "wrap", minWidth: 0 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,var(--sf),var(--vr))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: "white", flexShrink: 0 }}>{b.name.charAt(0)}</div>
                      <div style={{ flex: 1, minWidth: 120 }}>
                        <div style={{ color: "var(--cr)", fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{b.name}</div>
                        <div style={{ color: "var(--mu)", fontSize: 12 }}>Phone {b.phone}</div>
                      </div>
                      <div style={{ minWidth: 120 }}>
                        <div className={isTa ? "ta" : ""} style={{ color: "var(--sf)", fontWeight: 600, fontSize: 13 }}>{fn?.icon} {isTa ? fn?.ta : fn?.en?.split("(")[0]}</div>
                        <div style={{ color: "var(--mu)", fontSize: 12 }}>Date {b.date} {b.time ? "· Time " + b.time : "· " + (isTa ? "நெகிழ்வான" : "Flexible")}</div>
                      </div>
                      <div><div className={isTa ? "ta" : ""} style={{ color: "var(--cr)", fontSize: 12.5, fontWeight: 600 }}>Guests {b.guests} {isTa ? "விருந்தினர்" : "guests"}</div></div>
                      <span className={"sp s-" + b.status.toLowerCase() + " " + (isTa ? "ta" : "")}>{isTa ? t[b.status.toLowerCase()] : b.status}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
                      {b.status === "Pending" && <>
                        <button onClick={() => updSt(b.id, "Approved")} className="" style={{ background: "rgba(67,160,71,.12)", border: "1px solid rgba(67,160,71,.28)", color: "#43A047", padding: "5px 12px", borderRadius: 7, fontSize: 12, cursor: "pointer", fontWeight: 700 }}>Approve</button>
                        <button onClick={() => updSt(b.id, "Rejected")} className="" style={{ background: "rgba(192,57,43,.1)", border: "1px solid rgba(192,57,43,.22)", color: "var(--vr2)", padding: "5px 12px", borderRadius: 7, fontSize: 12, cursor: "pointer", fontWeight: 700 }}>Reject</button>
                      </>}
                      {b.status === "Approved" && <button onClick={() => updSt(b.id, "Completed")} className="" style={{ background: "rgba(93,173,226,.1)", border: "1px solid rgba(93,173,226,.22)", color: "#5DADE2", padding: "5px 12px", borderRadius: 7, fontSize: 12, cursor: "pointer", fontWeight: 700 }}>{t.markDone}</button>}
                      <a href={"tel:" + b.phone} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(232,135,26,.1)", border: "1px solid rgba(232,135,26,.22)", color: "var(--sf)", padding: "5px 11px", borderRadius: 7, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Call</a>
                    </div>
                  </div>
                  {/* WhatsApp + SMS notify client row */}
                  <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(37,211,102,.04)", border: "1px solid rgba(37,211,102,.1)", borderRadius: 9 }}>
                    <div className="" style={{ fontSize: 11, color: "rgba(37,211,102,.7)", fontWeight: 700, letterSpacing: .5, textTransform: "uppercase", marginBottom: 6 }}>Notify Client</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <a href={waLink(b.phone, b.status === "Approved" ? waApprove : b.status === "Completed" ? waDone : waReject)} target="_blank" rel="noreferrer" className="sb sb-wa">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.062.522 4.046 1.535 5.799L0 24l6.345-1.508A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.032-1.374l-.361-.214-3.741.889.935-3.639-.235-.374A9.875 9.875 0 012.118 12C2.118 6.536 6.536 2.118 12 2.118s9.882 4.418 9.882 9.882-4.418 9.882-9.882 9.882z" /></svg>
                        WhatsApp
                      </a>
                      <a href={smsLink(b.phone, b.status === "Approved" ? waApprove : b.status === "Completed" ? waDone : waReject)} className="sb sb-sms">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" /></svg>
                        SMS
                      </a>
                      <a href={"tel:" + b.phone} className="sb sb-call">Call</a>
                    </div>
                  </div>
                  {b.notes && <div style={{ marginTop: 8, padding: "7px 11px", background: "rgba(232,135,26,.04)", borderRadius: 7, fontSize: 12, color: "rgba(245,166,35,.7)", borderLeft: "3px solid rgba(232,135,26,.28)" }} className="">Notes: {b.notes}</div>}
                  <div style={{ marginTop: 6, fontSize: 11, color: "rgba(255,255,255,.2)" }}>Address: {b.address} · ID: {b.id}</div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {tab === "slots" && (
        <div>
          <p className={isTa ? "ta" : ""} style={{ color: "var(--mu)", marginBottom: 18, fontSize: 13.5 }}>{isTa ? "நேர இடங்களை தடு / திற. பச்சை = கிடைக்கும், சிவப்பு = தடுக்கப்பட்டது, நீலம் = முன்பதிவு." : "Block or unblock slots. Green = free, red = blocked, blue = booked."}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {Array(8).fill(null).map((_, di) => {
              const d = new Date(); d.setDate(d.getDate() + di); const ds = d.toISOString().split("T")[0];
              const lbl = d.toLocaleDateString(isTa ? "ta-IN" : "en-IN", { weekday: "long", day: "numeric", month: "short" });
              return (
                <Card key={ds} style={{ padding: "clamp(13px,1.8vw,20px)" }} nohov>
                  <div className="" style={{ color: "var(--sf)", fontWeight: 700, marginBottom: 11, fontSize: 14 }}>Date {lbl}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {TIME_SLOTS.map(tt => { const bl = (slots.blocked || []).includes(ds + "-" + tt); const bkd = bks.some(b => b.date === ds && b.time === tt && ["Approved", "Pending"].includes(b.status)); return (<button key={tt} disabled={bkd} onClick={() => togSlot(ds, tt)} style={{ padding: "7px 11px", borderRadius: 7, fontSize: 12, fontWeight: 700, background: bkd ? "rgba(26,94,138,.15)" : bl ? "rgba(192,57,43,.14)" : "rgba(67,160,71,.1)", border: bkd ? "1px solid rgba(26,94,138,.3)" : bl ? "1px solid rgba(192,57,43,.3)" : "1px solid rgba(67,160,71,.24)", color: bkd ? "#5DADE2" : bl ? "#EF4444" : "#43A047", cursor: bkd ? "not-allowed" : "pointer" }}>{tt} {bkd ? "Booked" : bl ? "Blocked" : "Free"}</button>); })}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: "var(--mu2)" }}>Available: {TIME_SLOTS.filter(tt => !(slots.blocked || []).includes(ds + "-" + tt) && !bks.some(b => b.date === ds && b.time === tt && ["Approved", "Pending"].includes(b.status))).length}/{TIME_SLOTS.length}</div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {tab === "customers" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {bks.sort((a, b) => new Date(b.created) - new Date(a.created)).map(b => {
            const fn = FUNCTIONS.find(f => f.id === b.func);
            const waMsg = buildWAMsg("new", { ...b, bkId: b.id }, lang);
            return (
              <Card key={b.id} style={{ padding: "clamp(13px,1.8vw,20px)" }} nohov>
                <div style={{ display: "flex", gap: 13, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,var(--sf),var(--vr))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "white", flexShrink: 0 }}>{b.name.charAt(0)}</div>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <div style={{ color: "var(--cr)", fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{b.name}</div>
                    <div className={isTa ? "ta" : ""} style={{ color: "var(--mu)", fontSize: 12.5 }}>📞 {b.phone} · 📅 {b.date} · {isTa ? fn?.ta : fn?.en?.split("(")[0]}</div>
                    <div style={{ color: "var(--mu)", fontSize: 12 }}>Address {b.address}</div>
                    <div className="" style={{ color: "var(--mu)", fontSize: 11.5, marginTop: 2 }}>Guests {b.guests} · {b.food === "veg" ? t.veg : b.food === "nonveg" ? t.nonveg : t.both}</div>
                    <SendButtons phone={b.phone} waMsg={waMsg} lang={lang} callPhone={b.phone} />
                  </div>
                  <span className={"sp s-" + b.status.toLowerCase()}>{b.status}</span>
                </div>
                {b.notes && <div className="" style={{ marginTop: 9, padding: "8px 12px", background: "rgba(232,135,26,.04)", borderRadius: 7, fontSize: 12, color: "rgba(245,166,35,.65)", borderLeft: "3px solid rgba(232,135,26,.25)" }}>Notes: {b.notes}</div>}
              </Card>
            );
          })}
        </div>
      )}

      {tab === "calendar" && (
        <div>
          <p className={isTa ? "ta" : ""} style={{ color: "var(--mu)", marginBottom: 18, fontSize: 13.5 }}>{isTa ? "முன்பதிவுகளை தேதியின்படி காண்க. நிலை: புதியது (🟡), அங்கீகரிக்கப்பட்டது (🟢), முடிந்தது (🔵), நிராகரிக்கப்பட்டது (🔴)." : "View bookings by date. Status: New (🟡), Approved (🟢), Completed (🔵), Rejected (🔴)."}</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
            <button onClick={() => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() - 1))} style={{ background: "rgba(232,135,26,.1)", border: "1px solid rgba(232,135,26,.22)", color: "var(--sf)", padding: "6px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>← Prev</button>
            <span className="en-h" style={{ minWidth: 180, textAlign: "center", fontSize: 15, fontWeight: 700, color: "var(--cr)" }}>Calendar by Month</span>
            <button onClick={() => setCalMonth(d => new Date(d.getFullYear(), d.getMonth() + 1))} style={{ background: "rgba(232,135,26,.1)", border: "1px solid rgba(232,135,26,.22)", color: "var(--sf)", padding: "6px 14px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>Next →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(clamp(280px,30vw,450px),1fr))", gap: 16 }}>
            {Array(12).fill(null).map((_, mi) => {
              const d = new Date(calMonth.getFullYear(), calMonth.getMonth() + mi); const yr = d.getFullYear(); const mo = d.getMonth();
              const fd = new Date(yr, mo, 1).getDay();
              const dm = new Date(yr, mo + 1, 0).getDate();
              const monLbl = d.toLocaleString("default", { month: "short", year: "numeric" });
              return (
                <Card key={mi} style={{ padding: "clamp(14px,1.8vw,18px)" }} nohov>
                  <div className="en-h" style={{ color: "var(--sf)", fontWeight: 700, marginBottom: 12, fontSize: 13, textAlign: "center" }}>{monLbl}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 8 }}>
                    {(isTa ? ["ஞா", "திங்", "செ", "புத", "வியா", "வெ", "சனி"] : ["S", "M", "T", "W", "T", "F", "Sa"]).map(h => <div key={h} className={isTa ? "ta" : ""} style={{ textAlign: "center", fontSize: 9, color: "var(--mu)", fontWeight: 700, padding: "2px 0" }}>{h}</div>)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                    {Array(fd).fill(null).map((_, i) => <div key={"e" + i} style={{ fontSize: 10 }} />)}
                    {Array(dm).fill(null).map((_, i) => {
                      const day = i + 1; const ds = yr + "-" + String(mo + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
                      const dayBookings = bks.filter(b => b.date === ds);
                      const bkCnt = dayBookings.length; const pending = dayBookings.filter(b => b.status === "Pending").length;
                      return (
                        <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 2px", background: bkCnt > 0 ? "rgba(232,135,26,.08)" : "rgba(255,255,255,.01)", borderRadius: 4, border: bkCnt > 0 ? "1px solid rgba(232,135,26,.2)" : "1px solid rgba(255,255,255,.05)", cursor: bkCnt > 0 ? "pointer" : "default", transition: "all .15s" }}>
                          <div style={{ fontSize: 10, fontWeight: 600, color: bkCnt > 0 ? "var(--sf)" : "var(--mu)" }}>{day}</div>
                          {bkCnt > 0 && <div style={{ fontSize: 8, color: "var(--cr)", fontWeight: 700 }}>{bkCnt}</div>}
                          {pending > 0 && <div style={{ fontSize: 6, background: "#D4AC0D", color: "var(--dk)", padding: "1px 3px", borderRadius: 2, marginTop: 1 }}>P{pending}</div>}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
          <div style={{ marginTop: 24, padding: "16px 18px", background: "rgba(232,135,26,.04)", border: "1px solid rgba(232,135,26,.15)", borderRadius: 10 }}>
            <div className={isTa ? "ta" : ""} style={{ fontSize: 12.5, color: "var(--mu)", lineHeight: 1.75 }}>Legend: Each cell shows booking count for that day. 🟡 = Pending bookings (P#). Click any date to see full details in the Bookings tab.</div>
          </div>
        </div>
      )}

      {tab === "analytics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            <Card style={{ padding: "clamp(16px,2vw,20px)", textAlign: "center" }} nohov>
              <div style={{ fontSize: 28, marginBottom: 8, color: "var(--sf)" }}>💰</div>
              <div className="en-h" style={{ fontSize: 24, fontWeight: 800, color: "var(--sf2)", marginBottom: 3 }}>{bks.filter(b => b.status === "Approved" || b.status === "Completed").length}</div>
              <div className={isTa ? "ta" : ""} style={{ fontSize: 12, color: "var(--mu)" }}>{isTa ? "உறுதিப்பட்ட / முடிந்த" : "Confirmed / Completed"}</div>
            </Card>
            <Card style={{ padding: "clamp(16px,2vw,20px)", textAlign: "center" }} nohov>
              <div style={{ fontSize: 28, marginBottom: 8, color: "#43A047" }}>👥</div>
              <div className="en-h" style={{ fontSize: 24, fontWeight: 800, color: "#43A047", marginBottom: 3 }}>{bks.reduce((sum, b) => sum + parseInt(b.guests || 0), 0)}</div>
              <div className={isTa ? "ta" : ""} style={{ fontSize: 12, color: "var(--mu)" }}>{isTa ? "மொத்த விருந்தினர்கள்" : "Total Guests Served"}</div>
            </Card>
            <Card style={{ padding: "clamp(16px,2vw,20px)", textAlign: "center" }} nohov>
              <div style={{ fontSize: 28, marginBottom: 8, color: "#5DADE2" }}>📅</div>
              <div className="en-h" style={{ fontSize: 24, fontWeight: 800, color: "#5DADE2", marginBottom: 3 }}>{new Set(bks.map(b => b.date)).size}</div>
              <div className={isTa ? "ta" : ""} style={{ fontSize: 12, color: "var(--mu)" }}>{isTa ? "வெவ்வேறு தேதிகள்" : "Unique Event Dates"}</div>
            </Card>
            <Card style={{ padding: "clamp(16px,2vw,20px)", textAlign: "center" }} nohov>
              <div style={{ fontSize: 28, marginBottom: 8, color: "#D4AC0D" }}>📊</div>
              <div className="en-h" style={{ fontSize: 24, fontWeight: 800, color: "#D4AC0D", marginBottom: 3 }}>{((bks.filter(b => b.status === "Approved" || b.status === "Completed").length / bks.length) * 100).toFixed(0)}%</div>
              <div className={isTa ? "ta" : ""} style={{ fontSize: 12, color: "var(--mu)" }}>{isTa ? "வெற்றির விகிதம்" : "Success Rate"}</div>
            </Card>
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 className={isTa ? "ta" : ""} style={{ color: "var(--cr)", fontSize: 16, fontWeight: 700 }}>{isTa ? "பல்வேறு விழாக்கள்" : "Event Type Distribution"}</h3>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12 }}>
              {FUNCTIONS.map(fn => {
                const cnt = bks.filter(b => b.func === fn.id).length;
                return (
                  <Card key={fn.id} style={{ padding: "12px", textAlign: "center", opacity: cnt > 0 ? 1 : 0.5 }} nohov>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{fn.icon}</div>
                    <div className={isTa ? "ta" : ""} style={{ fontSize: 11, color: "var(--mu)", marginBottom: 4, minHeight: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{isTa ? fn.ta : fn.en.split("(")[0]}</div>
                    <div className="en-h" style={{ fontSize: 18, fontWeight: 800, color: fn.col }}>{cnt}</div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 className={isTa ? "ta" : ""} style={{ color: "var(--cr)", fontSize: 16, fontWeight: 700 }}>{isTa ? "সব মুকাবেলা তালিকা" : "All Bookings Table"}</h3>
              <button onClick={() => exportToExcel(bks, lang)} style={{ background: "var(--sf)", color: "var(--dk)", padding: "7px 16px", borderRadius: 7, fontSize: 12.5, fontWeight: 700, border: "none", cursor: "pointer", transition: "all .2s" }} onMouseEnter={e => e.target.style.opacity = "0.85"} onMouseLeave={e => e.target.style.opacity = "1"}>📊 {isTa ? "Excel" : "Export Excel"}</button>
            </div>
            <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid rgba(232,135,26,.15)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "rgba(232,135,26,.08)", borderBottom: "2px solid rgba(232,135,26,.2)" }}>
                    <th style={{ padding: "11px 10px", textAlign: "left", color: "var(--sf)", fontWeight: 700 }}>ID</th>
                    <th style={{ padding: "11px 10px", textAlign: "left", color: "var(--sf)", fontWeight: 700 }}>{isTa ? "பெயர்" : "Name"}</th>
                    <th style={{ padding: "11px 10px", textAlign: "left", color: "var(--sf)", fontWeight: 700 }}>{isTa ? "தொலைபேசி" : "Phone"}</th>
                    <th style={{ padding: "11px 10px", textAlign: "left", color: "var(--sf)", fontWeight: 700 }}>{isTa ? "நிகழ்வு" : "Function"}</th>
                    <th style={{ padding: "11px 10px", textAlign: "left", color: "var(--sf)", fontWeight: 700 }}>{isTa ? "தேதி" : "Date"}</th>
                    <th style={{ padding: "11px 10px", textAlign: "left", color: "var(--sf)", fontWeight: 700 }}>{isTa ? "விருந்தினர்" : "Guests"}</th>
                    <th style={{ padding: "11px 10px", textAlign: "left", color: "var(--sf)", fontWeight: 700 }}>{isTa ? "நிலை" : "Status"}</th>
                  </tr>
                </thead>
                <tbody>
                  {bks.sort((a, b) => new Date(b.created) - new Date(a.created)).map((b, idx) => {
                    const fn = FUNCTIONS.find(f => f.id === b.func);
                    const statusColor = b.status === "Pending" ? "#D4AC0D" : b.status === "Approved" ? "#43A047" : b.status === "Completed" ? "#5DADE2" : "#E74C3C";
                    return (
                      <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: idx % 2 === 0 ? "rgba(232,135,26,.02)" : "transparent" }}>
                        <td style={{ padding: "10px", color: "var(--mu)", fontSize: 11 }}>{b.id.substring(0, 6)}...</td>
                        <td style={{ padding: "10px", color: "var(--cr)", fontWeight: 600 }}>{b.name}</td>
                        <td style={{ padding: "10px", color: "var(--mu)" }}>{b.phone}</td>
                        <td style={{ padding: "10px", color: "var(--mu)" }}>{isTa ? fn?.ta : fn?.en?.split("(")[0]}</td>
                        <td style={{ padding: "10px", color: "var(--mu)" }}>{b.date}</td>
                        <td style={{ padding: "10px", color: "var(--mu)", fontWeight: 600 }}>{b.guests}</td>
                        <td style={{ padding: "10px" }}><span className={"sp s-" + b.status.toLowerCase()} style={{ fontSize: 11 }}>{b.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TICKER + FOOTER
══════════════════════════════════════════════════════════════ */
function Ticker({ lang }) {
  const txt = T[lang].ticker;
  return (
    <div style={{ background: "linear-gradient(90deg,var(--vr),var(--mk,#4A0E0E),var(--vr))", borderTop: "1px solid rgba(232,135,26,.18)", borderBottom: "1px solid rgba(232,135,26,.18)", padding: "8px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
      <div style={{ display: "inline-block", animation: "marquee 30s linear infinite" }}>
        <span className={lang === "ta" ? "ta" : ""} style={{ fontSize: 12.5, fontWeight: 600, color: "#FFF9E6", letterSpacing: .4 }}>{txt} &nbsp;&nbsp;&nbsp;{txt}</span>
      </div>
    </div>
  );
}
function Footer({ setPg, lang }) {
  const t = T[lang]; const isTa = lang === "ta";
  return (
    <footer style={{ background: "#0A0400", backgroundImage: "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 300%22><defs><pattern id=%22spice%22 x=%220%22 y=%220%22 width=%22100%22 height=%22100%22 patternUnits=%22userSpaceOnUse%22><circle cx=%2250%22 cy=%2250%22 r=%2215%22 fill=%22rgba(232,135,26,.08)%22/></pattern></defs><rect width=%221200%22 height=%22300%22 fill=%22%230A0400%22/><rect width=%221200%22 height=%22300%22 fill=%22url(%23spice)%22/></svg>')", backgroundAttachment: "fixed", borderTop: "1px solid rgba(232,135,26,.1)", padding: "clamp(36px,5.5vw,56px) clamp(16px,6%,80px) clamp(18px,3vw,26px)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(clamp(160px,18vw,210px),1fr))", gap: "clamp(22px,3.5vw,36px)", marginBottom: "clamp(22px,3.5vw,36px)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
            <img src="/logo.png" alt="RVS Logo" style={{ width: 38, height: 38, borderRadius: 9, objectFit: "contain" }} />
            <div><div className={isTa ? "ta-h en-h" : "en-h"} style={{ fontSize: 15, fontWeight: 700, color: "var(--cr)", lineHeight: 1 }}>{t.brand}</div><div className={isTa ? "ta" : ""} style={{ fontSize: 8, color: "var(--sf)", letterSpacing: 1, textTransform: "uppercase" }}>{t.sub}</div></div>
          </div>
          <p className={isTa ? "ta" : ""} style={{ color: "var(--mu)", fontSize: 12.5, lineHeight: 1.8 }}>{t.fdesc}</p>
        </div>
        <div>
          <div className={isTa ? "ta" : ""} style={{ color: "var(--sf)", fontWeight: 700, fontSize: 11.5, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 13 }}>{isTa ? "நிகழ்வுகள்" : "Functions"}</div>
          {FUNCTIONS.slice(0, 6).map(f => <button key={f.id} onClick={() => setPg("services")} className={isTa ? "ta" : ""} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "var(--mu)", fontSize: 12.5, cursor: "pointer", padding: "2px 0", textAlign: "left", fontFamily: isTa ? "'Tiro Tamil','Catamaran',sans-serif" : "'Catamaran',sans-serif" }}><span style={{ fontSize: 12 }}>{f.icon}</span>{isTa ? f.ta : f.en.split("(")[0].trim()}</button>)}
        </div>
        <div>
          <div className={isTa ? "ta" : ""} style={{ color: "var(--sf)", fontWeight: 700, fontSize: 11.5, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 13 }}>{isTa ? "உணவுகள்" : "Foods"}</div>
          {MENU.veg.slice(0, 5).map(f => <div key={f.ne} className={isTa ? "ta" : ""} style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--mu)", fontSize: 12.5, padding: "2px 0" }}><span className="vd" />{isTa ? f.nt : f.ne}</div>)}
        </div>
        <div>
          <div className={isTa ? "ta" : ""} style={{ color: "var(--sf)", fontWeight: 700, fontSize: 11.5, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 13 }}>{isTa ? "தொடர்பு" : "Contact"}</div>
          {[[isTa ? "💬 WhatsApp" : "💬 WhatsApp", "+91 97517 89854"], [isTa ? "☎️ Call" : "☎️ Call", "+91 91591 92568"], ["✉️", "silambuvasantha@gmail.com"], ["⏰", isTa ? "காலை 7 - இரவு 10" : "7AM – 10PM Daily"]].map(([ic, v]) => (
            <div key={v} style={{ display: "flex", gap: 7, color: "var(--mu)", fontSize: 12, marginBottom: 6, alignItems: "flex-start" }}><span style={{ flexShrink: 0 }}>{ic}</span><span className={isTa ? "ta" : ""}>{v}</span></div>
          ))}
        </div>
      </div>
      <div className="kb" style={{ paddingTop: "clamp(18px,2.5vw,26px)", borderTop: "1px solid rgba(232,135,26,.1)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <p className={isTa ? "ta" : ""} style={{ color: "var(--mu2)", fontSize: 11.5 }}>© 2026 {t.brand}. All Rights Reserved.</p>
          <a href="https://www.techyoxtech.com" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", color: "var(--sf)", fontSize: 12, fontWeight: 600, transition: "all .2s", padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(232,135,26,.2)" }} onMouseEnter={e => { e.currentTarget.style.color = "var(--sf2)"; e.currentTarget.style.background = "rgba(232,135,26,.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }} onMouseLeave={e => { e.currentTarget.style.color = "var(--sf)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}>
            <span style={{ color: "var(--mu2)", fontSize: 11 }}>Powered by</span>
            <img src="/techyoxtech-text.png" alt="TechyoXTech" style={{ height: 16, objectFit: "contain" }} />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [pg, setPg] = useState("home");
  const [lang, setLang] = useState("ta");
  const [user, setUser] = useState(null);
  const toasts = useToasts();

  useEffect(() => { initDB(); }, []);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [pg]);

  const go = useCallback(p => setPg(p), []);

  const render = () => {
    switch (pg) {
      case "home": return (<><Hero setPg={go} lang={lang} /><Ticker lang={lang} /><Services setPg={go} lang={lang} /><MenuSec lang={lang} /><Booking user={user} lang={lang} /><Reviews lang={lang} /><Contact lang={lang} /><Footer setPg={go} lang={lang} /></>);
      case "services": return (<><div style={{ height: 62 }} /><Services setPg={go} lang={lang} /><Footer setPg={go} lang={lang} /></>);
      case "menu": return (<><div style={{ height: 62 }} /><MenuSec lang={lang} /><Footer setPg={go} lang={lang} /></>);
      case "booking": return (<><div style={{ height: 62 }} /><Booking user={user} lang={lang} /><Footer setPg={go} lang={lang} /></>);
      case "reviews": return (<><div style={{ height: 62 }} /><Reviews lang={lang} /><Footer setPg={go} lang={lang} /></>);
      case "contact": return (<><div style={{ height: 62 }} /><Contact lang={lang} /><Footer setPg={go} lang={lang} /></>);
      case "auth": return <Auth setUser={setUser} setPg={go} lang={lang} />;
      case "admin": return user?.role === "admin" ? (<><div style={{ height: 62 }} /><Admin lang={lang} /><Footer setPg={go} lang={lang} /></>) : <Auth setUser={setUser} setPg={go} lang={lang} />;
      case "history": return user ? (<><div style={{ height: 62 }} /><BookingHistory user={user} lang={lang} setPg={go} /><Footer setPg={go} lang={lang} /></>) : <Auth setUser={setUser} setPg={go} lang={lang} />;
      default: return null;
    }
  };


  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tiro+Tamil:ital@0;1&family=Catamaran:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap" />
      <div className="toast-box">{toasts.map(t => <div key={t.id} className={"toast t-" + t.type}>{t.type === "ok" ? "OK" : t.type === "err" ? "Error" : "Info"} {t.msg}</div>)}</div>
      <Nav pg={pg} setPg={go} lang={lang} setLang={setLang} user={user} setUser={setUser} />
      <main>{render()}</main>
    </>
  );
}
