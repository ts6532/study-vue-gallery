<script setup lang="ts">
import Gallery from "@/components/Gallery.vue";

type Slide = {
  id: number;
  path: string;
};

const items: Slide[] = [
  {
    id: 1.2,
    path: "https://cdn.dummyjson.com/recipe-images/1.webp",
  },
  {
    id: 2.2,
    path: "https://cdn.dummyjson.com/recipe-images/2.webp",
  },
  {
    id: 3.3,
    path: "https://cdn.dummyjson.com/recipe-images/3.webp",
  },
  {
    id: 4.1,
    path: "https://cdn.dummyjson.com/recipe-images/4.webp",
  },
  {
    id: 5.4,
    path: "https://cdn.dummyjson.com/recipe-images/5.webp",
  },
  {
    id: 6.9,
    path: "https://cdn.dummyjson.com/recipe-images/6.webp",
  },
];

const onSlideChange = (slide: Slide) => {
  console.log(slide);
};

const options = {
  height: "400px",
  width: "",
};
</script>

<template>
  <div class="container">
    <div class="page">
      <div class="page__left-sidebar"></div>
      <div class="page__main">
        <h1>Gallery page</h1>
        <Gallery
          class="gallery-1"
          :items
          :options
          keyName="id"
          @change="onSlideChange"
        />
      </div>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 1024px;
  margin: 0 auto;
}
.page {
  @media only screen and (min-width: 480px) {
    display: grid;
    grid-template-columns: minmax(200px, 300px) 1fr;
  }
}

.gallery-1 {
}

.image {
  height: 100%;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
