<template>
  <div class="image-upload-wrapper">
    <div class="image-upload-field">
        <input type="file" @change="onChange" ref="uploader" multiple>
        <div
          class="upload-image-placeholder"
          v-if="!imagesPreview.length">
             Click / drag and drop images here
        </div>
        <div>
          <transition-group name="slide" class="image-upload-preview" mode="out-in" tag="div">
           <div class="img-item" v-for="(img, i) in imagesPreview" :key="img.key" :style="{'background-image': `url(${img.src})`}">
             <i class="fa fa-close action-icon removeImageIcon" @click="removeImage(i)"></i>
             <i class="fa fa-edit action-icon editImageIcon" @click="editImage(img)"></i>
           </div>
           <div class="img-item upload-card" key="ccc" v-if="imagesPreview.length">
            <input type="file" @change="onChange" ref="uploader_2" multiple>
             Click / drag and drop images here
           </div>
          </transition-group>
        </div>
    </div>
    <ImageEditor v-if="selectedImage" v-model="selectedImage" @input="imageEdited"/>
  </div>
</template>
<script>
import ImageEditor from './ImageEditor.vue';

export default {
  components: { ImageEditor },
  data() {
    return {
      imagesPreview: [],
      selectedImage: null,
    };
  },
  methods: {
    onChange() {
      // get the fiels
      const files = this.$refs.uploader.files || this.$refs.uploader_2.files;
      if (!files || !files.length) {
        alert('no images...');
        return;
      }

      // eterate over the images
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image/*')) {
          alert(`${file.name} must be an image`);
          continue;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagesPreview.push({
            src: e.target.result,
            key: Date.now() + i,
          });
        };
        reader.readAsDataURL(file);
      }
    },
    removeImage(index) {
      this.imagesPreview.splice(index, 1);
    },
    editImage(ImgObject) {
      this.selectedImage = ImgObject;
    },
    imageEdited(editedImage) {
      if (editedImage) {
        const updatedImageIndex = this.imagesPreview.findIndex(img => img.key === editedImage.key);
        this.imagesPreview[updatedImageIndex].src = editedImage.src;
        this.selectedImage = null;
      }
    },
  },
};
</script>
