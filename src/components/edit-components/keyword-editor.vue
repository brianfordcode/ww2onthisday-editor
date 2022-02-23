<template>

    <label for="keywords">
        <span :class="{'done':keywords.length ? true : false}">keywords:</span>
        <input
          type="text"
          style="width: 125px;"
          v-model="input"
          @keyup.enter="addKeywords()"
        >
        <button
          style="height: 24px; width: 20px"
          @click="addKeywords()"
        >
        &#43;
        </button>
    </label>
    <!-- LIST OF KEYWORDS -->
      <div
        v-for="(keyword, index) in keywords"
        :key="keyword"
      >
        <p>
          {{ keyword }}
          <button @click="deleteKeyword(index)">
          &#x2715;
          </button>
        </p>
      </div>

</template>

<script>

export default {
    emits: ["addKeywords"],
    data() {
        return {
          keywords: [],
          input: '',
        }
    },
    methods: {
        addKeywords() {
            if (this.input === '') { return }
            this.keywords.push(this.input)
            this.input =  ''
            this.$emit('addKeywords', this.keywords)
        },
        deleteKeyword(index) {
          this.keywords.splice(index, 1)
        }
    }
}
</script>