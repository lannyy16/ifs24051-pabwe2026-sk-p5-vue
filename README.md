# Delcom Auction (Vue 3) — PABWE 2026 Praktikum 5

Aplikasi lelang berbasis **Vue 3 + JavaScript**, memakai Delcom Open API
(`https://open-api.delcom.org/docs/1.0/api-aucations`).

Stack: bun · Vite · Vue 3 · Pinia · vue-router · Tailwind CSS v4 · SweetAlert2 ·
lucide-vue-next · @toast-ui/editor · Vitest (coverage v8, threshold 100%).

## Menjalankan

```bash
bun install
cp .env.example .env     # sudah tersedia .env bawaan
bun run dev              # http://localhost:3000 (port dari APP_PORT)
bun run test             # unit + integration test
bun run test:coverage    # coverage v8 (threshold 100%)
bun run build
```

`.env`:

```
VITE_DELCOM_BASEURL=https://open-api.delcom.org/api/v1
APP_PORT=3000
```

## Struktur

```
src/
├── helpers/            apiHelper.js, toolsHelper.js
├── hooks/              useInput.js (+ useNow.js untuk countdown)
├── features/
│   ├── auth/           api · states(authStore) · layouts(AuthLayout) · pages(Login, Register)
│   ├── users/          api · states(usersStore) · pages(Users, Profile)
│   ├── aucations/      api · states · layouts · components(Navbar, Sidebar, Markdown*, modals/*) · pages(Home, Detail)
│   └── common/pages/   NotFoundPage.vue
├── router.js           /auth/* (guest), / (protected), wildcard 404
├── setupTests.js, test-utils.js, App.test.js
```

## Catatan implementasi

- `is_closed` mengikuti dokumentasi API: `1` = lelang berlangsung, `0` = lelang ditutup.
- Ganti kata sandi memakai `PUT /users/password` (sesuai dokumentasi API; modul menulis `/users/me/password`).
- Daftar lelang dari API hanya mengirim id pada `bids`; tawaran tertinggi di kartu dihitung dari
  data yang tersedia (fallback ke harga awal). Detail lelang memuat riwayat bid lengkap.
- Token disimpan di `localStorage`; respons 401 otomatis menghapus token dan kembali ke login.

## GitHub

Ganti nama folder/repositori menjadi `{username}-pabwe2026-sk-p5-vue`, misalnya `ifs18005-pabwe2026-sk-p5-vue`.
