<script setup lang="ts" generic="ItemType extends { id: number }">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";

interface GalleryProps {
  items?: ItemType[];
  initialIndex?: number;
  height?: string;
  width?: string;
  itemsOnSlide?: number;
}

const {
  items = [],
  initialIndex = 0,
  height = "100%",
  width = "100%",
  itemsOnSlide = 1,
} = defineProps<GalleryProps>();

const emit = defineEmits<{
  change: [currentItem: ItemType];
}>();

const galleryContainer = useTemplateRef("gallery-container");

const currentSlideIndex = ref(initialIndex);

const currentItem = computed(() => items[currentSlideIndex.value]);

onMounted(() => {
  if (initialIndex) {
    scrollTo({
      slideIndex: initialIndex,
      scrollOpts: {
        behavior: "instant",
        block: "nearest",
      },
    });
  }

  if (galleryContainer.value) {
    galleryContainer.value.addEventListener("scrollsnapchange", onSnapChange);
  }
});

onUnmounted(() =>
  galleryContainer.value?.removeEventListener("scrollsnapchange", onSnapChange)
);

const onSnapChange = (event: any) => {
  currentSlideIndex.value = Number(event.snapTargetInline.dataset.item);
  emit("change", currentItem.value);
};

type ScrollToOptions = {
  slideIndex: number;
  scrollOpts?: ScrollIntoViewOptions;
};
const scrollTo = ({ slideIndex, scrollOpts }: ScrollToOptions) => {
  let scrollOptions: ScrollIntoViewOptions = {
    behavior: "smooth",
    block: "nearest",
  };

  if (scrollOpts) {
    scrollOptions = { ...scrollOptions, ...scrollOpts };
  }

  galleryContainer.value?.children[slideIndex].scrollIntoView(scrollOptions);
};

const onArrowClick = ({ direction }: { direction: "left" | "right" }) => {
  switch (direction) {
    case "left":
      if (currentSlideIndex.value > 0) {
        const slideIndex =
          itemsOnSlide > 1
            ? currentSlideIndex.value - 1 - itemsOnSlide
            : currentSlideIndex.value - 1;

        scrollTo({ slideIndex });
      }
      break;
    case "right":
      if (currentSlideIndex.value < items.length - 1) {
        const slideIndex =
          itemsOnSlide > 1
            ? currentSlideIndex.value + 1 + itemsOnSlide
            : currentSlideIndex.value + 1;

        scrollTo({ slideIndex });
      }
      break;
  }
};
</script>

<template>
  <div class="gallery-wrapper">
    <div
      class="gallery-nav gallery-nav--left"
      @click="onArrowClick({ direction: 'left' })"
    >
      <slot name="arrow-left">Left</slot>
    </div>
    <div
      class="gallery-nav gallery-nav--right"
      @click="onArrowClick({ direction: 'right' })"
    >
      <slot name="arrow-right">Right</slot>
    </div>

    <div class="gallery-container" ref="gallery-container" id="scroll-box">
      <template v-for="(item, idx) in items" :key="item.id">
        <div class="gallery-item" :data-item="idx">
          <slot :item />
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.gallery-wrapper {
  position: relative;
  height: v-bind(height);
  width: v-bind(width);
}

.gallery-nav {
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  &.gallery-nav--left {
    left: 10px;
  }

  &.gallery-nav--right {
    right: 10px;
  }

  @media only screen and (min-width: 480px) {
    display: block;
  }
}

.gallery-container {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  scroll-snap-type: x mandatory;
  scroll-snap-stop: always;
  scroll-behavior: smooth;
  gap: 0px;
  z-index: 1;
  height: v-bind(height);
  width: v-bind(width);
}

.gallery-item {
  width: calc(100% / v-bind(itemsOnSlide));
  height: 100%;
  scroll-snap-align: center;
  flex-shrink: 0;
}
</style>
