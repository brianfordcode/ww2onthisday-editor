<template>

    <div style="display: flex; flex-direction: column;">
        <div style="display: flex; flex-direction: column;">
            <p style="text-align: center;">{{ title }}:</p>
            <!-- TITLE -->
            <label for="title">
                <span :class="{'done': input.title ? true : false}">title:</span><input v-model="input.title" type="text">
            </label>
            <!-- PICTURE -->
            <div style="display: flex; flex-direction: column; align-items: flex-end;">
            <label for="picture" >
                <span :class="{'done': input.picture ? true : false}">picture:</span>
                <input v-model="input.picture" type="text">
            </label>
            <img
                v-if="input.picture"
                :src="`${input.picture}`"
                :alt="`${input.picture}`"
                style="width: 75px; "
            />
            </div>
            <!-- YEAR -->
            <label for="year">
                <span :class="{'done': input.year ? true : false}">year:</span>
                <input v-model="input.year" type="text">
            </label>
            <!-- LINK -->
            <label for="link">
                <span :class="{'done': input.mediaLink.link ? true : false}">link:</span>
                <input v-model="input.mediaLink.link" type="text">
            </label>
            <!-- AFFILIATE? -->
            <label for="affiliate" style="display: flex; align-items: center; justify-content: flex-end">
                <span :class="{'done': input.mediaLink.affiliate ? true : false}">affiliate:</span>
            <input
                style="margin-left: 5px;"
                type="checkbox"
                v-model="input.mediaLink.affiliate"
            >
            </label>
            <!-- AFFILIATE SOURCE -->
            <label v-if="input.mediaLink.affiliate">
                <span :class="{'done': input.mediaLink.affiliateSource ? true : false}">affiliate source:</span>
            <!-- AMAZON -->
            <select
                style="margin-left:2px; border-right: 1px solid"
                v-model="input.mediaLink.affiliateSource"
                value="None"
            >
                <option>Amazon</option>
                <option>Ebay</option>
                <option>Walmart</option>
                <option>Other</option>
            </select>
            </label>
            <!-- <br> -->
            <!-- ENTER BUTTON -->
            <button
                @click="enterItem()"
                style="margin-top: 10px;"
            >
            &#43;
            <br>
                <span v-if="detailsNeeded">Needs title, picture and link!</span>
            </button>
        </div>
        <!-- LIST -->
        <div
            v-for="(item, index) in media"
            :key="item"
            style="margin-top: 10px; overflow-wrap: break-word;"
        >
            <div style="display: flex; flex-direction: column; align-items: flex-end; border: 1px solid">
                <!-- TITLE -->
                <p style="width: 207.36px; overflow-wrap: break-word">title: {{item.title}}</p>
                <!-- PICTURE -->
                <img
                    :src="`${item.picture}`"
                    :alt="`${item.picture}`"
                    style="width: 75px;"
                />
                <!-- YEAR -->
                <p>year: {{item.year}}</p>
                <!-- LINK -->
                <p style="width: 207.36px; overflow-wrap: break-word">
                link:
                    <a
                        style="text-decoration: none; color: black"
                        v-if="item.mediaLink.link"
                        :href="item.mediaLink.link"
                        target="_blank"
                    >
                    &#10003;
                    </a>
                </p>
                <!-- AFFILIATE -->
                <p>affiliate: {{item.mediaLink.affiliate ? '&#10003;' : '&#x2715;'}}</p>
                <p v-if="item.mediaLink.affiliateSource">affiliate source: {{item.mediaLink.affiliateSource}}</p>
                <!-- BUTTONS -->
                <div
                    style="
                        width: 100%;
                        display: flex;
                        justify-content: space-between">
                    <!-- DELETE ITEM -->
                    <button @click="media.splice(index, 1)">&#x2715;</button>
                    <!-- EDIT ITEM -->
                    <button @click="editItem(index)">
                        <img
                            style="width: 15px;"
                            src="https://cdn0.iconfinder.com/data/icons/glyphpack/45/edit-alt-1024.png"
                            alt="edit-icon"
                        >
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

const getInitialMediaState = () => ({
    id: '',
    title: '',
    picture: '',
    year: '',
    mediaLink: {
        link: '',
        affiliate: null,
        affiliateSource: ''
    }
})

export default {
    props: {
        media: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            detailsNeeded: false,
            input: getInitialMediaState(),
        }
    },
    methods: {
        enterItem() {
            const obj = {
                id: `${this.$props.title}`.toLowerCase().slice(0, -1) + '-' + Date.now(),
                title: this.input.title,
                picture: this.input.picture,
                year: this.input.year,
                mediaLink: {
                    link: this.input.mediaLink.link,
                    affiliate: this.input.mediaLink.affiliate ? this.input.mediaLink.affiliate : false,
                    affiliateSource: this.input.mediaLink.affiliateSource,
                }
            }
            if (this.input.title === '' || this.input.picture === '' || this.input.mediaLink.link === '') {
                this.detailsNeeded = true
                setTimeout(() => {
                    this.detailsNeeded = false;
                }, 2000)
            } else {
                this.$props.media.push(obj)
                Object.assign(this.$data.input, getInitialMediaState());
            }
        },
        editItem(index) {
            this.input.id = this.$props.media[index].id
            this.input.title = this.$props.media[index].title
            this.input.picture = this.$props.media[index].picture
            this.input.year = this.$props.media[index].year
            this.input.mediaLink.link = this.$props.media[index].mediaLink.link
            this.input.mediaLink.affiliate = this.$props.media[index].mediaLink.affiliate
            this.input.mediaLink.affiliateSource = this.$props.media[index].mediaLink.affiliateSource

            this.$props.media.splice(index, 1)
        },

    }
}

</script>