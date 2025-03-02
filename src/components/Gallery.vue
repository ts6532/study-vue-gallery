<script setup lang="ts" generic="ItemType extends Record<string, any>">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";

export interface GalleryOptions {
  height?: string;
  width?: string;
  slidesGap?: string;
}
const defaultOptions: GalleryOptions = {
  height: "100%",
  width: "100%",
  slidesGap: "0px",
};

interface GalleryProps {
  items?: ItemType[];
  keyName: keyof ItemType;
  initialIndex?: number;
  options: Partial<GalleryOptions>;
}

const {
  items = [],
  initialIndex = 0,
  keyName,
  options,
} = defineProps<GalleryProps>();

const emit = defineEmits<{
  change: [currentItem: ItemType];
  lastElement: [];
  firstElement: [];
}>();

const { width, height, slidesGap } = { ...defaultOptions, ...options };

const galleryContainer = useTemplateRef("gallery-container");

const calculatedItems = computed(() => {
  return items;
});

const currentSlideIndex = ref(initialIndex);

const currentSlide = computed(
  () => calculatedItems.value[currentSlideIndex.value]
);

const isFirstElement = computed(() => currentSlideIndex.value === 0);

const isLastElement = computed(() => currentSlideIndex.value === items.length - 1);

let observer: IntersectionObserver;

let isFirstCall = true;

const callback: IntersectionObserverCallback = (entries) => {
  entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
    if (!isIntersecting) return;

    if (intersectionRatio >= 1) {
      if (isFirstCall) {
        isFirstCall = false;
        return;
      } else {
        currentSlideIndex.value = Number((target as HTMLElement).dataset.item);

        emit("change", currentSlide.value);

        if (isFirstElement.value) emit("firstElement");

        if (isLastElement.value) emit("lastElement");
      }
    }
  });
};

onMounted(() => {
  if (currentSlideIndex.value) {
    scrollTo({
      slideIndex: currentSlideIndex.value,
      scrollOpts: {
        behavior: "instant",
      },
    });
  }

  if (galleryContainer.value) {
    const options = {
      root: galleryContainer.value,
      rootMargin: "0px 5px 0px 5px",
      threshold: 1,
    };

    observer = new IntersectionObserver(callback, options);

    for (const target of galleryContainer.value.children) {
      observer.observe(target);
    }
  }
});

onUnmounted(() => {
  observer.disconnect();
});

type ScrollToOptions = {
  slideIndex: number;
  scrollOpts?: ScrollIntoViewOptions;
};
const scrollTo = ({ slideIndex, scrollOpts }: ScrollToOptions) => {
  let defaultScrollOptions: ScrollIntoViewOptions = {
    behavior: "smooth",
  };

  const slide = galleryContainer.value?.children[slideIndex] as HTMLElement;

  galleryContainer.value?.scrollTo({
    left: slide.offsetLeft,
    ...defaultScrollOptions,
    ...scrollOpts,
  });
};

const onArrowClick = async (index: number) => {
  const slideIndex = currentSlideIndex.value + index;

  if (!calculatedItems.value[slideIndex]) return;

  scrollTo({ slideIndex });
};
</script>

<template>
  <div class="gallery-wrapper">
    <button
      v-if="!isFirstElement"
      class="gallery-nav gallery-nav--left"
      @click="onArrowClick(-1)"
    >
      <slot name="arrow-left"><i class="arrow arrow--left" /></slot>
    </button>

    <button
      v-if="!isLastElement"
      class="gallery-nav gallery-nav--right"
      @click="onArrowClick(1)"
    >
      <slot name="arrow-right"><i class="arrow arrow--right" /></slot>
    </button>

    <div class="gallery-container"  ref="gallery-container" id="scroll-box">
      <template
        v-for="(item, idx) in calculatedItems"
        :key="item[keyName] + idx"
      >
        <div class="gallery-item" :data-item="idx" :id="item[keyName]" draggable="true"> 
          <slot :item>
            <div class="gallery-item__image">
              <img :src="item.path" />
            </div>
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
.gallery-wrapper {
  box-sizing: border-box;

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  position: relative;
  height: v-bind(height);
  width: v-bind(width);

  .gallery-nav {
    all: unset;
    outline: revert;
    display: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    border-radius: 100%;
    width: 30px;
    height: 30px;
    background-color: black;
    color: white;

    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:active {
      transform: translate(1px, calc(-50% + 1px));
    }

    &.gallery-nav--left {
      left: 10px;
    }

    &.gallery-nav--right {
      right: 10px;
    }

    @media only screen and (min-width: 480px) {
      display: flex;
    }

    .arrow {
      border: solid white;
      border-width: 0 3px 3px 0;
      display: inline-block;
      padding: 3px;

      &.arrow--right {
        transform: rotate(-45deg);
        margin-left: -3px;
      }

      &.arrow--left {
        transform: rotate(135deg);
        margin-left: 3px;
      }
    }
  }

  .gallery-container {
    display: flex;
    overflow-y: hidden;
    overflow-x: auto;
    scrollbar-width: none;
    scroll-snap-type: x mandatory;
    scroll-snap-stop: always;
    scroll-behavior: smooth;
    align-items: center;
    gap: v-bind(slidesGap);
    z-index: 1;
    height: v-bind(height);
    width: 100%;

    .gallery-item {
      width: 100%;
      height: 100%;
      scroll-snap-align: start;
      scroll-snap-stop: always;
      flex-shrink: 0;

      .gallery-item__image {
        height: 100%;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }
  }
}
</style>
