import { ref } from 'vue'

export const toastState = ref({
  show: false,
  message: '',
  type: 'success'
})

// Popup which desappears in 4 seconds
export const showToast = (message, type = 'success') => {
  toastState.value.message = message
  toastState.value.type = type
  toastState.value.show = true

  setTimeout(() => {
    toastState.value.show = false
  }, 4000)
}