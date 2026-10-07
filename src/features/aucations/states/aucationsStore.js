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

export const useAucationsStore = defineStore('aucations', () => {
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

  async function fetchAucations(query = {}) {
    loading.value = true
    status.value.fetching = true
    error.value = ''
    try {
      const response = await getAucationsApi(query)
      aucations.value = response?.data || []
      return response
    } catch (err) {
      error.value = err.message
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
      const response = await getAucationApi(id)
      currentAucation.value = response?.data || null
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addAucation(payload) {
    status.value.adding = true
    try {
      return await addAucationApi(payload)
    } finally {
      status.value.adding = false
    }
  }

  async function updateAucation(id, payload) {
    status.value.updating = true
    try {
      return await updateAucationApi(id, payload)
    } finally {
      status.value.updating = false
    }
  }

  async function changeCover(id, file) {
    status.value.changingCover = true
    try {
      return await changeCoverApi(id, file)
    } finally {
      status.value.changingCover = false
    }
  }

  async function deleteAucation(id) {
    status.value.deleting = true
    try {
      return await deleteAucationApi(id)
    } finally {
      status.value.deleting = false
    }
  }

  async function addBid(id, bid) {
    status.value.bidding = true
    try {
      return await addBidApi(id, bid)
    } finally {
      status.value.bidding = false
    }
  }

  async function deleteBid(id) {
    status.value.bidding = true
    try {
      return await deleteBidApi(id)
    } finally {
      status.value.bidding = false
    }
  }

  async function deleteAllAucations() {
    status.value.deleting = true
    try {
      return await deleteAllAucationsApi()
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
})
