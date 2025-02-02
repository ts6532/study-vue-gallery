<script setup lang="ts">
import Gallery from "@/components/Gallery.vue";

type Slide = {
  id: number;
  path: string;
};

const items: Slide[] = [
  {
    id: 1,
    path: "https://cdn.dummyjson.com/recipe-images/1.webp",
  },
  {
    id: 2,
    path: "https://cdn.dummyjson.com/recipe-images/2.webp",
  },
  {
    id: 3,
    path: "https://cdn.dummyjson.com/recipe-images/3.webp",
  },
  {
    id: 4,
    path: "https://cdn.dummyjson.com/recipe-images/4.webp",
  },
];

const onSlideChange = (slide: Slide) => {
  console.log(slide)
}
</script>

<template>
  <h1>Gallery page</h1>
  <Gallery :items height="400px" width="400px" @change="onSlideChange">
    <template #arrow-left> << </template>
    <template #arrow-right> >> </template>
    <template v-slot="{ item }">
      <div class="image">
        <img :src="item.path" />
      </div>
    </template>
  </Gallery>
</template>

<style>
.image {
  height: 100%;
   img {
      width: 100%;
      height: 100%;
      object-fit: contain;
   }
}
</style>
