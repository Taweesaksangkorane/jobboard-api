export interface Province {
  id: string;
  nameTh: string;
  nameEn: string;
  region?: string;
}

export const ALL_PROVINCES_VALUE = 'all';

/**
 * Complete list of all 77 provinces of Thailand.
 * Bangkok (กรุงเทพมหานคร) is placed first as requested,
 * followed by the remaining 76 provinces sorted alphabetically in Thai.
 */
export const THAI_PROVINCES: Province[] = [
  // 1. กรุงเทพมหานคร (Bangkok - Special Administrative Area / Priority)
  { id: 'bkk', nameTh: 'กรุงเทพมหานคร', nameEn: 'Bangkok', region: 'Central' },

  // Remaining 76 Provinces in Thai alphabetical order
  { id: 'krabi', nameTh: 'กระบี่', nameEn: 'Krabi', region: 'South' },
  { id: 'kanchanaburi', nameTh: 'กาญจนบุรี', nameEn: 'Kanchanaburi', region: 'West' },
  { id: 'kalasin', nameTh: 'กาฬสินธุ์', nameEn: 'Kalasin', region: 'Northeast' },
  { id: 'kamphaeng-phet', nameTh: 'กำแพงเพชร', nameEn: 'Kamphaeng Phet', region: 'Central' },
  { id: 'khon-kaen', nameTh: 'ขอนแก่น', nameEn: 'Khon Kaen', region: 'Northeast' },
  { id: 'chanthaburi', nameTh: 'จันทบุรี', nameEn: 'Chanthaburi', region: 'East' },
  { id: 'chachoengsao', nameTh: 'ฉะเชิงเทรา', nameEn: 'Chachoengsao', region: 'East' },
  { id: 'chon-buri', nameTh: 'ชลบุรี', nameEn: 'Chon Buri', region: 'East' },
  { id: 'chai-nat', nameTh: 'ชัยนาท', nameEn: 'Chai Nat', region: 'Central' },
  { id: 'chaiyaphum', nameTh: 'ชัยภูมิ', nameEn: 'Chaiyaphum', region: 'Northeast' },
  { id: 'chumphon', nameTh: 'ชุมพร', nameEn: 'Chumphon', region: 'South' },
  { id: 'chiang-rai', nameTh: 'เชียงราย', nameEn: 'Chiang Rai', region: 'North' },
  { id: 'chiang-mai', nameTh: 'เชียงใหม่', nameEn: 'Chiang Mai', region: 'North' },
  { id: 'trang', nameTh: 'ตรัง', nameEn: 'Trang', region: 'South' },
  { id: 'trat', nameTh: 'ตราด', nameEn: 'Trat', region: 'East' },
  { id: 'tak', nameTh: 'ตาก', nameEn: 'Tak', region: 'West' },
  { id: 'nakhon-nayok', nameTh: 'นครนายก', nameEn: 'Nakhon Nayok', region: 'Central' },
  { id: 'nakhon-pathom', nameTh: 'นครปฐม', nameEn: 'Nakhon Pathom', region: 'Central' },
  { id: 'nakhon-phanom', nameTh: 'นครพนม', nameEn: 'Nakhon Phanom', region: 'Northeast' },
  { id: 'nakhon-ratchasima', nameTh: 'นครราชสีมา', nameEn: 'Nakhon Ratchasima', region: 'Northeast' },
  { id: 'nakhon-si-thammarat', nameTh: 'นครศรีธรรมราช', nameEn: 'Nakhon Si Thammarat', region: 'South' },
  { id: 'nakhon-sawan', nameTh: 'นครสวรรค์', nameEn: 'Nakhon Sawan', region: 'Central' },
  { id: 'nonthaburi', nameTh: 'นนทบุรี', nameEn: 'Nonthaburi', region: 'Central' },
  { id: 'narathiwat', nameTh: 'นราธิวาส', nameEn: 'Narathiwat', region: 'South' },
  { id: 'nan', nameTh: 'น่าน', nameEn: 'Nan', region: 'North' },
  { id: 'bueng-kan', nameTh: 'บึงกาฬ', nameEn: 'Bueng Kan', region: 'Northeast' },
  { id: 'buri-ram', nameTh: 'บุรีรัมย์', nameEn: 'Buri Ram', region: 'Northeast' },
  { id: 'pathum-thani', nameTh: 'ปทุมธานี', nameEn: 'Pathum Thani', region: 'Central' },
  { id: 'prachuap-khiri-khan', nameTh: 'ประจวบคีรีขันธ์', nameEn: 'Prachuap Khiri Khan', region: 'West' },
  { id: 'prachin-buri', nameTh: 'ปราจีนบุรี', nameEn: 'Prachin Buri', region: 'East' },
  { id: 'pattani', nameTh: 'ปัตตานี', nameEn: 'Pattani', region: 'South' },
  { id: 'phra-nakhon-si-ayutthaya', nameTh: 'พระนครศรีอยุธยา', nameEn: 'Phra Nakhon Si Ayutthaya', region: 'Central' },
  { id: 'phayao', nameTh: 'พะเยา', nameEn: 'Phayao', region: 'North' },
  { id: 'phangnga', nameTh: 'พังงา', nameEn: 'Phangnga', region: 'South' },
  { id: 'phichit', nameTh: 'พิจิตร', nameEn: 'Phichit', region: 'Central' },
  { id: 'phitsanulok', nameTh: 'พิษณุโลก', nameEn: 'Phitsanulok', region: 'Central' },
  { id: 'phetchaburi', nameTh: 'เพชรบุรี', nameEn: 'Phetchaburi', region: 'West' },
  { id: 'phetchabun', nameTh: 'เพชรบูรณ์', nameEn: 'Phetchabun', region: 'Central' },
  { id: 'phrae', nameTh: 'แพร่', nameEn: 'Phrae', region: 'North' },
  { id: 'phatthalung', nameTh: 'พัทลุง', nameEn: 'Phatthalung', region: 'South' },
  { id: 'phuket', nameTh: 'ภูเก็ต', nameEn: 'Phuket', region: 'South' },
  { id: 'maha-sarakham', nameTh: 'มหาสารคาม', nameEn: 'Maha Sarakham', region: 'Northeast' },
  { id: 'mukdahan', nameTh: 'มุกดาหาร', nameEn: 'Mukdahan', region: 'Northeast' },
  { id: 'mae-hong-son', nameTh: 'แม่ฮ่องสอน', nameEn: 'Mae Hong Son', region: 'North' },
  { id: 'yasothon', nameTh: 'ยโสธร', nameEn: 'Yasothon', region: 'Northeast' },
  { id: 'yala', nameTh: 'ยะลา', nameEn: 'Yala', region: 'South' },
  { id: 'roi-et', nameTh: 'ร้อยเอ็ด', nameEn: 'Roi Et', region: 'Northeast' },
  { id: 'ranong', nameTh: 'ระนอง', nameEn: 'Ranong', region: 'South' },
  { id: 'rayong', nameTh: 'ระยอง', nameEn: 'Rayong', region: 'East' },
  { id: 'ratchaburi', nameTh: 'ราชบุรี', nameEn: 'Ratchaburi', region: 'West' },
  { id: 'lop-buri', nameTh: 'ลพบุรี', nameEn: 'Lop Buri', region: 'Central' },
  { id: 'lampang', nameTh: 'ลำปาง', nameEn: 'Lampang', region: 'North' },
  { id: 'lamphun', nameTh: 'ลำพูน', nameEn: 'Lamphun', region: 'North' },
  { id: 'loei', nameTh: 'เลย', nameEn: 'Loei', region: 'Northeast' },
  { id: 'si-sa-ket', nameTh: 'ศรีสะเกษ', nameEn: 'Si Sa Ket', region: 'Northeast' },
  { id: 'sakon-nakhon', nameTh: 'สกลนคร', nameEn: 'Sakon Nakhon', region: 'Northeast' },
  { id: 'songkhla', nameTh: 'สงขลา', nameEn: 'Songkhla', region: 'South' },
  { id: 'satun', nameTh: 'สตูล', nameEn: 'Satun', region: 'South' },
  { id: 'samut-prakan', nameTh: 'สมุทรปราการ', nameEn: 'Samut Prakan', region: 'Central' },
  { id: 'samut-songkhram', nameTh: 'สมุทรสงคราม', nameEn: 'Samut Songkhram', region: 'Central' },
  { id: 'samut-sakhon', nameTh: 'สมุทรสาคร', nameEn: 'Samut Sakhon', region: 'Central' },
  { id: 'sa-kaeo', nameTh: 'สระแก้ว', nameEn: 'Sa Kaeo', region: 'East' },
  { id: 'saraburi', nameTh: 'สระบุรี', nameEn: 'Saraburi', region: 'Central' },
  { id: 'sing-buri', nameTh: 'สิงห์บุรี', nameEn: 'Sing Buri', region: 'Central' },
  { id: 'sukhothai', nameTh: 'สุโขทัย', nameEn: 'Sukhothai', region: 'Central' },
  { id: 'suphan-buri', nameTh: 'สุพรรณบุรี', nameEn: 'Suphan Buri', region: 'Central' },
  { id: 'surat-thani', nameTh: 'สุราษฎร์ธานี', nameEn: 'Surat Thani', region: 'South' },
  { id: 'surin', nameTh: 'สุรินทร์', nameEn: 'Surin', region: 'Northeast' },
  { id: 'nong-khai', nameTh: 'หนองคาย', nameEn: 'Nong Khai', region: 'Northeast' },
  { id: 'nong-bua-lam-phu', nameTh: 'หนองบัวลำภู', nameEn: 'Nong Bua Lam Phu', region: 'Northeast' },
  { id: 'ang-thong', nameTh: 'อ่างทอง', nameEn: 'Ang Thong', region: 'Central' },
  { id: 'amnat-charoen', nameTh: 'อำนาจเจริญ', nameEn: 'Amnat Charoen', region: 'Northeast' },
  { id: 'udon-thani', nameTh: 'อุดรธานี', nameEn: 'Udon Thani', region: 'Northeast' },
  { id: 'uttaradit', nameTh: 'อุตรดิตถ์', nameEn: 'Uttaradit', region: 'North' },
  { id: 'uthai-thani', nameTh: 'อุทัยธานี', nameEn: 'Uthai Thani', region: 'Central' },
  { id: 'ubon-ratchathani', nameTh: 'อุบลราชธานี', nameEn: 'Ubon Ratchathani', region: 'Northeast' },
];

export const TOTAL_PROVINCES = THAI_PROVINCES.length; // 77

/**
 * Finds a province by its Thai name, English name, or ID
 */
export function findProvince(query: string): Province | undefined {
  if (!query) return undefined;
  const clean = query.trim().toLowerCase();
  return THAI_PROVINCES.find(
    (p) =>
      p.nameTh === query ||
      p.nameTh.toLowerCase() === clean ||
      p.nameEn.toLowerCase() === clean ||
      p.id.toLowerCase() === clean
  );
}

/**
 * Helper to get localized province label
 */
export function getProvinceLabel(province: Province, lang: string = 'th'): string {
  if (lang === 'en') {
    return province.nameEn;
  }
  return province.nameTh;
}
