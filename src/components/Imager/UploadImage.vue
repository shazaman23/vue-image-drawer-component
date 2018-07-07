<template>
  <div class="image-upload-wrapper">
    <div class="image-upload-field">
        <input type="file" @change="onChange" ref="uploader" multiple>
        <div
          class="upload-image-placeholder"
          v-if="!imagesPreview.length">
            Upload your images
        </div>
        <div>
          <transition-group name="slide" class="image-upload-preview" mode="out-in" tag="div">
           <div class="img-item" v-for="(img, i) in imagesPreview" :key="img.key" :style="{'background-image': `url(${img.src})`}">
             <i class="material-icons action-icon removeImageIcon" @click="removeImage(i)">close</i>
             <i class="material-icons action-icon editImageIcon" @click="editImage(img.src)">edit</i>
           </div>
           <div class="img-item" key="ccc" v-if="imagesPreview.length">
             <i class="material-icons">photos</i>
             upload ur image
           </div>
          </transition-group>
        </div>
    </div>
    <ImageEditor v-if="selectedImage" v-model="selectedImage"/>
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
      console.log(this.$refs.uploader.files);
      // get the fiels
      const files = this.$refs.uploader.files;
      console.log('start uploading');
      if (!files.length) {
        console.log('no images...');
        return;
      }

      // eterate over the images
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.match('image/*')) {
          console.log(`${file.name} must be an image`);
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
    editImage(img) {
      this.selectedImage = img;
    },
  },
};
</script>

<style lang="scss">
.image {
  &-upload {
    &-field {
      border: 1px solid #ccc;
      width: 800px;
      margin: auto;
      min-height: 200px;
      position: relative;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      input[type="file"] {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
      }
    }
    &-preview {
      display: flex;
      flex-wrap: wrap;
      // justify-content: center;
      .img-item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        transition: .2s ease-in-out;
        z-index: 1;
        height: 300px;
        width: 200px;
        border: 2px solid #eee;
        border-radius: 10px;
        overflow: hidden;
        margin: 5px 10px;
        background: center center no-repeat;
        background-size: contain;
        background-color: #fafafa;
        position: relative;
        .action-icon {
          transition: .2s ease-in-out;
          border-radius: 50%;
          background-color: red;
          color: #fff;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          font-size: 22px;
          position: absolute;
          top: 10px;
          cursor: pointer;
          transform: scale(0);
          box-shadow: 1px 3px 10px 1px #4449;
          &.removeImageIcon {
            right: 10px;
          }
          &.editImageIcon {
            background-color: blue;
            right: 50px;
          }
        }
        &:hover {
          .action-icon {
            transform: scale(1);
          }
        }
      }
    }
  }
}
.slide-leave-active,
.slide-enter-active {
  transition: .2s ease-in-out;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: scale(0)
}
</style>
