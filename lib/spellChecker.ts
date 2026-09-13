// Lightweight multi-language spell checker utility supporting en, fr, ar, es, it, de

// Common dictionary words for supported languages (automobile & general terms)
const dictionaries: Record<string, Set<string>> = {
  en: new Set([
    "car", "vehicle", "automobile", "repair", "service", "workshop", "garage", "dealer",
    "appointment", "booking", "engine", "brake", "tire", "wheel", "oil", "battery",
    "transmission", "steering", "suspension", "exhaust", "insurance", "quote", "price",
    "cost", "model", "brand", "year", "mileage", "color", "name", "email", "phone",
    "address", "city", "country", "notes", "message", "request", "submit", "cancel",
    "confirm", "select", "search", "filter", "login", "password", "username", "account",
    "profile", "settings", "dashboard", "admin", "partners", "support", "help", "about",
    "home", "welcome", "hello", "please", "thank", "you", "good", "great", "best",
    "fast", "reliable", "expert", "professional", "certified", "quality", "original",
    "spare", "parts", "accessories", "maintenance", "diagnostic", "inspection", "test",
    "drive", "speed", "fuel", "electric", "hybrid", "diesel", "petrol", "automatic",
    "manual", "gearbox", "clutch", "radiator", "alternator", "starter", "spark", "plug",
    "filter", "air", "conditioner", "heater", "windshield", "wiper", "light", "headlight",
    "dashboard", "indicator", "door", "window", "seat", "trunk", "bumper", "mirror",
    "the", "and", "for", "with", "that", "this", "from", "have", "not", "are", "was",
    "all", "at", "by", "an", "be", "or", "which", "will", "my", "your", "their", "our"
  ]),
  fr: new Set([
    "voiture", "vehicule", "automobile", "reparation", "entretien", "garage", "atelier",
    "concessionnaire", "rendez-vous", "reservation", "moteur", "frein", "pneu", "roue",
    "huile", "batterie", "boite", "vitesse", "direction", "suspension", "echappement",
    "assurance", "devis", "prix", "cout", "modele", "marque", "annee", "kilometrage",
    "couleur", "nom", "email", "telephone", "adresse", "ville", "pays", "notes", "message",
    "demande", "soumettre", "annuler", "confirmer", "selectionner", "rechercher", "filtre",
    "connexion", "mot", "passe", "utilisateur", "compte", "profil", "parametres", "tableau",
    "bord", "admin", "partenaires", "support", "aide", "propos", "accueil", "bienvenue",
    "bonjour", "merci", "s'il", "vous", "plait", "bon", "meilleur", "rapide", "fiable",
    "expert", "professionnel", "certifie", "qualite", "origine", "pieces", "detachees",
    "accessoires", "maintenance", "diagnostic", "controle", "technique", "conduite",
    "carburant", "electrique", "hybride", "diesel", "essence", "automatique", "manuelle",
    "embrayage", "radiateur", "alternateur", "demarreur", "bougie", "filtre", "air",
    "climatisation", "chauffage", "pare-brise", "essuie-glace", "phare", "porte", "fentre",
    "siege", "coffre", "pare-chocs", "retroviseur", "le", "la", "les", "un", "une", "des",
    "et", "ou", "mais", "donc", "or", "ni", "car", "dans", "sur", "sous", "par", "pour",
    "avec", "sans", "de", "du", "au", "aux", "ce", "cette", "ces", "mon", "ton", "son",
    "notre", "votre", "leur", "qui", "que", "quoi", "dont", "où", "est", "sont", "ont", "avez"
  ]),
  es: new Set([
    "coche", "vehiculo", "automovil", "reparacion", "mantenimiento", "taller", "garaje",
    "concesionario", "cita", "reserva", "motor", "freno", "neumatico", "rueda", "aceite",
    "bateria", "transmision", "direccion", "suspension", "escape", "seguro", "presupuesto",
    "precio", "costo", "modelo", "marca", "ano", "kilometraje", "color", "nombre", "correo",
    "telefono", "direccion", "ciudad", "pais", "notas", "mensaje", "solicitud", "enviar",
    "cancelar", "confirmar", "seleccionar", "buscar", "filtro", "iniciar", "sesion",
    "contrasena", "usuario", "cuenta", "perfil", "configuracion", "panel", "admin",
    "socios", "soporte", "ayuda", "inicio", "bienvenido", "hola", "por", "favor", "gracias",
    "bueno", "mejor", "rapido", "confiable", "experto", "profesional", "certificado",
    "calidad", "original", "repuestos", "piezas", "accesorios", "diagnostico", "inspeccion",
    "prueba", "conducir", "combustible", "electrico", "hibrido", "diesel", "gasolina",
    "automatico", "manual", "embrague", "radiador", "alternador", "bujia", "filtro", "aire",
    "acondicionado", "calefaccion", "parabrisas", "limpiaparabrisas", "luz", "faro",
    "puerta", "ventana", "asiento", "maletero", "parachoques", "espejo", "el", "la", "los",
    "las", "un", "una", "unos", "unas", "y", "o", "pero", "porque", "como", "en", "con",
    "sin", "sobre", "entre", "desde", "hasta", "para", "de", "del", "al", "este", "esta",
    "estos", "estas", "mi", "tu", "su", "nuestro", "vuestro", "que", "quien", "donde"
  ]),
  it: new Set([
    "auto", "veicolo", "automobile", "riparazione", "manutenzione", "officina", "garage",
    "concessionario", "appuntamento", "prenotazione", "motore", "freno", "pneumatico",
    "ruota", "olio", "batteria", "trasmissione", "sterzo", "sospensione", "scarico",
    "assicurazione", "preventivo", "prezzo", "costo", "modello", "marca", "anno",
    "chilometraggio", "colore", "nome", "email", "telefono", "indirizzo", "citta",
    "paese", "note", "messaggio", "richiesta", "inviare", "annullare", "confermare",
    "selezionare", "cercare", "filtro", "accesso", "password", "utente", "profilo",
    "impostazioni", "dashboard", "admin", "partner", "supporto", "aiuto", "home",
    "benvenuto", "ciao", "prego", "grazie", "buono", "migliore", "veloce", "affidabile",
    "esperto", "professionale", "certificato", "qualita", "originale", "ricambi", "parti",
    "accessori", "diagnostica", "ispezione", "prova", "guida", "carburante", "elettrico",
    "ibrido", "diesel", "benzina", "automatico", "manuale", "frizione", "radiatore",
    "alternatore", "candela", "filtro", "aria", "climatizzatore", "riscaldamento",
    "parabrezza", "tergicristallo", "luce", "faro", "porta", "finestrino", "sedile",
    "bagagliaio", "paraurti", "specchietto", "il", "lo", "la", "i", "gli", "le", "un",
    "uno", "una", "e", "o", "ma", "perche", "come", "in", "con", "su", "per", "tra",
    "fra", "da", "di", "del", "dello", "della", "dei", "degli", "delle", "questo",
    "questa", "questi", "queste", "mio", "tuo", "suo", "nostro", "vostro", "loro", "che"
  ]),
  de: new Set([
    "auto", "fahrzeug", "kraftfahrzeug", "reparatur", "wartung", "werkstatt", "garage",
    "haendler", "termin", "buchung", "motor", "bremse", "reifen", "rad", "oel",
    "batterie", "getriebe", "lenkung", "aufhaengung", "auspuff", "versicherung",
    "angebot", "preis", "kosten", "modell", "marke", "baujahr", "kilometerstand",
    "farbe", "name", "telefon", "adresse", "stadt", "land", "notiz", "nachricht",
    "anfrage", "senden", "abbrechen", "bestaetigen", "auswaehlen", "suchen", "filter",
    "anmeldung", "passwort", "benutzer", "konto", "profil", "einstellungen", "dashboard",
    "admin", "partner", "support", "hilfe", "startseite", "willkommen", "hallo",
    "bitte", "danke", "gut", "bester", "schnell", "zuverlaessig", "experte",
    "professionell", "zertifiziert", "qualitaet", "original", "ersatzteile", "zubehoer",
    "diagnose", "inspektion", "probefahrt", "kraftstoff", "elektro", "hybrid", "diesel",
    "benzin", "automatik", "schaltung", "kupplung", "kuehler", "lichtmaschine",
    "zuendkerze", "filter", "luft", "klimaanlage", "heizung", "windschutzscheibe",
    "scheibenwischer", "licht", "scheinwerfer", "tuer", "fenster", "sitz", "kofferraum",
    "stossstange", "spiegel", "der", "die", "das", "ein", "eine", "und", "oder", "aber",
    "weil", "in", "an", "auf", "fuer", "mit", "ohne", "von", "zu", "nach", "bei", "ueber",
    "unter", "vor", "hinter", "dieser", "diese", "dieses", "mein", "dein", "sein",
    "unser", "euer", "ihr", "wer", "was", "wie", "wo", "wann", "warum"
  ]),
  ar: new Set([
    "سيارة", "مركبة", "إصلاح", "صيانة", "ورشة", "مرآب", "وكيل", "موعد", "حجز",
    "محرك", "فرامل", "إطار", "عجلة", "زيت", "بطارية", "ناقل", "حركة", "توجيه",
    "تعليق", "عادم", "تأمين", "عرض", "سعر", "تكلفة", "طراز", "علامة", "سنة",
    "مسافة", "لون", "اسم", "بريد", "هاتف", "عنوان", "مدينة", "دولة", "ملاحظات",
    "رسالة", "طلب", "إرسال", "إلغاء", "تأكيد", "تحديد", "بحث", "تصفية", "دخول",
    "كلمة", "مرور", "مستخدم", "حساب", "ملف", "إعدادات", "لوحة", "تحكم", "مسؤول",
    "شركاء", "دعم", "مساعدة", "رئيسية", "ترحيب", "مرحباً", "شكراً", "من فضلك",
    "جيد", "أفضل", "سريع", "موثوق", "خبير", "مهني", "معتمد", "جودة", "أصلي",
    "قطع", "غيار", "إكسسوارات", "تشخيص", "فحص", "قيادة", "وقود", "كهربائي",
    "هجين", "ديزل", "بنزين", "آلي", "يدوي", "قابض", "مبرد", "مولد", "شمعة",
    "تكييف", "تدفئة", "زجاج", "مسّاحات", "ضوء", "مصباح", "باب", "نافذة", "مقعد",
    "صندوق", "مصد", "مرآة", "في", "من", "إلى", "على", "عن", "مع", "هذا", "هذه",
    "ذلك", "الذي", "التي", "و", "أو", "لكن", "أن", "إن", "لا", "نعم", "كل", "بعض"
  ])
};

// Levenshtein distance for fuzzy matching suggestions
function getLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1  // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function checkWordSpelling(word: string, locale: string): { isCorrect: boolean; suggestions: string[] } {
  const cleanWord = word.trim().toLowerCase();
  if (!cleanWord || cleanWord.length <= 2 || /^\d+$/.test(cleanWord) || /^[^\w]+$/.test(cleanWord)) {
    return { isCorrect: true, suggestions: [] };
  }

  const dict = dictionaries[locale] || dictionaries["en"] || new Set();
  if (dict.has(cleanWord)) {
    return { isCorrect: true, suggestions: [] };
  }

  // Find top 3 suggestions using Levenshtein distance
  const scored: { word: string; dist: number }[] = [];
  dict.forEach((dictWord) => {
    // Only compare words of similar length for performance & relevance
    if (Math.abs(dictWord.length - cleanWord.length) <= 3) {
      const dist = getLevenshteinDistance(cleanWord, dictWord);
      if (dist <= 2) {
        scored.push({ word: dictWord, dist });
      }
    }
  });

  scored.sort((a, b) => a.dist - b.dist);
  const suggestions = scored.slice(0, 3).map((s) => s.word);

  return {
    isCorrect: false,
    suggestions,
  };
}
