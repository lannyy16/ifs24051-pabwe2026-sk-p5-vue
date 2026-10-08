import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as aucationApi from '../api/aucationApi'
import { isSuccess } from '../../../helpers/apiHelper'

export const useAucationsStore = defineStore('aucations', () => {
  const aucations = ref([])
  const aucation = ref(null)
  const isAucation = ref(false)

  const isAucationAdd = ref(false)
  const isAucationAdded = ref(false)
  const isAucationChange = ref(false)
  const isAucationChanged = ref(false)
  const isAucationChangeCover = ref(false)
  const isAucationChangedCover = ref(false)
  const isAucationDelete = ref(false)
  const isAucationDeleted = ref(false)
  const isBidAdd = ref(false)
  const isBidAdded = ref(false)
  const isBidDelete = ref(false)
  const isBidDeleted = ref(false)
  const isAucationDeleteAll = ref(false)
  const isAucationDeletedAll = ref(false)

  async function fetchAucations(params) {
    isAucation.value = true
    const response = await aucationApi.getAucations(params)
    aucations.value = isSuccess(response) ? response.data.aucations : []
    isAucation.value = false
    return response
  }

  async function fetchAucation(id) {
    isAucation.value = true
    const response = await aucationApi.getAucation(id)
    aucation.value = isSuccess(response) ? response.data.aucation : null
    isAucation.value = false
    return response
  }

  // Membungkus aksi mutasi: menyalakan flag "sedang berjalan" lalu flag "berhasil".
  function track(loading, done, call) {
    return async (...args) => {
      loading.value = true
      done.value = false
      const response = await call(...args)
      loading.value = false
      done.value = isSuccess(response)
      return response
    }
  }

  const addAucation = track(isAucationAdd, isAucationAdded, (p) => aucationApi.addAucation(p))
  const changeAucation = track(isAucationChange, isAucationChanged, (id, p) => aucationApi.changeAucation(id, p))
  const changeCover = track(isAucationChangeCover, isAucationChangedCover, (id, f) => aucationApi.changeCover(id, f))
  const deleteAucation = track(isAucationDelete, isAucationDeleted, (id) => aucationApi.deleteAucation(id))
  const addBid = track(isBidAdd, isBidAdded, (id, bid) => aucationApi.addBid(id, bid))
  const deleteBid = track(isBidDelete, isBidDeleted, (id) => aucationApi.deleteBid(id))
  const deleteAllAucations = track(isAucationDeleteAll, isAucationDeletedAll, () => aucationApi.deleteAllAucations())

  return {
    aucations,
    aucation,
    isAucation,
    isAucationAdd,
    isAucationAdded,
    isAucationChange,
    isAucationChanged,
    isAucationChangeCover,
    isAucationChangedCover,
    isAucationDelete,
    isAucationDeleted,
    isBidAdd,
    isBidAdded,
    isBidDelete,
    isBidDeleted,
    isAucationDeleteAll,
    isAucationDeletedAll,
    fetchAucations,
    fetchAucation,
    addAucation,
    changeAucation,
    changeCover,
    deleteAucation,
    addBid,
    deleteBid,
    deleteAllAucations,
  }
})
