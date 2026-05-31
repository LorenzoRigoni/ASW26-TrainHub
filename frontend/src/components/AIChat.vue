<script setup>
import { ref, watch, nextTick } from 'vue'
import axios from 'axios'
import { API_URL } from '../utils/config.js'
import { getErrorMessage } from '../utils/utils.js'

const isOpen = ref(false)
const messages = ref([])
const input = ref('')
const loading = ref(false)
const chatBody = ref(null)

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

// Auto-scroll logic
const scrollToBottom = async () => {
  await nextTick()
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

watch(isOpen, (val) => {
  if (val) scrollToBottom()
})

const sendMessage = async () => {
  if (!input.value.trim()) return

  const text = input.value
  const token = localStorage.getItem('token')

  messages.value.push({ role: 'user', text })
  input.value = ''
  loading.value = true

  try {
    const res = await axios.post(`${API_URL}/api/ai/chat`, 
      { message: text },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    messages.value.push({
      role: 'bot',
      text: res.data.reply || 'Nessuna risposta'
    })

  } catch (err) {
    messages.value.push({
      role: 'bot',
      text: getErrorMessage(err) || 'Errore nel chatbot. Assicurati di aver configurato la chiave API.'
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
        <span>Assistente TrainHub</span>
        <button class="close-btn" @click="toggleChat">✕</button>
      </div>

      <div class="chat-body" ref="chatBody">
        <div class="chat-msg bot">
          Ciao! Sono il tuo assistente TrainHub. Come posso aiutarti oggi?
        </div>
        
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
          placeholder="Chiedimi dell'allenamento o della navigazione..."
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
  width: 350px;
  height: 480px;
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
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.chat-body {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
}

.chat-msg {
  margin-bottom: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 85%;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
}

.chat-msg.user {
  background: #f7fa90;
  color: #333;
  align-self: flex-end;
  border-bottom-right-radius: 2px;
}

.chat-msg.bot {
  background: #e5e7eb;
  color: #1f2937;
  align-self: flex-start;
  border-bottom-left-radius: 2px;
}

.chat-footer {
  display: flex;
  border-top: 1px solid #e5e7eb;
  padding: 5px;
}

.chat-footer input {
  flex: 1;
  padding: 12px;
  border: none;
  outline: none;
  font-size: 14px;
}

.chat-footer button {
  padding: 0 15px;
  background: #0f0a2e;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-left: 5px;
}

.chat-footer button:hover {
  background: #1a144d;
}
</style>