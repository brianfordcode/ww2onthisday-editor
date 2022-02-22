<template>

    <label for="keywords">
        <span :class="markKeywordsDone()">keywords:</span>
        <input
          type="text"
          style="width: 125px;"
          @blur="addKeyword()"
          v-model="keywordInput"
          @keyup.enter="addKeyword()"
        >
        <button
          style="height: 24px; width: 20px"
          @click="addKeyword()"
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
          <button
            @click="keywords.splice(index, 1)"
          >
          &#x2715;
          </button>
        </p>
      </div>

</template>

<script>
export default {
    emits: ["addKeyword"],
    props: {
        keywords: {
            type: Array,
            required: true,
        }
    },
    data() {
        return {
            keywordInput: '',
        }
    },
    methods: {
        markKeywordsDone() {
            if (this.$props.keywords.length) {
                return 'done'
            }
        },
        addKeyword() {
            if (this.keywordInput === '') { return }
            this.$emit('addKeyword', this.keywordInput)
            this.keywordInput =  ''
        },
    }
}
</script>