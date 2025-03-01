<script setup lang="ts" generic="ItemType extends Record<string, any>">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";

interface GalleryOptions {
  height: string;
  width: string;
}

const defaultOptions = {
  height: "100%",
  width: "100%",
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
}>();

const { width, height } = { ...defaultOptions, ...options };

const galleryContainer = useTemplateRef("gallery-container");

const currentSlideIndex = ref(initialIndex);

const currentItem = computed(() => items[currentSlideIndex.value]);

let observer: IntersectionObserver;

let isFirstCall = true;

const callback: IntersectionObserverCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio === 1) {
      if (isFirstCall) {
        isFirstCall = false
        return
      } else {
        currentSlideIndex.value = Number(
          (entry.target as HTMLElement).dataset.item
        );
        emit("change", currentItem.value);
      }
    }
  });
};

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
    const options = {
      root: galleryContainer.value,
      rootMargin: "100% 0% 100% 0%",
      threshold: [1],
    };

    observer = new IntersectionObserver(callback, options);

    for (const target of galleryContainer.value.children) {
      observer.observe(target);
    }
  }
});

onUnmounted(() => {
  observer.disconnect()
});

type ScrollToOptions = {
  slideIndex: number;
  scrollOpts?: ScrollIntoViewOptions;
};
const scrollTo = ({ slideIndex, scrollOpts }: ScrollToOptions) => {
  let scrollOptions: ScrollIntoViewOptions = {
    behavior: "smooth",
    block: "nearest",
  };

  scrollOptions = { ...scrollOptions, ...scrollOpts };

  console.log("scrollTo index", slideIndex);
  galleryContainer.value?.children[slideIndex].scrollIntoView(scrollOptions);
};

type ArrowClickOptions = {
  direction: "left" | "right";
};
const onArrowClick = ({ direction }: ArrowClickOptions) => {
  switch (direction) {
    case "left":
      if (currentSlideIndex.value > 0) {
        const slideIndex = currentSlideIndex.value - 1;

        scrollTo({ slideIndex });
      }
      break;

    case "right":
      if (currentSlideIndex.value < items.length - 1) {
        const slideIndex = currentSlideIndex.value + 1;

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
      <slot name="arrow-left"><i class="arrow arrow--left" /></slot>
    </div>

    <div
      class="gallery-nav gallery-nav--right"
      @click="onArrowClick({ direction: 'right' })"
    >
      <slot name="arrow-right"><i class="arrow arrow--right" /></slot>
    </div>

    <div class="gallery-container" ref="gallery-container" id="scroll-box">
      <template v-for="(item, idx) in items" :key="item[keyName]">
        <div class="gallery-item" :data-item="idx" :id="item[keyName]">
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
  position: relative;
  height: v-bind(height);
  width: v-bind(width);

  .gallery-nav {
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
    overflow-x: auto;
    scrollbar-width: none;
    scroll-snap-type: x mandatory;
    scroll-snap-stop: always;
    scroll-behavior: smooth;
    gap: 0px;
    z-index: 1;
    height: v-bind(height);
    width: v-bind(width);

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
