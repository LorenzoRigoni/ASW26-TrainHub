<script setup>
   
    defineProps({
    icon: String,
    label: String,
      to: {
      type: [String, Object],
      required: true
    },
    active: Boolean
    })

    const emit = defineEmits(['click'])

    const handleClick = () => {
    emit('click')
    }
</script>

<template>
   <li class="side-menu-item" :class="{ active }">
    <router-link :to="to" class="item-content">
      <i :class="['item-icon', icon]"></i>
      <span class="item-label">{{ label }}</span>
    </router-link>
  </li>
</template>

<style scoped>
.side-menu-item {
  list-style: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 4px;
  margin-bottom: 4px;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  color: #b8b4d4;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
}

.item-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
  transition: all 0.3s ease;
}

.item-label {
  flex: 1;
  transition: all 0.3s ease;
}

.side-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.side-menu-item:hover .item-content {
  color: #ffffff;
}

.side-menu-item:hover .item-icon {
  transform: scale(1.1);
}

.side-menu-item.active {
  background-color: rgba(255, 255, 255, 0.1);
  border-left: 3px solid #4a5eff;
}

.side-menu-item.active .item-content {
  color: #ffffff;
  font-weight: 600;
}

.side-menu-item.active .item-icon {
  color: #4a5eff;
}

</style>