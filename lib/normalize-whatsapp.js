/**
 * Normalisasi nomor WhatsApp untuk deduplikasi.
 *
 * Aturan:
 * - Hapus spasi, tanda hubung, dan tanda kurung
 * - Kalau diawali 0 (format lokal Indonesia), ganti jadi +62
 * - Kalau diawali +, biarkan apa adanya (sudah ada kode negara)
 * - Kalau tidak diawali 0 atau +, biarkan apa adanya
 */
export function normalizeWhatsapp(raw) {
  if (!raw || typeof raw !== 'string') {
    return '';
  }

  // Hapus spasi, tanda hubung, dan tanda kurung
  let cleaned = raw.replace(/[\s\-\(\)]/g, '');

  // Kalau diawali 0, ganti jadi +62 (format Indonesia)
  if (cleaned.startsWith('0')) {
    cleaned = '+62' + cleaned.slice(1);
  }

  return cleaned;
}
