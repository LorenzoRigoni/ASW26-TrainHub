<script setup>
import { ref } from 'vue'
import axios from 'axios'

const isOpen = ref(false)
const messages = ref([])
const input = ref('')
const loading = ref(false)

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

//TODO Modificare questa parte, è provvisoria
const sendMessage = async () => {
  if (!input.value.trim()) return

  const text = input.value

  messages.value.push({ role: 'user', text })
  input.value = ''
  loading.value = true

  try {
    const res = await axios.post('http://localhost:5000/api/chat', {
      message: text
    })

    messages.value.push({
      role: 'bot',
      text: res.data.reply || 'Nessuna risposta'
    })

  } catch (err) {
    messages.value.push({
      role: 'bot',
      text: 'Errore nel chatbot'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="chat-fab" @click="toggleChat">
      <i class="fa fa-commenting" aria-hidden="true"></i>
    </div>

    <div v-if="isOpen" class="chat-widget">
      <div class="chat-header">
        <span>AI Assistant</span>
        <button class="close-btn" @click="toggleChat">✕</button>
      </div>

      <div class="chat-body">
        <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['chat-msg', msg.role]"
        >
          {{ msg.text }}
        </div>

        <div v-if="loading" class="chat-msg bot">
          Sta scrivendo...
        </div>
      </div>

      <div class="chat-footer">
        <input
          v-model="input"
          @keyup.enter="sendMessage"
          placeholder="Scrivi un messaggio..."
        />
        <button @click="sendMessage"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 55px;
  height: 55px;
  background: #0f0a2e ;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  z-index: 9999;
}

.chat-widget {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 320px;
  height: 420px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 9999;
}

.chat-header {
  background: #0f0a2e;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.chat-body {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  background: #f9fafb;
}

.chat-msg {
  margin-bottom: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  max-width: 80%;
  font-size: 14px;
}

.chat-msg.user {
  background: #f7fa90;
  margin-left: auto;
}

.chat-msg.bot {
  background: #c1c5cc;
  margin-right: auto;
}

.chat-footer {
  display: flex;
  border-top: 1px solid #ddd;
}

.chat-footer input {
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
}

.chat-footer button {
  padding: 10px 12px;
  background: #0f0a2e;
  color: white;
  border: none;
  cursor: pointer;
}
</style>