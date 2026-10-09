import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as aucationApi from '../api/aucationApi'
import { isSuccess } from '../../../helpers/apiHelper'
import { getHighestBid } from '../../../helpers/toolsHelper'

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

  // Daftar lelang hanya mengirim ID bid, jadi ambil detail untuk nilai tertinggi.
  async function loadHighestBids() {
    const targets = aucations.value.filter((item) =>
      (item.bids ?? []).some((bid) => typeof bid !== 'object'),
    )

    const details = await Promise.all(
      targets.map((item) => aucationApi.getAucation(item.id)),
    )

    details.forEach((response, index) => {
      if (isSuccess(response)) {
        targets[index].highest_bid = getHighestBid(
          response.data.aucation,
        )
      }
    })
  }

  async function fetchAucations(params) {
    isAucation.value = true

    const response = await aucationApi.getAucations(params)

    aucations.value = isSuccess(response)
      ? response.data.aucations
      : []

    isAucation.value = false

    await loadHighestBids()

    return response
  }

  async function fetchAucation(id) {
    isAucation.value = true

    const response = await aucationApi.getAucation(id)

    aucation.value = isSuccess(response)
      ? response.data.aucation
      : null

    isAucation.value = false

    return response
  }

  const addAucation = track(
    isAucationAdd,
    isAucationAdded,
    (payload) => aucationApi.addAucation(payload),
  )

  const changeAucation = track(
    isAucationChange,
    isAucationChanged,
    (id, payload) => aucationApi.changeAucation(id, payload),
  )

  const changeCover = track(
    isAucationChangeCover,
    isAucationChangedCover,
    (id, file) => aucationApi.changeCover(id, file),
  )

  const deleteAucation = track(
    isAucationDelete,
    isAucationDeleted,
    (id) => aucationApi.deleteAucation(id),
  )

  const addBid = track(
    isBidAdd,
    isBidAdded,
    (id, bid) => aucationApi.addBid(id, bid),
  )

  const deleteBid = track(
    isBidDelete,
    isBidDeleted,
    (id) => aucationApi.deleteBid(id),
  )

  const deleteAllAucations = track(
    isAucationDeleteAll,
    isAucationDeletedAll,
    () => aucationApi.deleteAllAucations(),
  )

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