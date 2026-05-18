<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '520px'
  },
  closeOnOutside: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'update:modelValue',
  'close'
])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleEsc = (e) => {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEsc)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEsc)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="modal-overlay"
      @click.self="closeOnOutside && close()"
    >
      <div
        class="modal"
        :style="{ maxWidth: width }"
      >
        <div class="modal-header">
          <div>
            <slot name="header">
              <h2>{{ title }}</h2>
            </slot>
          </div>

          <button
            class="close-btn"
            @click="close"
          >
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <slot />
        </div>

        <div
          v-if="$slots.actions"
          class="modal-actions"
        >
          <slot name="actions" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,15,30,.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
}

.modal {
  width: 100%;
  background:
    linear-gradient(
      to bottom,
      #fff,
      #f7f8fc
    );

  border-radius: 22px;
  padding: 28px;
  box-shadow:
    0 15px 40px
    rgba(0,0,0,.18);

  animation:
    modalFade .25s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #1e1548;
}

.modal-body {
  margin-top: 20px;
}

.modal-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.close-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: #666;
}

.close-btn:hover {
  color: #111;
}

@keyframes modalFade {
  from {
    opacity: 0;
    transform:
      translateY(10px)
      scale(.98);
  }

  to {
    opacity: 1;
    transform:
      translateY(0)
      scale(1);
  }
}
</style>