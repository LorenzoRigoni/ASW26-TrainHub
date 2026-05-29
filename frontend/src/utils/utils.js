export const ROLES = {
  PERSONAL_TRAINER: 'trainer',
  CLIENTE: 'client',
  NUTRIZIONISTA: 'nutritionist'
}

export const appPalette = {
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

//funzione per calcolo giorni mancanti alla scadenza
export const calculateDaysLeft = (dueDate) => {
  const today = new Date()
  const due = new Date(dueDate)

  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)

  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}


export const formatPrograms = (programs) => {
  return programs.map((p) => {
    const dateToUse = p.dueDate || p.createdAt;
    const daysLeft = calculateDaysLeft(dateToUse);

    const athleteName = p.athleteId?.name || '';
    const athleteSurname = p.athleteId?.surname || '';

    let statusClass = '';
    let iconClass = '';

    if (daysLeft <= 0) { statusClass = 'status-red'; iconClass = 'icon-red'; }
    else if (daysLeft < 5) { statusClass = 'status-orange'; iconClass = 'icon-orange'; }
    else if (daysLeft <= 10) { statusClass = 'status-yellow'; iconClass = 'icon-yellow'; }
    else { statusClass = 'status-green'; iconClass = 'icon-green'; }

    return {
      ...p,
      title: p.title || `${athleteName} ${athleteSurname}`,
      statusText: `${daysLeft} giorni`,
      statusClass,
      iconClass
    };
  })
}
