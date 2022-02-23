<template>

    <label for="keywords">
        <span :class="{'done': $props.keywords.length ? true : false}">keywords:</span>
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
        v-for="(keyword, index) in $props.keywords"
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
    props: {
      keywords: {
        type: Array,
        required: true,
      }
    },
    data() {
        return {
          allInputs: [],
          input: '',
        }
    },
    methods: {
        addKeywords() {
            if (this.input === '') { return }
            this.allInputs.push(this.input)
            this.input =  ''

            this.$emit('addKeywords', this.allInputs)
        },
        deleteKeyword(index) {
            this.$props.keywords.splice(index, 1)
        }
    }
}
</script>