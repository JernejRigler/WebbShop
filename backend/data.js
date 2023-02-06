import bcrypt from 'bcryptjs';
let data = {
  uporabniki: [
    {
      imeUporabnika: 'Jernej',
      email: 'admin@neki.com',
      geslo: bcrypt.hashSync('1234'),
      praviceAdmina: true,
    },
    {
      imeUporabnika: 'Mark',
      email: 'markec@neki.com',
      geslo: bcrypt.hashSync('1234'),
      praviceAdmina: false,
    },
  ],
  izdelki: [
    {
      imeIzdelka: 'Samsung Galaxy Z Fold3 mobilni telefon 12 GB/256 GB',
      //_id: '100001',
      cena: 1799.99,
      kategorijaIzdelka: 'Telefoni',
      alt: 'samsung-galaxy-z-fold3-mobilni-telefon-12-GB-256-GB',
      slika: '/slike/slika1.jpg',
      zaloga: 0,
      znamka: 'Samsung',
      ocena: 5,
      opis: 'Zložljiv telefon Samsung Galaxy Z Fold tretje generacije odlikuje zunanji 15,7 cm (6,2") velik dinamični AMOLED 2X 120 Hz zaslon z ločljivostjo 2268 x 832 px in steklom Gorilla Glass Victus, notranji 15,7 cm (7,6") velik dinamični zaslon AMOLED 2X 120 Hz z ločljivostjo 2208 × 1768 px in HDR, Android 11, super zmogljiv 8 -jedrni procesor Qualcomm Snapdragon 888 z omrežno podporo 5G, kapaciteto 12 GB/256 GB. Trojna ultra širokokotna kamera 12 + 12+ 12 Mpx, notranjo 4 Mpx in zunanjo kamero za selfie 10Mpx. Baterija 4400 mAh, zaščita IPX8, hitro polnjenje 25 W, brezžično polnjenje, NFC, bralnik prstnih odtisov, Dolby Atmos.',
      steviloOcen: 3,
    },
    {
      imeIzdelka: 'realme C11 2021 mobilni telefon 2GB/32GB moder',
      //_id: '100002',
      cena: 99.99,
      kategorijaIzdelka: 'Telefoni',
      alt: 'realme-c11-2021-mobilni-telefon-2-GB-32-GB-moder',
      slika: '/slike/slika2.jpg',
      zaloga: 6,
      znamka: 'realme',
      ocena: 3.5,
      opis: 'Mobilni telefon C11 2021 odlikuje 16,51 cm (6,5") velik zaslon, operacijski sistem Android 11 z vmesnikom Realme Go UI, zmogljiv 8-jedrni procesor Unisoc SC9863A, 2 GB/32 GB, podpora omrežja 4G/LTE, reža za pomnilniško kartico. 8 MP zadnja kamera, 5 MP kamera za selfije. Odlično delovanje baterije s 5000 mAh, podpora za obratno polnjenje, Bluetooth 4.2 in dve SIM.',
      steviloOcen: 4,
    },
    {
      imeIzdelka: 'Lenovo Tab M10 Plus G3 tablični računalnik',
      //_id: '100003',
      cena: 250.79,
      kategorijaIzdelka: 'Tablice',
      alt: 'lenovo-tab-m10-plus-g3-tablicni-racunalnik',
      slika: '/slike/slika3.jpg',
      zaloga: 11,
      znamka: 'Lenovo',
      ocena: 4,
      opis: 'Tablični računalnik Tab M10 Plus (3rd Gen) se ponaša z elegantno obliko in 27 cm (10,61") velikim zaslonom v ločljivosti 2K (2000×1200). Zmogljiv procesor MediaTek Helio G80 in delovni pomnilnik kapacitete 4 GB bosta zagotovila brezhibno delo in zabavo.',
      steviloOcen: 5,
    },
  ],
};
export default data;
