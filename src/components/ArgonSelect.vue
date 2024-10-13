<script setup>
const emit = defineEmits(["update:modelValue"]);

defineProps({
  size: {
    type: String,
    default: "default",
  },
  success: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "",
  },
  iconDir: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    default: () => [],
  },
});

const getClasses = (size, success, error) => {
  let sizeValue, isValidValue;

  sizeValue = size ? `form-control-${size}` : "";

  if (error) {
    isValidValue = "is-invalid";
  } else if (success) {
    isValidValue = "is-valid";
  } else {
    isValidValue = "";
  }

  return `${sizeValue} ${isValidValue}`.trim();
};

const getIcon = (icon) => (icon ? icon : "");
const hasIcon = (icon) => (icon ? "input-group" : "");
</script>

<template>
  <div class="form-group">
    <div :class="hasIcon(icon)">
      <span v-if="iconDir === 'left'" class="input-group-text">
        <i :class="getIcon(icon)"></i>
      </span>
      <select
        :id="id"
        class="form-control"
        :class="getClasses(size, success, error)"
        :name="name"
        :value="modelValue"
        :required="isRequired"
        @change="emit('update:modelValue', $event.target.value)"
      >
        <option disabled value="">{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <span v-if="iconDir === 'right'" class="input-group-text">
        <i :class="getIcon(icon)"></i>
      </span>
    </div>
  </div>
</template>
