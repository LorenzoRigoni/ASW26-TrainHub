import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    id: localStorage.getItem('user_id') || '',
    name: localStorage.getItem('user_name') || '',
    surname: localStorage.getItem('user_surname') || '',
    role: localStorage.getItem('user_role') || '',
    username: localStorage.getItem('user_username') || '',
    email: localStorage.getItem('user_email') || '',
    birthDate: localStorage.getItem('user_birth_date') || '',
    profilePicture: localStorage.getItem('user_profilePicture') || ''
  })
  
  const token = ref(localStorage.getItem('token') || '')

  const apiConfig = computed(() => {
    return {
      headers: { 
        Authorization: `Bearer ${token.value}` 
      }
    }
  })

  function setSession(userData, userToken) {
    user.value = {
      id: userData._id,
      name: userData.name,
      surname: userData.surname,
      role: userData.role,
      username: userData.username,
      email: userData.email,
      birthDate: userData.birthDate,
      profilePicture: userData.profilePicture
    }
    token.value = userToken

    localStorage.setItem('user_id', userData._id)
    localStorage.setItem('user_name', userData.name)
    localStorage.setItem('user_surname', userData.surname)
    localStorage.setItem('user_role', userData.role)
    localStorage.setItem('user_username', userData.username)
    localStorage.setItem('user_email', userData.email)
    localStorage.setItem('user_birth_date', userData.birthDate)
    localStorage.setItem('user_profilePicture', userData.profilePicture)
    localStorage.setItem('token', userToken)
  }

  function updateUserData(updatedData) {
    if (updatedData.name) user.value.name = updatedData.name
    if (updatedData.surname) user.value.surname = updatedData.surname
    if (updatedData.username) user.value.username = updatedData.username
    if (updatedData.email) user.value.email = updatedData.email
    
    const newImg = updatedData.profilePicture
    if (newImg) user.value.profilePicture = newImg

    localStorage.setItem('user_name', user.value.name)
    localStorage.setItem('user_surname', user.value.surname)
    localStorage.setItem('user_username', user.value.username)
    localStorage.setItem('user_email', user.value.email)
    localStorage.setItem('user_profilePicture', user.value.profilePicture)
  }

  function updateToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function logout() {
    user.value = { id: '', name: '', surname: '', role: '', username: '', email: '', birthDate: '', profilePicture: '' }
    token.value = ''
    localStorage.clear()
  }

  return { 
    user, 
    token, 
    apiConfig, 
    setSession,
    updateUserData,
    updateToken,
    logout 
  }
})