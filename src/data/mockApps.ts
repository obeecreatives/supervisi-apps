import { AppProject } from '../types';

export const initialProjects: AppProject[] = [
  {
    id: 'sfa-distribution',
    name: 'Sales Force Automation & Toko Lapangan',
    category: 'Field Operations & Sales',
    description: 'Aplikasi pencatatan kunjungan sales, pengambilan order toko, dan pelacakan stok lapangan harian. Digunakan oleh 120+ sales representative di seluruh cabang.',
    supervisionStatus: 'refactoring_gas',
    targetDatabase: 'postgresql',
    links: {
      sourceSheetUrl: 'https://docs.google.com/spreadsheets/d/1_Sample_SFA_SourceData_TokoOrders/edit',
      destinationSheetUrl: 'https://docs.google.com/spreadsheets/d/1_Sample_SFA_DailySummary_Report/edit',
      gasScriptUrl: 'https://script.google.com/home/projects/1_Sample_SFA_ScriptId/edit',
      webAppDeploymentUrl: 'https://script.google.com/macros/s/AKfycb_Sample_SFA_ExecUrl/exec',
      repoUrl: 'https://github.com/company/sfa-mobile-modern'
    },
    criticalNotes: `- Antrean LockService sering timeout 30 detik saat jam 08:30 - 09:30 WIB (absensi & check-in pagi).
- Data hilang saat sales membuka form di basement minim sinyal tanpa offline cache.
- Ukuran sheet sudah mencapai 68.500 baris, formula VLOOKUP antar tab mulai lambat.`,
    leadRecommendationNotes: `1. Segera ubah script doPost ke pola batching memory array (O(1) write) untuk menurunkan waktu eksekusi dari 3.2s ke < 300ms.
2. Migrasikan tabel transaksi order ke PostgreSQL Cloud SQL dengan relasi FK (stores -> orders -> order_items).
3. Bangun aplikasi Android Native (Kotlin + Jetpack Compose) dengan Room DB offline-first dan WorkManager sync otomatis.`,
    currentStack: {
      frontend: 'HTML5 Webview / Google Apps Script HTML Service',
      backend: 'Google Apps Script (doGet & doPost Web App URL)',
      database: 'Google Sheets (3 Tab Berantai, 68.000 baris data)',
      auth: 'Hardcoded PIN dalam Spreadsheet + Google User Email'
    },
    metrics: {
      dailyActiveUsers: 140,
      peakRequestsPerMinute: 85,
      totalRows: 68500,
      avgLatencyMs: 3200,
      errorRatePercent: 8.4
    },
    scores: [
      {
        label: 'Database Concurrency & ACID',
        currentScore: 28,
        targetScore: 95,
        unit: 'Score',
        currentValue: 'Sheets (LockService queue)',
        targetValue: 'PostgreSQL ACID (Row-Level Lock)',
        status: 'critical'
      },
      {
        label: 'API Response Latency (TTFB)',
        currentScore: 35,
        targetScore: 92,
        unit: 'ms',
        currentValue: '3,200 ms (GAS Cold Start)',
        targetValue: '< 180 ms (Fast Express/Edge)',
        status: 'critical'
      },
      {
        label: 'Mobile Offline Readiness',
        currentScore: 15,
        targetScore: 98,
        unit: 'Score',
        currentValue: 'Tidak Ada (Webview Blank saat Offline)',
        targetValue: 'Room DB Offline-First + WorkManager',
        status: 'critical'
      },
      {
        label: 'Quota & Scalability Safety',
        currentScore: 40,
        targetScore: 90,
        unit: 'Score',
        currentValue: 'Risiko Quota Read/Write 300 req/min',
        targetValue: 'Uncapped (Postgres + Redis Cache)',
        status: 'warning'
      }
    ],
    bottlenecks: [
      {
        id: 'b1',
        category: 'concurrency',
        title: 'LockService Contention & Timeout saat Pagi Hari',
        description: 'Saat 100+ sales melakukan check-in toko secara serentak pukul 08:30 - 09:30, `LockService.getScriptLock()` antri melebihi batas waktu (30 detik), memicu HTTP 500 dan data order gagal tercatat.',
        impact: '8.4% transaksi order gagal; sales harus input ulang manual dan komplain delay.',
        severity: 'critical',
        gasLimitContext: 'GAS LockService max timeout 30 detik. Spreadsheet tidak mendukung transaksi tingkat baris (row-level concurrency).',
        recommendedSolution: 'Migrasi endpoint mutasi ke backend Node.js terisolasi dengan PostgreSQL transaction (`BEGIN ... COMMIT`) dan pooling PgBouncer.'
      },
      {
        id: 'b2',
        category: 'database',
        title: 'Degradasi Performa Spreadsheet > 50.000 Baris',
        description: 'Eksekusi `sheet.getDataRange().getValues()` membutuhkan memori RAM besar dan waktu baca 2.8 - 4.5 detik setiap kali query filter order per tanggal dijalankan.',
        impact: 'Aplikasi terasa sangat lambat; pengguna sering refresh berulang yang justru memperparah beban antrean GAS.',
        severity: 'high',
        gasLimitContext: 'Sheets memory overhead tinggi saat serialisasi array 2 dimensi besar ke JSON.',
        recommendedSolution: 'Implementasi PostgreSQL dengan index B-Tree pada kolom `(store_id, order_date, status)` dan paginasi cursor limit 20 baris.'
      },
      {
        id: 'b3',
        category: 'mobile',
        title: 'Sinyal Drop di Toko Basement Menyebabkan Data Hilang',
        description: 'Sales di lapangan sering berada di area minim sinyal (basement, pasar tradisional). Karena aplikasi saat ini berbasis browser/webview biasa tanpa local persistent cache, form order yang sudah diisi hilang saat submit gagal.',
        impact: 'Kehilangan data pesanan barang, frustrasi pengguna lapangan, double entry.',
        severity: 'critical',
        gasLimitContext: 'GAS Web App memerlukan koneksi HTTP aktif dua arah secara instan saat eksekusi `google.script.run`.',
        recommendedSolution: 'Bangun Native Android App (Kotlin + Jetpack Compose) dengan Room Database lokal untuk offline store, serta WorkManager background sync otomatis saat sinyal pulih.'
      }
    ],
    recommendations: [
      {
        id: 'r1',
        domain: 'Database & Storage',
        title: 'Migrasi Database Primer dari Sheets ke Cloud SQL / PostgreSQL',
        summary: 'Pindahkan penyimpanan operasional harian ke PostgreSQL relasional. Google Sheets dapat tetap difungsikan sebagai read-only report viewer via background export jika manajemen masih menginginkannya.',
        currentArchitecture: 'Google Sheets multi-tab dengan VLOOKUP internal dan formula berantai.',
        proposedArchitecture: 'PostgreSQL terindeks (tabel: users, stores, orders, order_items) dengan foreign key dan audit timestamp.',
        expectedGain: 'Query latency turun dari 3.200ms ke <25ms, bebas batas sel 10 juta, 100% konsistensi ACID.',
        implementationEffort: 'Sedang (1-2 minggu)',
        priority: 'P0 - Urgent',
        keyTechStack: ['PostgreSQL / Cloud SQL', 'Drizzle ORM', 'PgBouncer'],
        actionSteps: [
          'Desain skema tabel ternormalisasi (3NF) dari data spreadsheet yang ada.',
          'Buat script ETL one-time data migrasi dari Sheet ke PostgreSQL via Service Account.',
          'Siapkan background job jika tim finance tetap membutuhkan ekspor berkala ke Google Sheets.'
        ]
      },
      {
        id: 'r2',
        domain: 'API & Gateway',
        title: 'Decoupling: Gantikan GAS doGet/doPost dengan REST API Node.js/Express',
        summary: 'Buat API Gateway tersendiri yang menangani validasi request, autentikasi JWT token, dan connection pooling langsung ke database.',
        currentArchitecture: 'Google Apps Script Web App publik dengan endpoint doGet() dan doPost().',
        proposedArchitecture: 'Node.js Express / Fastify REST API yang di-deploy di Cloud Run dengan auto-scaling.',
        expectedGain: 'Menghilangkan cold start GAS (turun dari 2.500ms ke ~90ms), bebas timeout eksekusi 6 menit.',
        implementationEffort: 'Sedang (1-2 minggu)',
        priority: 'P0 - Urgent',
        keyTechStack: ['Node.js', 'Express/TypeScript', 'Zod Validator', 'JWT Auth'],
        actionSteps: [
          'Implementasikan endpoint CRUD terpisah: POST /api/orders, GET /api/stores, POST /api/checkin.',
          'Pasang middleware JWT Authentication menggantikan pengecekan hardcoded PIN.',
          'Gunakan Zod untuk validasi skema payload sebelum menyentuh layer database.'
        ]
      },
      {
        id: 'r3',
        domain: 'Android & Mobile Client',
        title: 'Pengembangan Native Android App (Offline-First Architecture)',
        summary: 'Gantikan browser webview dengan aplikasi Android native berarsitektur MVVM + Room Database. Sales dapat membuat pesanan kapan saja tanpa ketergantungan sinyal.',
        currentArchitecture: 'Mobile Chrome Webview mengakses URL GAS Web App secara langsung.',
        proposedArchitecture: 'Kotlin + Jetpack Compose + Room Local DB + Retrofit HTTP/2 + WorkManager sync.',
        expectedGain: 'Pengalaman instan (0ms form lag), 100% pesanan terselamatkan saat offline, scanning barcode kamera 60fps.',
        implementationEffort: 'Tinggi (3-4 minggu)',
        priority: 'P1 - High',
        keyTechStack: ['Kotlin', 'Jetpack Compose', 'Room DB', 'Retrofit & OkHttp', 'WorkManager'],
        actionSteps: [
          'Setup project Android modern dengan Clean Architecture (Domain, Data, UI Layer).',
          'Implementasikan Repository Pattern dengan Room sebagai Single Source of Truth.',
          'Konfigurasikan WorkManager dengan constraint `NetworkType.CONNECTED` untuk sync otomatis berulang.'
        ]
      },
      {
        id: 'r4',
        domain: 'Backend Caching',
        title: 'Lapisan Cache Redis untuk Data Master (Katalog Produk & Toko)',
        summary: 'Data master seperti daftar harga, diskon, dan master toko jarang berubah per menit. Simpan di Redis in-memory cache dengan TTL 15-30 menit.',
        currentArchitecture: 'Setiap request membaca seluruh baris master produk dari Google Sheets.',
        proposedArchitecture: 'Redis / Upstash in-memory cache di depan query database relasional.',
        expectedGain: 'Pengurangan 80% beban query database, kecepatan response katalog < 15ms.',
        implementationEffort: 'Rendah (1-2 hari)',
        priority: 'P1 - High',
        keyTechStack: ['Redis / Valkey', 'IORedis', 'Cache-Aside Pattern'],
        actionSteps: [
          'Implementasi Cache-Aside: Cek Redis dulu; jika miss, query PostgreSQL dan set Redis TTL 900s.',
          'Buat invalidasi cache otomatis saat ada perubahan harga produk oleh admin.'
        ]
      }
    ],
    roadmap: [
      {
        phaseNumber: 1,
        name: 'Triage & Immediate GAS Optimization',
        duration: 'Minggu 1',
        status: 'in_progress',
        objective: 'Menghentikan error 500 dan LockService timeout pada sistem eksisting tanpa merombak total segera.',
        deliverables: [
          'Refactor GAS: Ganti cell-by-cell write dengan batch array `setValues()`.',
          'Implementasi `CacheService.getScriptCache()` untuk data master toko & produk (TTL 6 jam).',
          'Pemisahan spreadsheet arsip untuk data order lama (>3 bulan) agar sheet aktif < 15.000 baris.'
        ],
        riskMitigation: 'Lakukan backup spreadsheet penuh sebelum menjalankan script arsip otomatis.'
      },
      {
        phaseNumber: 2,
        name: 'Backend API Gateway & Database Foundation',
        duration: 'Minggu 2 - 3',
        status: 'planned',
        objective: 'Membangun infrastruktur backend modern dengan PostgreSQL dan REST API yang kokoh.',
        deliverables: [
          'Provisioning Cloud SQL PostgreSQL dengan connection pool PgBouncer.',
          'Setup Node.js Express TypeScript API dengan otentikasi JWT dan rate limiting.',
          'Script sinkronisasi data master dan order historical ke tabel PostgreSQL.'
        ],
        riskMitigation: 'Gunakan dual-write sementara (tulis ke DB dan background sync ke Sheets) agar operasional tidak terganggu.'
      },
      {
        phaseNumber: 3,
        name: 'Native Android Client (Offline-First)',
        duration: 'Minggu 4 - 5',
        status: 'planned',
        objective: 'Merilis aplikasi Android untuk sales lapangan dengan kapabilitas offline penuh.',
        deliverables: [
          'Aplikasi Kotlin Jetpack Compose dengan Material 3 Design System.',
          'Penyimpanan lokal Room Database + enkripsi SQLCipher untuk data offline.',
          'WorkManager background sync worker dengan exponential backoff dan deteksi konflik.'
        ],
        riskMitigation: 'Uji coba pilot di 1 cabang percontohan (15 sales) selama 5 hari sebelum rollout nasional.'
      },
      {
        phaseNumber: 4,
        name: 'Cutover Penuh & Pemantauan APM',
        duration: 'Minggu 6',
        status: 'planned',
        objective: 'Peralihan total dari Google Apps Script ke Arsitektur Baru berkinerja tinggi.',
        deliverables: [
          'Matikan endpoint mutasi GAS dan jadikan Spreadsheet hanya dashboard pelaporan opsional.',
          'Setup logging & tracing (OpenTelemetry / Prometheus) untuk SLA 99.9% uptime.',
          'Dokumentasi teknis API OpenAPI / Swagger untuk integrasi sistem ERP perusahaan.'
        ],
        riskMitigation: 'Sediakan rollback kill-switch jika terdapat anomali data integritas pada 48 jam pertama.'
      }
    ],
    codeSnippets: [
      {
        title: 'Optimasi Google Apps Script (Batching & CacheService)',
        language: 'javascript',
        description: 'Pola perbaikan langsung untuk script GAS agar tidak timeout saat menangani banyak request bersamaan.',
        legacyGasCode: `// ❌ POLA LAMA: Lambat, lock timeout, cell-by-cell write
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // Sering throw timeout di jam sibuk!
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
  var data = JSON.parse(e.postData.contents);
  
  // Baca baris satu per satu (sangat lambat!)
  for (var i = 0; i < data.items.length; i++) {
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1).setValue(data.orderId);
    sheet.getRange(lastRow + 1, 2).setValue(data.items[i].sku);
    sheet.getRange(lastRow + 1, 3).setValue(data.items[i].qty);
  }
  
  lock.releaseLock();
  return ContentService.createTextOutput("OK");
}`,
        optimizedCode: `// ✅ POLA BARU: Batching array memory + CacheService + Safe Lock Backoff
function doPostOptimized(e) {
  var lock = LockService.getScriptLock();
  var success = lock.tryLock(25000);
  if (!success) {
    return ContentService.createTextOutput(JSON.stringify({
      error: "SERVER_BUSY",
      message: "Antrean penuh, silakan retry dengan exponential backoff."
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Orders");
    var payload = JSON.parse(e.postData.contents);
    var now = new Date().toISOString();
    
    // Siapkan buffer array 2 dimensi di memori (O(1) I/O write)
    var rowsToInsert = payload.items.map(function(item) {
      return [payload.orderId, item.sku, item.qty, payload.storeId, now];
    });
    
    if (rowsToInsert.length > 0) {
      var nextRow = sheet.getLastRow() + 1;
      // Satu kali eksekusi setValues() memangkas waktu dari 3.8s menjadi 0.25s
      sheet.getRange(nextRow, 1, rowsToInsert.length, rowsToInsert[0].length)
           .setValues(rowsToInsert);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "SUCCESS", count: rowsToInsert.length }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}`
      },
      {
        title: 'Backend API Modern (Express + Drizzle PostgreSQL)',
        language: 'typescript',
        description: 'Arsitektur target dengan transaksi ACID sejati, latency < 30ms, dan kapasitas ribuan concurrent request.',
        optimizedCode: `// backend/src/controllers/orderController.ts
import { Request, Response } from 'express';
import { db } from '../db';
import { orders, orderItems } from '../db/schema';
import { z } from 'zod';

const OrderSchema = z.object({
  orderId: z.string().uuid(),
  storeId: z.string().min(1),
  items: z.array(z.object({
    sku: z.string(),
    qty: z.number().int().positive(),
    price: z.number().positive(),
  })),
});

export async function createOrder(req: Request, res: Response) {
  const validated = OrderSchema.parse(req.body);

  // Transaksi atomik database ACID sejati
  const result = await db.transaction(async (tx) => {
    // 1. Insert master order
    const [newOrder] = await tx.insert(orders).values({
      id: validated.orderId,
      storeId: validated.storeId,
      salesId: req.user.id,
      totalAmount: validated.items.reduce((acc, i) => acc + (i.price * i.qty), 0),
      status: 'SUBMITTED',
    }).returning();

    // 2. Bulk insert order items
    await tx.insert(orderItems).values(
      validated.items.map(item => ({
        orderId: newOrder.id,
        sku: item.sku,
        qty: item.qty,
        unitPrice: item.price,
      }))
    );

    return newOrder;
  });

  return res.status(201).json({ success: true, data: result });
}`
      },
      {
        title: 'Android Client (Kotlin + Room Offline-First Repository)',
        language: 'kotlin',
        description: 'Pola arsitektur offline-first pada Android agar sales tetap dapat beroperasi tanpa terhambat jaringan.',
        optimizedCode: `// OrderRepository.kt (Android Jetpack Compose + Room)
package com.company.sfa.data.repository

import com.company.sfa.data.local.OrderDao
import com.company.sfa.data.local.OrderEntity
import com.company.sfa.data.remote.OrderApiService
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class OrderRepository @Inject constructor(
    private val localDao: OrderDao,
    private val remoteApi: OrderApiService,
    private val workManagerHelper: SyncWorkManagerHelper
) {
    // Single source of truth: UI selalu mendengarkan local database
    val pendingOrders: Flow<List<OrderEntity>> = localDao.getPendingOrdersFlow()

    suspend fun saveOrderLocally(order: OrderEntity) {
        // 1. Simpan seketika di Room DB (UI merespon dalam <5ms)
        localDao.insertOrder(order.copy(syncStatus = "PENDING_SYNC"))
        
        // 2. Trigger background sync via WorkManager (jalan otomatis saat sinyal ada)
        workManagerHelper.scheduleImmediateSync()
    }

    suspend fun syncPendingOrders() {
        val pending = localDao.getUnsyncedOrders()
        for (order in pending) {
            try {
                val response = remoteApi.submitOrder(order.toDto())
                if (response.isSuccessful) {
                    localDao.updateSyncStatus(order.id, "SYNCED")
                }
            } catch (e: Exception) {
                // Biarkan tetap PENDING, WorkManager akan retry dengan exponential backoff
            }
        }
    }
}`
      }
    ]
  },
  {
    id: 'warehouse-inventory',
    name: 'Multi-Warehouse Inventory & Mutation Tracker',
    category: 'Supply Chain & Logistics',
    description: 'Sistem transfer stok antar gudang, kartu stok digital, dan opname harian yang menghubungkan 5 lokasi gudang fisik.',
    currentStack: {
      frontend: 'React Web Apps (di-host di GitHub Pages)',
      backend: 'Google Apps Script Library + Triggers 15-menit',
      database: '5 File Spreadsheet (1 per Gudang) dihubungkan IMPORTRANGE',
      auth: 'Akun Google OAuth Domain Internal'
    },
    metrics: {
      dailyActiveUsers: 65,
      peakRequestsPerMinute: 45,
      totalRows: 142000,
      avgLatencyMs: 4800,
      errorRatePercent: 12.1
    },
    scores: [
      {
        label: 'Database Concurrency & ACID',
        currentScore: 20,
        targetScore: 98,
        unit: 'Score',
        currentValue: 'IMPORTRANGE Sinkronisasi Parsial',
        targetValue: 'PostgreSQL Distributed Transactions',
        status: 'critical'
      },
      {
        label: 'API Response Latency (TTFB)',
        currentScore: 25,
        targetScore: 95,
        unit: 'ms',
        currentValue: '4,800 ms',
        targetValue: '< 120 ms',
        status: 'critical'
      },
      {
        label: 'Mobile Offline Readiness',
        currentScore: 30,
        targetScore: 90,
        unit: 'Score',
        currentValue: 'Web Apps Browser Biasa',
        targetValue: 'Android Scanner App (Zebra / Camera Native)',
        status: 'warning'
      },
      {
        label: 'Quota & Scalability Safety',
        currentScore: 35,
        targetScore: 95,
        unit: 'Score',
        currentValue: 'IMPORTRANGE Sering #ERROR! Kalkulasi',
        targetValue: 'Fully Scalable SQL Data Model',
        status: 'critical'
      }
    ],
    bottlenecks: [
      {
        id: 'wh-b1',
        category: 'database',
        title: 'Formula IMPORTRANGE Sering Rontok (#ERROR! Data Limit)',
        description: 'Formula IMPORTRANGE lintas 5 spreadsheet gudang sering macet saat ukuran baris bertambah, menyebabkan kalkulasi stok total nasional menjadi #N/A atau salah hitung.',
        impact: 'Selisih stok fisik vs sistem; tim gudang salah kirim barang dan over-selling produk.',
        severity: 'critical',
        gasLimitContext: 'Google Sheets memiliki batas internal komputasi formula dan rentan timeout jika sheet saling merujuk (circular dependency risk).',
        recommendedSolution: 'Satukan data inventory ke dalam satu tabel SQL `inventory_ledger` dengan index pada `(warehouse_id, item_sku)`.'
      },
      {
        id: 'wh-b2',
        category: 'concurrency',
        title: 'Race Condition pada Pengurangan Stok Bersamaan',
        description: 'Dua staf gudang berbeda mengurangi stok barang yang sama pada detik yang sama. Spreadsheet tidak memiliki atomisitas locking baris, sehingga stok akhir hanya mencatat satu transaksi.',
        impact: 'Phantom stock dan kerugian operasional akibat minus barang.',
        severity: 'critical',
        gasLimitContext: 'Tidak ada fasilitas `SELECT ... FOR UPDATE` pada Google Sheets.',
        recommendedSolution: 'Gunakan isolasi transaksi `SERIALIZABLE` atau `SELECT ... FOR UPDATE` pada PostgreSQL.'
      }
    ],
    recommendations: [
      {
        id: 'wh-r1',
        domain: 'Database & Storage',
        title: 'Konsolidasi 5 Spreadsheet ke Double-Entry Inventory Ledger (PostgreSQL)',
        summary: 'Terapkan konsep pembukuan stok ganda (Debit/Kredit per mutasi barang) di PostgreSQL sehingga stok saat ini adalah hasil agregasi transaksi yang tidak bisa dimanipulasi.',
        currentArchitecture: '5 file spreadsheet terpisah dengan formula SUMIF dan IMPORTRANGE.',
        proposedArchitecture: 'PostgreSQL Relational Ledger dengan tabel `stock_movements` immutable.',
        expectedGain: 'Akurasi stok 100% tanpa selisih, query stok nasional instan (< 10ms).',
        implementationEffort: 'Tinggi (3-4 minggu)',
        priority: 'P0 - Urgent',
        keyTechStack: ['PostgreSQL', 'Drizzle ORM', 'Database Indexes'],
        actionSteps: [
          'Normalisasi skema ledger stok berbasis event (movement_type: IN, OUT, TRANSFER, ADJUSTMENT).',
          'Terapkan database trigger atau computed balance dengan cache.',
          'Migrasi seluruh histori mutasi 6 bulan terakhir dari 5 spreadsheet.'
        ]
      },
      {
        id: 'wh-r2',
        domain: 'Android & Mobile Client',
        title: 'Aplikasi Android Khusus Warehouse dengan Barcode / QR Scanner Cepat',
        summary: 'Petugas gudang membutuhkan alat scan fisik cepat untuk penerimaan dan packing barang, terintegrasi langsung dengan API backend.',
        currentArchitecture: 'Staf mengetik SKU manual di form web browser ponsel.',
        proposedArchitecture: 'Aplikasi Android Kotlin dengan ZXing / ML Kit Barcode Scanner + audio beep validasi.',
        expectedGain: 'Kecepatan scan meningkat 400%, menghilangkan human error salah ketik kode SKU.',
        implementationEffort: 'Sedang (1-2 minggu)',
        priority: 'P1 - High',
        keyTechStack: ['Android Kotlin', 'Google ML Kit Barcode Scanning', 'CameraX'],
        actionSteps: [
          'Integrasikan CameraX dan Google ML Kit untuk deteksi barcode tanpa jeda (60 FPS).',
          'Tambahkan haptic feedback (getar) dan audio tone konfirmasi keberhasilan scan.',
          'Koneksikan ke endpoint `/api/inventory/scan` dengan validasi instan.'
        ]
      }
    ],
    roadmap: [
      {
        phaseNumber: 1,
        name: 'Database Architecture & Schema Ledger',
        duration: 'Minggu 1 - 2',
        status: 'in_progress',
        objective: 'Membangun skema SQL yang kebal terhadap race condition dan inkonsistensi stok.',
        deliverables: [
          'Skema PostgreSQL untuk master produk, lokasi gudang, dan buku besar mutasi stok.',
          'Unit testing untuk verifikasi race condition penarikan stok bersamaan.'
        ],
        riskMitigation: 'Jalankan uji beban paralel (concurrency test) dengan k6.'
      },
      {
        phaseNumber: 2,
        name: 'REST API & Migrasi Data Historis',
        duration: 'Minggu 3',
        status: 'planned',
        objective: 'Menyediakan endpoint terenkripsi untuk mutasi stok dan import data awal.',
        deliverables: [
          'REST API dengan Express/TypeScript.',
          'Import data opname awal untuk kalibrasi stok fisik 5 gudang.'
        ],
        riskMitigation: 'Lakukan opname fisik akhir pekan saat operasional gudang tutup sementara.'
      },
      {
        phaseNumber: 3,
        name: 'Android Barcode Scanner & Web Dashboard',
        duration: 'Minggu 4 - 5',
        status: 'planned',
        objective: 'Peluncuran aplikasi scan Android untuk operator gudang dan web admin monitoring.',
        deliverables: [
          'APK Android khusus device gudang (support hardware scanner & kamera).',
          'Dashboard monitoring stok real-time untuk kepala gudang.'
        ],
        riskMitigation: 'Training intensif kepada staf lapangan dan sediakan panduan video singkat.'
      }
    ],
    codeSnippets: [
      {
        title: 'PostgreSQL Double-Entry Stock Movement (Anti Race-Condition)',
        language: 'sql',
        description: 'Mencegah stok minus dengan row-level lock FOR UPDATE pada level SQL transaksi.',
        optimizedCode: `-- Transaksi Mutasi Stok Aman dari Race Condition
BEGIN;

-- 1. Kunci baris item pada gudang tertentu agar tidak diubah transaksi lain secara paralel
SELECT id, current_qty 
FROM warehouse_stocks 
WHERE warehouse_id = 'wh-jkt-01' AND item_sku = 'BRG-9942'
FOR UPDATE;

-- 2. Pastikan stok cukup sebelum dipotong
-- Jika current_qty < quantity_to_deduct, aplikasi melempar rollback!

-- 3. Catat riwayat di buku besar mutasi (immutable log)
INSERT INTO stock_movements (id, warehouse_id, item_sku, movement_type, qty, reference_no, created_at)
VALUES (gen_random_uuid(), 'wh-jkt-01', 'BRG-9942', 'STOCK_OUT', 15, 'ORD-2026-8819', NOW());

-- 4. Update stok agregat
UPDATE warehouse_stocks
SET current_qty = current_qty - 15, updated_at = NOW()
WHERE warehouse_id = 'wh-jkt-01' AND item_sku = 'BRG-9942';

COMMIT;`
      }
    ]
  },
  {
    id: 'procurement-approval',
    name: 'Procurement & Purchase Requisition Approval Hub',
    category: 'Corporate Governance & Finance',
    description: 'Alur persetujuan pengadaan barang, verifikasi budget departemen, dan tanda tangan digital berjenjang dari staff hingga Direksi.',
    currentStack: {
      frontend: 'Google Apps Script HTML Dialog',
      backend: 'Google Apps Script Trigger onEdit & MailApp',
      database: 'Google Sheets (Pengajuan PR & Master Anggaran)',
      auth: 'Google Workspace Account'
    },
    metrics: {
      dailyActiveUsers: 80,
      peakRequestsPerMinute: 30,
      totalRows: 24000,
      avgLatencyMs: 2900,
      errorRatePercent: 4.2
    },
    scores: [
      {
        label: 'Database Concurrency & ACID',
        currentScore: 45,
        targetScore: 92,
        unit: 'Score',
        currentValue: 'Sheets Lock per Dokumen',
        targetValue: 'PostgreSQL Relational Workflow',
        status: 'warning'
      },
      {
        label: 'API Response Latency (TTFB)',
        currentScore: 40,
        targetScore: 95,
        unit: 'ms',
        currentValue: '2,900 ms',
        targetValue: '< 150 ms',
        status: 'warning'
      },
      {
        label: 'Mobile Push Notifications',
        currentScore: 10,
        targetScore: 95,
        unit: 'Score',
        currentValue: 'Hanya Email (Sering Masuk Spam/Terlewat)',
        targetValue: 'Android FCM Instant Push Notifications',
        status: 'critical'
      },
      {
        label: 'Security & Role-Based Access Control',
        currentScore: 40,
        targetScore: 98,
        unit: 'Score',
        currentValue: 'URL Publik Terbuka jika Link Bocor',
        targetValue: 'RBAC Terenkripsi + JWT + Biometric Auth',
        status: 'warning'
      }
    ],
    bottlenecks: [
      {
        id: 'pr-b1',
        category: 'api',
        title: 'Quota Pengiriman Email Workspace Sering Limit di Akhir Bulan',
        description: 'Notifikasi approval dikirim menggunakan `MailApp.sendEmail()` yang terbentur kuota harian Google Workspace (1.500 email/hari). Saat antrean padat, email approval berhenti terkirim.',
        impact: 'Proses pengadaan terhenti, Direksi tidak menerima notifikasi untuk persetujuan cepat.',
        severity: 'high',
        gasLimitContext: 'Google Workspace email quota habis; tidak ada mekanisme retry queue.',
        recommendedSolution: 'Gunakan dedicated transactional email provider (SendGrid / Resend) via API terpisah + Firebase Cloud Messaging (FCM) Push ke ponsel Android.'
      },
      {
        id: 'pr-b2',
        category: 'mobile',
        title: 'Direksi Kesulitan Review Lampiran PDF di Layar Mobile',
        description: 'Tampilan GAS HTML dialog tidak responsif di smartphone. Direksi yang sering mobile menunda approval hingga kembali ke laptop.',
        impact: 'SLA persetujuan membengkak dari 4 jam menjadi 3-5 hari kerja.',
        severity: 'high',
        gasLimitContext: 'GAS Web App iframe rendering lambat dan pinch-to-zoom terbatas pada mobile browser.',
        recommendedSolution: 'Kembangkan modul Approval Cepat di aplikasi Android Native dengan tombol "Approve / Reject" instan langsung dari Push Notification.'
      }
    ],
    recommendations: [
      {
        id: 'pr-r1',
        domain: 'Android & Mobile Client',
        title: 'Mobile Approval App dengan 1-Tap Biometric Authentication',
        summary: 'Buat aplikasi Android ringkas untuk manager dan direksi dengan autentikasi sidik jari / Face Unlock dan notifikasi push real-time.',
        currentArchitecture: 'Link email membuka web GAS yang lambat dan perlu login ulang.',
        proposedArchitecture: 'Android Native App dengan Firebase Cloud Messaging + Android BiometricPrompt API.',
        expectedGain: 'SLA approval dipangkas 85%, pengalaman eksekutif premium dan aman.',
        implementationEffort: 'Sedang (1-2 minggu)',
        priority: 'P0 - Urgent',
        keyTechStack: ['Android Kotlin', 'BiometricPrompt', 'Firebase Cloud Messaging (FCM)', 'Jetpack Compose'],
        actionSteps: [
          'Pasang FCM untuk push notification berprioritas tinggi ke device Android.',
          'Implementasi BiometricPrompt untuk tanda tangan digital approval dalam 2 detik.',
          'Sediakan preview dokumen PDF lampiran dengan Android PdfRenderer native.'
        ]
      }
    ],
    roadmap: [
      {
        phaseNumber: 1,
        name: 'Approval Engine Modernization & API',
        duration: 'Minggu 1 - 2',
        status: 'planned',
        objective: 'Membuat engine state-machine approval yang tangguh di backend.',
        deliverables: [
          'Engine alur persetujuan berbasis state machine (DRAFT -> PENDING_MGR -> PENDING_DIR -> APPROVED).',
          'Integrasi Resend / SendGrid untuk notifikasi email tanpa batas kuota GAS.'
        ],
        riskMitigation: 'Log setiap event approval untuk keperluan audit kepatuhan ISO/SOX.'
      },
      {
        phaseNumber: 2,
        name: 'Android Executive Client & Biometrics',
        duration: 'Minggu 3 - 4',
        status: 'planned',
        objective: 'Merilis aplikasi mobile approval untuk manajemen.',
        deliverables: [
          'Aplikasi Android dengan Push Notification action buttons (Approve/Reject).',
          'Autentikasi biometrik lokal untuk otorisasi transaksi bernilai tinggi.'
        ],
        riskMitigation: 'Pastikan enkripsi token device di level database backend.'
      }
    ],
    codeSnippets: [
      {
        title: 'Android Biometric Approval Flow (Kotlin)',
        language: 'kotlin',
        description: 'Contoh integrasi BiometricPrompt untuk verifikasi persetujuan berisiko tinggi.',
        optimizedCode: `// BiometricApprovalHelper.kt
package com.company.procurement.ui.approval

import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity

class BiometricApprovalHelper(
    private val activity: FragmentActivity,
    private val onApproved: () -> Unit,
    private val onError: (String) -> Unit
) {
    fun promptBiometricConfirmation(requisitionNumber: String, amountString: String) {
        val executor = ContextCompat.getMainExecutor(activity)
        val prompt = BiometricPrompt(activity, executor, object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                super.onAuthenticationSucceeded(result)
                // Otorisasi biometrik sukses -> eksekusi approval ke backend
                onApproved()
            }

            override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                super.onAuthenticationError(errorCode, errString)
                onError(errString.toString())
            }
        })

        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Konfirmasi Persetujuan Pengadaan")
            .setSubtitle("No: $requisitionNumber • Total: $amountString")
            .setDescription("Gunakan sidik jari atau pengenalan wajah untuk menandatangani approval.")
            .setNegativeButtonText("Batal")
            .build()

        prompt.authenticate(promptInfo)
    }
}`
      }
    ]
  }
];
