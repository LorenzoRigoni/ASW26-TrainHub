export const ROLES = {
  PERSONAL_TRAINER: 'trainer',
  CLIENTE: 'client',
  NUTRIZIONISTA: 'nutritionist'
}

const appPalette = {
  DARK_BLUE: '#0f0a2e' ,
  WHITE: '#ffffff' ,
  LIGHT_GREY: '#f4f6f9'
}

const avatarColors = [
  '#2d6a4f','#1b4332','#40916c','#52b788',
  '#1e6091','#1a759f','#168aad','#76c893',
  '#4a90d9','#7c6af7','#e05c9a','#f5a623'
]

export const getInitials = (name = '', surname = '') =>
  `${name?.[0] ?? ''}${surname?.[0] ?? ''}`.toUpperCase()

export const getAvatarColor = (seed = '') => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

export const statusClasses = {
  //status clienti
  attivo: 'badge-attivo',
  inattivo: 'badge-inattivo',
  perso: 'badge-perso',

  //attività diario
  on: 'status-on',
  off: 'status-off',

  //status notifiche
  nuova: 'badge-nuova',
  warning: 'badge-warning',
  success: 'badge-success',
  info: 'badge-info'


}