import { ref } from 'vue'
import { defineStore } from 'pinia'

import {
  getAucationsApi,
  getAucationApi,
  addAucationApi,
  updateAucationApi,
  changeCoverApi,
  deleteAucationApi,
  addBidApi,
  deleteBidApi,
  deleteAllAucationsApi,
} from '../api/aucationApi'

export const useAucationsStore =
  defineStore(
    'aucations',
    () => {
      const aucations = ref([])
      const currentAucation = ref(null)

      const loading = ref(false)
      const error = ref('')

      const status = ref({
        fetching: false,
        adding: false,
        updating: false,
        deleting: false,
        bidding: false,
        changingCover: false,
      })

      async function fetchAucations(
        query = {},
      ) {
        loading.value = true
        status.value.fetching = true
        error.value = ''

        try {
          const response =
            await getAucationsApi(
              query,
            )

          aucations.value =
            response?.data?.aucations ||
            []

          return response
        } catch (err) {
          error.value =
            err.message ||
            'Gagal mengambil data lelang'

          throw err
        } finally {
          loading.value = false
          status.value.fetching = false
        }
      }

      async function fetchAucation(id) {
        loading.value = true
        error.value = ''

        try {
          const response =
            await getAucationApi(id)

          currentAucation.value =
            response?.data?.aucation ||
            null

          return response
        } catch (err) {
          error.value =
            err.message ||
            'Gagal mengambil detail lelang'

          throw err
        } finally {
          loading.value = false
        }
      }

      async function addAucation(
        payload,
      ) {
        status.value.adding = true
        error.value = ''

        try {
          const response =
            await addAucationApi(
              payload,
            )

          const aucationId =
            response?.data?.aucation_id ||
            response?.data?.id ||
            response?.aucation_id

          if (!aucationId) {
            throw new Error(
              'ID lelang tidak ditemukan dari response API',
            )
          }

          if (payload.cover) {
            await changeCoverApi(
              aucationId,
              payload.cover,
            )
          }

          return response
        } catch (err) {
          error.value =
            err.message ||
            'Gagal menambahkan lelang'

          throw err
        } finally {
          status.value.adding = false
        }
      }

      async function updateAucation(
        id,
        payload,
      ) {
        status.value.updating = true
        error.value = ''

        try {
          return await updateAucationApi(
            id,
            payload,
          )
        } catch (err) {
          error.value =
            err.message ||
            'Gagal mengubah data lelang'

          throw err
        } finally {
          status.value.updating = false
        }
      }

      async function changeCover(
        id,
        file,
      ) {
        status.value.changingCover = true
        error.value = ''

        try {
          return await changeCoverApi(
            id,
            file,
          )
        } catch (err) {
          error.value =
            err.message ||
            'Gagal mengubah cover'

          throw err
        } finally {
          status.value.changingCover = false
        }
      }

      async function deleteAucation(id) {
        status.value.deleting = true
        error.value = ''

        try {
          return await deleteAucationApi(
            id,
          )
        } catch (err) {
          error.value =
            err.message ||
            'Gagal menghapus lelang'

          throw err
        } finally {
          status.value.deleting = false
        }
      }

      async function addBid(id, bid) {
        status.value.bidding = true
        error.value = ''

        try {
          return await addBidApi(
            id,
            bid,
          )
        } catch (err) {
          error.value =
            err.message ||
            'Gagal mengajukan bid'

          throw err
        } finally {
          status.value.bidding = false
        }
      }

      async function deleteBid(id) {
        status.value.bidding = true
        error.value = ''

        try {
          return await deleteBidApi(id)
        } catch (err) {
          error.value =
            err.message ||
            'Gagal menghapus bid'

          throw err
        } finally {
          status.value.bidding = false
        }
      }

      async function deleteAllAucations() {
        status.value.deleting = true
        error.value = ''

        try {
          return await deleteAllAucationsApi()
        } catch (err) {
          error.value =
            err.message ||
            'Gagal menghapus semua lelang'

          throw err
        } finally {
          status.value.deleting = false
        }
      }

      return {
        aucations,
        currentAucation,
        loading,
        error,
        status,

        fetchAucations,
        fetchAucation,
        addAucation,
        updateAucation,
        changeCover,
        deleteAucation,
        addBid,
        deleteBid,
        deleteAllAucations,
      }
    },
  )