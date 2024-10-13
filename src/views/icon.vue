<script setup>

// قائمة الأيقونات مع الأسماء
const icons = [
  { class: "ni ni-active-40", name: "ni-active-40" },
  { class: "ni ni-air-baloon", name: "ni-air-baloon" },
  { class: "ni ni-album-2", name: "ni-album-2" },
  { class: "ni ni-align-center", name: "ni-align-center" },
  { class: "ni ni-align-left-2", name: "ni-align-left-2" },
  { class: "ni ni-ambulance", name: "ni-ambulance" },
  { class: "ni ni-app", name: "ni-app" },
  { class: "ni ni-archive-2", name: "ni-archive-2" },
  { class: "ni ni-atom", name: "ni-atom" },
  { class: "ni ni-badge", name: "ni-badge" },
  { class: "ni ni-bag-17", name: "ni-bag-17" },
  { class: "ni ni-basket", name: "ni-basket" },
  { class: "ni ni-bell-55", name: "ni-bell-55" },
  { class: "ni ni-bold-down", name: "ni-bold-down" },
  { class: "ni ni-bold-left", name: "ni-bold-left" },
  { class: "ni ni-bold-right", name: "ni-bold-right" },
  { class: "ni ni-bold-up", name: "ni-bold-up" },
  { class: "ni ni-bold", name: "ni-bold" },
  { class: "ni ni-book-bookmark", name: "ni-book-bookmark" },
  { class: "ni ni-books", name: "ni-books" },
  { class: "ni ni-box-2", name: "ni-box-2" },
  { class: "ni ni-briefcase-24", name: "ni-briefcase-24" },
  { class: "ni ni-building", name: "ni-building" },
  { class: "ni ni-bulb-61", name: "ni-bulb-61" },
  { class: "ni ni-bullet-list-67", name: "ni-bullet-list-67" },
  { class: "ni ni-bus-front-12", name: "ni-bus-front-12" },
  { class: "ni ni-button-pause", name: "ni-button-pause" },
  { class: "ni ni-button-play", name: "ni-button-play" },
  { class: "ni ni-button-power", name: "ni-button-power" },
  { class: "ni ni-calendar-grid-58", name: "ni-calendar-grid-58" },
  { class: "ni ni-camera-compact", name: "ni-camera-compact" },
  { class: "ni ni-caps-small", name: "ni-caps-small" },
  { class: "ni ni-cart", name: "ni-cart" },
  { class: "ni ni-chart-bar-32", name: "ni-chart-bar-32" },
  { class: "ni ni-chart-pie-35", name: "ni-chart-pie-35" },
  { class: "ni ni-chat-round", name: "ni-chat-round" },
  { class: "ni ni-check-bold", name: "ni-check-bold" },
  { class: "ni ni-circle-08", name: "ni-circle-08" },
  { class: "ni ni-cloud-download-95", name: "ni-cloud-download-95" },
  { class: "ni ni-cloud-upload-96", name: "ni-cloud-upload-96" },
  { class: "ni ni-compass-04", name: "ni-compass-04" },
  { class: "ni ni-controller", name: "ni-controller" },
  { class: "ni ni-credit-card", name: "ni-credit-card" },
  { class: "ni ni-curved-next", name: "ni-curved-next" },
  { class: "ni ni-delivery-fast", name: "ni-delivery-fast" },
  { class: "ni ni-diamond", name: "ni-diamond" },
  { class: "ni ni-email-83", name: "ni-email-83" },
  { class: "ni ni-fat-add", name: "ni-fat-add" },
  { class: "ni ni-fat-delete", name: "ni-fat-delete" },
  { class: "ni ni-fat-remove", name: "ni-fat-remove" },
  { class: "ni ni-favourite-28", name: "ni-favourite-28" },
  { class: "ni ni-folder-17", name: "ni-folder-17" },
  { class: "ni ni-glasses-2", name: "ni-glasses-2" },
  { class: "ni ni-hat-3", name: "ni-hat-3" },
  { class: "ni ni-headphones", name: "ni-headphones" },
  { class: "ni ni-html5", name: "ni-html5" },
  { class: "ni ni-istanbul", name: "ni-istanbul" },
  { class: "ni ni-key-25", name: "ni-key-25" },
  { class: "ni ni-laptop", name: "ni-laptop" },
  { class: "ni ni-like-2", name: "ni-like-2" },
  { class: "ni ni-lock-circle-open", name: "ni-lock-circle-open" },
  { class: "ni ni-map-big", name: "ni-map-big" },
  { class: "ni ni-mobile-button", name: "ni-mobile-button" },
  { class: "ni ni-money-coins", name: "ni-money-coins" },
  { class: "ni ni-note-03", name: "ni-note-03" },
  { class: "ni ni-notification-70", name: "ni-notification-70" },
  { class: "ni ni-palette", name: "ni-palette" },
  { class: "ni ni-paper-diploma", name: "ni-paper-diploma" },
  { class: "ni ni-pin-3", name: "ni-pin-3" },
  { class: "ni ni-planet", name: "ni-planet" },
  { class: "ni ni-ruler-pencil", name: "ni-ruler-pencil" },
  { class: "ni ni-satisfied", name: "ni-satisfied" },
  { class: "ni ni-scissors", name: "ni-scissors" },
  { class: "ni ni-send", name: "ni-send" },
  { class: "ni ni-settings-gear-65", name: "ni-settings-gear-65" },
  { class: "ni ni-settings", name: "ni-settings" },
  { class: "ni ni-single-02", name: "ni-single-02" },
  { class: "ni ni-single-copy-04", name: "ni-single-copy-04" },
  { class: "ni ni-sound-wave", name: "ni-sound-wave" },
  { class: "ni ni-spaceship", name: "ni-spaceship" },
  { class: "ni ni-square-pin", name: "ni-square-pin" },
  { class: "ni ni-support-16", name: "ni-support-16" },
  { class: "ni ni-tablet-button", name: "ni-tablet-button" },
  { class: "ni ni-tag", name: "ni-tag" },
  { class: "ni ni-tie-bow", name: "ni-tie-bow" },
  { class: "ni ni-time-alarm", name: "ni-time-alarm" },
  { class: "ni ni-trophy", name: "ni-trophy" },
  { class: "ni ni-tv-2", name: "ni-tv-2" },
  { class: "ni ni-umbrella-13", name: "ni-umbrella-13" },
  { class: "ni ni-user-run", name: "ni-user-run" },
  { class: "ni ni-vector", name: "ni-vector" },
  { class: "ni ni-watch-time", name: "ni-watch-time" },
  { class: "ni ni-world", name: "ni-world" },
  { class: "ni ni-zoom-split-in", name: "ni-zoom-split-in" },
  { class: "ni ni-collection", name: "ni-collection" },
  { class: "ni ni-image", name: "ni-image" },
  { class: "ni ni-shop", name: "ni-shop" },
  { class: "ni ni-ungroup", name: "ni-ungroup" },
  { class: "ni ni-world-2", name: "ni-world-2" },
  { class: "ni ni-ui-04", name: "ni-ui-04" },
];
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Existing content remains as is -->
    </div>
    <div class="row mt-5">
      <div class="col-12">
        <h4>All Icons:</h4>
        <div class="icons-list">
          <div v-for="icon in icons" :key="icon.name" class="icon-item">
            <i :class="icon.class"></i>
            <p>{{ icon.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.icons-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.icon-item {
  text-align: center;
  width: 120px;
}

.icon-item i {
  font-size: 24px;
  margin-bottom: 10px;
}

.icon-item p {
  font-size: 14px;
  color: #555;
}
</style>
